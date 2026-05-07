import { onMounted, onUnmounted, useTemplateRef, watch } from '@vue/runtime-core'

/**
 * Props for the `useLazyBackground` hook.
 *
 * @property url - The URL of the background image to load lazily.
 */
export type TLazyBackground = {
  url: string
}

/**
 * `useLazyBackground` is a custom React hook that applies a background image
 * to a `<div>` element only when it enters the viewport (lazy-loading).
 *
 * @param {TLazyBackground} props - The props object containing the image URL.
 */
export const useLazyBackground = ({ url }: TLazyBackground) => {
  const lazyRef = useTemplateRef<HTMLElement>('lazy-el')
  let observer: IntersectionObserver | null = null

  const loadImage = (el: HTMLElement) => {
    el.style.backgroundImage = `url(${url})`
  }

  onMounted(() => {
    const el = lazyRef.value
    if (!el) return

    observer = new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        loadImage(el)
        obs.unobserve(el)
      }
    })

    observer.observe(el)
  })

  watch(
    () => url,
    () => {
      if (lazyRef.value && lazyRef.value.style.backgroundImage) loadImage(lazyRef.value)
    },
  )

  onUnmounted(() => {
    observer?.disconnect()
  })
}
