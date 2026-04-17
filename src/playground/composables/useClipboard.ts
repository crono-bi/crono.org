import { ref } from 'vue'
import type { Ref } from 'vue'
import { ToastType } from '../types/enums'

export function useClipboard() {
  const toastMessage: Ref<string> = ref('')
  const toastType: Ref<ToastType> = ref(ToastType.Info)

  function showToast(message: string, type: ToastType = ToastType.Info): void {
    toastMessage.value = ''
    setTimeout(() => {
      toastMessage.value = message
      toastType.value = type
    }, 10)
  }

  function copyToClipboard(text: string, successMsg: string, emptyMsg?: string): void {
    if (!text || text.startsWith('-- No') || text.startsWith('-- Compiling') || text.startsWith('-- Compilation error')) {
      if (emptyMsg) showToast(emptyMsg, ToastType.Info)
      return
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, ToastType.Success)
    }).catch((err: unknown) => {
      console.error('Failed to copy:', err)
      showToast('Failed to copy', ToastType.Error)
    })
  }

  function loadCodeFromUrl(cronoCode: Ref<string>): void {
    const urlParams = new URLSearchParams(window.location.search)
    const encodedCode = urlParams.get('code')
    if (!encodedCode) return

    try {
      if (encodedCode.length > 150000) {
        showToast('Shared code is too large', ToastType.Error)
        window.history.replaceState({}, '', window.location.pathname)
        return
      }

      const decodedCode = decodeURIComponent(atob(encodedCode))

      if (decodedCode.length > 100000) {
        showToast('Shared code exceeds maximum size', ToastType.Error)
        window.history.replaceState({}, '', window.location.pathname)
        return
      }

      cronoCode.value = decodedCode
      window.history.replaceState({}, '', window.location.pathname)
      showToast('Code loaded from shared URL', ToastType.Success)
    } catch (error: unknown) {
      console.error('Error decoding shared code:', error)
      showToast('Invalid shared URL', ToastType.Error)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  return { toastMessage, toastType, showToast, copyToClipboard, loadCodeFromUrl }
}
