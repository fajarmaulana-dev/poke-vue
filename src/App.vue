<script setup lang="ts">
import { RouterView } from 'vue-router'

import PluginLayout from './plugins/plugin-layout.vue'
</script>

<template>
  <PluginLayout>
    <RouterView :key="$route.path" />
  </PluginLayout>
</template>
