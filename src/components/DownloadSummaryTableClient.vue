<template>
  <div class="download-table-container not-content">
    <h3 v-if="title">{{ title }}</h3>

    <div v-if="loading" class="skeleton-wrapper" role="status" aria-live="polite">
      <p class="sr-only">{{ t('download.loading') }}</p>
      <div class="skeleton-table">
        <div class="skeleton-row skeleton-header">
          <div class="skeleton-cell" v-for="n in 5" :key="n"></div>
        </div>
        <div class="skeleton-row" v-for="n in 4" :key="n">
          <div class="skeleton-cell" v-for="m in 5" :key="m"></div>
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
          <col style="width: 8rem" />
          <col style="width: 7rem" />
        </colgroup>
        <thead>
          <tr>
            <th>{{ t('download.table.product') }}</th>
            <th>{{ t('download.table.version') }}</th>
            <th>{{ t('download.table.date') }}</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.IdRelease">
            <td class="product-cell">{{ item.ProductDescription }}</td>
            <td class="version-cell">{{ item.Version }}</td>
            <td class="date-cell">{{ formatDate(item.Date) }}</td>
            <td class="action-cell">
              <a
                v-if="item.SetupUri"
                :href="item.SetupUri"
                class="download-btn"
                target="_blank"
                rel="noopener noreferrer"
                :title="t('download.summary.downloadTitle')"
                :style="{ '--btn-color': getColorByReleaseName(item.ReleaseName) }"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {{ t('download.btn') }}
              </a>
            </td>
            <td class="link-cell">
              <a
                :href="`${props.prefix}/downloads/${getSlugByReleaseName(item.ReleaseName)}`"
                class="versions-btn"
                :title="t('download.summary.historyTitle')"
                :style="{ '--btn-color': getColorByReleaseName(item.ReleaseName) }"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                {{ t('download.summary.historyLabel') }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useT, getLangFromPath } from '../i18n/ui'
import { fetchSectionReleases } from '../services/downloads.service'
import { getColorByReleaseName, getSlugByReleaseName, type DownloadItem } from '../config/downloads'

const props = withDefaults(defineProps<{
  section?: 'StandardRelease' | 'ServerRelease' | 'StandardReleaseX86' | 'MSIRelease' | 'CronoClassic'
  title?: string
  prefix?: string
}>(), { prefix: '' })

const lang = getLangFromPath(typeof window !== 'undefined' ? window.location.pathname : '/')
const t = useT(lang)

const months = t('download.months').split('|')

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (d.getFullYear() === 1) return ''
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const items = ref<DownloadItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    items.value = await fetchSectionReleases(props.section || 'StandardRelease')
  } catch (e) {
    error.value = t('download.error.connect')
    console.error('DownloadSummaryTableClient fetch error:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style>
.download-table-container.not-content {
  margin: 0;
}

.download-table-container h3 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  background: var(--sl-color-bg-nav);
}

.download-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  background: var(--sl-color-bg-nav);
  border: 1px solid var(--sl-color-hairline-light);
  border-radius: 8px;
  overflow: hidden;
}

.download-table thead th:first-child {
  border-top-left-radius: 8px;
}

.download-table thead th:last-child {
  border-top-right-radius: 8px;
}

.download-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

.download-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}

.download-table-container.not-content .download-table thead,
.download-table-container.not-content .download-table thead th {
  background: var(--sl-color-accent, #2563EB) !important;
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

.download-table tbody tr:last-child {
  border-bottom: none;
}

.download-table tbody tr:nth-child(even) {
  background-color: rgba(128, 128, 128, 0.04);
}

.download-table tbody tr:hover {
  background-color: rgba(128, 128, 128, 0.08);
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
}

.link-cell {
  text-align: right;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
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
}

.download-btn:hover {
  background: var(--btn-color);
  border-color: var(--btn-color);
  color: white;
}

.versions-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  width: 100%;
  padding: 0.375rem 0.625rem;
  background: transparent;
  border: 1px solid var(--sl-color-hairline);
  border-radius: 0.375rem;
  color: var(--sl-color-gray-2);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s;
  white-space: nowrap;
}

.versions-btn:hover {
  background: color-mix(in srgb, var(--btn-color) 12%, transparent);
  border-color: color-mix(in srgb, var(--btn-color) 40%, transparent);
  color: var(--btn-color);
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

.skeleton-cell:nth-child(4),
.skeleton-cell:nth-child(5) {
  flex: 1;
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
