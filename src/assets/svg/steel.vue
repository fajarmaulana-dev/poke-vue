<script setup lang="ts">
import type { Type } from './types'

const { id = '0', size = 260 } = defineProps<Type>()
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :size="size" viewBox="0 0 204 204" fill="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :fill="`url(#paint0_linear_1441_14646-${id})`"
      d="M0.0203644 101.419C-0.00677527 101.372 -0.0067889 101.315 0.0203281 101.268L51.3168 13.6257C51.3435 13.5802 51.3925 13.5522 51.4451 13.5522L153.117 13.5522C153.17 13.5522 153.219 13.5805 153.246 13.6263L203.98 101.269C204.006 101.315 204.006 101.372 203.98 101.418L153.246 188.962C153.219 189.008 153.17 189.036 153.117 189.036H51.4451C51.3925 189.036 51.3435 189.008 51.3168 188.963L0.0203644 101.419ZM149.262 101.294C149.262 127.387 128.109 148.54 102.016 148.54C75.9231 148.54 54.7704 127.387 54.7704 101.294C54.7704 75.2009 75.9231 54.0487 102.016 54.0487C128.109 54.0487 149.262 75.2009 149.262 101.294Z"
    />
    <defs>
      <linearGradient
        :id="`paint0_linear_1441_14646-${id}`"
        x1="0.216755"
        y1="13.5499"
        x2="79.7536"
        y2="233.794"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
</template>
