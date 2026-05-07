<script setup lang="ts">
import { NavArrowDown } from '@iconoir/vue'
import { computed } from '@vue/reactivity'
import { useAttrs } from '@vue/runtime-core'
import type { StyleValue } from 'vue'

import { CircleSpinner } from '@/assets/spinner'

import type { DropDownProps } from './types'

defineOptions({ inheritAttrs: false })
const { options, showValue, placeholder = 'Pilih Opsi' } = defineProps<DropDownProps>()
const attrs = useAttrs()
const model = defineModel<string | number>()

const selectedText = computed(() => {
  const selected = options.find(option => option.value === model.value)
  return selected ? (showValue ? selected.value.toString().replaceAll('-', ' ') : selected.text) : placeholder
})

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
  <div v-bind="containerAttrs" class="relative z-4">
    <button
      type="button"
      class="h-10 relative z-5 peer w-full rounded-full px-4 flex items-center justify-between gap-2
        disabled:bg-neutral-200 not-disabled:bg-slate-300/80 not-disabled:hover:bg-slate-300
        not-disabled:active:bg-slate-400/50 font-semibold text-slate-800 whitespace-nowrap capitalize transition-colors
        duration-300"
      :disabled="isLoading"
    >
      <span class="block text-center w-full">{{ selectedText }}</span>
      <CircleSpinner v-if="isLoading" class="border-slate-600! border-b-neutral-200! min-w-4.5 size-4.5!" />
      <NavArrowDown v-else class="min-w-5 h-auto stroke-3 **:stroke-slate-800" />
    </button>
    <div
      class="absolute rounded-3xl top-0 left-0 min-w-full opacity-0 pointer-events-none peer-hover:opacity-100
        peer-disabled:opacity-0 peer-disabled:pointer-events-none peer-hover:pointer-events-auto hover:opacity-100
        hover:pointer-events-auto transition-opacity duration-300 peer-disabled:hover:opacity-0
        peer-disabled:hover:pointer-events-none"
    >
      <div
        class="bg-rose-50 rounded-2xl mt-11.5 h-full max-h-70 flex flex-col gap-2 p-2.5 border border-rose-100
          overflow-y-auto no-scroll"
      >
        <label
          v-for="{ value, text } in options"
          :key="value"
          :for="`${name}-${value}`"
          class="min-h-10 cursor-pointer px-3 rounded-lg text-slate-800 bg-slate-300/80 hover:bg-slate-300
            active:bg-slate-400/50 font-semibold grid place-items-center whitespace-nowrap transition-colors
            duration-300"
          :class="labelClass"
        >
          <input
            v-bind="inputAttrs"
            :id="`${name}-${value}`"
            v-model="model"
            :name="name"
            type="radio"
            :value="value"
            class="hidden"
          />
          {{ text }}
        </label>
      </div>
    </div>
  </div>
</template>
