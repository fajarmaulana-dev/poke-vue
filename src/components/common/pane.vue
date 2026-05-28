<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { useAttrs } from '@vue/runtime-core'
import type { StyleValue } from 'vue'

import { usePane } from './hooks'
import type { PaneEmits, PaneProps } from './types'

defineOptions({ inheritAttrs: false })
const props = defineProps<PaneProps>()
const emit = defineEmits<PaneEmits>()
const attrs = useAttrs()

const { grab, handleChange, handleAction } = usePane({
  id: props.id,
  mobileOnly: props.mobileOnly,
  scrollTarget: props.scrollTarget,
  onShown: e => emit('shown', e),
  onHidden: e => emit('hidden', e),
})

const wrapperAttrs = computed(() => ({
  class: [
    'fixed inset-0 pointer-events-none z-50 select-none sm:grid sm:place-items-center xs:px-mobile md:px-desktop',
    props.mobileOnly ? 'sm:hidden' : '',
    props.wrapperClass,
  ],
  style: attrs.style as StyleValue | undefined,
}))

const contentAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs
  return rest
})
</script>

<template>
  <div v-bind="wrapperAttrs">
    <label
      aria-label="pane"
      :class="[
        `peer absolute inset-0 z-50 bg-black/40 opacity-0 transition-opacity duration-300 delay-200
        has-checked:opacity-100 has-checked:delay-0 pointer-events-none`,
        grab ? '' : 'has-checked:pointer-events-auto',
      ]"
      :for="id"
    >
      <input :id="id" class="hidden" type="checkbox" name="pane" :disabled="preventClose" @change="handleChange" />
    </label>
    <div
      v-bind="contentAttrs"
      :id="`pane-${id}`"
      role="button"
      :tabindex="0"
      :class="[
        `absolute z-50 pointer-events-none bottom-0 left-0 translate-y-full transition-transform sm:transition-opacity
        ease bg-white w-full shadow-blur-y-inv-4 shadow-black/10 pt-4 rounded-t-4xl after:pointer-events-none
        after:absolute after:w-16 after:h-1.5 after:rounded-full after:bg-gray-400/60 after:top-3 after:left-1/2
        after:-translate-x-1/2 opacity-0 will-change-transform peer-has-checked:pointer-events-auto sm:cursor-default`,
        !mobileOnly
          ? `sm:relative sm:translate-y-0! sm:opacity-0! sm:peer-has-checked:opacity-100!
            sm:peer-has-checked:pointer-events-auto sm:shadow-none sm:rounded-3xl sm:after:hidden sm:p-0`
          : '',
        grab ? 'cursor-grabbing duration-0' : 'cursor-grab duration-300',
        'peer-has-checked:translate-y-0!',
        $attrs.class,
      ]"
      @mousedown="e => handleAction({ e, axis: 'Y' }, 'start')"
      @mousemove="e => handleAction({ e, axis: 'Y' }, 'move')"
      @mouseup="e => handleAction({ e, axis: 'Y' }, 'end')"
      @touchstart.passive="e => handleAction({ e, axis: 'Y' }, 'start')"
      @touchmove.passive="e => handleAction({ e, axis: 'Y' }, 'move')"
      @touchend.passive="e => handleAction({ e, axis: 'Y' }, 'end')"
    >
      <slot />
    </div>
  </div>
</template>
