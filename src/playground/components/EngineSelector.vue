<template>
  <div class="engine-selector" :class="[themeClass, { 'engine-selector--mobile': isMobile }]">
    <!-- Desktop: icon tabs with hover tooltips -->
    <template v-if="!isMobile">
      <div
        v-for="engine in engines"
        :key="engine.id"
        class="engine-tab"
        :class="{ active: modelValue === engine.id, disabled: engine.disabled }"
        @click="selectEngine(engine)"
      >
        <img :src="engine.icon" :alt="engine.label" class="engine-icon" />
        <span v-if="modelValue === engine.id" class="engine-label">{{ engine.label }}</span>
        <span v-else class="engine-tooltip">
          {{ engine.label }}
          <span v-if="engine.disabled" class="tooltip-badge">Soon</span>
        </span>
      </div>
    </template>

    <!-- Mobile: compact dropdown with touch-friendly targets -->
    <template v-else>
      <button
        ref="triggerRef"
        type="button"
        class="engine-mobile-trigger"
        :class="{ 'engine-mobile-trigger--open': isOpen }"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        @click="toggle"
      >
        <img :src="activeEngine.icon" :alt="activeEngine.label" class="engine-icon" />
        <span class="engine-mobile-label">{{ activeEngine.label }}</span>
        <ChevronDown :size="16" class="engine-mobile-chevron" :class="{ 'engine-mobile-chevron--open': isOpen }" />
      </button>

      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 scale-95 -translate-y-1"
        leave-to-class="opacity-0 scale-95 -translate-y-1"
      >
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="engine-mobile-dropdown"
          :class="theme === Theme.Light ? 'engine-mobile-dropdown--light' : 'engine-mobile-dropdown--dark'"
          :style="floatingStyles"
          role="listbox"
          :aria-label="t('engineSelector.label')"
        >
          <button
            v-for="engine in engines"
            :key="engine.id"
            type="button"
            class="engine-mobile-option"
            :class="{
              'engine-mobile-option--active': modelValue === engine.id,
              'engine-mobile-option--disabled': engine.disabled
            }"
            role="option"
            :aria-selected="modelValue === engine.id"
            :disabled="engine.disabled"
            @click="selectEngine(engine)"
          >
            <img :src="engine.icon" :alt="engine.label" class="engine-icon" />
            <span class="engine-mobile-option-label">{{ engine.label }}</span>
            <span v-if="engine.disabled" class="engine-mobile-soon">{{ t('engineSelector.soon') }}</span>
          </button>
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import { EngineId, Theme } from '../types/enums'
import type { Engine } from '../types/interfaces'
import { ENGINES } from '../../config/engines'
import { useT, getLangFromPath } from '../../i18n/ui'

const props = defineProps<{
  modelValue: EngineId
  theme: Theme
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: EngineId): void
}>()

const t = useT(getLangFromPath(typeof window !== 'undefined' ? window.location.pathname : '/'))

const themeClass = computed(() => props.theme === Theme.Light ? 'theme-light' : 'theme-dark')

// Fuente única de verdad (config/engines.ts)
const engines: Engine[] = ENGINES.map(e => ({ id: e.id, label: e.name, icon: e.logo }))
const activeEngine = computed(() => engines.find(e => e.id === props.modelValue) ?? engines[0])

function selectEngine(engine: Engine): void {
  if (engine.disabled) return
  emit('update:modelValue', engine.id)
  isOpen.value = false
}

// Mobile detection (match media + resize fallback)
const isMobile = ref(false)
let mobileMq: MediaQueryList | null = null

function updateIsMobile(): void {
  isMobile.value = mobileMq ? mobileMq.matches : window.innerWidth <= 640
}

onMounted(() => {
  if (typeof window === 'undefined') return
  mobileMq = window.matchMedia('(max-width: 640px)')
  updateIsMobile()
  if ('addEventListener' in mobileMq) {
    mobileMq.addEventListener('change', updateIsMobile)
  } else {
    // Safari <14
    mobileMq.addListener(updateIsMobile)
  }
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  if (mobileMq) {
    if ('removeEventListener' in mobileMq) {
      mobileMq.removeEventListener('change', updateIsMobile)
    } else {
      mobileMq.removeListener(updateIsMobile)
    }
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateIsMobile)
  }
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})

// Dropdown state + floating positioning
const isOpen = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

const { floatingStyles } = useFloating(triggerRef, dropdownRef, {
  placement: 'bottom-start',
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [offset(6), flip(), shift({ padding: 8 })]
})

function toggle(): void {
  isOpen.value = !isOpen.value
}

function onClickOutside(e: MouseEvent): void {
  const target = e.target as Node
  if (
    triggerRef.value && !triggerRef.value.contains(target) &&
    dropdownRef.value && !dropdownRef.value.contains(target)
  ) {
    isOpen.value = false
  }
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') isOpen.value = false
}

watch(isOpen, (val) => {
  if (val) {
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('mousedown', onClickOutside)
    document.removeEventListener('keydown', onKeydown)
  }
})
</script>

<style scoped>
/* ===== ENGINE SELECTOR ===== */
.engine-selector {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: nowrap;
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
}

.engine-selector--mobile {
  position: relative;
  display: inline-flex;
}

/* ===== ENGINE TAB — icon only ===== */
.engine-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1.5px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  box-sizing: border-box;
  gap: 6px;
  padding: 0 8px;
}

.engine-tab.active {
  width: auto;
  padding: 0 12px;
}

/* ===== ACTIVE LABEL ===== */
.engine-label {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1;
}

.engine-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  display: block;
  transition: filter 0.15s ease, opacity 0.15s ease;
  flex-shrink: 0;
}

/* ===== TOOLTIP ===== */
.engine-tooltip {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  background: #1e293b;
  color: #f1f5f9;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  padding: 5px 10px;
  border-radius: 6px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}

.engine-tooltip::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-bottom-color: #1e293b;
}

.engine-tab:hover .engine-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.tooltip-badge {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #334155;
  color: #94a3b8;
  padding: 2px 5px;
  border-radius: 3px;
}

/* ===== MOBILE DROPDOWN ===== */
.engine-mobile-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1.5px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  transition: all 0.15s ease;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.engine-mobile-label {
  white-space: nowrap;
}

.engine-mobile-chevron {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.engine-mobile-chevron--open {
  transform: rotate(180deg);
}

.engine-mobile-dropdown {
  min-width: 220px;
  max-width: calc(100vw - 32px);
  max-height: 70vh;
  overflow-y: auto;
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.12);
  z-index: 200;
}

.engine-mobile-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  transition: background 0.12s ease;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.engine-mobile-option:disabled,
.engine-mobile-option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.engine-mobile-option-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.engine-mobile-soon {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 5px;
  border-radius: 3px;
}

/* ===== LIGHT THEME ===== */
.theme-light .engine-tab {
  border-color: #e2e8f0;
}

.theme-light .engine-tab:hover:not(.disabled) {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.07);
}

.theme-light .engine-tab.active {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.12);
  box-shadow: 0 0 0 1px #3B82F6 inset;
}

.theme-light .engine-label {
  color: #2563EB;
}

.theme-light .engine-tab.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.theme-light .engine-tab.disabled .engine-icon {
  filter: grayscale(1);
}

.theme-light .engine-mobile-trigger {
  border-color: #e2e8f0;
  color: #334155;
}

.theme-light .engine-mobile-trigger--open,
.theme-light .engine-mobile-trigger:hover {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.07);
}

.theme-light .engine-mobile-dropdown--light {
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.theme-light .engine-mobile-option {
  color: #334155;
}

.theme-light .engine-mobile-option:hover:not(:disabled):not(.engine-mobile-option--disabled) {
  background: rgba(59, 130, 246, 0.08);
}

.theme-light .engine-mobile-option--active {
  background: rgba(59, 130, 246, 0.14);
  color: #2563EB;
}

.theme-light .engine-mobile-soon {
  background: #e2e8f0;
  color: #64748b;
}

/* ===== DARK THEME ===== */
.theme-dark .engine-tab {
  border-color: #2d3748;
}

.theme-dark .engine-tab:hover:not(.disabled) {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.theme-dark .engine-tab.active {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.18);
  box-shadow: 0 0 0 1px #3B82F6 inset;
}

.theme-dark .engine-label {
  color: #60A5FA;
}

.theme-dark .engine-tab.disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.theme-dark .engine-icon {
  filter: brightness(0.8) saturate(0.6);
}

.theme-dark .engine-tab:hover:not(.disabled) .engine-icon,
.theme-dark .engine-tab.active .engine-icon {
  filter: none;
}

.theme-dark .engine-tab.disabled .engine-icon {
  filter: grayscale(1) brightness(0.5);
}

.theme-dark .engine-mobile-trigger {
  border-color: #2d3748;
  color: #e2e8f0;
}

.theme-dark .engine-mobile-trigger--open,
.theme-dark .engine-mobile-trigger:hover {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.theme-dark .engine-mobile-dropdown--dark {
  background: #1e293b;
  border: 1px solid #334155;
}

.theme-dark .engine-mobile-option {
  color: #e2e8f0;
}

.theme-dark .engine-mobile-option:hover:not(:disabled):not(.engine-mobile-option--disabled) {
  background: rgba(59, 130, 246, 0.1);
}

.theme-dark .engine-mobile-option--active {
  background: rgba(59, 130, 246, 0.16);
  color: #60A5FA;
}

.theme-dark .engine-mobile-soon {
  background: #334155;
  color: #94a3b8;
}
</style>
