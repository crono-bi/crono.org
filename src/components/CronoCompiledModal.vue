<template>
  <dialog ref="dialogRef" class="ccm-dialog" :class="themeClass" @click="onBackdropClick" @close="onClose">
    <div class="ccm-panel" @click.stop>
      <!-- Header -->
      <div class="ccm-header">
        <div class="ccm-title">
          <img :src="cronoIcon" alt="Crono" class="ccm-title-icon" />
          <span>Crono SQL → SQL compilado</span>
        </div>
        <button class="ccm-close" @click="close" title="Cerrar (Esc)" aria-label="Cerrar">
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div class="ccm-body">
        <!-- Source -->
        <div class="ccm-col">
          <div class="ccm-col-header">
            <span class="ccm-col-label">Crono SQL</span>
          </div>
          <div class="ccm-col-body">
            <CodeEditor :modelValue="sourceCode" :readonly="true" :theme="theme" />
          </div>
        </div>

        <!-- Output -->
        <div class="ccm-col">
          <div class="ccm-col-header">
            <EngineSelector v-model="selectedEngine" :theme="theme" />
            <span v-if="isCompiling" class="ccm-status ccm-compiling">Compilando…</span>
            <span v-else-if="compilationError" class="ccm-status ccm-error">Error</span>
          </div>
          <div class="ccm-col-body">
            <CodeEditor :modelValue="sqlOutput" :readonly="true" :theme="theme" />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="ccm-footer">
        <a :href="playgroundUrl" target="_blank" rel="noopener" class="ccm-pg-link">
          <ExternalLink :size="14" />
          <span>Abrir en Playground</span>
        </a>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { X, ExternalLink } from 'lucide-vue-next'
import { Theme, EngineId } from '../playground/types/enums'
import CodeEditor from '../playground/components/CodeEditor.vue'
import EngineSelector from '../playground/components/EngineSelector.vue'
import { CronoSqlService } from '../playground/services/cronosql.service'
import { ENGINE_MAP, DEFAULT_ENGINE } from '../config/engines'
import cronoIcon from '../playground/assets/datawarehouse-logos/crono.svg?url'

const ENGINE_STORAGE_KEY = 'crono-sql-engine'

const dialogRef = ref<HTMLDialogElement | null>(null)
const sourceCode = ref('')
const sqlOutput = ref('')
const isCompiling = ref(false)
const compilationError = ref('')

// Engine: persisted across blocks via localStorage
function loadEngine(): EngineId {
  if (typeof window === 'undefined') return DEFAULT_ENGINE
  const stored = window.localStorage.getItem(ENGINE_STORAGE_KEY) as EngineId | null
  return stored && ENGINE_MAP.has(stored) ? stored : DEFAULT_ENGINE
}
const selectedEngine = ref<EngineId>(loadEngine())

// Theme sync with Starlight
const theme = ref<Theme>(Theme.Dark)
function syncTheme() {
  const st = document.documentElement.dataset.theme
  theme.value = st === 'light' ? Theme.Light : Theme.Dark
}
let themeObserver: MutationObserver | null = null

const themeClass = computed(() => ({
  'ccm-theme-light': theme.value === Theme.Light,
  'ccm-theme-dark': theme.value === Theme.Dark,
}))

const engineLabel = computed(() => ENGINE_MAP.get(selectedEngine.value)?.name ?? selectedEngine.value)

const playgroundUrl = computed(() => {
  if (typeof window === 'undefined') return '/playground'
  const code = btoa(encodeURIComponent(sourceCode.value))
  return `/playground?code=${code}&engine=${selectedEngine.value}`
})

let runId = 0
async function compile() {
  if (!sourceCode.value.trim()) {
    sqlOutput.value = '-- Sin código para compilar'
    return
  }
  const currentRunId = ++runId
  isCompiling.value = true
  compilationError.value = ''
  sqlOutput.value = `-- Compilando para ${engineLabel.value}…`

  try {
    const result = await CronoSqlService.compile(sourceCode.value, selectedEngine.value)
    if (currentRunId !== runId) return

    let output = `-- SQL generado para ${engineLabel.value}\n`
    if (result.warnings.length > 0) {
      output += `-- Advertencias:\n`
      result.warnings.forEach(w => { output += `--   ${w}\n` })
      output += `\n`
    }
    output += result.sql
    sqlOutput.value = output.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  } catch (error: unknown) {
    if (currentRunId !== runId) return
    const msg = error instanceof Error ? error.message : 'Error desconocido'
    const code = (error as Error & { code?: string }).code
    compilationError.value = msg
    sqlOutput.value = code === 'SyntaxErrorException'
      ? `-- Error de sintaxis en tu Crono SQL:\n-- ${msg}`
      : `-- Error de compilación:\n-- ${msg}`
  } finally {
    if (currentRunId === runId) isCompiling.value = false
  }
}

function open(code: string) {
  sourceCode.value = code
  // Refresh engine from storage in case it changed elsewhere (other tab / playground)
  selectedEngine.value = loadEngine()
  syncTheme()
  if (dialogRef.value && !dialogRef.value.open) {
    dialogRef.value.showModal()
  }
  compile()
}

function close() {
  dialogRef.value?.close()
}

function onClose() {
  sqlOutput.value = ''
  compilationError.value = ''
}

function onBackdropClick(e: MouseEvent) {
  // Click on the dialog element itself (backdrop) closes it
  if (e.target === dialogRef.value) close()
}

// Recompile + persist when engine changes
function onEngineChange() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ENGINE_STORAGE_KEY, selectedEngine.value)
  }
  if (dialogRef.value?.open) compile()
}

// Listen for global compile requests (decoupled from injector)
function handleCompileEvent(e: Event) {
  const detail = (e as CustomEvent<{ code: string }>).detail
  if (detail?.code != null) open(detail.code)
}

onMounted(() => {
  syncTheme()
  themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  window.addEventListener('crono:compile', handleCompileEvent as EventListener)
})

onUnmounted(() => {
  themeObserver?.disconnect()
  window.removeEventListener('crono:compile', handleCompileEvent as EventListener)
})

watch(selectedEngine, onEngineChange)

defineExpose({ open, close })
</script>

<style scoped>
.ccm-dialog {
  border: none;
  padding: 0;
  background: transparent;
  max-width: min(1100px, 94vw);
  width: 94vw;
  max-height: 88vh;
  border-radius: 14px;
  overflow: visible;
  /* Center in viewport — required for <dialog> element */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}
.ccm-dialog::backdrop {
  background: rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(3px);
}

.ccm-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 88vh;
  max-height: 88vh;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}
.ccm-theme-dark .ccm-panel { background: #0f172a; border: 1px solid #1e293b; }
.ccm-theme-light .ccm-panel { background: #ffffff; border: 1px solid #e2e8f0; }

/* Header */
.ccm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid;
  flex-shrink: 0;
}
.ccm-theme-dark .ccm-header { border-color: #1e293b; }
.ccm-theme-light .ccm-header { border-color: #e2e8f0; }

.ccm-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}
.ccm-theme-dark .ccm-title { color: #f1f5f9; }
.ccm-theme-light .ccm-title { color: #0f172a; }
.ccm-title-icon { width: 20px; height: 20px; object-fit: contain; }

.ccm-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.ccm-theme-dark .ccm-close { color: #94a3b8; }
.ccm-theme-dark .ccm-close:hover { background: #1e293b; color: #f1f5f9; }
.ccm-theme-light .ccm-close { color: #64748b; }
.ccm-theme-light .ccm-close:hover { background: #f1f5f9; color: #0f172a; }

/* Body */
.ccm-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
@media (max-width: 768px) {
  .ccm-body { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
}

.ccm-col {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}
.ccm-col + .ccm-col { border-left: 1px solid; }
.ccm-theme-dark .ccm-col + .ccm-col { border-color: #1e293b; }
.ccm-theme-light .ccm-col + .ccm-col { border-color: #e2e8f0; }
@media (max-width: 768px) {
  .ccm-col + .ccm-col { border-left: none; border-top: 1px solid; }
}

.ccm-col-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  min-height: 52px;
  flex-shrink: 0;
}
.ccm-theme-dark .ccm-col-header { background: #0b1220; }
.ccm-theme-light .ccm-col-header { background: #f8fafc; }

.ccm-col-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.ccm-theme-dark .ccm-col-label { color: #60A5FA; }
.ccm-theme-light .ccm-col-label { color: #2563EB; }

.ccm-col-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
}
.ccm-col-body > :deep(.code-editor) { flex: 1; min-height: 220px; }

.ccm-status { font-size: 12px; font-weight: 600; }
.ccm-compiling { color: #94a3b8; }
.ccm-error { color: #ef4444; }

/* Footer */
.ccm-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 16px;
  border-top: 1px solid;
  flex-shrink: 0;
}
.ccm-theme-dark .ccm-footer { border-color: #1e293b; }
.ccm-theme-light .ccm-footer { border-color: #e2e8f0; }

.ccm-pg-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 7px 12px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s ease;
}
.ccm-theme-dark .ccm-pg-link { color: #60A5FA; }
.ccm-theme-dark .ccm-pg-link:hover { background: #1e293b; }
.ccm-theme-light .ccm-pg-link { color: #2563EB; }
.ccm-theme-light .ccm-pg-link:hover { background: #eff6ff; }
</style>
