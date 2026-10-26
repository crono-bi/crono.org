// scanner.ts — análisis léxico ligero de documentos Crono SQL.
//
// Distingue los contextos relevantes para hover y autocompletado:
//   - comentarios de línea (--) y de bloque (/* */)
//   - cadenas de texto ('...' con escape '')
//   - cabecera YAML de ejecución auditada (--- ... --- al inicio del fichero)
//   - cuerpos de acciones ETL: [bulk table]( ... ), WORKFLOW/PARALLEL/ASYNC (...)
//
// Es un módulo puro (sin dependencia de vscode) para poder probarlo con
// node:test. El offset es un índice absoluto en el texto.

export type BlockKind = 'action' | 'workflow';

export interface BlockRange {
  kind: BlockKind;
  /** Nombre normalizado en mayúsculas: 'BULK TABLE', 'WORKFLOW', 'PARALLEL'... */
  name: string;
  /** Offset donde empieza el nombre (tras '[' si va entre corchetes). */
  nameStart: number;
  /** Offset donde termina el nombre. */
  nameEnd: number;
  /** Offset del '(' que abre el cuerpo. */
  bodyStart: number;
  /** Offset del ')' que cierra el cuerpo, o null si no se cerró. */
  bodyEnd: number | null;
}

export interface YamlRange {
  start: number;
  end: number;
}

export interface ScanContext {
  inComment: boolean;
  inString: boolean;
  inYamlHeader: boolean;
  /** Bloque cuyo cuerpo (...) contiene la posición, si hay. */
  block: BlockRange | null;
}

const ACTION_NAMES = new Set(['BULK TABLE', 'COPY FILE', 'EXPORT PARQUET', 'IMPORT PARQUET']);
const WORKFLOW_KEYWORDS = new Set(['WORKFLOW', 'PARALLEL', 'ASYNC']);
const WORD = /[A-Za-z_][A-Za-z0-9_]*/y;

/** Cabecera YAML: línea '---' al inicio del documento hasta la siguiente '---'. */
export function yamlHeaderRange(text: string): YamlRange | null {
  if (!/^---[ \t]*(\r?\n|$)/.test(text)) return null;
  const firstLineEnd = text.indexOf('\n');
  if (firstLineEnd === -1) return null;
  const rest = text.slice(firstLineEnd + 1);
  const close = rest.search(/^---[ \t]*$/m);
  if (close === -1) return null;
  const closeStart = firstLineEnd + 1 + close;
  const closeEnd = closingYamlEnd(text, closeStart);
  return { start: 0, end: closeEnd };
}

function closingYamlEnd(text: string, from: number): number {
  const eol = text.indexOf('\n', from);
  return eol === -1 ? text.length : eol;
}

/** Recorre el texto y devuelve el contexto en `offset` y los bloques ETL. */
export function scan(text: string, offset?: number): { context: ScanContext; blocks: BlockRange[] } {
  const blocks: BlockRange[] = [];
  const stack: BlockRange[] = [];

  const yaml = yamlHeaderRange(text);
  if (yaml && offset !== undefined && offset >= yaml.start && offset <= yaml.end) {
    return { context: { inComment: false, inString: false, inYamlHeader: true, block: null }, blocks };
  }

  let i = yaml ? yaml.end : 0;
  const n = text.length;
  let inComment = false;
  let inString = false;

  while (i < n) {
    const ch = text[i];
    const two = text.slice(i, i + 2);

    // Comentario de línea.
    if (two === '--') {
      const eol = text.indexOf('\n', i);
      const end = eol === -1 ? n : eol;
      if (offset !== undefined && offset >= i && offset < end) inComment = true;
      i = end;
      continue;
    }
    // Comentario de bloque.
    if (two === '/*') {
      const close = text.indexOf('*/', i + 2);
      const end = close === -1 ? n : close + 2;
      if (offset !== undefined && offset >= i && offset < end) inComment = true;
      i = end;
      continue;
    }
    // Cadena '...' con escape ''.
    if (ch === "'") {
      let j = i + 1;
      while (j < n) {
        if (text[j] === "'") {
          if (text[j + 1] === "'") { j += 2; continue; }
          j += 1;
          break;
        }
        j += 1;
      }
      if (offset !== undefined && offset >= i && offset < j) inString = true;
      i = j;
      continue;
    }
    // Acción entre corchetes: [bulk table](
    if (ch === '[') {
      const m = /^\[\s*([A-Za-z][A-Za-z ]*?)\s*\]/.exec(text.slice(i));
      if (m) {
        const name = m[1].toUpperCase();
        if (ACTION_NAMES.has(name)) {
          const nameStart = i + m[0].indexOf(m[1]);
          const nameEnd = nameStart + m[1].length;
          let j = i + m[0].length;
          while (j < n && /\s/.test(text[j])) j += 1;
          if (text[j] === '(') {
            const block: BlockRange = { kind: 'action', name, nameStart, nameEnd, bodyStart: j, bodyEnd: null };
            blocks.push(block);
            stack.push(block);
            i = j + 1;
            continue;
          }
        }
      }
    }
    // Bloques de workflow: WORKFLOW|PARALLEL|ASYNC ['nombre'] (
    if (/[A-Za-z_]/.test(ch)) {
      WORD.lastIndex = i;
      const m = WORD.exec(text);
      if (m && m.index === i) {
        const upper = m[0].toUpperCase();
        if (WORKFLOW_KEYWORDS.has(upper)) {
          let j = i + m[0].length;
          while (j < n && /\s/.test(text[j])) j += 1;
          if (text[j] === "'") {
            // Nombre opcional del bloque: saltar la cadena.
            j += 1;
            while (j < n && text[j] !== "'") j += 1;
            if (text[j] === "'") j += 1;
            while (j < n && /\s/.test(text[j])) j += 1;
          }
          if (text[j] === '(') {
            const block: BlockRange = {
              kind: 'workflow', name: upper, nameStart: i, nameEnd: i + m[0].length,
              bodyStart: j, bodyEnd: null,
            };
            blocks.push(block);
            stack.push(block);
            i = j + 1;
            continue;
          }
        }
        i += m[0].length;
        continue;
      }
    }
    if (ch === '(' && stack.length > 0) {
      // Paréntesis anidado: el ')' correspondiente no cierra el bloque.
      stack.push({ kind: 'workflow', name: '', nameStart: i, nameEnd: i, bodyStart: i, bodyEnd: null });
      i += 1;
      continue;
    }
    if (ch === ')' && stack.length > 0) {
      const top = stack.pop()!;
      top.bodyEnd = i;
      i += 1;
      continue;
    }
    i += 1;
  }

  let block: BlockRange | null = null;
  if (offset !== undefined) {
    for (const b of blocks) {
      if (b.name !== '' && offset > b.bodyStart && (b.bodyEnd === null || offset <= b.bodyEnd)) {
        block = b;
      }
    }
  }
  return { context: { inComment, inString, inYamlHeader: false, block }, blocks };
}

/** Contexto en una posición (offset absoluto). */
export function contextAt(text: string, offset: number): ScanContext {
  return scan(text, offset).context;
}

/** Acción entre corchetes cuya zona `[nombre]` contiene el offset (para hover). */
export function bracketedActionAt(text: string, offset: number): { name: string; start: number; end: number } | null {
  for (const m of text.matchAll(/\[\s*([A-Za-z][A-Za-z ]*?)\s*\]/g)) {
    const name = m[1].toUpperCase();
    if (!ACTION_NAMES.has(name)) continue;
    const start = m.index!;
    const end = start + m[0].length;
    if (offset >= start && offset <= end) return { name, start, end };
  }
  return null;
}
