import { type Ref } from '@vue/reactivity'
import { onUnmounted, watch } from '@vue/runtime-core'

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

export const usePane = ({ id, onHidden, onShown, scrollTarget }: Pane) => {
  const { handleAction, movement, grab } = useSlider({
    data: [],
    mobileOnly: true,
    onBack: () => clickById(id),
  })

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const pane = getById(`pane-${id}`)

    if (!pane) return
    if (!target.checked) {
      if (window.innerWidth < MOBILE_BOUND) {
        pane.style.transform = ''
        document.documentElement.style.overflow = 'auto'
      }
      onHidden?.(e)
      return
    }

    pane.style.transform = ''
    if (window.innerWidth < MOBILE_BOUND) {
      document.documentElement.style.overflow = 'hidden'
      pane.style.opacity = '1'
    }
    onShown?.(e)
  }

  watch([grab, movement], ([isGrabbing, move]) => {
    if (window.innerWidth >= MOBILE_BOUND) return
    const pane = getById(`pane-${id}`)
    if (!pane) return

    if (isGrabbing) {
      const isAtTop = !scrollTarget?.value || scrollTarget.value.scrollTop === 0
      if (isAtTop) {
        const yMove = move > 0 ? move : 0
        pane.style.transform = `translateY(${yMove}px)`
      }
      return
    }
    pane.style.transform = ''
  })

  const mediaQuery = window.matchMedia(`(min-width: ${MOBILE_BOUND}px)`)

  const onBreakpointChange = () => {
    const pane = getById(`pane-${id}`)
    if (!pane) return

    const label = pane.previousElementSibling as HTMLElement | null
    pane.style.transition = 'none'
    if (label) label.style.transition = 'none'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pane.style.transition = ''
        if (label) label.style.transition = ''
      })
    })
  }

  mediaQuery.addEventListener('change', onBreakpointChange)

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', onBreakpointChange)
  })

  return {
    grab,
    handleChange,
    handleAction,
  }
}
