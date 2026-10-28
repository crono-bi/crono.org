<template>
  <div class="cli-block">
    <div class="cli-header">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
      <span class="cli-title">{{ t('downloadPage.cli.title') }}</span>
    </div>
    <p class="cli-desc">{{ t('downloadPage.cli.desc') }}</p>
    <div class="cli-command">
      <code>{{ command }}</code>
      <button type="button" class="cli-copy" :aria-label="t('downloadPage.cli.copy')" @click="copy">
        <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <span>{{ copied ? t('downloadPage.cli.copied') : t('downloadPage.cli.copy') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useT, getLangFromPath } from '../i18n/ui'

const props = defineProps<{ command: string }>()

const lang = getLangFromPath(typeof window !== 'undefined' ? window.location.pathname : '/')
const t = useT(lang)

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.command)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('CliInstallBlock copy error:', e)
  }
}
</script>

<style>
.cli-block {
  border: 1px solid var(--sl-color-hairline-light);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  background: var(--sl-color-bg-nav);
}

.cli-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--pdp-color);
  margin-bottom: 0.375rem;
}

.cli-title {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.cli-desc {
  font-size: 0.875rem;
  color: var(--sl-color-gray-3);
  margin: 0 0 0.875rem;
}

.cli-command {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: var(--sl-color-bg);
  border: 1px solid var(--sl-color-hairline-light);
  border-radius: 6px;
  padding: 0.625rem 0.875rem;
}

.cli-command code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8125rem;
  color: var(--sl-color-gray-2);
  word-break: break-all;
}

.cli-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--sl-color-hairline-light);
  background: var(--sl-color-bg-nav);
  color: var(--sl-color-gray-2);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.2s, border-color 0.2s;
}

.cli-copy:hover {
  color: var(--pdp-color);
  border-color: var(--pdp-color);
}

@media (max-width: 640px) {
  .cli-command { flex-direction: column; align-items: stretch; }
  .cli-copy { justify-content: center; }
}
</style>
