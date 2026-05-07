import { onMounted, onUnmounted } from 'vue'

export function usePwa() {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  onMounted(() => {
    if (!('serviceWorker' in navigator)) return

    const loadHandler = () => {
      timeoutId = setTimeout(async () => {
        const { registerSW } = await import('virtual:pwa-register')
        registerSW({ immediate: true })
      }, 1000)
    }

    if (document.readyState === 'complete') {
      loadHandler()
      return
    }

    window.addEventListener('load', loadHandler, { once: true })
  })

  onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })
}
