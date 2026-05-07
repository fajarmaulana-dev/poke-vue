<script setup lang="ts">
import { IconoirProvider } from '@iconoir/vue'
import { onMounted } from '@vue/runtime-core'

import { getById } from '@/utils/general'

import { useHead } from './head'
import { usePwa } from './pwa'

usePwa()
useHead()

onMounted(() => {
  const splash = getById('splash-screen')
  if (!splash) return
  if (sessionStorage.getItem('pwa_cached') === '1') {
    splash.remove()
    return
  }

  splash.style.opacity = '0'
  splash.style.pointerEvents = 'none'
  if (!import.meta.env.DEV) sessionStorage.setItem('pwa_cached', '1')
})
</script>

<template>
  <IconoirProvider>
    <slot />
  </IconoirProvider>
</template>
