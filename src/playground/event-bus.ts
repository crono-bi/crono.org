/**
 * Simple event bus for cross-component communication
 * between the Starlight sidebar (PlaygroundSidebar.vue) 
 * and the content area (PlaygroundEditor.vue).
 */
type Handler = (...args: any[]) => void

const listeners: Record<string, Handler[]> = {}

export const playgroundBus = {
  on(event: string, handler: Handler) {
    if (!listeners[event]) listeners[event] = []
    listeners[event].push(handler)
  },
  off(event: string, handler: Handler) {
    if (!listeners[event]) return
    listeners[event] = listeners[event].filter(h => h !== handler)
  },
  emit(event: string, ...args: any[]) {
    if (!listeners[event]) return
    listeners[event].forEach(h => h(...args))
  }
}
