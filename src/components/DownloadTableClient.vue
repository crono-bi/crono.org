<template>
  <div class="download-table-container not-content" :style="{ '--btn-color': productColor }">
    <h2 v-if="title">{{ title }}</h2>

    <div v-if="loading" class="skeleton-wrapper" role="status" aria-live="polite">
      <p class="sr-only">{{ t('download.loading') }}</p>
      <div class="skeleton-table">
        <div class="skeleton-row skeleton-header">
          <div class="skeleton-cell" v-for="n in columnCount" :key="n"></div>
        </div>
        <div class="skeleton-row" v-for="n in 6" :key="n">
          <div class="skeleton-cell" v-for="m in columnCount" :key="m"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="error-message" role="alert">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="items.length === 0" class="loading-message">
      <p>{{ t('download.loading') }}</p>
    </div>

    <div v-else class="table-wrapper">
      <table class="download-table" style="table-layout: fixed; width: 100%">
        <colgroup>
          <col style="width: auto" />
          <col style="width: 7rem" />
          <col style="width: 9rem" />
          <col v-if="hasExpiration" style="width: 9rem" />
          <col v-if="hasSetupUri" style="width: 7rem" />
        </colgroup>
        <thead :style="{ backgroundColor: productColor }">
          <tr>
            <th>{{ t('download.table.product') }}</th>
            <th>{{ t('download.table.version') }}</th>
            <th>{{ t('download.table.date') }}</th>
            <th v-if="hasExpiration">{{ t('download.table.expiration') }}</th>
            <th v-if="hasSetupUri"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.IdRelease">
            <td class="product-cell">{{ item.ProductDescription }}</td>
            <td class="version-cell">{{ item.Version }}</td>
            <td class="date-cell">{{ formatDate(item.Date) }}</td>
            <td v-if="hasExpiration" class="date-cell">{{ formatDate(item.ExpirationDate) }}</td>
            <td v-if="hasSetupUri" class="action-cell">
              <a
                v-if="item.SetupUri"
                :href="item.SetupUri"
                class="download-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {{ t('download.btn') }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useT, getLangFromPath } from '../i18n/ui'
import { fetchHistory } from '../services/downloads.service'
import { getColorByReleaseName, type DownloadItem } from '../config/downloads'

const props = defineProps<{
  product: string
  title?: string
}>()

const lang = getLangFromPath(typeof window !== 'undefined' ? window.location.pathname : '/')
const t = useT(lang)

const months = t('download.months').split('|')

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (date.getFullYear() === 1) return ''
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const items = ref<DownloadItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const productColor = computed(() => getColorByReleaseName(props.product))
const hasExpiration = computed(() => items.value.some((d: DownloadItem) => d.ExpirationDate))
const hasSetupUri = computed(() => items.value.some((d: DownloadItem) => d.SetupUri))
const columnCount = computed(() => {
  let count = 3
  if (hasExpiration.value) count++
  if (hasSetupUri.value) count++
  return count
})

onMounted(async () => {
  try {
    items.value = await fetchHistory(props.product)
  } catch (e) {
    error.value = t('download.error.connect')
    console.error('DownloadTableClient fetch error:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style>
.download-table-container.not-content {
  margin: 0;
}

.download-table-container h2 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--sl-color-hairline-light);
}

.download-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  background: var(--sl-color-bg-nav);
}

.download-table-container.not-content .download-table thead,
.download-table-container.not-content .download-table thead th {
  color: white !important;
}

.download-table thead th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
}

.download-table tbody tr {
  border-bottom: 1px solid var(--sl-color-hairline-light);
  transition: background-color 0.15s;
}

.download-table tbody tr:nth-child(even) {
  background-color: var(--sl-color-bg-sidebar);
}

.download-table tbody tr:hover {
  background-color: var(--sl-color-bg-inline-code);
}

.download-table tbody td {
  padding: 0.75rem 1rem;
  color: var(--sl-color-gray-2) !important;
}

.product-cell {
  font-weight: 500;
}

.version-cell {
  font-family: ui-monospace, monospace;
  font-size: 0.8125rem;
}

.date-cell {
  white-space: nowrap;
  color: var(--sl-color-gray-3);
}

.action-cell {
  text-align: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  width: 100%;
  padding: 0.375rem 0.625rem;
  background: color-mix(in srgb, var(--btn-color) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--btn-color) 30%, transparent);
  border-radius: 0.375rem;
  color: var(--btn-color);
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.download-btn:hover {
  background: var(--btn-color);
  border-color: var(--btn-color);
  color: white;
}

.error-message,
.loading-message {
  padding: 2rem;
  text-align: center;
  color: var(--sl-color-gray-3);
  background: var(--sl-color-bg-sidebar);
  border-radius: 8px;
}

.error-message {
  color: var(--sl-color-red-high);
  background: var(--sl-color-red-low);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skeleton-wrapper {
  border-radius: 8px;
  border: 1px solid var(--sl-color-hairline-light);
  background: var(--sl-color-bg-nav);
  padding: 1rem;
}

.skeleton-table {
  width: 100%;
}

.skeleton-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.skeleton-row:last-child {
  margin-bottom: 0;
}

.skeleton-header {
  margin-bottom: 1rem;
}

.skeleton-cell {
  flex: 1;
  height: 1rem;
  border-radius: 4px;
  background: var(--sl-color-gray-5);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-cell:nth-child(1) {
  flex: 2;
}

.skeleton-cell:nth-child(2) {
  flex: 1;
}

.skeleton-cell:nth-child(3) {
  flex: 1.2;
}

.skeleton-cell:nth-child(4) {
  flex: 1.2;
}

.skeleton-cell:nth-child(5) {
  flex: 0.8;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-cell {
    animation: none;
  }
}
</style>
