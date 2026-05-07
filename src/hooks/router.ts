import { computed, type ComputedRef } from '@vue/reactivity'
import { onUnmounted } from '@vue/runtime-core'
import { type LocationQueryRaw, useRoute, useRouter } from 'vue-router'

type QueryValue = string | number | (string | number)[] | undefined | null

export interface ExtendedRoute {
  /** Current Base URL saat ini (e.g., https://example.com) */
  origin: string
  /** Full URL including base URL, pathname, query, and hash */
  href: ComputedRef<string>
  /** Reload the current page */
  refresh: () => void
  /**
   * Registers a callback to be executed before navigating back/forward.
   * The callback can cancel navigation if it returns `false`.
   *
   * @param cb - Function to handle popstate events
   */
  beforePopState: (cb: (state: unknown) => boolean) => () => void
}

/**
 * Custom router API built on top of React Router DOM.
 *
 * @returns An object implementing the {@link ExtendedRoute} interface
 */
export function useExtendedRoute(): ExtendedRoute {
  const route = useRoute()
  const origin = window.location.origin
  const href = computed(() => `${origin}${route.fullPath}`)
  const refresh = () => window.location.reload()

  const beforePopState = (cb: (state: unknown) => boolean) => {
    const handlePopState = (event: PopStateEvent) => {
      const allow = cb(event.state)
      if (!allow) history.pushState(null, '', window.location.href)
    }

    window.addEventListener('popstate', handlePopState)
    const cleanup = () => window.removeEventListener('popstate', handlePopState)

    onUnmounted(cleanup)
    return cleanup
  }

  return {
    origin,
    href,
    refresh,
    beforePopState,
  }
}

/**
 * A hook for reading and updating query parameters in the URL.
 *
 * @template T - Shape of the query parameters
 * @param defaultValues - Optional default values for query parameters
 *
 * @returns A tuple:
 *  - `queryObj`: The parsed query parameters as an object
 *  - `updateQuery`: A function to update query parameters
 */
export function useQueryParams<T extends Record<string, QueryValue>>(
  defaultValues?: Partial<T>,
): [ComputedRef<T>, (updates: Partial<T>) => void] {
  const router = useRouter()
  const route = useRoute()

  const queryObj = computed<T>(() => {
    const result = { ...defaultValues } as T

    for (const key in route.query) {
      const value = route.query[key]
      if (value !== undefined) {
        ;(result as Record<string, unknown>)[key] = value
      }
    }

    return result
  })

  const updateQuery = (updates: Partial<T>): void => {
    const newQuery: LocationQueryRaw = { ...route.query }

    ;(Object.keys(updates) as Array<keyof T>).forEach(key => {
      const value = updates[key]
      const stringKey = String(key)

      if (value === undefined || value === null || value === '') {
        delete newQuery[stringKey]
      } else {
        newQuery[stringKey] = value as Exclude<QueryValue, undefined | null>
      }
    })

    router.push({ query: newQuery })
  }

  return [queryObj, updateQuery]
}
