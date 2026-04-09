<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{ name: string; size?: number }>()

const icon = computed(() => (icons as Record<string, unknown>)[props.name])
</script>

<template>
  <component :is="icon" :size="size ?? 24" />
</template>
