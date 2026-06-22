import * as vscode from 'vscode';

import { CRONO_KEYWORDS, CRONO_SPECIFIC_KEYWORDS } from './language-data';
import { KEYWORD_DOCS, PHRASE_DOCS, FUNCTION_DOCS, DocEntry } from './hover-docs';
import {
  CRONO_FUNCTION_NAMES,
  CRONO_FUNCTION_CATEGORIES,
  GENERATED_FUNCTION_DOCS,
  GeneratedDoc,
} from './generated/function-docs';

const LANGUAGE_ID = 'crono-sql';
const DOCS_BASE = 'https://crono.org/sql';

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
// CRONO_FUNCTION_NAMES is the canonical superset derived from the official docs.
const FUNCTION_SET = new Set(CRONO_FUNCTION_NAMES.map((f) => f.toLowerCase()));
const KEYWORD_SET = new Set(CRONO_KEYWORDS.map((k) => k.toLowerCase()));
const SPECIFIC_KEYWORD_SET = new Set(CRONO_SPECIFIC_KEYWORDS.map((k) => k.toLowerCase()));

// ── Completion ────────────────────────────────────────────────────────
function buildCompletionItems(): vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = [];

  for (const fn of CRONO_FUNCTION_NAMES) {
    const item = new vscode.CompletionItem(fn, vscode.CompletionItemKind.Function);
    const cat = CRONO_FUNCTION_CATEGORIES[fn] ?? GENERATED_FUNCTION_DOCS[fn]?.category ?? null;
    item.detail = cat ? `Función Crono · ${CATEGORY_LABELS[cat] ?? cat}` : 'Función Crono';
    const md = renderFunctionDoc(fn);
    if (md) {
      item.documentation = md;
    }
    // Insert "fn(" and place the cursor inside the parentheses.
    item.insertText = new vscode.SnippetString(`${fn}($0)`);
    items.push(item);
  }

  for (const kw of CRONO_KEYWORDS) {
    const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
    item.detail = SPECIFIC_KEYWORD_SET.has(kw.toLowerCase())
      ? 'Keyword Crono SQL'
      : 'Keyword SQL';
    const doc = KEYWORD_DOCS[kw];
    if (doc) {
      item.documentation = renderDoc(doc);
    }
    items.push(item);
  }

  return items;
}

const completionProvider: vscode.CompletionItemProvider = {
  provideCompletionItems(document, position) {
    if (!vscode.workspace.getConfiguration('cronoSql').get('completion.enabled', true)) {
      return undefined;
    }
    // Do not complete inside line comments.
    const linePrefix = document.lineAt(position).text.slice(0, position.character);
    if (linePrefix.includes('--')) {
      return undefined;
    }
    return buildCompletionItems();
  },
};

// ── Hover ─────────────────────────────────────────────────────────────
function renderDoc(entry: DocEntry): vscode.MarkdownString {
  const md = new vscode.MarkdownString(undefined, true);
  md.appendCodeblock(entry.signature, 'crono-sql');
  md.appendMarkdown(`\n${entry.description}`);
  if (entry.docs) {
    md.appendMarkdown(`\n\n[Ver documentación →](${DOCS_BASE}/${entry.docs}/)`);
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
  md.appendMarkdown(`\n\n[Ver documentación →](${DOCS_BASE}/${entry.slug}/)`);
  md.isTrusted = false;
  return md;
}

// Resolve a function's hover/completion doc with priority:
// generated (official docs) → manual → generic fallback.
function renderFunctionDoc(name: string): vscode.MarkdownString {
  const lower = name.toLowerCase();
  const gen = GENERATED_FUNCTION_DOCS[lower];
  if (gen) {
    return renderGeneratedDoc(lower, gen);
  }
  const manual = FUNCTION_DOCS[lower];
  if (manual) {
    return renderDoc(manual);
  }
  return genericFunctionDoc(lower);
}

const hoverProvider: vscode.HoverProvider = {
  provideHover(document, position) {
    if (!vscode.workspace.getConfiguration('cronoSql').get('hover.enabled', true)) {
      return undefined;
    }
    const range = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/);
    if (!range) {
      return undefined;
    }
    const word = document.getText(range);
    const lower = word.toLowerCase();
    const upper = word.toUpperCase();

    // 1) Multi-word phrase (e.g. "MERGE CLONE", "SEMI JOIN").
    const phraseHover = tryPhraseHover(document, range, word);
    if (phraseHover) {
      return phraseHover;
    }
    // 2) Function: official docs → manual → generic.
    if (FUNCTION_SET.has(lower)) {
      return new vscode.Hover(renderFunctionDoc(lower), range);
    }
    // 3) Keyword with explicit docs.
    if (KEYWORD_DOCS[upper]) {
      return new vscode.Hover(renderDoc(KEYWORD_DOCS[upper]), range);
    }
    // 4) Known keyword without rich docs.
    if (KEYWORD_SET.has(lower)) {
      const md = new vscode.MarkdownString(`**${upper}** · keyword de Crono SQL`);
      return new vscode.Hover(md, range);
    }
    return undefined;
  },
};

// Detect two-word Crono phrases around the hovered word.
function tryPhraseHover(
  document: vscode.TextDocument,
  range: vscode.Range,
  word: string,
): vscode.Hover | undefined {
  const wordUpper = word.toUpperCase();
  const prevRange = document.getWordRangeAtPosition(range.start.translate(0, -1), /[a-zA-Z_][a-zA-Z0-9_]*/);
  const nextRange = document.getWordRangeAtPosition(range.end.translate(0, 1), /[a-zA-Z_][a-zA-Z0-9_]*/);
  const candidates: Array<{ phrase: string; range: vscode.Range }> = [];

  if (prevRange) {
    const prev = document.getText(prevRange).toUpperCase();
    candidates.push({
      phrase: `${prev} ${wordUpper}`,
      range: new vscode.Range(prevRange.start, range.end),
    });
  }
  if (nextRange) {
    const next = document.getText(nextRange).toUpperCase();
    candidates.push({
      phrase: `${wordUpper} ${next}`,
      range: new vscode.Range(range.start, nextRange.end),
    });
  }

  for (const c of candidates) {
    const entry = PHRASE_DOCS[c.phrase];
    if (entry) {
      return new vscode.Hover(renderDoc(entry), c.range);
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
