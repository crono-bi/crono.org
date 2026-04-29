<template>
  <div ref="editorRef" class="code-editor"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  EditorView, ViewPlugin, Decoration, keymap,
  lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
  drawSelection, dropCursor, rectangularSelection, crosshairCursor,
  highlightActiveLine
} from '@codemirror/view'
import type { DecorationSet } from '@codemirror/view'
import { EditorState, Prec, RangeSetBuilder } from '@codemirror/state'
import {
  syntaxHighlighting, syntaxTree, HighlightStyle, defaultHighlightStyle,
  foldGutter, indentOnInput, bracketMatching,
  foldKeymap
} from '@codemirror/language'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import type { CompletionSource } from '@codemirror/autocomplete'
import { sql, MSSQL } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { tags } from '@lezer/highlight'

import { Theme } from '../types/enums'
import { CRONO_FUNCTIONS, CRONO_KEYWORDS } from '../crono-language'

const props = defineProps<{
  modelValue: string
  readonly?: boolean
  theme: Theme
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLElement | null>(null)
let editorView: EditorView | null = null

// ══════════════════════════════════════════════════════════════════
// DATA-DRIVEN LISTS — sourced from crono-language.ts
// ══════════════════════════════════════════════════════════════════

// Extract all functions from categorized object into a flat array
const SQL_FUNCTIONS = [
  ...CRONO_FUNCTIONS.aggregation,
  ...CRONO_FUNCTIONS.conversion,
  ...CRONO_FUNCTIONS.dates,
  ...CRONO_FUNCTIONS.informational,
  ...CRONO_FUNCTIONS.nullsAndConditions,
  ...CRONO_FUNCTIONS.numeric,
  ...CRONO_FUNCTIONS.text,
  ...CRONO_FUNCTIONS.obsolete,
  ...CRONO_FUNCTIONS.obsoleteUncertain,
  ...CRONO_FUNCTIONS.obsoleteAD
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

const CRONO_KW_RE  = buildKeywordRegex([...CRONO_KEYWORDS])
const SQL_FUNC_RE  = buildFunctionRegex(SQL_FUNCTIONS)

// ══════════════════════════════════════════════════════════════════
// CRONO SQL AUTOCOMPLETION
// ══════════════════════════════════════════════════════════════════

const cronoSQLCompletion: CompletionSource = (context) => {
  const word = context.matchBefore(/\w*/)
  if (!word || (word.from === word.to && !context.explicit)) return null

  const options = [
    // Functions with ( suffix
    ...SQL_FUNCTIONS.map(func => ({
      label: func,
      type: 'function',
      info: `Crono SQL function: ${func}`,
      apply: func + '('
    })),
    // Keywords
    ...CRONO_KEYWORDS.map(kw => ({
      label: kw,
      type: 'keyword',
      info: `Crono SQL keyword: ${kw}`
    }))
  ]

  return {
    from: word.from,
    options: options.filter(option => 
      option.label.toLowerCase().startsWith(word.text.toLowerCase())
    ),
    validFor: /^\w*$/
  }
}

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
    '.cm-scroller': { overflow: 'auto' },
    '.cm-content': { fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace", lineHeight: '1.4' },
    '.cm-gutters': { fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" },
    '.cm-gutterElement': { lineHeight: '1.4' },
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

const editorSetup = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion({ override: [cronoSQLCompletion] }),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    indentWithTab,
  ]),
]

function buildExtensions() {
  const extensions = [
    ...editorSetup,
    sql({ dialect: MSSQL }),
    ...getThemeExtensions(),
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
  const el = editorRef.value
  if (!el) return

  // FIX: Initialize editor ONLY when container has height > 0
  // This prevents the "double viewport virtualization" bug where CodeMirror
  // calculates incorrect gutter positions when initialized in a 0-height container
  const ro = new ResizeObserver(() => {
    if (el.offsetHeight > 0 && !editorView) {
      ro.disconnect()
      editorView = new EditorView({
        state: EditorState.create({
          doc: props.modelValue,
          extensions: buildExtensions()
        }),
        parent: el
      })
    }
  })
  ro.observe(el)
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
    editorView.requestMeasure()
    setTimeout(() => editorView?.requestMeasure(), 100)
  }
})

watch(() => props.theme, () => {
  if (editorView) {
    const currentDoc = editorView.state.doc.toString()
    editorView.destroy()
    editorView = new EditorView({
      state: EditorState.create({
        doc: currentDoc,
        extensions: buildExtensions()
      }),
      parent: editorRef.value ?? undefined
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
/* Solo estilos del contenedor principal - el resto está en playground-codemirror.css (global) */
.code-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 
  NOTA: Todos los estilos para elementos internos de CodeMirror (.cm-*)
  han sido movidos a /src/styles/playground-codemirror.css
  
  Esto soluciona el bug donde Astro purga CSS scoped con :deep() 
  cuando se usa client:only="vue" en producción.
  
  Ver: https://github.com/withastro/astro/issues/\d+
*/
</style>
