import { type Ref, ref, watch } from '@vue/reactivity'
import { onUnmounted } from '@vue/runtime-core'

import {
  type ApiConfig,
  ApiInstance,
  type ApiInstanceOptions,
  type ApiInterceptor,
  type ApiResponse,
  buildURL,
  type HttpConfig,
  type Progress,
} from './api'

type TFetchState<T> = {
  data: Ref<T | null>
  error: Ref<unknown>
  isLoading: Ref<boolean>
  cacheKey: Ref<string | null>
}

type TFetchResult<T> = TFetchState<T> & {
  refetch: () => Promise<void>
}

type TBatchResult<T extends unknown[]> = {
  [K in keyof T]: ApiResponse<T[K]>
}

type TMutationOptions = Pick<ApiConfig, 'cache' | 'headers' | 'method' | 'signal'> & {
  progress?: 'upload' | 'download'
  queryMutation?: boolean
}

type TMutationResult<TData, TRequest> = {
  mutate: (request?: TRequest) => Promise<ApiResponse<TData>>
  isLoading: Ref<boolean>
  error: Ref<unknown>
  cacheKey: Ref<string | null>
  progress: Ref<Progress | null>
}

type TInfiniteFetchOptions<T> = {
  initialOffset: number
  offsetKey?: string
  setOffset: (lastItems: T, allItems: T[], lastOffset: number) => number | null
}

const pendingRequests: Map<string, Promise<ApiResponse<unknown>>> = new Map()

/**
 * Creates a new API instance with built-in Vue composables (`fetch`, `mutation`, `infinite`)
 * for performing typed data fetching and mutations with progress tracking.
 *
 * @param options - Optional configuration for the API instance (e.g. baseURL, default headers).
 * @returns An object containing data composables and cache manipulation methods.
 *
 * @example
 * ```vue
 * <script setup>
 * const api = createApi({ baseURL: '/api' })
 *
 * const { data, isLoading, refetch } = api.fetch('/users')
 *
 * const { mutate, isLoading: mutating, progress } = api.mutation('/users', {
 *   method: 'POST'
 * })
 * </script>
 * ```
 */
export default function createApi(options: ApiInstanceOptions = {}) {
  const instance = new ApiInstance(options)

  /**
   * Vue composable for data fetching with built-in loading, error, and refetch states.
   *
   * @typeParam T - Expected data type from the API response.
   * @param url - The endpoint URL (relative to instance baseURL) or reactive ref.
   * @param config - Optional HTTP configuration (headers, params, cache, etc.) or reactive ref.
   * @param options - Optional configuration object with enabled flag.
   *
   * @returns An object with reactive refs:
   * - `data`: fetched data or `null`
   * - `error`: any error encountered
   * - `isLoading`: request state
   * - `cacheKey`: identifier for caching this request
   * - `refetch()`: manually trigger a new fetch
   *
   * @example
   * ```vue
   * <script setup>
   * const userId = ref(1)
   * const { data, isLoading, error, refetch } = api.fetch(
   *   computed(() => `/users/${userId.value}`),
   *   { cache: { enabled: true } }
   * )
   * </script>
   * ```
   */
  function fetch<T>(
    url: string | Ref<string>,
    config?: Omit<HttpConfig, 'onUpload' | 'onDownload'> | Ref<Omit<HttpConfig, 'onUpload' | 'onDownload'>>,
    options: { enabled?: boolean | Ref<boolean> } = {},
  ): TFetchResult<T> {
    const data = ref<T | null>(null) as Ref<T | null>
    const error = ref<unknown>(null)
    const isLoading = ref(false)
    const cacheKey = ref<string | null>(null)

    const enabled = ref(options.enabled ?? true)
    const urlRef = ref(url)
    const configRef = ref(config)

    let abortController: AbortController | null = null

    const fetchData = async (force = false) => {
      if (!enabled.value && !force) return
      if (abortController) abortController.abort()
      abortController = new AbortController()

      isLoading.value = true
      error.value = null

      try {
        const response = await instance.get<T>(urlRef.value, {
          ...configRef.value,
          signal: abortController.signal,
        })

        data.value = response.data
        error.value = null
        cacheKey.value = response.cacheKey ?? null
      } catch (err) {
        if (!(err instanceof Error && err.name === 'AbortError')) {
          data.value = null
          error.value = err
          cacheKey.value = null
        }
      } finally {
        isLoading.value = false
      }
    }

    watch(
      [urlRef, configRef, enabled],
      () => {
        if (enabled.value) fetchData()
      },
      { immediate: true, deep: true },
    )

    onUnmounted(() => {
      if (abortController) abortController.abort()
    })

    return {
      data,
      error,
      isLoading,
      cacheKey,
      refetch: () => fetchData(true),
    }
  }

  function batch<T extends unknown[]>(
    initialRequests?: { [K in keyof T]: string | ApiConfig } | Ref<{ [K in keyof T]: string | ApiConfig }>,
  ) {
    const isLoading = ref(false)
    const error = ref<unknown>(null)
    const cacheKeys = ref<(string | null)[]>([])

    const baseRequests = ref(initialRequests) as Ref<{ [K in keyof T]: string | ApiConfig } | undefined>
    let abortController: AbortController | null = null

    const mutate = async (overrideRequests?: { [K in keyof T]: string | ApiConfig }): Promise<TBatchResult<T>> => {
      const targetRequests = overrideRequests || baseRequests.value
      if (!targetRequests) throw new Error('No requests defined for batch execution.')
      if (abortController) abortController.abort()
      abortController = new AbortController()

      isLoading.value = true
      error.value = null

      try {
        const promises = targetRequests.map(req => {
          const config: ApiConfig = typeof req === 'string' ? { url: req, method: 'GET' } : req
          return instance.request<T>({
            ...config,
            signal: abortController?.signal,
          })
        })

        const results = await Promise.all(promises)
        cacheKeys.value = results.map(res => res.cacheKey ?? null)
        return results as TBatchResult<T>
      } catch (err) {
        if (!(err instanceof Error && err.name === 'AbortError')) {
          error.value = err
        }
        throw err
      } finally {
        isLoading.value = false
      }
    }

    onUnmounted(() => {
      if (abortController) abortController.abort()
    })

    return {
      mutate,
      isLoading,
      error,
      cacheKeys,
    }
  }

  /**
   * Vue composable for making data mutations (e.g. POST, PUT, DELETE) with built-in
   * loading state, upload/download progress tracking, and request deduplication.
   *
   * @typeParam TData - Expected data type of the response.
   * @typeParam TRequest - Payload type for the mutation body or query param.
   *
   * @param url - Endpoint URL for the mutation or reactive ref.
   * @param config - Optional mutation config (method, headers, cache, progress, etc.).
   *
   * @returns An object with:
   * - `mutate(request)`: Function to trigger the mutation.
   * - `isLoading`: Reactive ref indicating if request is in progress.
   * - `cacheKey`: Reactive ref with cache identifier.
   * - `progress`: Reactive ref with progress info (loaded, total, percentage).
   *
   * @example
   * ```vue
   * <script setup>
   * const { mutate, isLoading, progress } = api.mutation('/upload', {
   *   method: 'POST',
   *   progress: 'upload'
   * })
   *
   * const handleUpload = async (formData) => {
   *   try {
   *     const { data } = await mutate(formData)
   *     console.log('Success:', data)
   *   } catch (err) {
   *     console.error('Error:', err)
   *   }
   * }
   * </script>
   *
   * <template>
   *   <div v-if="progress">Upload: {{ progress.percentage }}%</div>
   * </template>
   * ```
   */
  function mutation<TData, TRequest = void>(
    url: string | Ref<string>,
    config?: TMutationOptions | Ref<TMutationOptions>,
  ): TMutationResult<TData, TRequest> {
    const isLoading = ref(false)
    const error = ref<unknown>(null)
    const cacheKey = ref<string | null>(null)
    const progress = ref<Progress | null>(null)

    const urlRef = ref(url)
    const configRef = ref(config)

    let abortController: AbortController | null = null

    const mutate = async (request?: TRequest): Promise<ApiResponse<TData>> => {
      if (abortController) {
        abortController.abort()
      }
      abortController = new AbortController()

      isLoading.value = true
      progress.value = null
      error.value = null

      let requestKey = ''
      try {
        const method = configRef.value?.method || 'GET'
        requestKey = JSON.stringify({ url: urlRef.value, method, request })

        if (pendingRequests.has(requestKey)) {
          return pendingRequests.get(requestKey)! as Promise<ApiResponse<TData>>
        }

        const shouldTrackUpload = configRef.value?.progress === 'upload'
        const shouldTrackDownload = configRef.value?.progress === 'download'

        let requestPromise: Promise<ApiResponse<TData>>

        if (method === 'GET') {
          requestPromise = instance.get<TData>(urlRef.value, {
            ...configRef.value,
            params: request as HttpConfig['params'],
            signal: abortController.signal,
            onDownload: shouldTrackDownload ? p => (progress.value = p) : undefined,
          })
        } else {
          requestPromise = instance.request<TData>({
            ...configRef.value,
            url: configRef.value?.queryMutation
              ? buildURL(urlRef.value, request as HttpConfig['params'])
              : urlRef.value,
            method,
            body: request ? (request as globalThis.BodyInit) : undefined,
            signal: abortController.signal,
            onUpload: shouldTrackUpload ? p => (progress.value = p) : undefined,
          })
        }

        pendingRequests.set(requestKey, requestPromise)
        const response = await requestPromise

        cacheKey.value = response.cacheKey ?? null
        progress.value = null

        return response
      } catch (err) {
        cacheKey.value = null
        progress.value = null
        error.value = err
        throw err
      } finally {
        isLoading.value = false
        if (pendingRequests.has(requestKey)) pendingRequests.delete(requestKey)
      }
    }

    onUnmounted(() => {
      if (abortController) abortController.abort()
    })

    return {
      mutate,
      isLoading,
      cacheKey,
      progress,
      error,
    }
  }

  /**
   * Vue composable for infinite pagination fetching with custom offset logic.
   *
   * @typeParam T - Expected data type from the API response.
   * @param url - Endpoint URL (relative to instance baseURL) or reactive ref.
   * @param options - Infinite pagination options.
   * @param config - Optional HTTP configuration.
   * @returns Object with reactive refs for paginated data and pagination controls.
   *
   * @example
   * ```vue
   * <script setup>
   * const {
   *   data,
   *   isLoading,
   *   hasNextPage,
   *   isFetchingNextPage,
   *   fetchNextPage,
   *   refetch
   * } = api.infinite('/users', {
   *   initialOffset: 0,
   *   setOffset: (lastItems, allItems, lastOffset) => {
   *     return lastItems.length ? lastOffset + 10 : null
   *   },
   * })
   * </script>
   *
   * <template>
   *   <div v-for="user in data" :key="user.id">{{ user.name }}</div>
   *   <button @click="fetchNextPage" :disabled="!hasNextPage">Load More</button>
   * </template>
   * ```
   */
  function infinite<T>(
    url: string | Ref<string>,
    options: TInfiniteFetchOptions<T>,
    config?: HttpConfig | Ref<HttpConfig>,
  ) {
    const { initialOffset, offsetKey, setOffset } = options

    const data = ref<T[]>([]) as Ref<T[]>
    const offset = ref(initialOffset)
    const isLoading = ref(false)
    const isFetchingNextPage = ref(false)
    const hasNextPage = ref(true)
    const error = ref<unknown>(null)

    const urlRef = ref(url)
    const configRef = ref(config)

    let abortController: AbortController | null = null

    const fetchPage = async (offsetValue: number, append = false) => {
      if (abortController) abortController.abort()
      abortController = new AbortController()

      if (!append) {
        isLoading.value = true
      } else {
        isFetchingNextPage.value = true
      }

      try {
        const response = await instance.get<T>(urlRef.value, {
          ...configRef.value,
          params: {
            ...(configRef.value?.params ?? {}),
            [offsetKey ?? 'offset']: offsetValue,
          },
          signal: abortController.signal,
        })

        const responseData = response.data

        if (append) {
          data.value = [...data.value, responseData]
        } else {
          data.value = [responseData]
        }

        const nextOffset = setOffset(responseData, data.value, offsetValue)

        if (nextOffset === null || nextOffset === undefined) {
          hasNextPage.value = false
        } else {
          hasNextPage.value = true
          offset.value = nextOffset
        }

        error.value = null
      } catch (err) {
        if (!(err instanceof Error && err.name === 'AbortError')) error.value = err
      } finally {
        isLoading.value = false
        isFetchingNextPage.value = false
      }
    }

    const fetchNextPage = async () => {
      if (!hasNextPage.value || isFetchingNextPage.value) return
      await fetchPage(offset.value, true)
    }

    const refetch = async () => {
      data.value = []
      offset.value = initialOffset
      hasNextPage.value = true
      await fetchPage(initialOffset, false)
    }

    watch([urlRef, configRef], () => refetch(), { immediate: true, deep: true })

    onUnmounted(() => {
      if (abortController) abortController.abort()
    })

    return {
      data,
      error,
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      refetch,
    }
  }

  return {
    // ----------- Vue composables -----------
    fetch,
    batch,
    mutation,
    infinite,

    // ----------- cache ops -----------
    /**
     * Retrieves a cached response by its key.
     * @param key - Unique cache key.
     * @returns Cached data or `undefined` if not found.
     */
    getCache: <T>(key: string) => instance.getCache<T>(key),

    /**
     * Stores data in cache.
     * @param key - Cache key.
     * @param data - Data to store.
     * @param ttl - Optional time-to-live in milliseconds.
     */
    setCache: <T>(key: string, data: T, ttl?: number) => instance.setCache<T>(key, data, ttl),

    /**
     * Removes a single cached entry.
     * @param key - Cache key to remove.
     */
    removeCache: (key: string) => instance.removeCache(key),

    /**
     * Clears all cache entries.
     */
    clearCache: () => instance.clearCache(),

    // ----------- interceptors -----------
    /**
     * Registers custom request/response interceptors.
     *
     * @param interceptors - Object containing optional `request`, `response`, and `error` interceptors.
     *
     * @example
     * ```ts
     * api.setInterceptors({
     *   request: config => config,
     *   response: res => res,
     *   error: err => Promise.reject(err),
     * })
     * ```
     */
    setInterceptors: (interceptors: ApiInterceptor) => instance.setInterceptors(interceptors),
  }
}
