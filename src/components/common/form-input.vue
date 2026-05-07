<script setup lang="ts">
import { computed, ref } from '@vue/reactivity'
import { useAttrs, useSlots } from '@vue/runtime-core'
import type { StyleValue } from 'vue'

import { CircleSpinner } from '@/assets/spinner'
import { ANY_NUMBER } from '@/constants/regex'

import type { FormInputProps } from './types'

defineOptions({ inheritAttrs: false })
const props = defineProps<FormInputProps>()
const model = defineModel<string | number>()
const slots = useSlots()
const attrs = useAttrs()

const inputRef = ref<HTMLInputElement | null>(null)

const containerAttrs = computed(() => ({
  class: attrs.class as string | undefined,
  style: attrs.style as StyleValue | undefined,
}))

const inputAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs
  return rest
})

const handlePreventTyping = (e: KeyboardEvent) => {
  const { key, ctrlKey, metaKey } = e
  if ((ctrlKey || metaKey) && ['a', 'c', 'v', 'x', 'z', 'y'].includes(key.toLowerCase())) return

  const isWhiteListKey = ['Backspace', 'Delete', 'ArrowRight', 'ArrowLeft', 'Enter', 'Tab'].includes(key)
  const isNumber = ANY_NUMBER.re.test(key)

  const inputType = inputRef.value?.type || 'text'
  const isNumberAndTel = ['tel', 'number'].includes(inputType)

  if (!isWhiteListKey && !isNumber && isNumberAndTel) e.preventDefault()
  if (props.max && inputRef.value) {
    const currentValue = inputRef.value.value
    if (currentValue.length >= props.max && !isWhiteListKey) {
      e.preventDefault()
    }
  }
}

const handleWheel = () => {
  if (inputRef.value?.type === 'number') {
    inputRef.value.blur()
  }
}
</script>

<template>
  <div v-bind="containerAttrs">
    <span v-if="label" :id="`${id}_label`" class="text-slate-800 text-sm block mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </span>
    <label
      :for="id"
      class="flex items-center text-slate-800 h-10 rounded-full border-2 border-slate-500/80
        not-has-disabled:hover:border-slate-500 has-focus:border-slate-600 group transition-colors duration-300
        has-disabled:bg-neutral-200 has-disabled:cursor-not-allowed"
      :class="{ 'mb-1': !!name }"
    >
      <button
        v-if="slots.prefix"
        type="button"
        aria-label="prefix"
        class="h-full px-3 grid place-items-center text-slate-800 text-sm group-has-disabled:pointer-events-none
          group-has-disabled:text-slate-400"
        @click="onPrefixClick"
      >
        <slot name="prefix" />
      </button>
      <input
        v-bind="inputAttrs"
        :id="id"
        ref="inputRef"
        v-model="model"
        :name="name"
        :required="required"
        class="h-full bg-transparent text-sm w-full border-none outline-none focus:ring-0"
        :class="[!slots.prefix ? 'pl-4' : 'pl-0', !(slots.suffix || isLoading) ? 'pr-4' : 'pr-0']"
        spellcheck="false"
        autocomplete="off"
        @keydown="handlePreventTyping"
        @wheel="handleWheel"
      />
      <button
        v-if="slots.suffix || isLoading"
        type="button"
        aria-label="suffix"
        class="h-full px-3 grid place-items-center text-slate-800 text-sm group-has-disabled:pointer-events-none
          group-has-disabled:text-slate-400"
        @click="onSuffixClick"
      >
        <CircleSpinner v-if="isLoading" class="border-t-slate-800! border-b-slate-800!" />
        <slot v-else name="suffix" />
      </button>
    </label>
    <small :id="`${id}_error`" class="text-xs text-red-500 flex items-center gap-1"></small>
    <small :id="`${id}_info`" class="text-xs text-slate-500 flex items-center gap-1"></small>
  </div>
</template>
