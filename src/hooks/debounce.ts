import { type Ref, ref, watch } from '@vue/reactivity'
import { onUnmounted } from '@vue/runtime-core'

/**
 * useDebounce is a Vue composable that returns a debounced version of a reactive value.
 * It updates the returned value only after a specified delay has passed
 * without any changes to the input value.
 *
 * Useful for delaying expensive operations such as API calls,
 * especially while the user is typing.
 *
 * @param value - The input value to debounce (can be a ref or raw value).
 * @param delay - The debounce delay in milliseconds.
 * @returns A reactive ref containing the debounced value.
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from '@vue/reactivity'
 * import { useDebounce } from './composables/debounce'
 *
 * const searchTerm = ref('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 500)
 *
 * watch(debouncedSearchTerm, (newValue) => {
 *   // Trigger API call with debounced value
 *   console.log('Searching for:', newValue)
 * })
 * </script>
 *
 * <template>
 *   <input v-model="searchTerm" placeholder="Search..." />
 *   <p>Debounced: {{ debouncedSearchTerm }}</p>
 * </template>
 * ```
 */
export function useDebounce<T>(value: T | Ref<T>, delay: number = 500): Ref<T> {
  const valueRef = ref(value) as Ref<T>
  const debouncedValue = ref(value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(
    valueRef,
    newValue => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
    },
    { immediate: false },
  )

  onUnmounted(() => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
  })

  return debouncedValue
}

/**
 * useDebounceFunc returns a debounced version of a callback function.
 * The function will only be executed after the specified delay has passed
 * without being called again. This is helpful for limiting function execution
 * in response to frequent user actions like typing or resizing.
 *
 * @param callback - The original function to debounce.
 * @param delay - Delay in milliseconds before the callback is executed.
 * @returns A debounced function that delays execution of the callback.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useDebounceFunc } from './composables/debounce'
 *
 * const fetchResults = (query: string) => {
 *   console.log('Fetching results for:', query)
 *   // API call here
 * }
 *
 * const debouncedSearch = useDebounceFunc(fetchResults, 300)
 *
 * const handleInput = (event: Event) => {
 *   const query = (event.target as HTMLInputElement).value
 *   debouncedSearch(query) // Will wait 300ms before calling fetchResults
 * }
 * </script>
 *
 * <template>
 *   <input @input="handleInput" placeholder="Search..." />
 * </template>
 * ```
 */
export function useDebounceFunc<T extends (...args: never[]) => void>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debouncedFunction = (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      callback(...args)
    }, delay)
  }

  onUnmounted(() => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
  })

  return debouncedFunction
}

/**
 * A Vue composable that conditionally executes a callback function after a specified debounce delay.
 *
 * Unlike a standard debounce, `useConditionalDebounce` only triggers the callback if a given condition is `true`.
 * It automatically clears any pending timeouts when the component unmounts or when the condition changes before the delay expires.
 *
 * @param {number} [delay=500] - The debounce delay in milliseconds before executing the callback.
 * @returns A function that accepts a condition and callback.
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from '@vue/reactivity'
 * import { useConditionalDebounce } from './composables/debounce'
 *
 * const searchQuery = ref('')
 * const isValid = ref(false)
 * const run = useConditionalDebounce(500)
 *
 * const handleSearch = () => {
 *   isValid.value = searchQuery.value.length >= 3
 *
 *   run(isValid.value, () => {
 *     console.log('Searching for:', searchQuery.value)
 *     // Only runs if isValid is true
 *   })
 * }
 * </script>
 *
 * <template>
 *   <input
 *     v-model="searchQuery"
 *     @input="handleSearch"
 *     placeholder="Type at least 3 characters..."
 *   />
 *   <p v-if="!isValid && searchQuery">Query too short</p>
 * </template>
 * ```
 */
export function useConditionalDebounce(delay: number = 500) {
  let timeoutId: number | null = null

  const run = (condition: boolean, callback: () => void) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    if (!condition) return

    timeoutId = window.setTimeout(callback, delay)
  }

  onUnmounted(() => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
  })

  return run
}
