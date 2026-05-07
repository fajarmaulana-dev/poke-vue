<script setup lang="ts">
import type { Type } from './types'

const { id = '0', size = 260 } = defineProps<Type>()
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :size="size" viewBox="0 0 204 204" fill="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :fill="`url(#paint0_linear_1441_9479-${id})`"
      d="M38.8169 175.574C38.1166 174.915 37.4242 174.244 36.7397 173.559C0.607588 137.427 0.607594 78.8455 36.7397 42.7135C72.8717 6.58127 188.003 4.16406 188.003 4.16406C188.003 4.16406 203.718 137.427 167.586 173.559C135.496 205.649 85.6982 209.239 49.6464 184.329L78.6957 148.681L125.134 138.655L87.2266 134.865L111.317 110.337L138.739 104.33L117.055 97.9079L138.739 58.7909L107.896 93.3864L95.9855 76.5791L100.178 104.33L78.6957 128.547L68.7375 97.9075V138.655L38.8169 175.574Z"
    />
    <defs>
      <linearGradient
        :id="`paint0_linear_1441_9479-${id}`"
        x1="9.83375"
        y1="4.16148"
        x2="114.745"
        y2="235.325"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
</template>
