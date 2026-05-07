<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { useAttrs } from '@vue/runtime-core'

import { toast as toastConfig } from './configs'
import { useToast } from './hooks'
import type { ToastProps } from './types'

defineOptions({ inheritAttrs: false })
const props = defineProps<ToastProps>()
const attrs = useAttrs()

const { styleByType, iconByType } = toastConfig
const { toggleToast } = useToast(props.id!)

const containerAttrs = computed(() => ({
  class: [
    'fixed inset-0 z-50 transition-opacity duration-300 opacity-0 pointer-events-none delay-200',
    'bg-black/20 has-checked:opacity-100 has-checked:pointer-events-auto has-checked:delay-0',
    attrs.class,
  ],
  style: attrs.style as any,
}))

const contentAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs
  return rest
})
</script>

<template>
  <label v-bind="containerAttrs" :for="id">
    <input v-bind="contentAttrs" :id="id" class="hidden peer" type="checkbox" @change="toggleToast" />
    <div
      :class="[
        `absolute border right-0 bottom-6 max-w-80 p-3 flex gap-2 rounded-lg transition-transform ease duration-300
        translate-x-full peer-checked:-translate-x-6 delay-200`,
        styleByType({ type: props.type }),
      ]"
    >
      <component :is="iconByType({ type: props.type })" class="min-w-6 h-auto" />
      <div class="flex-1 text-sm text-slate-800">
        <slot />
      </div>
    </div>
  </label>
</template>
