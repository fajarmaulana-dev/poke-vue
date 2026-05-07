import { onUnmounted, type Ref, watchEffect } from 'vue'

import { MOBILE_BOUND } from '@/constants'
import { useSlider } from '@/hooks/slider'
import { clickById, getById } from '@/utils/general'

export interface Pane {
  id: string
  mobileOnly?: boolean
  scrollTarget?: Readonly<Ref<HTMLElement | null>>
  onShown?: (event: Event) => void
  onHidden?: (event: Event) => void
}

export const usePane = ({ id, mobileOnly, onHidden, onShown, scrollTarget }: Pane) => {
  const { handleAction, movement, grab } = useSlider({
    data: [],
    mobileOnly,
    onBack: () => clickById(id),
  })

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const pane = getById(`pane-${id}`)

    if (!pane) return
    if (!target.checked) {
      if (window.innerWidth < MOBILE_BOUND) {
        pane.style.transform = 'translateY(100%)'
        document.documentElement.style.overflow = 'auto'
        setTimeout(() => {
          pane.style.opacity = '0'
        }, 300)
      }
      onHidden?.(e)
      return
    }

    if (window.innerWidth < MOBILE_BOUND) {
      document.documentElement.style.overflow = 'hidden'
      pane.style.opacity = '1'
    }
    onShown?.(e)
  }

  let frame: number
  const cleanup = watchEffect(onCleanup => {
    if (window.innerWidth < MOBILE_BOUND) {
      const update = () => {
        const pane = getById(`pane-${id}`)
        if (!pane) return

        const isAtTop = !scrollTarget?.value || scrollTarget.value.scrollTop === 0
        if (grab.value && isAtTop) {
          const yMove = movement.value > 0 ? movement.value : 0
          pane.style.transform = `translateY(${yMove}px)`
        }
        frame = requestAnimationFrame(update)
      }

      update()
      onCleanup(() => {
        if (frame) cancelAnimationFrame(frame)
      })
    }
  })

  onUnmounted(() => {
    cleanup()
    if (frame) cancelAnimationFrame(frame)
  })

  return {
    grab,
    handleChange,
    handleAction,
  }
}
