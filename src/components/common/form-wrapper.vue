<script setup lang="ts">
import { useTemplateRef } from '@vue/runtime-core'

import type { FormWrapperEmits, FormWrapperProps } from './types'

defineProps<FormWrapperProps>()
const emit = defineEmits<FormWrapperEmits>()

const formRef = useTemplateRef<HTMLFormElement>('form-el')
defineExpose({ form: formRef })

const handleSubmit = () => {
  const activeEl = document.activeElement as HTMLElement
  if (activeEl && typeof activeEl.blur === 'function') activeEl.blur()
  if (!formRef.value) return
  const formData = new FormData(formRef.value)
  emit('action', formData)
}
</script>

<template>
  <form ref="form-el" v-bind="$attrs" @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>
