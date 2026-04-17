<template>
  <div class="pg-editor" :class="themeClass">
    <!-- Left panel: Crono SQL input -->
    <div class="pg-panel pg-panel-left" :style="{ flex: leftPanelFlex }">
      <div class="pg-panel-body pg-panel-body-left">
        <CodeEditor 
          v-model="cronoCode" 
          :theme="theme" 
          show-panel 
          panel-title="Crono SQL"
        >
          <template #panel-actions>
            <EtlOptionsPanel v-model="etlOptions" :theme="theme" @apply="handleRun" />
          </template>
        </CodeEditor>
        <button class="pg-run-fab" @click="handleRun" title="Run (Ctrl+Enter)">
          <Play :size="16" />
          <span class="pg-run-label">Run</span>
        </button>
      </div>
    </div>

    <!-- Splitter -->
    <div class="pg-splitter" @mousedown="startDrag" @touchstart.prevent="startDragTouch"></div>

    <!-- Right panel: SQL output -->
    <div class="pg-panel pg-panel-right" :style="{ flex: rightPanelFlex }">
      <div class="pg-panel-body pg-panel-body-right">
        <CodeEditor 
          :modelValue="sqlOutput" 
          :readonly="true" 
          :theme="theme" 
          show-panel 
          panel-title=""
        >
          <template #panel-actions>
            <EngineSelector v-model="selectedEngine" :theme="theme" />
            <span v-if="isCompiling" class="pg-status pg-compiling">Compiling...</span>
            <span v-else-if="compilationError" class="pg-status pg-error">Error</span>
          </template>
        </CodeEditor>
      </div>
    </div>

    <Toast :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Play } from 'lucide-vue-next'
import { Theme } from '../types/enums'
import type { ExampleItem } from '../types'
import CodeEditor from './CodeEditor.vue'
import EngineSelector from './EngineSelector.vue'
import Toast from './Toast.vue'
import EtlOptionsPanel from './EtlOptionsPanel.vue'
import { useSplitter } from '../composables/useSplitter'
import { useCompilation } from '../composables/useCompilation'
import { useClipboard } from '../composables/useClipboard'
import { playgroundBus } from '../event-bus'

// Theme - sync with Starlight
const theme = ref<Theme>(Theme.Dark)

const themeClass = computed(() => ({
  'pg-theme-light': theme.value === Theme.Light,
  'pg-theme-dark': theme.value === Theme.Dark,
}))

function syncTheme() {
  const st = document.documentElement.dataset.theme
  theme.value = st === 'light' ? Theme.Light : Theme.Dark
}

let themeObserver: MutationObserver | null = null

const { leftPanelFlex, rightPanelFlex, startDrag, startDragTouch } = useSplitter()
const { selectedEngine, isCompiling, compilationError, etlOptions, cronoCode, sqlOutput, handleRun } = useCompilation()
const { toastMessage, toastType, copyToClipboard, loadCodeFromUrl } = useClipboard()


function onLoadExample(item: ExampleItem) {
  cronoCode.value = item.code
  sqlOutput.value = ''
  compilationError.value = ''
}

onMounted(() => {
  syncTheme()
  themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })

  loadCodeFromUrl(cronoCode)

  playgroundBus.on('load-example', onLoadExample)

  window.addEventListener('keydown', handleKeyboard)
})

const handleKeyboard = (e: KeyboardEvent): void => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun() }
  if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault() }
}

onUnmounted(() => {
  themeObserver?.disconnect()
  playgroundBus.off('load-example', onLoadExample)
  window.removeEventListener('keydown', handleKeyboard)
})
</script>

<style scoped>
/* ===== EDITOR LAYOUT ===== */
.pg-editor {
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--sl-color-gray-5);
}

.pg-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  padding: 0 !important;
  margin: 0 !important;
}

/* ===== PANEL HEADER - COMPACT 24px ===== */
.pg-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px !important;
  margin: 0 !important;
  height: 24px;
  min-height: 24px;
  max-height: 24px;
  flex-shrink: 0;
  gap: 8px;
  border-bottom: none;
  background: var(--sl-color-bg);
  box-sizing: border-box;
  overflow: hidden;
}

/* Reset Starlight prose margins on ALL header children */
.pg-panel-header :deep(*) {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

/* Ensure component root elements inside header don't expand it */
.pg-panel-header-actions :deep(> div),
.pg-panel-header-actions :deep(> span) {
  display: inline-flex;
  align-items: center;
  margin: 0 !important;
}

/* Left side: Label or EngineSelector */
.pg-panel-header-left {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  height: 100%;
}

.pg-panel-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--sl-color-white);
  white-space: nowrap;
  padding: 0 6px;
  margin: 0 !important;
  background: var(--sl-color-accent);
  border-radius: 3px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* Right side: Actions */
.pg-panel-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  height: 100%;
}

.pg-copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  padding: 0;
  margin: 0;
  line-height: 1;
  background: var(--sl-color-gray-6);
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 6px;
  cursor: pointer;
  color: var(--sl-color-gray-2);
  transition: all 0.15s ease;
}

.pg-copy-btn svg {
  display: block;
  margin: 0 auto;
}

.pg-copy-btn:hover {
  color: var(--sl-color-white);
  background: var(--sl-color-gray-5);
  border-color: var(--sl-color-accent);
}

/* Status badges */
.pg-status {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  white-space: nowrap;
}

.pg-status.pg-compiling {
  color: var(--sl-color-accent);
  background: var(--sl-color-gray-6);
  animation: pulse 1.5s ease-in-out infinite;
}

.pg-status.pg-error {
  color: #f85149;
  background: rgba(248, 81, 73, 0.15);
}

/* ===== PANEL BODY ===== */
.pg-panel-body {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  padding: 0 !important;
  margin: 0 !important;
}

.pg-panel-body-left {
  position: relative;
}

.pg-panel-body-right {
  position: relative;
}

/* ===== RUN BUTTON ===== */
.pg-run-fab {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  z-index: 10;
  background: var(--sl-color-accent);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.pg-run-fab:hover {
  filter: brightness(1.1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  transform: translateY(-1px);
}

.pg-run-fab:active {
  transform: translateY(0);
}

/* ===== SPLITTER ===== */
.pg-splitter {
  width: 5px;
  cursor: col-resize;
  flex-shrink: 0;
  align-self: stretch;
  margin: 0;
  padding: 0;
  background: var(--sl-color-gray-5);
  transition: background 0.15s ease;
}

.pg-splitter:hover {
  background: var(--sl-color-accent);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ===== LIGHT THEME ===== */
.pg-theme-light {
  background: #fff;
}

/* ===== DARK THEME ===== */
.pg-theme-dark {
  background: var(--sl-color-bg);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .pg-editor {
    flex-direction: column;
    height: auto;
    min-height: 100%;
    overflow-y: auto;
  }

  .pg-splitter {
    width: 100%;
    height: 5px;
    cursor: row-resize;
  }

  .pg-panel {
    min-height: 220px;
  }

  .pg-run-label {
    display: none;
  }

  .pg-run-fab {
    padding: 8px 12px;
    bottom: 12px;
    right: 12px;
  }
}

@media (max-width: 480px) {
  .pg-panel {
    min-height: 180px;
  }

  .pg-run-fab {
    padding: 7px 10px;
    bottom: 10px;
    right: 10px;
    font-size: 12px;
  }
}
</style>
