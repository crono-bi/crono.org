<template>
  <div ref="editorRef" class="code-editor"></div>
  <Teleport v-if="panelRef" :to="panelRef" defer>
    <slot name="panel-actions" />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, h, render } from 'vue'
import { basicSetup } from 'codemirror'
import { EditorView, ViewPlugin, Decoration, showPanel, keymap } from '@codemirror/view'
import type { DecorationSet } from '@codemirror/view'
import { EditorState, Prec, RangeSetBuilder, Compartment } from '@codemirror/state'
import { syntaxHighlighting, syntaxTree } from '@codemirror/language'
import { sql, MSSQL } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

import { Theme } from '../types/enums'

// Compartment for dynamic theme swapping (preserves undo history, cursor, selection)
const themeCompartment = new Compartment()

const props = defineProps<{
  modelValue: string
  readonly?: boolean
  theme: Theme
  panelTitle?: string
  showPanel?: boolean
  showCopy?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'copy'): void
}>()

const editorRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
let editorView: EditorView | null = null

// ══════════════════════════════════════════════════════════════════
// DATA-DRIVEN LISTS — add new keywords / functions here
// ══════════════════════════════════════════════════════════════════

// Crono SQL compound keywords & non-standard reserved words → keyword color
const CRONO_KEYWORDS = [
  'CHECK SNOWFLAKE',
  'SEMI JOIN', 'ANTI JOIN',
  'MATERIALIZE', 'ASSERT', 'CALCULATE', 'FILTER',
  'DELETE AND INSERT', 'TRUNCATE AND INSERT',
  'INSERT ALL', 'UPDATE ALL',
  'MERGE CLONE', 'MERGE HISTORY', 'MERGE SOFT DELETE',
  'MERGE UPSERT', 'MERGE UPDATE', 'MERGE ALL',
]

// SQL & Crono functions → function color (applied ONLY when followed by '(')
// This resolves ambiguity: LEFT JOIN → keyword, LEFT(...) → function
const SQL_FUNCTIONS = [
  // Aggregate
  'sum', 'avg', 'count', 'min', 'max', 'count_big',
  'stdev', 'stdevp', 'var', 'varp', 'string_agg', 'grouping',
  // Date / Time
  'year', 'month', 'day', 'hour', 'minute', 'second',
  'getdate', 'getutcdate', 'sysdatetime', 'dateadd', 'datediff',
  'datediff_big', 'datename', 'datepart', 'datefromparts',
  'datetime2fromparts', 'datetimefromparts', 'datetimeoffsetfromparts',
  'smalldatetimefromparts', 'timefromparts',
  'eomonth', 'switchoffset', 'todatetimeoffset', 'isdate', 'datetrunc',
  // String
  'concat', 'concat_ws', 'substring', 'replace', 'trim', 'ltrim', 'rtrim',
  'upper', 'lower', 'len', 'length', 'left', 'right',
  'charindex', 'patindex', 'stuff', 'reverse', 'replicate',
  'space', 'format', 'translate', 'char', 'ascii', 'unicode', 'nchar',
  'string_split', 'string_escape', 'soundex', 'difference', 'quotename',
  // Conversion / Null handling
  'cast', 'convert', 'try_cast', 'try_convert', 'parse', 'try_parse',
  'coalesce', 'nullif', 'isnull', 'iif', 'choose',
  // Math
  'abs', 'ceiling', 'ceil', 'floor', 'round', 'power', 'sqrt', 'sign',
  'log', 'log10', 'exp', 'rand', 'pi', 'square', 'greatest', 'least',
  'acos', 'asin', 'atan', 'atn2', 'cos', 'cot', 'sin', 'tan',
  'degrees', 'radians',
  // Window / Ranking
  'row_number', 'rank', 'dense_rank', 'ntile',
  'lag', 'lead', 'first_value', 'last_value',
  'percent_rank', 'cume_dist',
  // System / Meta
  'newid', 'checksum', 'hashbytes', 'isnumeric',
  'scope_identity', 'object_id', 'db_name', 'schema_name',
  'error_message', 'error_number', 'error_line', 'error_severity',
  // JSON
  'json_value', 'json_query', 'json_modify', 'isjson', 'json_array', 'json_object',
  // Crono-specific
  'divide', 'margin', 'markup', 'substraction',
]

// ══════════════════════════════════════════════════════════════════
// REGEX BUILDERS — compile once from the data arrays
// ══════════════════════════════════════════════════════════════════

function buildKeywordRegex(keywords: string[]): RegExp {
  const pattern = keywords
    .map(kw => kw.split(/\s+/).join('\\s+'))
    .sort((a, b) => b.length - a.length)  // longest first
    .join('|')
  return new RegExp(`\\b(${pattern})\\b`, 'gi')
}

function buildFunctionRegex(functions: string[]): RegExp {
  const pattern = functions
    .sort((a, b) => b.length - a.length)
    .join('|')
  return new RegExp(`\\b(${pattern})\\s*(?=\\()`, 'gi')
}

const CRONO_KW_RE  = buildKeywordRegex(CRONO_KEYWORDS)
const SQL_FUNC_RE  = buildFunctionRegex(SQL_FUNCTIONS)

// ══════════════════════════════════════════════════════════════════
// SYNTAX TREE HELPERS
// ══════════════════════════════════════════════════════════════════

function isInComment(state: EditorState, pos: number): boolean {
  const tree = syntaxTree(state)
  let node: ReturnType<typeof tree.resolveInner> | null = tree.resolveInner(pos, 1)
  while (node) {
    if (/[Cc]omment/.test(node.type.name)) return true
    node = node.parent
  }
  return false
}

// ══════════════════════════════════════════════════════════════════
// VIEW PLUGIN — decorates Crono keywords (blue) and functions (magenta)
// ══════════════════════════════════════════════════════════════════

function makeSyntaxPlugin(kwCls: string, funcCls: string) {
  return ViewPlugin.fromClass(class {
    decorations: DecorationSet
    constructor(view: EditorView) { this.decorations = this.build(view) }
    update(u: { docChanged: boolean; viewportChanged: boolean; view: EditorView }) {
      if (u.docChanged || u.viewportChanged) this.decorations = this.build(u.view)
    }
    build(view: EditorView) {
      const kwMark   = Decoration.mark({ class: kwCls })
      const funcMark = Decoration.mark({ class: funcCls })
      const allMarks: { from: number; to: number; value: ReturnType<typeof Decoration.mark>; prio: number }[] = []

      for (const { from, to } of view.visibleRanges) {
        const text = view.state.sliceDoc(from, to)

        // Crono keywords → keyword color
        CRONO_KW_RE.lastIndex = 0
        let m
        while ((m = CRONO_KW_RE.exec(text)) !== null) {
          const abs = from + m.index
          if (!isInComment(view.state, abs))
            allMarks.push({ from: abs, to: abs + m[0].length, value: kwMark, prio: 1 })
        }

        // SQL + Crono functions → function color (only when followed by '(')
        SQL_FUNC_RE.lastIndex = 0
        while ((m = SQL_FUNC_RE.exec(text)) !== null) {
          const abs = from + m.index
          if (!isInComment(view.state, abs))
            allMarks.push({ from: abs, to: abs + m[1].length, value: funcMark, prio: 0 })
        }
      }

      // Sort by position; on overlap keyword (prio 1) wins
      allMarks.sort((a, b) => a.from - b.from || b.prio - a.prio)
      const builder = new RangeSetBuilder<Decoration>()
      let lastEnd = -1
      for (const { from: mf, to: mt, value } of allMarks) {
        if (mf >= lastEnd) {
          builder.add(mf, mt, value)
          lastEnd = mt
        }
      }
      return builder.finish()
    }
  }, { decorations: (v: { decorations: DecorationSet }) => v.decorations })
}

// ══════════════════════════════════════════════════════════════════
// HIGHLIGHT STYLES — base SQL token colors
// ══════════════════════════════════════════════════════════════════

const ALL_NAME_TAGS = [
  tags.name, tags.variableName, tags.typeName, tags.propertyName,
  tags.className, tags.labelName, tags.namespace, tags.macroName,
  tags.definition(tags.name), tags.definition(tags.variableName),
  tags.definition(tags.propertyName),
  tags.local(tags.variableName),
  tags.special(tags.variableName),
  tags.function(tags.variableName),
  tags.function(tags.propertyName),
]

// Light: SSMS-inspired
const lightHighlight = syntaxHighlighting(HighlightStyle.define([
  { tag: [tags.comment, tags.lineComment, tags.blockComment],
                                          color: '#008000', fontStyle: 'italic' },
  { tag: [tags.keyword, tags.operatorKeyword, tags.modifier,
          tags.controlKeyword, tags.definitionKeyword, tags.moduleKeyword],
                                          color: '#0000ff' },
  { tag: tags.standard(tags.name),       color: '#0000ff' },   // builtins → blue (same as keywords)
  { tag: [tags.string, tags.special(tags.string)],
                                          color: '#a31515' },
  { tag: tags.number,                    color: '#098658' },
  { tag: tags.literal,                   color: '#098658' },
  { tag: tags.inserted,                  color: '#000000' },
  { tag: tags.atom,                      color: '#000000' },
  { tag: tags.bool,                      color: '#000000' },
  { tag: [tags.operator, tags.punctuation, tags.separator,
          tags.bracket, tags.paren, tags.squareBracket, tags.brace],
                                          color: '#000000' },
  { tag: ALL_NAME_TAGS,                  color: '#000000' },
]))

// Dark: VS Code-inspired
const darkHighlight = syntaxHighlighting(HighlightStyle.define([
  { tag: [tags.comment, tags.lineComment, tags.blockComment],
                                          color: '#7ee787', fontStyle: 'italic', fontWeight: '500' },
  { tag: [tags.keyword, tags.operatorKeyword, tags.modifier,
          tags.controlKeyword, tags.definitionKeyword, tags.moduleKeyword],
                                          color: '#569cd6', fontWeight: 'bold' },
  { tag: tags.standard(tags.name),       color: '#569cd6' },   // builtins → blue (same as keywords)
  { tag: [tags.string, tags.special(tags.string)],
                                          color: '#ce9178' },
  { tag: tags.number,                    color: '#b5cea8' },
  { tag: tags.literal,                   color: '#b5cea8' },
  { tag: tags.inserted,                  color: '#b5cea8' },
  { tag: tags.atom,                      color: '#b5cea8' },
  { tag: tags.bool,                      color: '#b5cea8' },
  { tag: [tags.operator, tags.punctuation, tags.separator,
          tags.bracket, tags.paren, tags.squareBracket, tags.brace],
                                          color: '#d4d4d4' },
  { tag: ALL_NAME_TAGS,                  color: '#9cdcfe' },
]))

const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: '#ffffff',
    color: '#24292e'
  },
  '.cm-content': {
    caretColor: '#24292e',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#24292e' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#d7d4f0'
  },
  '.cm-activeLine': { backgroundColor: '#f6f8fa' },
  '.cm-selectionMatch': { backgroundColor: '#e8f2ff' },
  '.cm-gutters': {
    backgroundColor: '#f6f8fa',
    color: '#6e7781',
    border: 'none',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f6f8fa'
  }
}, { dark: false })

function getThemeExtensions(): ReturnType<typeof EditorView.theme>[] {
  const baseTheme = EditorView.theme({
    '&': { height: '100%', fontSize: '14px' },
    '.cm-content': { fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" },
    '.cm-gutters': { fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" },
    '.cm-crono-kw-light':        { color: '#0000ff !important' },
    '.cm-crono-kw-light span':   { color: '#0000ff !important' },
    '.cm-crono-kw-dark':         { color: '#569cd6 !important' },
    '.cm-crono-kw-dark span':    { color: '#569cd6 !important' },
    '.cm-crono-fn-light':        { color: '#FF00FF !important' },
    '.cm-crono-fn-light span':   { color: '#FF00FF !important' },
    '.cm-crono-fn-dark':         { color: '#dcdcaa !important' },
    '.cm-crono-fn-dark span':    { color: '#dcdcaa !important' }
  })

  if (props.theme === Theme.Light) {
    return [baseTheme, lightTheme, Prec.highest(lightHighlight), makeSyntaxPlugin('cm-crono-kw-light', 'cm-crono-fn-light')]
  } else {
    return [baseTheme, oneDark, Prec.highest(darkHighlight), makeSyntaxPlugin('cm-crono-kw-dark', 'cm-crono-fn-dark')]
  }
}

// Create top panel using showPanel - native CodeMirror API
function createTopPanel(): any[] {
  if (!props.showPanel) return []
  
  const panel = showPanel.of(() => {
    const dom = document.createElement('div')
    dom.className = 'cm-top-panel'
    
    // Title
    if (props.panelTitle) {
      const titleEl = document.createElement('span')
      titleEl.className = 'cm-panel-title'
      titleEl.textContent = props.panelTitle
      dom.appendChild(titleEl)
    }

    // Spacer — only when there's a title, pushes right group to the right
    if (props.panelTitle) {
      const spacer = document.createElement('div')
      spacer.className = 'cm-panel-spacer'
      dom.appendChild(spacer)
    }

    // Right group — actions + copy in one flex row (guarantees same vertical center)
    const rightGroup = document.createElement('div')
    rightGroup.className = props.panelTitle
      ? 'cm-panel-right-group'
      : 'cm-panel-right-group cm-panel-right-full'

    // Actions slot container (for Teleport)
    const actionsEl = document.createElement('div')
    actionsEl.className = 'cm-panel-actions'
    rightGroup.appendChild(actionsEl)
    panelRef.value = actionsEl

    // Copy button
    if (props.showCopy) {
      const copyBtn = document.createElement('button')
      copyBtn.className = 'cm-panel-copy-btn'
      copyBtn.title = 'Copy'
      copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
      copyBtn.addEventListener('click', () => emit('copy'))
      rightGroup.appendChild(copyBtn)
    }

    dom.appendChild(rightGroup)
    
    return { dom, top: true }
  })
  
  return [panel]
}

// Use basicSetup from codemirror which includes proper foldGutter configuration

function buildExtensions() {
  const extensions = [
    basicSetup,
    sql({ dialect: MSSQL }),
    themeCompartment.of(getThemeExtensions()),
    ...createTopPanel()
  ]

  if (props.readonly) {
    extensions.push(EditorState.readOnly.of(true))
    extensions.push(EditorView.editable.of(false))
  } else {
    extensions.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString())
        }
      })
    )
  }

  return extensions
}

onMounted(() => {
  editorView = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions: buildExtensions()
    }),
    parent: editorRef.value ?? undefined
  })
})

watch(() => props.modelValue, (newVal) => {
  if (editorView && newVal !== editorView.state.doc.toString()) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: newVal
      }
    })
  }
})

// Theme swap via compartment — preserves cursor, scroll, undo history
watch(() => props.theme, () => {
  if (editorView) {
    editorView.dispatch({
      effects: themeCompartment.reconfigure(getThemeExtensions())
    })
  }
})

onUnmounted(() => {
  if (editorView) {
    editorView.destroy()
    editorView = null
  }
})
</script>

<style scoped>
.code-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.code-editor :deep(.cm-editor) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.code-editor :deep(.cm-editor .cm-scroller) {
  flex: 1;
}

/* Scroller - only show scrollbar when content exceeds container */
.code-editor :deep(.cm-scroller) {
  overflow: auto;
  height: 100%;
}

/* Hide scrollbar when content fits (Webkit browsers) */
.code-editor :deep(.cm-scroller::-webkit-scrollbar) {
  width: 10px;
  height: 10px;
}

.code-editor :deep(.cm-scroller::-webkit-scrollbar-track) {
  background: transparent;
}

.code-editor :deep(.cm-scroller::-webkit-scrollbar-thumb) {
  background: var(--sl-color-gray-5);
  border-radius: 5px;
}

.code-editor :deep(.cm-scroller::-webkit-scrollbar-thumb:hover) {
  background: var(--sl-color-gray-4);
}

/* Hide announced element but don't break layout */
.code-editor :deep(.cm-announced) {
  position: absolute;
  height: 0;
  overflow: hidden;
}

/* Remove space between panel and content */
.code-editor :deep(.cm-editor) {
  padding: 0;
}

.code-editor :deep(.cm-editor > .cm-scroller) {
  margin-top: 0;
}

/* First line should have no top padding */
.code-editor :deep(.cm-line:first-child) {
  padding-top: 0;
}

/* Keep gutters transparent - basicSetup handles fold gutter styling */
.code-editor :deep(.cm-gutters) {
  background: transparent;
  border-right: 1px solid var(--sl-color-gray-6, #333);
}


/* Top panel styles - with vertical padding for breathing room */
.code-editor :deep(.cm-top-panel) {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start;
  gap: 10px;
  padding: 10px 16px !important;
  min-height: 44px !important;
  background: var(--sl-color-bg);
  border-bottom: 1px solid var(--sl-color-gray-5);
  box-sizing: border-box !important;
  flex-shrink: 0;
}

/* Force vertical centering on all panel children */
.code-editor :deep(.cm-top-panel > *) {
  align-self: center !important;
}

.code-editor :deep(.cm-panel-title) {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--sl-color-accent);
  flex-shrink: 0;
  line-height: 1;
  padding: 0;
  background: none;
  border-radius: 0;
  box-shadow: none;
  border-left: 3px solid var(--sl-color-accent);
  padding-left: 10px;
}

.code-editor :deep(.cm-panel-spacer) {
  flex: 1;
  align-self: stretch;
}

.code-editor :deep(.cm-panel-right-group) {
  display: flex !important;
  align-items: center !important;
  align-self: center !important;
  flex-shrink: 0;
  gap: 8px;
  margin: 0 !important;
  padding: 0 !important;
  height: auto !important;
}

/* Right panel (no title): group fills width, clipboard pushed right */
.code-editor :deep(.cm-panel-right-full) {
  flex: 1 !important;
  min-width: 0;
}

.code-editor :deep(.cm-panel-actions) {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
}

.code-editor :deep(.cm-panel-right-full .cm-panel-copy-btn) {
  margin-left: auto !important;
}

.code-editor :deep(.cm-panel-copy-btn) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background: var(--sl-color-gray-6);
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 5px;
  cursor: pointer;
  color: var(--sl-color-gray-2);
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.code-editor :deep(.cm-panel-copy-btn:hover) {
  color: #fff;
  background: var(--sl-color-accent);
  border-color: var(--sl-color-accent);
  box-shadow: 0 1px 3px rgba(212, 168, 75, 0.3);
}

.code-editor :deep(.cm-panel-copy-btn svg) {
  display: block;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .code-editor :deep(.cm-top-panel) {
    min-height: 40px !important;
    padding: 8px 14px !important;
    gap: 8px;
  }

  .code-editor :deep(.cm-panel-title) {
    font-size: 12px;
    padding-left: 9px;
  }
}

@media (max-width: 600px) {
  .code-editor :deep(.cm-top-panel) {
    min-height: 38px !important;
    padding: 6px 12px !important;
    gap: 6px;
  }

  .code-editor :deep(.cm-panel-title) {
    font-size: 11px;
    padding-left: 8px;
    border-left-width: 2px;
  }

  .code-editor :deep(.cm-panel-right-group) {
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .code-editor :deep(.cm-top-panel) {
    min-height: 36px !important;
    padding: 6px 10px !important;
    gap: 4px;
  }
}

/* Crono keyword & function overrides — force color over syntax spans */
.code-editor :deep(.cm-crono-kw-light),
.code-editor :deep(.cm-crono-kw-light) span {
  color: #0000ff !important;
}
.code-editor :deep(.cm-crono-kw-dark),
.code-editor :deep(.cm-crono-kw-dark) span {
  color: #569cd6 !important;
}
.code-editor :deep(.cm-crono-fn-light),
.code-editor :deep(.cm-crono-fn-light) span {
  color: #FF00FF !important;
}
.code-editor :deep(.cm-crono-fn-dark),
.code-editor :deep(.cm-crono-fn-dark) span {
  color: #dcdcaa !important;
}
</style>
