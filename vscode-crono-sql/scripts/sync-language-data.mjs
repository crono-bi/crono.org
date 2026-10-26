// sync-language-data.mjs
//
// Genera src/generated/keywords.ts, src/generated/etl-data.ts y actualiza
// syntaxes/crono-sql.tmLanguage.json desde la documentación oficial.
//
// Fuentes de verdad:
//   - crono.org/src/content/docs/sql/language/keywords.md
//   - crono.org/src/content/docs/etl/data-movement/*.md
//   - crono.org/src/content/docs/etl/orchestration/workflow.md
//   - crono.org/src/content/docs/etl/orchestration/audited-execution.md
//
// Uso: npm run sync
//
// No edites los archivos generados a mano.

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXT_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(EXT_ROOT, '..');
const DOCS_SQL_ROOT = join(REPO_ROOT, 'src', 'content', 'docs', 'sql');
const DOCS_ETL_ROOT = join(REPO_ROOT, 'src', 'content', 'docs', 'etl');

const OUT_KEYWORDS = join(EXT_ROOT, 'src', 'generated', 'keywords.ts');
const OUT_ETL = join(EXT_ROOT, 'src', 'generated', 'etl-data.ts');
const GRAMMAR_FILE = join(EXT_ROOT, 'syntaxes', 'crono-sql.tmLanguage.json');

function toPascalCase(snake) {
  return snake.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join('');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Keywords ──────────────────────────────────────────────────────────
function parseKeywordsTable(md) {
  const lines = md.split('\n');
  const words = new Set();
  for (const raw of lines) {
    const line = raw.trim();
    if (!line.startsWith('|')) continue;
    if (line.startsWith('|---') || line.startsWith('|Keyword')) continue;
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    for (const cell of cells) {
      if (cell) words.add(cell);
    }
  }
  return [...words].filter((w) => !w.startsWith('CRONO')).sort();
}

function generateKeywords() {
  const md = readFileSync(join(DOCS_SQL_ROOT, 'language', 'keywords.md'), 'utf8');
  const words = parseKeywordsTable(md);

  const body =
    '// AUTO-GENERADO por scripts/sync-language-data.mjs — NO EDITAR A MANO.\n' +
    '// Fuente de verdad: crono.org/src/content/docs/sql/language/keywords.md\n' +
    '// Regenerar con: npm run sync\n\n' +
    `export const CRONO_RESERVED_WORDS: string[] = ${JSON.stringify(words, null, 2)};\n`;

  mkdirSync(dirname(OUT_KEYWORDS), { recursive: true });
  writeFileSync(OUT_KEYWORDS, body);
  return words;
}

// ── ETL docs ──────────────────────────────────────────────────────────
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (extname(entry) === '.md') {
      out.push(full);
    }
  }
  return out;
}

function parseFrontmatter(raw) {
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return {};
  const obj = {};
  for (const line of fm[1].split('\n')) {
    const m = line.match(/^([a-zA-Z0-9_\-]+):\s*(.*)$/);
    if (m) obj[m[1].trim()] = m[2].trim();
  }
  return obj;
}

function stripFrontmatter(raw) {
  return raw.replace(/^---\n[\s\S]*?\n---/, '').trim();
}

function parseDescription(md) {
  const blocks = stripFrontmatter(md).split(/\n\s*\n/);
  for (const b of blocks) {
    const t = b.trim();
    if (!t || t.startsWith('#') || t.startsWith('```') || t.startsWith('|')) continue;
    return t.replace(/\n/g, ' ').trim();
  }
  return '';
}

function parsePropertyTable(md) {
  const body = stripFrontmatter(md);
  const start = body.search(/^## Propiedades\b/m);
  if (start === -1) return {};

  const rest = body.slice(start);
  const next = rest.indexOf('\n## ');
  const section = next === -1 ? rest : rest.slice(0, next);
  const props = {};
  for (const raw of section.split('\n')) {
    const line = raw.trim();
    if (!line.startsWith('|')) continue;
    if (line.startsWith('|---') || line.startsWith('| Propiedad')) continue;
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 2) {
      const name = cells[0].replace(/^`|`$/g, '');
      const desc = cells[1];
      if (name && name !== '---') props[name] = desc;
    }
  }
  return props;
}

function generateEtl() {
  const files = walk(DOCS_ETL_ROOT);

  const actions = {};
  const actionProperties = {};
  const auditHeader = {};

  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const fm = parseFrontmatter(raw);
    const title = fm.title ? fm.title.replace(/"/g, '') : null;
    if (!title) continue;

    const slug = file
      .replace(DOCS_ETL_ROOT, '')
      .replace(/\.md$/, '')
      .replace(/^\//, '');

    const desc = parseDescription(raw);
    const props = parsePropertyTable(raw);

    if (file.includes('/data-movement/') || file.endsWith('workflow.md')) {
      actions[title] = { description: desc, docs: `etl/${slug}` };
      actionProperties[title] = Object.keys(props);
      // properties apply to all actions with a data property; store globally below
    } else if (file.endsWith('audited-execution.md')) {
      for (const [p, d] of Object.entries(props)) {
        auditHeader[p.toLowerCase()] = d;
      }
      continue;
    } else {
      continue;
    }
  }

  const properties = {};
  for (const [action, props] of Object.entries(actionProperties)) {
    for (const p of props) {
      const lower = p.toLowerCase();
      if (lower === '---' || lower === '') continue;
      if (!properties[lower]) {
        properties[lower] = { description: '', appliesTo: [] };
      }
      if (!properties[lower].appliesTo.includes(action)) properties[lower].appliesTo.push(action);
    }
  }

  // Fill descriptions from the first action doc encountered.
  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const fm = parseFrontmatter(raw);
    const title = fm.title ? fm.title.replace(/"/g, '') : null;
    if (!title || (!title.includes(' ') && !file.endsWith('workflow.md'))) continue;
    const props = parsePropertyTable(raw);
    for (const [p, d] of Object.entries(props)) {
      const lower = p.toLowerCase();
      if (lower === '---' || !properties[lower]) continue;
      if (!properties[lower].description) properties[lower].description = d;
    }
  }

  const out =
    '// AUTO-GENERADO por scripts/sync-language-data.mjs — NO EDITAR A MANO.\n' +
    '// Fuentes de verdad: crono.org/src/content/docs/etl/**/*.md\n' +
    '// Regenerar con: npm run sync\n\n' +
    `export interface EtlActionDoc {\n` +
    `  description: string;\n` +
    `  docs: string;\n` +
    `}\n\n` +
    `export interface EtlPropertyDoc {\n` +
    `  description: string;\n` +
    `  appliesTo: string[];\n` +
    `}\n\n` +
    `export const ETL_ACTION_DOCS: Record<string, EtlActionDoc> = ${JSON.stringify(actions, null, 2)};\n\n` +
    `export const ETL_ACTION_PROPERTIES: Record<string, string[]> = ${JSON.stringify(actionProperties, null, 2)};\n\n` +
    `export const ETL_PROPERTY_DOCS: Record<string, EtlPropertyDoc> = ${JSON.stringify(properties, null, 2)};\n\n` +
    `export const AUDIT_HEADER_PROPERTIES: Record<string, string> = ${JSON.stringify(auditHeader, null, 2)};\n`;

  mkdirSync(dirname(OUT_ETL), { recursive: true });
  writeFileSync(OUT_ETL, out);
  return { actions, properties, auditHeader };
}

// ── Grammar patch ─────────────────────────────────────────────────────
function buildActionRegex(actions) {
  const bracketed = actions.filter((a) => a.includes(' ')).map(escapeRegex).join('|');
  const unbracketed = actions.filter((a) => !a.includes(' ')).map(escapeRegex).join('|');
  return { bracketed, unbracketed };
}

function buildPropertyRegex(properties) {
  const names = Object.keys(properties).filter((p) => p !== '---');
  const snake = names.filter((p) => p.includes('_')).map(escapeRegex).join('|');
  const pascal = names.filter((p) => p.includes('_')).map((p) => toPascalCase(p)).map(escapeRegex).join('|');
  const short = names.filter((p) => !p.includes('_')).map(escapeRegex).join('|');
  const parts = [snake, pascal, short].filter(Boolean);
  return parts.length ? `(?i)(?:\\[\\s*)?\\b(?:${parts.join('|')})\\b(?:\\s*\\]?)(?=\\s*[:=])` : '';
}

const LOAD_PATTERNS = [
  'MERGE\\s+CLONE',
  'MERGE\\s+UPSERT',
  'MERGE\\s+HISTORY',
  'MERGE\\s+SOFT\\s+DELETE',
  'INSERT\\s+IF\\s+NEW',
  'INSERT\\s+RAW',
  'INSERT\\s+OVERWRITE',
  'CHECK\\s+SNOWFLAKE',
  'ASSERT\\s+NOT\\s+EXISTS\\s+OR\\s+RAISE',
  'ASSERT\\s+EXISTS\\s+OR\\s+RAISE',
  'CALCULATE\\s+JOIN',
  'ADD\\s+COLUMNS',
  'NO_ALTER',
  'NO_AUDIT',
  'SEMI\\s+JOIN',
  'ANTI\\s+JOIN',
  'DECLARE\\s+VIRTUAL\\s+VIEW',
];

function readFunctionNames() {
  try {
    const src = readFileSync(join(EXT_ROOT, 'src', 'generated', 'function-docs.ts'), 'utf8');
    const m = src.match(/CRONO_FUNCTION_NAMES:\s*string\[\]\s*=\s*\[([\s\S]*?)\]/);
    if (!m) return null;
    return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).sort();
  } catch {
    return null;
  }
}

// Reescribe el grammar completo de forma determinista a partir de los datos
// generados. Estructura con bloques begin/end: las propiedades solo se
// reconocen dentro del cuerpo de una acción `[acción]( ...)`, evitando
// falsos positivos en `nombre = valor` en SQL normal.
function patchGrammar(keywords, etl) {
  const single = keywords.filter((w) => !/\s/.test(w)).sort((a, b) => b.length - a.length);
  const { bracketed, unbracketed } = buildActionRegex(Object.keys(etl.actions));
  const propPattern = buildPropertyRegex(etl.properties);
  const fns = readFunctionNames();

  const innerPatterns = [
    { include: '#crono-comments' },
    { include: '#crono-etl-properties' },
    { include: '#crono-nested-parens' },
    { include: '#crono-bracketed-ident' },
    { include: '#crono-load-patterns' },
    { include: '#crono-keywords' },
    { include: '#crono-functions' },
    { include: 'source.sql' },
  ];

  const grammar = {
    $schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
    name: 'Crono SQL',
    scopeName: 'source.crono-sql',
    patterns: [
      { include: '#crono-comments' },
      { include: '#crono-yaml-header' },
      { include: '#crono-workflow' },
      { include: '#crono-etl-action' },
      { include: '#crono-etl-action-name' },
      { include: '#crono-bracketed-ident' },
      { include: '#crono-load-patterns' },
      { include: '#crono-keywords' },
      { include: '#crono-functions' },
      { include: 'source.sql' },
    ],
    repository: {
      'crono-comments': {
        patterns: [
          {
            name: 'comment.line.double-dash.crono-sql',
            begin: '--',
            end: '$',
            captures: { '0': { name: 'punctuation.definition.comment.crono-sql' } },
          },
          {
            name: 'comment.block.crono-sql',
            begin: '/\\*',
            end: '\\*/',
            captures: { '0': { name: 'punctuation.definition.comment.crono-sql' } },
          },
        ],
      },
      // Cabecera YAML de ejecución auditada: solo al inicio del fichero (\A).
      'crono-yaml-header': {
        patterns: [
          {
            name: 'meta.yaml-header.crono-sql',
            begin: '\\A\\s*---\\s*$',
            end: '^---\\s*$',
            patterns: [
              {
                name: 'entity.other.attribute-name.crono-sql',
                match: '^\\s*[A-Za-z_][A-Za-z0-9_]*(?=\\s*:)',
              },
              { include: '#crono-comments' },
              { include: 'source.sql' },
            ],
          },
        ],
      },
      // Bloques WORKFLOW/PARALLEL/ASYNC: sintaxis de pasos, no propiedades.
      'crono-workflow': {
        patterns: [
          {
            name: 'meta.workflow.crono-sql',
            begin: "(?i)\\b(WORKFLOW|PARALLEL|ASYNC)\\b(\\s*'[^']*')?\\s*\\(",
            end: '\\)',
            beginCaptures: {
              '1': { name: 'entity.name.function.crono-sql' },
              '2': { name: 'string.quoted.single.crono-sql' },
            },
            patterns: [
              { include: '#crono-comments' },
              { include: '#crono-workflow' },
              {
                name: 'keyword.other.crono-sql',
                match: '(?i)\\b(?:PROCEDURE|FILE)\\b',
              },
              { include: '#crono-nested-parens' },
              { include: 'source.sql' },
            ],
          },
        ],
      },
      // Acción con cuerpo de propiedades: [bulk table]( prop=valor, ... ).
      'crono-etl-action': bracketed
        ? {
            patterns: [
              {
                name: 'meta.etl-action.crono-sql',
                begin: `(?i)\\[\\s*(${bracketed})\\s*\\]\\s*\\(`,
                end: '\\)',
                beginCaptures: { '1': { name: 'entity.name.function.crono-sql' } },
                patterns: [{ include: '#crono-action-inner' }],
              },
            ],
          }
        : { patterns: [] },
      // Nombre de acción suelto (sin paréntesis): fallback de coloreado.
      'crono-etl-action-name': {
        patterns: [
          ...(bracketed
            ? [
                {
                  match: `(?i)\\[\\s*(${bracketed})\\s*\\]`,
                  captures: { '1': { name: 'entity.name.function.crono-sql' } },
                },
              ]
            : []),
          ...(unbracketed
            ? [
                {
                  name: 'entity.name.function.crono-sql',
                  match: `(?i)\\b(?:${unbracketed})\\b`,
                },
              ]
            : []),
        ],
      },
      // Patrones internos del cuerpo de una acción (reutilizado por la recursión).
      'crono-action-inner': { patterns: innerPatterns },
      // Paréntesis anidados dentro de acciones, p. ej. [data]=(SELECT ...).
      'crono-nested-parens': {
        patterns: [
          {
            name: 'meta.parens.crono-sql',
            begin: '\\(',
            end: '\\)',
            patterns: [{ include: '#crono-action-inner' }],
          },
        ],
      },
      'crono-etl-properties': propPattern
        ? { patterns: [{ name: 'entity.other.attribute-name.crono-sql', match: propPattern }] }
        : { patterns: [] },
      'crono-bracketed-ident': {
        patterns: [
          {
            match: '\\[\\s*([A-Za-z_][A-Za-z0-9_]*)\\s*\\]',
            captures: { '1': { name: 'variable.other.crono-sql' } },
          },
        ],
      },
      'crono-load-patterns': {
        patterns: [
          {
            name: 'keyword.other.crono-sql',
            match: `(?i)\\b(?:${LOAD_PATTERNS.join('|')})\\b`,
          },
        ],
      },
      'crono-keywords': {
        patterns: single.length
          ? [
              {
                name: 'keyword.other.crono-sql',
                match: `(?i)\\b(?:${single.map(escapeRegex).join('|')})\\b`,
              },
            ]
          : [],
      },
      'crono-functions': {
        patterns: fns?.length
          ? [
              {
                name: 'meta.function-call.crono-sql',
                match: `(?i)\\b(${fns.map(escapeRegex).join('|')})\\b\\s*(?=\\()`,
                captures: { '1': { name: 'support.function.crono-sql' } },
              },
            ]
          : [],
      },
    },
  };

  writeFileSync(GRAMMAR_FILE, JSON.stringify(grammar, null, 2));
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  const keywords = generateKeywords();
  const etl = generateEtl();
  patchGrammar(keywords, etl);
  console.log(`Generados ${OUT_KEYWORDS}, ${OUT_ETL} y actualizado ${GRAMMAR_FILE}`);
}

await main();
