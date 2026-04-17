<template>
  <Transition name="toast-slide">
    <div v-if="visible" class="toast" :class="type">
      <div class="toast-content">
        <span class="toast-message">{{ displayMessage }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ToastType } from '../types/enums'

const props = defineProps<{
  message: string
  type: ToastType
  duration: number
}>()

const visible = ref<boolean>(false)
const displayMessage = ref<string>('')
let hideTimeoutId: ReturnType<typeof setTimeout> | null = null

watch(() => props.message, (newMessage: string) => {
  if (newMessage && newMessage.trim()) {
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId)
      hideTimeoutId = null
    }
    displayMessage.value = newMessage
    visible.value = true
    hideTimeoutId = setTimeout(() => {
      visible.value = false
      hideTimeoutId = null
    }, props.duration)
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #2a2a2a;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 10000;
  border: 1px solid #444;
  min-width: 280px;
  max-width: 500px;
}

.toast.success {
  background: #2ea043;
  border-color: #3fb950;
}

.toast.error {
  background: #da3633;
  border-color: #f85149;
}

.toast.info {
  background: #0078d4;
  border-color: #58a6ff;
}

.toast-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-message {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

@media (max-width: 768px) {
  .toast {
    bottom: 16px;
    min-width: 240px;
    max-width: calc(100vw - 32px);
    padding: 10px 16px;
  }

  .toast-message {
    font-size: 13px;
  }
}
</style>
