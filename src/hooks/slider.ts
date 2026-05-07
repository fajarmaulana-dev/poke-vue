import { computed, type Ref, ref } from '@vue/reactivity'

import { MOBILE_BOUND } from '@/constants'

type TSlider = {
  e: MouseEvent | TouchEvent
  axis: 'X' | 'Y'
}

type TSlide<T = void> = {
  data: T[] | Ref<T[]>
  mobileOnly?: boolean
  infiniteSlide?: boolean
  isLoading?: boolean | Ref<boolean>
  mobileBound?: number
  onNext?: () => void
  onBack?: () => void
}

/**
 * Get slider position from an event, supports mobile touch events.
 *
 * @param e - The event object of MouseEvent or TouchEvent.
 * @param mobile - Whether the event is from a mobile touch (default: false).
 * @param axis - The axis to get position from, either 'X' or 'Y' (default: 'X').
 * @returns The page X or Y coordinate from the event.
 */
export function slider({ e, axis }: TSlider): number {
  const isMobile = e instanceof TouchEvent
  return isMobile ? e.changedTouches[0][`page${axis}`] : e[`page${axis}`]
}

/**
 * useSlider is a Vue composable to manage the logic for the slider component.
 *
 * @param options - Configuration object for the slider.
 * @param options.data - An array of data to display in the slider (can be reactive).
 * @param options.mobileOnly - Boolean indicating whether the slider is showed on mobile only or not.
 * @param options.infiniteSlide - Boolean indicating whether the slider can be slided infinitely or not.
 * @param options.isLoading - Boolean indicating whether the data is still loading (can be reactive).
 * @param options.mobileBound - Number as bound for mobile only mode.
 * @param options.onNext - Emited method to override the next function.
 * @param options.onBack - Emited method to override the back function.
 * @returns An object containing reactive state values and handlers for slider control and interaction.
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useSlider } from './composables/slider'
 *
 * const slides = ref([
 *   { id: 1, title: 'Slide 1' },
 *   { id: 2, title: 'Slide 2' },
 *   { id: 3, title: 'Slide 3' },
 * ])
 *
 * const {
 *   currentSlide,
 *   movement,
 *   grab,
 *   disableLeftArrow,
 *   disableRightArrow,
 *   startSlide,
 *   moveSlide,
 *   endSlide,
 *   next,
 *   back,
 * } = useSlider({
 *   data: slides,
 *   infiniteSlide: true
 * })
 * </script>
 *
 * <template>
 *   <div class="slider">
 *     <button @click="back" :disabled="disableLeftArrow">←</button>
 *
 *     <div
 *       class="slider-track"
 *       :class="{ grabbing: grab }"
 *       :style="{ transform: `translateX(${-currentSlide * 100 + (movement / window.innerWidth) * 100}%)` }"
 *       @mousedown="(e) => startSlide({ e, axis: 'X' })"
 *       @mousemove="(e) => grab && moveSlide({ e, axis: 'X' })"
 *       @mouseup="(e) => endSlide({ e, axis: 'X' })"
 *       @mouseleave="(e) => grab && endSlide({ e, axis: 'X' })"
 *       @touchstart="(e) => startSlide({ e, mobile: true, axis: 'X' })"
 *       @touchmove="(e) => grab && moveSlide({ e, mobile: true, axis: 'X' })"
 *       @touchend="(e) => endSlide({ e, mobile: true, axis: 'X' })"
 *     >
 *       <div v-for="slide in slides" :key="slide.id" class="slide">
 *         {{ slide.title }}
 *       </div>
 *     </div>
 *
 *     <button @click="next" :disabled="disableRightArrow">→</button>
 *   </div>
 * </template>
 * ```
 */
export function useSlider<T = void>({
  data,
  mobileOnly,
  infiniteSlide,
  isLoading,
  mobileBound,
  onBack,
  onNext,
}: TSlide<T>) {
  const currentSlide = ref(0)
  const movement = ref(0)
  const grab = ref(false)

  const startPos = ref(0)
  const endPos = ref(0)
  const throttling = ref(false)

  const dataRef = ref(data)
  const isLoadingRef = ref(isLoading ?? false)

  /**
   * Determines whether the left navigation arrow should be disabled.
   */
  const disableLeftArrow = computed(() => {
    return currentSlide.value === 0 || dataRef.value.length === 0 || isLoadingRef.value
  })

  /**
   * Determines whether the right navigation arrow should be disabled.
   */
  const disableRightArrow = computed(() => {
    return currentSlide.value === dataRef.value.length - 1 || dataRef.value.length === 0 || isLoadingRef.value
  })

  /**
   * Begins drag or swipe interaction for the slider.
   *
   * @param param - Slider parameter containing event and axis information.
   */
  const startSlide = (param: TSlider) => {
    if (mobileOnly && window.innerWidth >= (mobileBound || MOBILE_BOUND)) return
    startPos.value = slider(param)
    grab.value = true
  }

  /**
   * Handles the ongoing drag/swipe movement of the slider.
   *
   * @param param - Slider parameter containing event and axis information.
   */
  const moveSlide = (param: TSlider) => {
    if (mobileOnly && window.innerWidth >= (mobileBound || MOBILE_BOUND)) return
    const diff = slider(param) - startPos.value
    const move = param.e instanceof TouchEvent && Math.abs(diff) <= 24 ? 0 : diff

    if (!onNext || !onBack) {
      const len = dataRef.value.length - 1
      if (currentSlide.value === 0 && move > 0) {
        currentSlide.value = 0
      }
      if (currentSlide.value === len && move < 0) {
        currentSlide.value = len
      }
    }

    movement.value = move
  }

  /**
   * Throttle call of next and back function.
   */
  const throttle = (callback: () => void, delay = 100) => {
    if (throttling.value) return
    throttling.value = true
    callback()
    setTimeout(() => {
      throttling.value = false
    }, delay)
  }

  /**
   * Navigates to the next slide if possible.
   */
  const next = () => {
    if (disableRightArrow.value && !infiniteSlide) return

    throttle(() => {
      if (disableRightArrow.value) {
        currentSlide.value = 0
        return
      }
      currentSlide.value++
    })
  }

  /**
   * Navigates to the previous slide if possible.
   */
  const back = () => {
    if (disableLeftArrow.value && !infiniteSlide) return

    throttle(() => {
      if (disableLeftArrow.value) {
        currentSlide.value = dataRef.value.length - 1
        return
      }
      currentSlide.value--
    })
  }

  /**
   * Ends the drag or swipe interaction and determines if a slide change should occur.
   *
   * @param param - Slider parameter containing event and axis information.
   */
  const endSlide = (param: TSlider) => {
    if (mobileOnly && window.innerWidth >= (mobileBound || MOBILE_BOUND)) return

    grab.value = false
    endPos.value = slider(param)

    if (startPos.value > endPos.value && startPos.value - endPos.value > 56) {
      onNext ? onNext() : next()
    }
    if (startPos.value < endPos.value && endPos.value - startPos.value > 56) {
      onBack ? onBack() : back()
    }

    movement.value = 0
  }

  /**
   * Manually set the current slide index.
   *
   * @param index - The slide index to navigate to.
   */
  const setCurrentSlide = (index: number) => {
    if (index >= 0 && index < dataRef.value.length) {
      currentSlide.value = index
    }
  }

  /**
   * Function to simplify action calls
   * @param param - Slider parameter containing event and axis information.
   * @param type - type of action
   */
  const handleAction = (param: TSlider, type: 'start' | 'move' | 'end', disabled?: boolean) => {
    if (disabled) return
    switch (type) {
      case 'start':
        startSlide(param)
        return
      case 'move':
        if (grab.value) moveSlide(param)
        return
      default:
        endSlide(param)
    }
  }

  return {
    currentSlide,
    movement,
    grab,
    disableLeftArrow,
    disableRightArrow,
    setCurrentSlide,
    handleAction,
    next,
    back,
  }
}
