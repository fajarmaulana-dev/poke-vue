<script setup lang="ts">
import type { Type } from './types'

const { id = '0', size = 260 } = defineProps<Type>()
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :size="size" viewBox="0 0 204 204" fill="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :fill="`url(#paint0_linear_1441_9106-${id})`"
      d="M168.209 138.066C168.209 174.476 138.582 203.992 102.034 203.992C65.4868 203.992 35.8594 174.476 35.8594 138.066C35.8594 102.655 98.4547 5.39946 101.888 0.0922329C101.966 -0.0287919 102.103 -0.0287909 102.181 0.0922341C105.614 5.39946 168.209 102.655 168.209 138.066ZM91.0031 182.857C57.4228 175.509 63.1691 138.311 63.1691 138.311C63.1691 138.311 72.3387 160.766 94.5911 168.04C116.843 175.314 143.734 164.646 143.734 164.646C143.734 164.646 124.583 190.204 91.0031 182.857Z"
    />
    <defs>
      <linearGradient
        :id="`paint0_linear_1441_9106-${id}`"
        x1="36"
        y1="-0.0012206"
        x2="168"
        y2="203.999"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
</template>
