<template>
  <div class="engine-selector" :class="themeClass">
    <button
      v-for="engine in engines"
      :key="engine.id"
      class="engine-tab"
      :class="{ active: modelValue === engine.id, disabled: engine.disabled }"
      :disabled="engine.disabled"
      @click="!engine.disabled && $emit('update:modelValue', engine.id)"
    >
      <span class="engine-icon">
        <img :src="engine.icon" :alt="engine.label" />
      </span>
      <span class="engine-name">{{ engine.label }}</span>
      <span v-if="engine.disabled" class="engine-badge">Soon</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EngineId, Theme } from '../types/enums'
import type { Engine } from '../types/interfaces'

const LOGOS = {
  [EngineId.SQLServer]: '/playground-assets/microsoft-sql-server.svg',
  [EngineId.Snowflake]: '/playground-assets/snowflake.svg',
  [EngineId.Postgres]:  '/playground-assets/postgresql.svg',
  [EngineId.Redshift]:  '/playground-assets/redshift.svg',
  [EngineId.BigQuery]:  '/playground-assets/bigquery.svg'
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
  { id: EngineId.SQLServer, label: 'SQL Server', icon: LOGOS[EngineId.SQLServer] },
  { id: EngineId.Snowflake, label: 'Snowflake',  icon: LOGOS[EngineId.Snowflake] },
  { id: EngineId.Postgres,  label: 'PostgreSQL', icon: LOGOS[EngineId.Postgres] },
  { id: EngineId.Redshift,  label: 'Redshift',   icon: LOGOS[EngineId.Redshift],   disabled: true },
  { id: EngineId.BigQuery,  label: 'BigQuery',   icon: LOGOS[EngineId.BigQuery],   disabled: true }
]
</script>

<style scoped>
/* ===== ENGINE SELECTOR - flat, no outer container ===== */
.engine-selector {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  margin: 0 !important;
  padding: 0;
  background: transparent;
  border: none;
}

.engine-selector::-webkit-scrollbar {
  display: none;
}

.theme-light,
.theme-dark {
  background: transparent;
  border: none;
  box-shadow: none;
}

/* ===== ENGINE TAB ===== */
.engine-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 45px;
  min-height: 45px;
  max-height: 45px;
  font-size: 13.5px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1;
  box-sizing: border-box;
  margin: 0 !important;
}

/* ===== ICON ===== */
.engine-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.engine-icon img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.engine-name {
  line-height: 1;
}

/* ===== LIGHT THEME ===== */
.theme-light .engine-tab {
  color: #555;
  border-color: #d0d0d0;
  background: transparent;
}

.theme-light .engine-tab:hover:not(.disabled):not(.active) {
  border-color: #3B82F6;
  color: #333;
  background: rgba(59, 130, 246, 0.06);
}

.theme-light .engine-tab.active {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.12);
  color: #2563EB;
  font-weight: 700;
  box-shadow: 0 0 0 1px #3B82F6 inset;
}

.theme-light .engine-tab.disabled {
  color: #c0c0c0;
  border-color: #e8e8e8;
  opacity: 0.6;
}

/* ===== DARK THEME ===== */
.theme-dark .engine-tab {
  color: #777;
  border-color: #3a3a3a;
  background: transparent;
}

.theme-dark .engine-tab:hover:not(.disabled):not(.active) {
  border-color: #3B82F6;
  color: #ccc;
  background: rgba(59, 130, 246, 0.08);
}

.theme-dark .engine-tab.active {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.15);
  color: #60A5FA;
  font-weight: 700;
  box-shadow: 0 0 0 1px #3B82F6 inset;
}

.theme-dark .engine-tab.disabled {
  color: #444;
  border-color: #2a2a2a;
  opacity: 0.5;
}

.theme-dark .engine-icon img {
  filter: brightness(0.75) saturate(0.5);
}

.theme-dark .engine-tab:hover:not(.disabled) .engine-icon img,
.theme-dark .engine-tab.active .engine-icon img {
  filter: none;
}

/* ===== DISABLED STATE ===== */
.engine-tab.disabled {
  cursor: not-allowed;
  pointer-events: none;
}

/* ===== MODERN SOON BADGE ===== */
.engine-badge {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  box-sizing: border-box;
  margin-left: 2px;
  vertical-align: middle;
  margin-top: -1px;
}

.theme-light .engine-badge {
  background: #e8e8e8;
  color: #888;
  border: 1px solid #ddd;
}

.theme-dark .engine-badge {
  background: #2a2a2a;
  color: #666;
  border: 1px solid #3a3a3a;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1100px) {
  .engine-name {
    display: none;
  }

  .engine-tab {
    padding: 0 10px;
    gap: 4px;
  }
}

@media (max-width: 768px) {
  .engine-tab {
    padding: 0 8px;
    height: 40px;
    min-height: 40px;
    max-height: 40px;
  }

  .engine-icon {
    width: 20px;
    height: 20px;
  }

  .engine-icon img {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .engine-tab {
    padding: 0 6px;
  }
}
</style>
