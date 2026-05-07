<script setup lang="ts">
import type { Type } from './types'

const { id = '0', size = 260 } = defineProps<Type>()
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :size="size" viewBox="0 0 204 204" fill="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :fill="`url(#paint0_radial_1441_5384-${id})`"
      d="M150.704 11.5532L151.331 66.6771L103.252 89.7574L102.659 37.7099L150.704 11.5532Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :fill="`url(#paint1_radial_1441_5384-${id})`"
      d="M198.902 98.418L151.306 125.642L103.683 98.375L151.282 73.3722L198.902 98.418Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :fill="`url(#paint2_radial_1441_5384-${id})`"
      d="M95.2192 98.418L47.6238 125.642L0 98.375L47.5991 73.3722L95.2192 98.418Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :fill="`url(#paint3_radial_1441_5384-${id})`"
      d="M47.0835 11.3306L96.4842 35.7969L95.2212 89.1143L48.5777 66.0136L47.0835 11.3306Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :fill="`url(#paint4_radial_1441_5384-${id})`"
      d="M152.054 184.667L102.653 160.201L103.916 106.883L150.56 129.984L152.054 184.667Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :fill="`url(#paint5_radial_1441_5384-${id})`"
      d="M48.7966 185.165L48.1687 130.041L96.2485 106.961L96.8414 159.008L48.7966 185.165Z"
    />
    <defs>
      <radialGradient
        :id="`paint0_radial_1441_5384-${id}`"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(9.00001 11.0001) rotate(42.4831) scale(257.635 294.787)"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </radialGradient>
      <radialGradient
        :id="`paint1_radial_1441_5384-${id}`"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(9.00001 11.0001) rotate(42.4831) scale(257.635 294.787)"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </radialGradient>
      <radialGradient
        :id="`paint2_radial_1441_5384-${id}`"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(9.00001 11.0001) rotate(42.4831) scale(257.635 294.787)"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </radialGradient>
      <radialGradient
        :id="`paint3_radial_1441_5384-${id}`"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(9.00001 11.0001) rotate(42.4831) scale(257.635 294.787)"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </radialGradient>
      <radialGradient
        :id="`paint4_radial_1441_5384-${id}`"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(9.00001 11.0001) rotate(42.4831) scale(257.635 294.787)"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </radialGradient>
      <radialGradient
        :id="`paint5_radial_1441_5384-${id}`"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(9.00001 11.0001) rotate(42.4831) scale(257.635 294.787)"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </radialGradient>
    </defs>
  </svg>
</template>
