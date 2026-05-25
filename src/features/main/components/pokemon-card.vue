<script setup lang="ts">
import { Heart, Pokeball, TrashSolid } from '@iconoir/vue'
import { computed, ref } from '@vue/reactivity'

import { useSlider } from '@/hooks/slider'

import { TYPE_ICONS } from '../config'
import type { PokemonCard, PokemonCardEmits } from '../types'

const props = defineProps<PokemonCard>()
const propsWithSpreads = computed(() => ({ spreads: [], ...props }))
const emit = defineEmits<PokemonCardEmits>()

const cardRef = ref<HTMLDivElement>()

const { handleAction, movement, grab } = useSlider({
  data: [],
  onNext: () => cardRef.value?.classList.add('-translate-x-16'),
  onBack: () => cardRef.value?.classList.remove('-translate-x-16'),
})

const movementStyle = computed(() => {
  let translation = 0
  if (grab) {
    translation = movement.value
    if (movement.value >= 64) translation = 64
    if (!cardRef.value?.classList.contains('-translate-x-16') && movement.value > 0) translation = 0
  }
  return {
    transform: `translateX(${translation}px)`,
    cursor: grab.value ? 'grabbing' : 'pointer',
  }
})
</script>

<template>
  <div class="relative h-32 rounded-2xl grow basis-90 md:basis-auto select-none">
    <button
      class="rounded-2xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 h-full w-full transition duration-400 flex
        items-center justify-end pr-5"
      @click="() => emit('remove', propsWithSpreads)"
    >
      <TrashSolid class="w-6 h-auto text-white" />
    </button>
    <div
      ref="cardRef"
      role="button"
      class="absolute inset-0 rounded-2xl flex items-center justify-between shadow-blur-4 shadow-gray-200
        hover:shadow-blur-10 hover:shadow-gray-300/80 transition duration-300 ease"
      :class="TYPE_ICONS[types[0]].layer"
      :style="movementStyle"
      @mousedown="e => handleAction({ e, axis: 'X' }, 'start', !removable)"
      @mousemove="e => handleAction({ e, axis: 'X' }, 'move', !removable)"
      @mouseup="e => handleAction({ e, axis: 'X' }, 'end', !removable)"
      @touchstart.passive="e => handleAction({ e, axis: 'X' }, 'start', !removable)"
      @touchmove.passive="e => handleAction({ e, axis: 'X' }, 'move', !removable)"
      @touchend.passive="e => handleAction({ e, axis: 'X' }, 'end', !removable)"
      @click="() => emit('open', id)"
    >
      <div class="p-4 overflow-hidden">
        <b class="text-sm xs:text-base font-semibold md:text-sm lg:text-base">No. {{ id }}</b>
        <strong
          class="font-bold text-base xs:text-lg md:text-base lg:text-lg xl:text-xl mb-3 capitalize truncate block"
          >{{ name }}</strong
        >
        <div class="flex gap-2 items-center">
          <div
            v-for="type in types"
            :key="type"
            class="h-8 w-fit flex items-center gap-1.5 p-1 xs:pr-2.25 sm:pr-1 md:pr-2.25 rounded-full"
            :class="TYPE_ICONS[type].bg"
          >
            <div class="h-6 w-6 bg-white rounded-full grid place-items-center">
              <component :is="TYPE_ICONS[type].icon" :size="15" :class="TYPE_ICONS[type].fill" />
            </div>
            <span class="hidden xs:block sm:hidden md:block text-white text-xs font-semibold drop-shadow capitalize">{{
              type
            }}</span>
          </div>
        </div>
      </div>
      <div
        class="relative grid place-items-center h-32 min-w-32 lg:min-w-36 rounded-2xl"
        :class="TYPE_ICONS[types[0]].bg"
      >
        <component :is="TYPE_ICONS[types[0]].icon" :size="112" class="pointer-events-none" />
        <div class="absolute inset-0 grid place-items-center pointer-events-none">
          <img :src="image" alt="pokemon" width="96" height="96" loading="lazy" />
        </div>
        <button
          v-if="with_favorite"
          class="w-8 h-8 grid place-items-center border border-white/80 rounded-full bg-white/20 backdrop-blur absolute
            group top-2 right-2"
          @click="() => emit('favorite', id)"
        >
          <Heart
            class="h-auto w-4.5 **:stroke-2 **:stroke-white transition duration-400 group-hover:scale-110
              group-active:scale-90 *:transition *:duration-400"
            :class="favorite_date ? '*:fill-fill-1' : '*:fill-transparent'"
          />
        </button>
        <i
          v-if="catch_date"
          class="w-8 h-8 grid place-items-center border border-white/80 rounded-full bg-white/20 backdrop-blur absolute
            group bottom-2 left-2"
        >
          <Pokeball class="h-auto w-4.5 **:stroke-2 **:stroke-white *:fill-fill-1" />
        </i>
      </div>
    </div>
  </div>
</template>
