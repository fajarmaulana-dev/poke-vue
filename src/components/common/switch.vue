<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { useAttrs } from '@vue/runtime-core'
import type { StyleValue } from 'vue'

import type { SwitchProps } from './types'

defineOptions({ inheritAttrs: false })
const { label } = defineProps<SwitchProps>()
const attrs = useAttrs()
const model = defineModel<string | number>()

const inputAttrs = computed(() => {
  const { class: _c, style: _s, placeholder: _p, ...rest } = attrs
  return rest
})

const containerAttrs = computed(() => ({
  class: attrs.class as string | undefined,
  style: attrs.style as StyleValue | undefined,
}))
</script>

<template>
  <div v-bind="containerAttrs" class="flex w-fit items-center gap-2 sm:gap-3">
    <label
      :aria-label="name"
      class="relative h-3 sm:h-4 w-10 sm:w-14 rounded-full transition-colors duration-300 bg-slate-200
        has-checked:bg-rose-200 after:absolute after:h-5 sm:after:h-6 after:w-5 sm:after:w-6 after:rounded-full
        after:left-0 after:translate-x-0 has-checked:after:translate-x-5 sm:has-checked:after:translate-x-8 after:-top-1
        after:bg-slate-400 hover:after:bg-slate-500 has-checked:after:bg-rose-400 has-checked:hover:after:bg-rose-500
        after:transition after:duration-300"
      :for="id || name"
    >
      <input v-bind="inputAttrs" :id="name || name" v-model="model" :name="name" class="hidden" type="checkbox" />
    </label>
    <small v-if="label" class="whitespace-nowrap text-title text-xs sm:text-sm">{label}</small>
  </div>
</template>
