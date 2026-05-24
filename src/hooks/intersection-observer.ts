import { onMounted, onUnmounted } from '@vue/runtime-core'
import { type Ref } from 'vue'

/**
 * A reusable hook to observe one or more elements using IntersectionObserver.
 *
 * @param target - A Ref of an HTML element or an array of Refs of HTML elements to observe.
 * @param onIntersect - The callback function to run when the observed element is intersecting.
 * @param options - The IntersectionObserver options.
 */
export const useIntersectionObserver = (
  target: Ref<HTMLElement | undefined> | Ref<HTMLElement | undefined>[],
  onIntersect: () => void,
  // eslint-disable-next-line no-undef
  options: IntersectionObserverInit = { threshold: 0.5 },
) => {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onIntersect()
        }
      })
    }, options)

    const targets = Array.isArray(target) ? target : [target]
    targets.forEach(t => {
      if (t.value) {
        observer?.observe(t.value)
      }
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
}
