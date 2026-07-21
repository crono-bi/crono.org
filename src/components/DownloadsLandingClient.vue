<template>
  <div class="dl-landing not-content" :style="{ '--brand-color': downloadsColor, '--brand-rgb': downloadsRgb }">
    <!-- CARDS -->
    <div class="dl-grid">
      <div v-for="product in products" :key="product.apiKey" class="dl-card" :style="{ '--c': product.color, '--rgb': product.rgb }">
        <div class="dl-card-top">
          <div class="dl-card-icon" v-html="product.icon" />
          <span class="dl-card-tagline">{{ product.tagline }}</span>
        </div>
        <div class="dl-card-body">
          <h2 class="dl-card-name">
            <a :href="product.path" class="dl-card-name-link">{{ product.name }}</a>
          </h2>
          <p class="dl-card-desc">{{ product.description }}</p>

          <div v-if="product.loading" class="dl-card-meta skeleton-meta">
            <span class="skeleton-pill"></span>
            <span class="skeleton-date"></span>
          </div>

          <div v-else-if="product.version || product.date" class="dl-card-meta">
            <span v-if="product.version" class="dl-card-version">v{{ product.version }}</span>
            <span v-if="product.date" class="dl-card-date">{{ product.date }}</span>
          </div>
        </div>
        <div class="dl-card-foot">
          <a
            v-if="product.downloadUrl"
            :href="product.downloadUrl"
            class="dl-card-btn"
            download
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {{ t('downloadsLanding.btn.download') }}
          </a>
          <a v-else :href="product.path" class="dl-card-btn dl-card-btn--nav">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            {{ t('downloadsLanding.btn.versions') }}
          </a>
        </div>
      </div>
    </div>

    <!-- BANNER -->
    <a :href="`${props.prefix}/downloads/all/`" class="dl-banner">
      <div class="dl-banner-left">
        <div class="dl-banner-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </div>
        <div>
          <p class="dl-banner-title">{{ t('downloadsLanding.banner.title') }}</p>
          <p class="dl-banner-sub">{{ t('downloadsLanding.banner.sub') }}</p>
        </div>
      </div>
      <span class="dl-banner-cta">
        {{ t('downloadsLanding.banner.cta') }}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useT, getLangFromPath } from '../i18n/ui'
import { PRODUCTS } from '../config/products'
import { fetchHistory } from '../services/downloads.service'

interface LandingProduct {
  id: string
  apiKey: string
  path: string
  name: string
  tagline: string
  description: string
  icon: string
  color: string
  rgb: string
  loading: boolean
  downloadUrl: string | null
  version: string | null
  date: string | null
}

const props = withDefaults(defineProps<{ prefix?: string }>(), { prefix: '' })

const lang = getLangFromPath(typeof window !== 'undefined' ? window.location.pathname : '/')
const t = useT(lang)

const months = t('download.months').split('|')
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (d.getFullYear() === 1) return ''
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const downloadsColor = '#2563EB'
const downloadsRgb = '37, 99, 235'

const productDefs = [
  {
    ...PRODUCTS.analysis,
    tagline: t('downloadsLanding.product.analysis.tagline'),
    description: t('downloadsLanding.product.analysis.desc'),
    path: `${props.prefix}/downloads/crono-analysis/`,
    apiKey: 'CronoAnalysis',
  },
  {
    ...PRODUCTS.metadata,
    tagline: t('downloadsLanding.product.metadata.tagline'),
    description: t('downloadsLanding.product.metadata.desc'),
    path: `${props.prefix}/downloads/crono-metadata/`,
    apiKey: 'CronoMetadata',
  },
  {
    ...PRODUCTS.etl,
    tagline: t('downloadsLanding.product.etl.tagline'),
    description: t('downloadsLanding.product.etl.desc'),
    path: `${props.prefix}/downloads/crono-etl/`,
    apiKey: 'CronoETL',
  },
]

const products = ref<LandingProduct[]>(productDefs.map(p => ({
  id: p.id,
  apiKey: p.apiKey,
  path: p.path,
  name: p.name,
  tagline: p.tagline,
  description: p.description,
  icon: p.icon,
  color: p.color,
  rgb: p.rgb,
  loading: true,
  downloadUrl: null,
  version: null,
  date: null,
})))

onMounted(async () => {
  await Promise.all(products.value.map(async (product) => {
    try {
      const items = await fetchHistory(product.apiKey)
      const latest = items.find(i => i.SetupUri)
      product.downloadUrl = latest?.SetupUri ?? null
      product.version = latest?.Version ?? null
      product.date = latest?.Date ? formatDate(latest.Date) : null
    } catch (e) {
      console.error(`DownloadsLandingClient fetch error for ${product.apiKey}:`, e)
    } finally {
      product.loading = false
    }
  }))
})
</script>

<style>
.dl-landing {
  padding: 0 0 2.5rem;
}

.dl-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.dl-card {
  display: flex;
  flex-direction: column;
  background: var(--sl-color-bg-nav);
  border: 1px solid var(--sl-color-hairline);
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  overflow: hidden;
  position: relative;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.dl-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(var(--rgb), 0.07) 0%, transparent 55%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s;
}

.dl-card:hover {
  border-color: var(--c);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px -6px rgba(var(--rgb), 0.25);
}

.dl-card:hover::before { opacity: 1; }

.dl-card-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.dl-card-icon {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: var(--c);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  transition: filter 0.2s;
}

.dl-card-icon svg { width: 20px; height: 20px; }
.dl-card:hover .dl-card-icon { filter: brightness(1.1); }

.dl-card-tagline {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--c);
}

.dl-card-body { flex: 1; }

.dl-card-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--sl-color-white);
  margin: 0 0 0.5rem;
  line-height: 1.25;
}

.dl-card-name-link {
  color: inherit;
  text-decoration: none;
}

.dl-card-name-link:hover { text-decoration: underline; }

.dl-card-desc {
  font-size: 0.875rem;
  color: var(--sl-color-gray-3);
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

.dl-card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--sl-color-gray-3);
  margin-bottom: 0.5rem;
  min-height: 1.5rem;
}

.dl-card-version {
  font-family: ui-monospace, monospace;
  font-weight: 600;
  color: var(--c);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: rgba(var(--rgb), 0.1);
}

.dl-card-date {
  color: var(--sl-color-gray-3);
  opacity: 0.8;
}

.skeleton-meta {
  gap: 0.75rem;
}

.skeleton-pill {
  width: 4rem;
  height: 1.25rem;
  border-radius: 4px;
  background: var(--sl-color-gray-5);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-date {
  width: 5rem;
  height: 1rem;
  border-radius: 4px;
  background: var(--sl-color-gray-5);
  animation: pulse 1.5s ease-in-out infinite;
}

.dl-card-foot {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--sl-color-hairline);
}

.dl-card-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  justify-content: center;
  padding: 0.625rem;
  border-radius: 8px;
  background: var(--c);
  border: 1px solid var(--c);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: filter 0.2s;
}

.dl-card-btn:hover,
.dl-card:hover .dl-card-btn {
  filter: brightness(1.1);
}

.dl-card-btn--nav {
  background: var(--sl-color-bg-nav);
  border-color: var(--sl-color-hairline-light);
  color: var(--sl-color-gray-2);
}

.dl-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--sl-color-hairline);
  background: var(--sl-color-bg-nav);
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;
  margin-top: 0.25rem;
}

.dl-banner:hover {
  border-color: var(--sl-color-accent);
  background: color-mix(in srgb, var(--sl-color-bg-nav) 90%, var(--sl-color-accent));
}

.dl-banner-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dl-banner-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: var(--sl-color-bg);
  border: 1px solid var(--sl-color-hairline-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sl-color-gray-2);
  flex-shrink: 0;
}

.dl-banner-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--sl-color-white);
  margin: 0 0 0.2rem;
}

.dl-banner-sub {
  font-size: 0.8125rem;
  color: var(--sl-color-gray-3);
  margin: 0;
}

.dl-banner-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--sl-color-hairline);
  color: var(--sl-color-gray-2);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 0;
}

.dl-banner:hover .dl-banner-cta {
  background: var(--sl-color-bg-nav);
  border-color: var(--sl-color-gray-3);
  color: var(--sl-color-white);
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-pill,
  .skeleton-date,
  .skeleton-cell {
    animation: none;
  }
}

@media (max-width: 1024px) {
  .dl-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .dl-grid { grid-template-columns: 1fr; }
  .dl-banner { flex-direction: column; align-items: flex-start; }
  .dl-banner-cta { width: 100%; justify-content: center; }
}
</style>
