<script setup lang="ts">
import { useLazyBackground } from './hooks'
import type { LazyBackgroundProps } from './types'

const { url } = defineProps<LazyBackgroundProps>()
useLazyBackground({ url })
</script>

<template>
  <div ref="lazy-el">
    <slot />
  </div>
</template>
