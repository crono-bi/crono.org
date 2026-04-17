<template>
  <div class="etl-wrapper">

    <!-- Toggle button -->
    <button
      ref="toggleRef"
      class="etl-trigger-btn"
      :class="theme === Theme.Light ? 'etl-trigger-light' : 'etl-trigger-dark'"
      @click="toggle"
    >
      <Settings2 :size="14" />
      <span>ETL Options</span>
      <ChevronDown :size="12" class="etl-chevron" :class="{ 'etl-chevron-open': isOpen }" />
    </button>

    <!-- Floating panel -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        ref="floatingRef"
        :style="floatingStyles"
        class="etl-floating-panel"
        :class="theme === Theme.Light ? 'etl-panel-light' : 'etl-panel-dark'"
      >
        <!-- Header -->
        <div class="etl-header">
          <div
            class="etl-header-icon"
            :class="theme === Theme.Light ? 'etl-icon-light' : 'etl-icon-dark'"
          >
            <Settings2 :size="15" />
          </div>
          <div>
            <h3 class="etl-title">ETL Audit Fields</h3>
            <p class="etl-subtitle">Customize column names in generated SQL</p>
          </div>
        </div>

        <div class="etl-divider"></div>

        <!-- Fields -->
        <div class="etl-fields">
          <div v-for="field in fields" :key="field.key" class="etl-field-group">
            <label class="etl-label">{{ field.label }}</label>
            <input
              type="text"
              :value="modelValue[field.key]"
              @input="update(field.key, ($event.target as HTMLInputElement).value)"
              :placeholder="field.placeholder"
              class="etl-input"
              :class="theme === Theme.Light ? 'etl-input-light' : 'etl-input-dark'"
            />
          </div>
        </div>

        <div class="etl-divider"></div>

        <!-- Footer -->
        <div class="etl-footer">
          <button @click="reset" class="etl-reset">↺ Reset defaults</button>
          <button @click="applyAndClose" class="etl-apply">Apply</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import { Settings2, ChevronDown } from 'lucide-vue-next'
import { EtlColumnDefault, Theme } from '../types/enums'
import type { EtlOptions, EtlField } from '../types/interfaces'

const props = defineProps<{
  modelValue: EtlOptions
  theme: Theme
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: EtlOptions): void
  (e: 'apply'): void
}>()

const isOpen = ref<boolean>(false)
const toggleRef = ref<HTMLButtonElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)

const { floatingStyles } = useFloating(toggleRef, floatingRef, {
  placement: 'bottom-end',
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
    toggleRef.value && !toggleRef.value.contains(target) &&
    floatingRef.value && !floatingRef.value.contains(target)
  ) {
    isOpen.value = false
  }
}

watch(isOpen, (val) => {
  if (val) document.addEventListener('mousedown', onClickOutside)
  else document.removeEventListener('mousedown', onClickOutside)
})

onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

const DEFAULTS: EtlOptions = {
  InsertedDateColumnName: EtlColumnDefault.InsertedDate,
  UpdatedDateColumnName:  EtlColumnDefault.UpdatedDate,
  DeletedDateColumnName:  EtlColumnDefault.DeletedDate,
  StartDateColumnName:    EtlColumnDefault.StartDate,
  EndDateColumnName:      EtlColumnDefault.EndDate,
  DefaultEndDate:         EtlColumnDefault.DefaultEndDate
}

const fields: EtlField[] = [
  { key: 'InsertedDateColumnName', label: 'Inserted Date Column', placeholder: EtlColumnDefault.InsertedDate },
  { key: 'UpdatedDateColumnName',  label: 'Updated Date Column',  placeholder: EtlColumnDefault.UpdatedDate  },
  { key: 'DeletedDateColumnName',  label: 'Deleted Date Column',  placeholder: EtlColumnDefault.DeletedDate  },
  { key: 'StartDateColumnName',    label: 'Start Date Column',    placeholder: EtlColumnDefault.StartDate    },
  { key: 'EndDateColumnName',      label: 'End Date Column',      placeholder: EtlColumnDefault.EndDate      },
  { key: 'DefaultEndDate',         label: 'Default End Date',     placeholder: EtlColumnDefault.DefaultEndDate }
]

function update(key: keyof EtlOptions, value: string): void {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function reset(): void {
  emit('update:modelValue', { ...DEFAULTS })
}

function applyAndClose(): void {
  emit('apply')
  isOpen.value = false
}
</script>

<style scoped>
/* ── Responsive ── */
@media (max-width: 768px) {
  .etl-wrapper {
    height: 38px;
  }
  .etl-trigger-btn {
    height: 38px;
    min-height: 38px;
    max-height: 38px;
    padding: 0 10px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .etl-wrapper {
    height: 34px;
  }
  .etl-trigger-btn {
    height: 34px;
    min-height: 34px;
    max-height: 34px;
    padding: 0 8px;
    font-size: 11px;
    gap: 4px;
  }
}

/* ── Wrapper - invisible to layout but needed for positioning ── */
.etl-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin: 0 !important;
  padding: 0 !important;
  height: 45px;
  line-height: 1;
}

/* ── Modern Trigger Button ── */
.etl-trigger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  height: 45px;
  min-height: 45px;
  max-height: 45px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-sizing: border-box;
}

.etl-trigger-light {
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
  border-color: #d0d7de;
  color: #444;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.etl-trigger-light:hover {
  background: linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%);
  border-color: #afb8c1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.etl-trigger-dark {
  background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%);
  border-color: #3d3d3d;
  color: #b0b0b0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.etl-trigger-dark:hover {
  background: linear-gradient(180deg, #333 0%, #282828 100%);
  border-color: #4a4a4a;
  color: #e0e0e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.etl-chevron {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.etl-chevron-open {
  transform: rotate(180deg);
}

/* ── Panel container ── */
.etl-floating-panel {
  width: 420px;
  max-width: calc(100vw - 24px);
  border-radius: 16px;
  z-index: 9999;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.etl-panel-light {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 60px -10px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08);
  color: #1a1a1a;
}

.etl-panel-dark {
  background: #1c1c1e;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 60px -10px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4);
  color: #f5f5f5;
}

/* ── Header ── */
.etl-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px 8px;
}

.etl-header-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.etl-icon-light { background: rgba(0,120,212,0.1); color: #0078d4; }
.etl-icon-dark  { background: rgba(88,166,255,0.12); color: #58a6ff; }

.etl-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.etl-panel-light .etl-title { color: #111827; }
.etl-panel-dark  .etl-title { color: #f5f5f5; }

.etl-subtitle {
  font-size: 11px;
  margin: 2px 0 0;
  line-height: 1.3;
}

.etl-panel-light .etl-subtitle { color: #94a3b8; }
.etl-panel-dark  .etl-subtitle { color: #8e8e93; }

/* ── Divider ── */
.etl-divider {
  height: 1px;
  margin: 0;
}

.etl-panel-light .etl-divider { background: #f1f5f9; }
.etl-panel-dark  .etl-divider { background: rgba(255,255,255,0.07); }

/* ── Fields ── */
.etl-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 14px;
  padding: 8px 16px 10px;
}

.etl-field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: flex-end;
}

.etl-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  line-height: 1.2;
}

.etl-panel-light .etl-label { color: #94a3b8; }
.etl-panel-dark  .etl-label { color: #636366; }

.etl-input {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid;
  font-size: 12px;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.etl-input-light {
  background: #f8fafc;
  color: #1e293b;
  border-color: #e2e8f0;
}

.etl-input-light::placeholder { color: #cbd5e1; }
.etl-input-light:focus {
  background: #ffffff;
  border-color: #0078d4;
  box-shadow: 0 0 0 3px rgba(0,120,212,0.1);
}

.etl-input-dark {
  background: #2c2c2e;
  color: #e5e5ea;
  border-color: rgba(255,255,255,0.1);
}

.etl-input-dark::placeholder { color: rgba(255,255,255,0.2); }
.etl-input-dark:focus {
  border-color: #58a6ff;
  box-shadow: 0 0 0 3px rgba(88,166,255,0.12);
}

/* ── Footer ── */
.etl-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 10px;
}

.etl-reset {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  padding: 0;
  transition: color 0.15s ease;
}

.etl-panel-light .etl-reset { color: #94a3b8; }
.etl-panel-light .etl-reset:hover { color: #ef4444; }
.etl-panel-dark  .etl-reset { color: #636366; }
.etl-panel-dark  .etl-reset:hover { color: #f85149; }

.etl-apply {
  background: #0078d4;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  padding: 7px 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,120,212,0.35);
  transition: background 0.15s ease, transform 0.1s ease;
}

.etl-apply:hover  { background: #0069bb; }
.etl-apply:active { transform: scale(0.97); }
</style>
