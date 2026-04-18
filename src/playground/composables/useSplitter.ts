import { ref } from 'vue'
import type { Ref } from 'vue'

export function useSplitter() {
  const leftPanelFlex: Ref<string> = ref('1 1 50%')
  const rightPanelFlex: Ref<string> = ref('1 1 50%')
  let isDragging = false
  let panelsEl: HTMLElement | null = null
  let isVertical = false

  function detectOrientation(): void {
    if (!panelsEl) return
    const style = window.getComputedStyle(panelsEl)
    isVertical = style.flexDirection === 'column'
  }

  function applyPct(clientX: number, clientY: number): void {
    if (!panelsEl) return
    const rect = panelsEl.getBoundingClientRect()
    let pct: number
    if (isVertical) {
      const offset = clientY - rect.top
      pct = Math.max(0.15, Math.min(0.85, offset / rect.height))
    } else {
      const offset = clientX - rect.left
      pct = Math.max(0.15, Math.min(0.85, offset / rect.width))
    }
    leftPanelFlex.value = `${pct} ${pct} 0%`
    rightPanelFlex.value = `${1 - pct} ${1 - pct} 0%`
  }

  function startDrag(e: MouseEvent): void {
    isDragging = true
    panelsEl = (e.target as HTMLElement).parentElement
    detectOrientation()
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
    document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize'
    document.body.style.userSelect = 'none'
  }

  function startDragTouch(e: TouchEvent): void {
    isDragging = true
    panelsEl = (e.target as HTMLElement).parentElement
    detectOrientation()
    document.addEventListener('touchmove', onDragTouch)
    document.addEventListener('touchend', stopDrag)
  }

  function onDrag(e: MouseEvent): void {
    if (!isDragging || !panelsEl) return
    applyPct(e.clientX, e.clientY)
  }

  function onDragTouch(e: TouchEvent): void {
    if (!isDragging || !panelsEl || !e.touches[0]) return
    applyPct(e.touches[0].clientX, e.touches[0].clientY)
  }

  function stopDrag(): void {
    isDragging = false
    panelsEl = null
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('touchmove', onDragTouch)
    document.removeEventListener('touchend', stopDrag)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  return { leftPanelFlex, rightPanelFlex, startDrag, startDragTouch }
}
