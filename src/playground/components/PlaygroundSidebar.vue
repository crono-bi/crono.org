<template>
  <nav class="pg-sl-sidebar">
    <!-- Link to Crono SQL -->
    <div class="pg-sl-back">
      <a href="/sql/intro" class="pg-sl-back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>
        </svg>
        <span>Manual Crono SQL</span>
      </a>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="pg-sl-loading">
      <span class="pg-sl-spinner"></span>
      <span>Cargando ejemplos...</span>
    </div>

    <div v-for="group in examples" :key="group.group" class="pg-sl-group">
      <button class="pg-sl-group-btn" @click="toggleGroup(group.group)">
        <svg
          class="pg-sl-chevron"
          :class="{ open: expandedGroups.has(group.group) }"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2"
        >
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span>{{ group.group }}</span>
      </button>
      <ul v-if="expandedGroups.has(group.group)" class="pg-sl-items">
        <li v-for="item in group.items" :key="item.name">
          <button
            class="pg-sl-item"
            :class="{ active: activeExample === item.name }"
            @click="selectItem(item)"
          >
            {{ item.name }}
          </button>
        </li>
      </ul>
    </div>

  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ExampleGroupId } from '../types/enums'
import type { ExampleGroupData, ExampleItem } from '../types'
import { useExamples } from '../composables/useExamples'
import { playgroundBus } from '../event-bus'

const { examples, activeExample, loadExamples } = useExamples()

const isLoading = ref(true)
const expandedGroups = ref<Set<string>>(new Set([ExampleGroupId.Select]))
const pendingCodeFromUrl = ref<string | null>(null)

function toggleGroup(group: string): void {
  if (expandedGroups.value.has(group)) {
    expandedGroups.value.delete(group)
  } else {
    expandedGroups.value.add(group)
  }
  expandedGroups.value = new Set(expandedGroups.value)
}

function selectItem(item: ExampleItem): void {
  activeExample.value = item.name
  playgroundBus.emit('load-example', item)
  closeMobileSidebar()
}

function closeMobileSidebar(): void {
  // Starlight mobile menu uses <starlight-menu-button> custom element
  // aria-expanded is on the custom element itself, not the inner button
  const menuEl = document.querySelector('starlight-menu-button')
  if (menuEl && menuEl.getAttribute('aria-expanded') === 'true') {
    // Call the custom element's setExpanded method if available
    const el = menuEl as HTMLElement & { setExpanded?: (v: boolean) => void }
    if (typeof el.setExpanded === 'function') {
      el.setExpanded(false)
    } else {
      // Fallback: click the inner button to toggle closed
      menuEl.querySelector('button')?.click()
    }
  }
}

function normalizeForCompare(str: string): string {
  // Very aggressive normalization: remove all whitespace, lowercase
  return str.toLowerCase().replace(/\s+/g, '').trim()
}

function findAndSelectExampleByCode(code: string): void {
  // If examples not loaded yet, store for later
  if (isLoading.value || examples.value.length === 0) {
    pendingCodeFromUrl.value = code
    return
  }
  
  const normalizedCode = normalizeForCompare(code)
  
  // First pass: look for exact code match (most reliable)
  for (const group of examples.value) {
    for (const item of group.items) {
      const itemNormalized = normalizeForCompare(item.code)
      if (itemNormalized === normalizedCode) {
        selectExample(group.group, item.name)
        return
      }
    }
  }
  
  // Second pass: look for "Merge Clone" specifically by name
  const targetName = 'Merge Clone'.toLowerCase().replace(/\s+/g, '')
  for (const group of examples.value) {
    for (const item of group.items) {
      const itemNameNormalized = item.name.toLowerCase().replace(/\s+/g, '')
      if (itemNameNormalized === targetName) {
        selectExample(group.group, item.name)
        return
      }
    }
  }
  
  // Third pass: fallback to partial name match in code
  for (const group of examples.value) {
    for (const item of group.items) {
      if (normalizedCode.includes(item.name.toLowerCase().replace(/\s+/g, ''))) {
        selectExample(group.group, item.name)
        return
      }
    }
  }
  
  // If no match found, clear pending
  pendingCodeFromUrl.value = null
}

function selectExample(groupName: string, itemName: string): void {
  expandedGroups.value = new Set([groupName])
  activeExample.value = itemName
  pendingCodeFromUrl.value = null
  
  // Scroll the selected item into view after render
  setTimeout(() => {
    const activeBtn = document.querySelector('.pg-sl-item.active')
    activeBtn?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, 100)
}

onMounted(async () => {
  // Listen for URL-loaded code
  playgroundBus.on('url-code-loaded', findAndSelectExampleByCode)
  
  try {
    await loadExamples()
  } catch (e) {
    console.error('Failed to load examples:', e)
  } finally {
    isLoading.value = false
  }
  
  // Check for code from URL (from localStorage fallback)
  const urlCode = localStorage.getItem('pg-url-code')
  if (urlCode) {
    findAndSelectExampleByCode(urlCode)
    localStorage.removeItem('pg-url-code')
  }
  // Also check pending from event bus
  else if (pendingCodeFromUrl.value) {
    findAndSelectExampleByCode(pendingCodeFromUrl.value)
  }
})
</script>

<style scoped>
.pg-sl-sidebar {
  padding: 0.5rem 0;
}

.pg-sl-group {
  margin-bottom: 0.125rem;
}

.pg-sl-group-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  padding: 0.375rem var(--sl-sidebar-pad-x, 1rem);
  background: none;
  border: none;
  font-size: var(--sl-text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--sl-color-white);
  cursor: pointer;
  transition: color 0.15s ease;
}

.pg-sl-group-btn:hover {
  color: var(--sl-color-accent);
}

.pg-sl-chevron {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  transition: transform 0.15s ease;
  opacity: 0.6;
}

.pg-sl-chevron.open {
  transform: rotate(90deg);
}

.pg-sl-items {
  list-style: none;
  padding: 0.125rem 0;
  margin: 0;
}

.pg-sl-item {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem 0.375rem calc(var(--sl-sidebar-pad-x, 1rem) + 1.125rem);
  background: none;
  border: none;
  border-radius: 0.25rem;
  font-size: var(--sl-text-sm);
  color: var(--sl-color-gray-2);
  cursor: pointer;
  text-align: left;
  transition: color 0.15s ease, background 0.15s ease;
  line-height: 1.4;
  margin: 0 0.5rem;
}

.pg-sl-item:hover {
  color: var(--sl-color-white);
  background: var(--sl-color-gray-6);
}

.pg-sl-item.active {
  color: #ffffff;
  background: var(--sl-color-accent);
  font-weight: 500;
}

.pg-sl-back {
  margin-bottom: 0.5rem;
  padding: 0.5rem var(--sl-sidebar-pad-x, 1rem) 0.75rem;
  border-bottom: 1px solid var(--sl-color-gray-6);
}

.pg-sl-back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--sl-text-sm);
  font-weight: 500;
  color: var(--sl-color-gray-2);
  text-decoration: none;
  transition: color 0.15s ease;
}

.pg-sl-back-link:hover {
  color: var(--sl-color-accent);
}

.pg-sl-back-link svg {
  flex-shrink: 0;
  opacity: 0.8;
}

.pg-sl-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem var(--sl-sidebar-pad-x, 1rem);
  font-size: var(--sl-text-sm);
  color: var(--sl-color-gray-3);
}

.pg-sl-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--sl-color-gray-5);
  border-top-color: var(--sl-color-accent);
  border-radius: 50%;
  animation: pg-spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes pg-spin {
  to { transform: rotate(360deg); }
}
</style>
