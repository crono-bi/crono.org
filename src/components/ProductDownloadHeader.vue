<template>
  <div class="pdh">
    <div v-if="loading" class="pdh-meta skeleton-meta">
      <span class="skeleton-pill"></span>
      <span class="skeleton-date"></span>
    </div>

    <template v-else>
      <div v-if="version || date" class="pdh-meta">
        <span v-if="version" class="pdh-version">v{{ version }}</span>
        <span v-if="date" class="pdh-date">{{ date }}</span>
      </div>
      <a
        v-if="downloadUrl"
        :href="downloadUrl"
        class="pdh-btn"
        download
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {{ t('download.btn') }}
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useT, getLangFromPath } from '../i18n/ui'
import { fetchHistory } from '../services/downloads.service'

const props = defineProps<{ product: string }>()

const lang = getLangFromPath(typeof window !== 'undefined' ? window.location.pathname : '/')
const t = useT(lang)

const months = t('download.months').split('|')
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (d.getFullYear() === 1) return ''
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const loading = ref(true)
const downloadUrl = ref<string | null>(null)
const version = ref<string | null>(null)
const date = ref<string | null>(null)

onMounted(async () => {
  try {
    const items = await fetchHistory(props.product)
    // Con SetupUri si existe (instaladores); si no, el más reciente (p.ej. CLIs sin instalador)
    const latest = items.find(i => i.SetupUri) ?? items[0]
    downloadUrl.value = latest?.SetupUri ?? null
    version.value = latest?.Version ?? null
    date.value = latest?.Date ? formatDate(latest.Date) : null
  } catch (e) {
    console.error(`ProductDownloadHeader fetch error for ${props.product}:`, e)
  } finally {
    loading.value = false
  }
})
</script>

<style>
.pdh {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.pdh-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: var(--sl-color-gray-3);
}

.pdh-version {
  font-family: ui-monospace, monospace;
  font-weight: 600;
  color: var(--pdp-color);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: var(--pdp-soft);
}

.pdh-date { opacity: 0.85; }

.pdh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.625rem 1.5rem;
  border-radius: 8px;
  background: var(--pdp-color);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: filter 0.2s;
}

.pdh-btn:hover { filter: brightness(1.1); }

.skeleton-meta { gap: 0.75rem; }

.skeleton-pill,
.skeleton-date {
  display: inline-block;
  border-radius: 4px;
  background: var(--sl-color-gray-5);
  animation: pdh-pulse 1.5s ease-in-out infinite;
}

.skeleton-pill { width: 4rem; height: 1.4rem; }
.skeleton-date { width: 6rem; height: 1rem; }

@keyframes pdh-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-pill, .skeleton-date { animation: none; }
}
</style>
