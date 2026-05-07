import { clickById } from '@/utils/general'

/**
 * `useToast` is a custom React hook that manages the lifecycle of a toast notification.
 *
 * It automatically hides the toast after a timeout and restores the page's scroll behavior.
 * It also provides a `closeToast` method to allow manual dismissal of the toast.
 */
export const useToast = (id: string) => {
  let timeoutId: ReturnType<typeof setTimeout> | null
  let overflowId: ReturnType<typeof setTimeout> | null

  const toggleToast = (event: Event) => {
    const { checked } = event.target as HTMLInputElement
    if (checked) {
      document.body.style.overflow = 'hidden'
      timeoutId = setTimeout(() => {
        clickById(id)
      }, 2500)
      overflowId = setTimeout(() => {
        document.body.style.overflow = 'auto'
      }, 2700)
      return
    }
    clickById(id)
    clearTimeout(timeoutId!)
    clearTimeout(overflowId!)
    setTimeout(() => {
      document.body.style.overflow = 'auto'
    }, 200)
  }

  return {
    toggleToast,
  }
}
