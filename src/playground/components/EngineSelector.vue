<template>
  <div class="engine-selector" :class="themeClass">
    <div
      v-for="engine in engines"
      :key="engine.id"
      class="engine-tab"
      :class="{ active: modelValue === engine.id, disabled: engine.disabled }"
      @click="!engine.disabled && $emit('update:modelValue', engine.id)"
    >
      <img :src="engine.icon" :alt="engine.label" class="engine-icon" />
      <span v-if="modelValue === engine.id" class="engine-label">{{ engine.label }}</span>
      <span v-else class="engine-tooltip">
        {{ engine.label }}
        <span v-if="engine.disabled" class="tooltip-badge">Soon</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EngineId, Theme } from '../types/enums'
import type { Engine } from '../types/interfaces'

const LOGOS = {
  [EngineId.SQLServer]:  '/playground-assets/microsoft-sql-server.svg',
  [EngineId.Snowflake]:  '/playground-assets/snowflake.svg',
  [EngineId.Postgres]:   '/playground-assets/postgresql.svg',
  [EngineId.Redshift]:   '/playground-assets/redshift.svg',
  [EngineId.BigQuery]:   '/playground-assets/bigquery.svg',
  [EngineId.Databricks]: '/playground-assets/databricks.svg',
  [EngineId.MSFabric]:   '/playground-assets/msfabric.svg'
} as const

const props = defineProps<{
  modelValue: EngineId
  theme: Theme
}>()

defineEmits<{
  (e: 'update:modelValue', value: EngineId): void
}>()

const themeClass = computed(() => props.theme === Theme.Light ? 'theme-light' : 'theme-dark')

const engines: Engine[] = [
  { id: EngineId.Snowflake,  label: 'Snowflake',        icon: LOGOS[EngineId.Snowflake] },
  { id: EngineId.Redshift,   label: 'Redshift',         icon: LOGOS[EngineId.Redshift] },
  { id: EngineId.BigQuery,   label: 'BigQuery',         icon: LOGOS[EngineId.BigQuery] },
  { id: EngineId.SQLServer,  label: 'SQL Server',       icon: LOGOS[EngineId.SQLServer] },
  { id: EngineId.Postgres,   label: 'PostgreSQL',       icon: LOGOS[EngineId.Postgres] },
  { id: EngineId.Databricks, label: 'Databricks',       icon: LOGOS[EngineId.Databricks], disabled: true },
  { id: EngineId.MSFabric,   label: 'MS Fabric DWH',   icon: LOGOS[EngineId.MSFabric],   disabled: true }
]
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
</style>
