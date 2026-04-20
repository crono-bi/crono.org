<template>
  <div id="playground-editor" class="pg-editor" :class="themeClass">
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
/* 
  NOTA: La mayoría de los estilos han sido movidos a /src/styles/playground-editor.css
  Esto soluciona el bug donde Astro no extrae CSS scoped de componentes client:only.
  
  Solo mantenemos aquí estilos que necesitan acceso a variables scoped del componente.
*/

/* ===== PANEL HEADER - OVERRIDE SCOPED ===== */
/* Reset Starlight prose margins - debe usar :deep() porque es scoped */
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
</style>
