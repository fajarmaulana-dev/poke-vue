<script setup lang="ts">
import type { Type } from './types'

const { id = '0', size = 260 } = defineProps<Type>()
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :size="size" viewBox="0 0 204 204" fill="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :fill="`url(#paint0_linear_1441_15328-${id})`"
      d="M60.7859 0.232552C60.7465 0.118718 60.8314 0 60.9517 0L132.602 0C132.679 0 132.747 0.0500386 132.77 0.123429L165.68 106.451C165.715 106.564 165.631 106.678 165.512 106.678H117.812C117.754 106.678 117.712 106.733 117.728 106.79L145.085 203.094C145.139 203.281 144.894 203.403 144.777 203.247L38.4613 61.8642C38.3744 61.7487 38.4569 61.5837 38.6013 61.5837H81.8936C81.9537 61.5837 81.996 61.5244 81.976 61.4674L60.7859 0.232552Z"
    />
    <defs>
      <linearGradient
        :id="`paint0_linear_1441_15328-${id}`"
        x1="38.561"
        y1="-0.00267659"
        x2="172.003"
        y2="198.954"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
</template>
