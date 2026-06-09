<template>
  <dialog ref="dialogRef" class="ccm-dialog" :class="themeClass" @click="onBackdropClick" @close="onClose">
    <div class="ccm-panel" @click.stop>
      <!-- Header -->
      <div class="ccm-header">
        <div class="ccm-title">
          <img :src="cronoIcon" alt="Crono" class="ccm-title-icon" />
          <span>{{ t('modal.title') }}</span>
        </div>
        <button class="ccm-close" @click="close" :title="t('modal.close')" :aria-label="t('modal.closeAria')">
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div class="ccm-body">
        <!-- Source -->
        <div class="ccm-col">
          <div class="ccm-col-header">
            <span class="ccm-col-label">{{ t('modal.cronoSql') }}</span>
          </div>
          <div class="ccm-col-body">
            <CodeEditor :modelValue="sourceCode" :readonly="true" :theme="theme" />
          </div>
        </div>

        <!-- Output -->
        <div ref="outputPanelRef" class="ccm-col" style="position:relative">
          <div class="ccm-col-header">
            <EngineSelector v-model="selectedEngine" :theme="theme" />
            <span v-if="isCompiling" class="ccm-status ccm-compiling">{{ t('modal.compiling') }}</span>
            <span v-else-if="compilationError" class="ccm-status ccm-error">{{ t('modal.error') }}</span>
            <div class="ccm-fs-wrapper">
              <button
                ref="fsBtnRef"
                class="ccm-fs-btn"
                @click="toggleFullscreen"
                @mouseenter="showTooltip"
                @mouseleave="hideTooltip"
                :aria-label="isFullscreen ? t('modal.exitFullscreen') : t('modal.fullscreen')"
              >
                <!-- Exit fullscreen icon (X) -->
                <svg v-if="isFullscreen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                <!-- Enter fullscreen icon (expand arrows) -->
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4v4M6 14H2v-4M14 2l-5 5M2 14l5-5"/></svg>
              </button>
            </div>
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
          <span>{{ t('modal.openPlayground') }}</span>
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
import { useT, getLangFromPath } from '../i18n/ui'
import cronoIcon from '../playground/assets/datawarehouse-logos/crono.svg?url'

const t = useT(getLangFromPath(typeof window !== 'undefined' ? window.location.pathname : '/'))

const ENGINE_STORAGE_KEY = 'crono-sql-engine'

const dialogRef = ref<HTMLDialogElement | null>(null)
const outputPanelRef = ref<HTMLElement | null>(null)
const fsBtnRef = ref<HTMLButtonElement | null>(null)
let tooltipEl: HTMLDivElement | null = null
const sourceCode = ref('')
const sqlOutput = ref('')
const isCompiling = ref(false)
const compilationError = ref('')
const isFullscreen = ref(false)

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
    sqlOutput.value = t('modal.noCode')
    return
  }
  const currentRunId = ++runId
  isCompiling.value = true
  compilationError.value = ''
  sqlOutput.value = t('modal.compilingFor', { engine: engineLabel.value })

  try {
    const result = await CronoSqlService.compile(sourceCode.value, selectedEngine.value)
    if (currentRunId !== runId) return

    let output = t('modal.generatedFor', { engine: engineLabel.value }) + '\n'
    if (result.warnings.length > 0) {
      output += t('modal.warnings') + '\n'
      result.warnings.forEach(w => { output += `--   ${w}\n` })
      output += `\n`
    }
    output += result.sql
    sqlOutput.value = output.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  } catch (error: unknown) {
    if (currentRunId !== runId) return
    const msg = error instanceof Error ? error.message : t('modal.unknownError')
    const code = (error as Error & { code?: string }).code
    compilationError.value = msg
    sqlOutput.value = code === 'SyntaxErrorException'
      ? `${t('modal.syntaxError')}\n-- ${msg}`
      : `${t('modal.compileError')}\n-- ${msg}`
  } finally {
    if (currentRunId === runId) isCompiling.value = false
  }
}

let originalBodyOverflow = ''

function open(code: string) {
  sourceCode.value = code
  // Refresh engine from storage in case it changed elsewhere (other tab / playground)
  selectedEngine.value = loadEngine()
  syncTheme()
  if (dialogRef.value && !dialogRef.value.open) {
    // Lock body scroll to prevent background scrolling
    originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.value.showModal()
  }
  compile()
}

function close() {
  dialogRef.value?.close()
}

function onClose() {
  // Restore body scroll
  document.body.style.overflow = originalBodyOverflow
  sqlOutput.value = ''
  compilationError.value = ''
}

function onBackdropClick(e: MouseEvent) {
  // Click on the dialog element itself (backdrop) closes it
  if (e.target === dialogRef.value) close()
}

function showTooltip() {
  if (!fsBtnRef.value) return
  hideTooltip()

  const btnRect = fsBtnRef.value.getBoundingClientRect()
  // Mount point: fullscreen element owns the top layer; dialog otherwise
  const mountEl = (document.fullscreenElement as HTMLElement) ?? dialogRef.value
  if (!mountEl) return
  const mountRect = mountEl.getBoundingClientRect()

  // Position to the LEFT of the button, vertically centered (same level)
  const top = btnRect.top - mountRect.top + btnRect.height / 2
  const left = btnRect.left - mountRect.left - 8

  tooltipEl = document.createElement('div')
  tooltipEl.className = `ccm-tooltip-imp ${themeClass.value}`
  tooltipEl.textContent = isFullscreen.value ? t('modal.exitFullscreen') : t('modal.fullscreen')
  tooltipEl.style.cssText = [
    'position:absolute',
    `top:${top}px`,
    `left:${left}px`,
    'transform:translate(-100%, -50%)',
    'z-index:999999',
    'pointer-events:none',
    'padding:6px 10px',
    'border-radius:6px',
    'font-size:12px',
    'font-weight:500',
    'white-space:nowrap',
    'animation:ccm-tip-in 0.12s ease forwards',
  ].join(';')

  // Theme styles
  if (theme.value === 'dark') {
    tooltipEl.style.background = '#1e293b'
    tooltipEl.style.color = '#f1f5f9'
    tooltipEl.style.border = '1px solid #334155'
    tooltipEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
  } else {
    tooltipEl.style.background = '#ffffff'
    tooltipEl.style.color = '#0f172a'
    tooltipEl.style.border = '1px solid #e2e8f0'
    tooltipEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
  }

  mountEl.appendChild(tooltipEl)
}

function hideTooltip() {
  tooltipEl?.remove()
  tooltipEl = null
}

// Fullscreen toggle for output panel only
async function toggleFullscreen() {
  if (!outputPanelRef.value) return
  try {
    if (document.fullscreenElement === outputPanelRef.value) {
      await document.exitFullscreen()
    } else {
      await outputPanelRef.value.requestFullscreen()
    }
  } catch (err) {
    console.error('Fullscreen error:', err)
  }
}

// Sync fullscreen state when user presses Esc or uses browser controls
function onFullscreenChange() {
  isFullscreen.value = document.fullscreenElement === outputPanelRef.value
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
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  themeObserver?.disconnect()
  window.removeEventListener('crono:compile', handleCompileEvent as EventListener)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
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

/* Fullscreen button */
.ccm-fs-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.ccm-theme-dark .ccm-fs-btn { color: #94a3b8; }
.ccm-theme-dark .ccm-fs-btn:hover { background: #1e293b; color: #f1f5f9; }
.ccm-theme-light .ccm-fs-btn { color: #64748b; }
.ccm-theme-light .ccm-fs-btn:hover { background: #f1f5f9; color: #0f172a; }

/* Fullscreen button wrapper */
.ccm-fs-wrapper {
  margin-left: auto;
  display: inline-flex;
}


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

<style>
/* Imperative tooltip — appended directly to fullscreen element or dialog via JS.
   Must be global (not scoped) since the element is created outside Vue's tree. */
@keyframes ccm-tip-in {
  from { opacity: 0; transform: translate(-100%, -50%) translateX(4px); }
  to   { opacity: 1; transform: translate(-100%, -50%) translateX(0); }
}
</style>
