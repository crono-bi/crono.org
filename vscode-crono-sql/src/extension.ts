import * as vscode from 'vscode';

import { CRONO_KEYWORDS, CRONO_SPECIFIC_KEYWORDS } from './language-data';
import { KEYWORD_DOCS, PHRASE_DOCS, PROPERTY_SIGNATURES, DocEntry } from './hover-docs';
import { contextAt, bracketedActionAt } from './scanner';
import {
  CRONO_FUNCTION_NAMES,
  CRONO_FUNCTION_CATEGORIES,
  GENERATED_FUNCTION_DOCS,
  GeneratedDoc,
} from './generated/function-docs';
import {
  ETL_ACTION_DOCS,
  ETL_ACTION_PROPERTIES,
  ETL_PROPERTY_DOCS,
  AUDIT_HEADER_PROPERTIES,
} from './generated/etl-data';

const LANGUAGE_ID = 'crono-sql';
const DOCS_BASE = 'https://crono.org/';
const ETL_AUDIT_DOCS = 'etl/orchestration/audited-execution';

// Human-readable category labels (aligned with doc folder names).
const CATEGORY_LABELS: Record<string, string> = {
  aggregation: 'Agregación',
  conversion: 'Conversión de tipos',
  dates: 'Fechas',
  metadata: 'Metadata',
  nullsAndConditions: 'Nulos y condiciones',
  numeric: 'Numéricas',
  text: 'Texto',
};

// Lower-cased lookup sets for fast membership tests.
const FUNCTION_SET = new Set(CRONO_FUNCTION_NAMES.map((f) => f.toLowerCase()));
const KEYWORD_SET = new Set(CRONO_KEYWORDS.map((k) => k.toLowerCase()));
const SPECIFIC_KEYWORD_SET = new Set(CRONO_SPECIFIC_KEYWORDS.map((k) => k.toLowerCase()));

// Compiled once: phrase matchers sorted longest-first so "MERGE SOFT DELETE"
// wins over "MERGE" when both could match at the same position.
const PHRASE_MATCHERS: Array<{ phrase: string; regex: RegExp }> = Object.keys(PHRASE_DOCS)
  .sort((a, b) => b.split(/\s+/).length - a.split(/\s+/).length || b.length - a.length)
  .map((phrase) => ({
    phrase,
    regex: new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')}\\b`, 'gi'),
  }));

function pascalToSnake(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

// ── Completion ────────────────────────────────────────────────────────
let cachedBaseItems: vscode.CompletionItem[] | null = null;
let cachedActionItems: vscode.CompletionItem[] | null = null;
let cachedWorkflowItems: vscode.CompletionItem[] | null = null;

function baseCompletionItems(): vscode.CompletionItem[] {
  if (cachedBaseItems) return cachedBaseItems;
  const items: vscode.CompletionItem[] = [];

  for (const fn of CRONO_FUNCTION_NAMES) {
    const item = new vscode.CompletionItem(fn, vscode.CompletionItemKind.Function);
    const cat = CRONO_FUNCTION_CATEGORIES[fn] ?? GENERATED_FUNCTION_DOCS[fn]?.category ?? null;
    item.detail = cat ? `Función Crono · ${CATEGORY_LABELS[cat] ?? cat}` : 'Función Crono';
    const md = renderFunctionDoc(fn);
    if (md) item.documentation = md;
    item.insertText = new vscode.SnippetString(`${fn}($0)`);
    items.push(item);
  }

  for (const kw of CRONO_KEYWORDS) {
    const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
    item.detail = SPECIFIC_KEYWORD_SET.has(kw.toLowerCase()) ? 'Keyword Crono SQL' : 'Keyword SQL';
    const doc = KEYWORD_DOCS[kw];
    if (doc) item.documentation = renderDoc(doc);
    items.push(item);
  }

  cachedBaseItems = items;
  return items;
}

function actionCompletionItems(): vscode.CompletionItem[] {
  if (cachedActionItems) return cachedActionItems;
  cachedActionItems = Object.keys(ETL_ACTION_DOCS)
    .filter((a) => a.includes(' '))
    .map((a) => {
      const item = new vscode.CompletionItem(
        `[${a.toLowerCase()}]`,
        vscode.CompletionItemKind.Snippet,
      );
      item.detail = 'Acción ETL';
      item.insertText = new vscode.SnippetString(`[${a.toLowerCase()}](\n\t$0\n)`);
      const doc = ETL_ACTION_DOCS[a];
      const md = new vscode.MarkdownString(undefined, true);
      md.appendCodeblock(`[${a.toLowerCase()}]( ... )`, 'crono-sql');
      md.appendMarkdown(`\n${doc.description}`);
      item.documentation = md;
      return item;
    });
  return cachedActionItems;
}

function workflowCompletionItems(): vscode.CompletionItem[] {
  if (cachedWorkflowItems) return cachedWorkflowItems;
  cachedWorkflowItems = ['WORKFLOW', 'PARALLEL', 'ASYNC', 'PROCEDURE', 'FILE'].map((k) => {
    const item = new vscode.CompletionItem(k, vscode.CompletionItemKind.Keyword);
    item.detail = 'Bloque/paso de workflow';
    const doc = KEYWORD_DOCS[k];
    if (doc) item.documentation = renderDoc(doc);
    return item;
  });
  return cachedWorkflowItems;
}

function propertyCompletionItems(actionName: string): vscode.CompletionItem[] {
  const props = ETL_ACTION_PROPERTIES[actionName] ?? [];
  return props.map((p) => {
    const item = new vscode.CompletionItem(p, vscode.CompletionItemKind.Property);
    item.detail = `Propiedad de ${actionName}`;
    const doc = ETL_PROPERTY_DOCS[p.toLowerCase()];
    if (doc) {
      const md = new vscode.MarkdownString(undefined, true);
      const sig = PROPERTY_SIGNATURES[p.toLowerCase()];
      md.appendCodeblock(sig ?? `${p} = ...`, 'crono-sql');
      md.appendMarkdown(`\n${doc.description}`);
      item.documentation = md;
    }
    item.insertText = new vscode.SnippetString(`${p}=$0`);
    return item;
  });
}

function auditCompletionItems(): vscode.CompletionItem[] {
  return Object.keys(AUDIT_HEADER_PROPERTIES).map((p) => {
    const label = p.charAt(0).toUpperCase() + p.slice(1);
    const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Property);
    item.detail = 'Propiedad de ejecución auditada';
    const md = new vscode.MarkdownString(undefined, true);
    md.appendCodeblock(`${label}: ...`, 'yaml');
    md.appendMarkdown(`\n${AUDIT_HEADER_PROPERTIES[p]}`);
    item.documentation = md;
    item.insertText = `${label}: `;
    return item;
  });
}

const completionProvider: vscode.CompletionItemProvider = {
  provideCompletionItems(document, position) {
    if (!vscode.workspace.getConfiguration('cronoSql').get('completion.enabled', true)) {
      return undefined;
    }
    const ctx = contextAt(document.getText(), document.offsetAt(position));
    if (ctx.inComment || ctx.inString) return undefined;
    if (ctx.inYamlHeader) return auditCompletionItems();
    if (ctx.block?.kind === 'workflow') return workflowCompletionItems();
    if (ctx.block?.kind === 'action') {
      return [...propertyCompletionItems(ctx.block.name), ...baseCompletionItems()];
    }
    return [...baseCompletionItems(), ...actionCompletionItems()];
  },
};

// ── Hover ─────────────────────────────────────────────────────────────
function renderDoc(entry: DocEntry): vscode.MarkdownString {
  const md = new vscode.MarkdownString(undefined, true);
  md.appendCodeblock(entry.signature, 'crono-sql');
  md.appendMarkdown(`\n${entry.description}`);
  if (entry.docs) {
    md.appendMarkdown(`\n\n[Ver documentación →](${DOCS_BASE}${entry.docs}/)`);
  }
  md.isTrusted = false;
  return md;
}

function genericFunctionDoc(name: string): vscode.MarkdownString {
  const cat = CRONO_FUNCTION_CATEGORIES[name] ?? GENERATED_FUNCTION_DOCS[name]?.category ?? null;
  const label = cat ? (CATEGORY_LABELS[cat] ?? cat) : 'Función';
  const md = new vscode.MarkdownString(undefined, true);
  md.appendCodeblock(`${name}(...)`, 'crono-sql');
  md.appendMarkdown(`\nFunción de Crono SQL · _${label}_.`);
  return md;
}

// Render a doc extracted from the official documentation.
function renderGeneratedDoc(name: string, entry: GeneratedDoc): vscode.MarkdownString {
  const md = new vscode.MarkdownString(undefined, true);
  const cat = entry.category ?? CRONO_FUNCTION_CATEGORIES[name] ?? null;
  if (cat) {
    md.appendMarkdown(`_${CATEGORY_LABELS[cat] ?? cat}_\n\n`);
  }
  md.appendMarkdown(entry.description);
  if (entry.example) {
    md.appendMarkdown('\n\n**Ejemplo**');
    md.appendCodeblock(entry.example, 'sql');
  }
  md.appendMarkdown(`\n\n[Ver documentación →](${DOCS_BASE}sql/${entry.slug}/)`);
  md.isTrusted = false;
  return md;
}

function renderFunctionDoc(name: string): vscode.MarkdownString {
  const lower = name.toLowerCase();
  const gen = GENERATED_FUNCTION_DOCS[lower];
  return gen ? renderGeneratedDoc(lower, gen) : genericFunctionDoc(lower);
}

const hoverProvider: vscode.HoverProvider = {
  provideHover(document, position) {
    if (!vscode.workspace.getConfiguration('cronoSql').get('hover.enabled', true)) {
      return undefined;
    }
    const text = document.getText();
    const offset = document.offsetAt(position);
    const ctx = contextAt(text, offset);
    if (ctx.inComment || ctx.inString) return undefined;

    const range = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/);
    if (!range) return undefined;
    const word = document.getText(range);
    const lower = word.toLowerCase();
    const upper = word.toUpperCase();

    // Cabecera YAML: propiedades de ejecución auditada (JobName, SendLogTo...).
    // Si no es una propiedad, sigue el flujo normal (la query de Condition: es SQL).
    if (ctx.inYamlHeader) {
      const h = auditHover(document, range, word);
      if (h) return h;
    }

    // Acción ETL entre corchetes: [bulk table], [export parquet]...
    const action = bracketedActionAt(text, offset);
    if (action) {
      return etlActionHover(document, action);
    }

    // Propiedad de una acción (solo dentro del cuerpo de la acción).
    if (ctx.block?.kind === 'action') {
      const propHover = propertyHover(document, range, word);
      if (propHover) return propHover;
    }

    // Frases multi-palabra: MERGE CLONE, CHECK SNOWFLAKE, INSERT IF NEW...
    const phraseHover = tryPhraseHover(document, position);
    if (phraseHover) return phraseHover;

    // Function: official docs → generic.
    if (FUNCTION_SET.has(lower)) {
      return new vscode.Hover(renderFunctionDoc(lower), range);
    }
    // Keyword with explicit docs.
    if (KEYWORD_DOCS[upper]) {
      return new vscode.Hover(renderDoc(KEYWORD_DOCS[upper]), range);
    }
    // Known keyword without rich docs.
    if (KEYWORD_SET.has(lower)) {
      const md = new vscode.MarkdownString(`**${upper}** · keyword de Crono SQL`);
      return new vscode.Hover(md, range);
    }
    return undefined;
  },
};

function auditHover(
  document: vscode.TextDocument,
  range: vscode.Range,
  word: string,
): vscode.Hover | undefined {
  const desc = AUDIT_HEADER_PROPERTIES[word.toLowerCase()];
  if (!desc) return undefined;
  const line = document.lineAt(range.start.line).text;
  const after = line.slice(range.end.character).trimStart();
  if (after.charAt(0) !== ':') return undefined;
  const md = new vscode.MarkdownString(undefined, true);
  md.appendCodeblock(`${word}: ...`, 'yaml');
  md.appendMarkdown(`\n${desc}`);
  md.appendMarkdown(`\n\n[Ver documentación →](${DOCS_BASE}${ETL_AUDIT_DOCS}/)`);
  md.isTrusted = false;
  return new vscode.Hover(md, range);
}

function etlActionHover(
  document: vscode.TextDocument,
  action: { name: string; start: number; end: number },
): vscode.Hover | undefined {
  const doc = ETL_ACTION_DOCS[action.name];
  if (!doc) return undefined;
  const md = new vscode.MarkdownString(undefined, true);
  md.appendCodeblock(`[${action.name.toLowerCase()}]( ... )`, 'crono-sql');
  md.appendMarkdown(`\n${doc.description}`);
  md.appendMarkdown(`\n\n[Ver documentación →](${DOCS_BASE}${doc.docs}/)`);
  md.isTrusted = false;
  const range = new vscode.Range(document.positionAt(action.start), document.positionAt(action.end));
  return new vscode.Hover(md, range);
}

function propertyHover(
  document: vscode.TextDocument,
  range: vscode.Range,
  word: string,
): vscode.Hover | undefined {
  const normalized = ETL_PROPERTY_DOCS[word.toLowerCase()]
    ? word.toLowerCase()
    : pascalToSnake(word);
  const entry = ETL_PROPERTY_DOCS[normalized];
  if (!entry) return undefined;
  const line = document.lineAt(range.start.line).text;
  const after = line.slice(range.end.character).trimStart();
  const first = after.charAt(0);
  const isProperty = first === '=' || (first === ']' && after.substring(1).trimStart().startsWith('='));
  if (!isProperty) return undefined;
  const md = new vscode.MarkdownString(undefined, true);
  md.appendCodeblock(PROPERTY_SIGNATURES[normalized] ?? `${normalized} = ...`, 'crono-sql');
  md.appendMarkdown(`\n${entry.description}`);
  if (entry.appliesTo?.length) {
    md.appendMarkdown(`\n\n_Acciones: ${entry.appliesTo.join(', ')}._`);
  }
  md.isTrusted = false;
  return new vscode.Hover(md, range);
}

// Detect multi-word Crono phrases on the hovered line. Longer phrases are
// tried first so "MERGE SOFT DELETE" wins over its prefixes.
function tryPhraseHover(
  document: vscode.TextDocument,
  position: vscode.Position,
): vscode.Hover | undefined {
  const line = document.lineAt(position.line).text;
  for (const { phrase, regex } of PHRASE_MATCHERS) {
    regex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(line)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (position.character >= start && position.character <= end) {
        const range = new vscode.Range(position.line, start, position.line, end);
        return new vscode.Hover(renderDoc(PHRASE_DOCS[phrase]), range);
      }
      if (start > position.character) break;
    }
  }
  return undefined;
}

// ── Activation ────────────────────────────────────────────────────────
export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(LANGUAGE_ID, completionProvider),
    vscode.languages.registerHoverProvider(LANGUAGE_ID, hoverProvider),
  );
}

export function deactivate(): void {
  /* no-op */
}
