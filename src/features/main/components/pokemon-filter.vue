<script setup lang="ts">
import { Search } from '@iconoir/vue'

import { DropDown, FormInput } from '@/components/common'

import { FILTER_OPTIONS, SORT_OPTIONS } from '../config'
import type { PokemonFilterEmits, PokemonFilterProps } from '../types'

defineProps<PokemonFilterProps>()
const emit = defineEmits<PokemonFilterEmits>()
</script>

<template>
  <div class="flex items-center justify-between gap-4 flex-wrap pb-4">
    <FormInput
      :id="`search-${prefix}${suffix ? `-${suffix}` : ''}`"
      placeholder="Cari pokemon disini ..."
      class="[&_button]:pointer-events-none grow basis-56"
      :class="{ 'gx:max-w-98': prefix === 'p' }"
      :is-loading="isLoading && loadingFor === `search_${prefix}`"
      :model-value="searchValue"
      @keydown.enter="e => emit('enter', { e })"
      @input="e => emit('filter', { e, type: `search_${prefix}` })"
    >
      <template #prefix>
        <Search class="h-auto w-4.5 stroke-3 **:stroke-slate-500/90" />
      </template>
    </FormInput>
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 grow justify-end" :class="{ 'lg:grow-0': prefix === 'p' }">
      <DropDown
        :model-value="typeValue"
        :name="`filter-${prefix}-${suffix || ''}`"
        class="grow z-5"
        show-value
        :options="FILTER_OPTIONS"
        label-class="nth-2:bg-grass-1/50 nth-2:hover:bg-grass-1/60 nth-2:active:bg-grass-1/70
          nth-3:bg-poison-1/50 nth-3:hover:bg-poison-1/60 nth-3:active:bg-poison-1/70
          nth-4:bg-fire-1/50 nth-4:hover:bg-fire-1/60 nth-4:active:bg-fire-1/70
          nth-5:bg-flying-1/50 nth-5:hover:bg-flying-1/60 nth-5:active:bg-flying-1/70
          nth-6:bg-water-1/50 nth-6:hover:bg-water-1/60 nth-6:active:bg-water-1/70
          nth-7:bg-bug-1/50 nth-7:hover:bg-bug-1/60 nth-7:active:bg-bug-1/70
          nth-8:bg-electric-1/50 nth-8:hover:bg-electric-1/60 nth-8:active:bg-electric-1/70
          nth-9:bg-fairy-1/50 nth-9:hover:bg-fairy-1/60 nth-9:active:bg-fairy-1/70
          nth-10:bg-ground-1/50 nth-10:hover:bg-ground-1/60 nth-10:active:bg-ground-1/70
          nth-11:bg-rock-1/50 nth-11:hover:bg-rock-1/60 nth-11:active:bg-rock-1/70
          nth-12:bg-normal-1/50 nth-12:hover:bg-normal-1/60 nth-12:active:bg-normal-1/70
          nth-13:bg-psychic-1/50 nth-13:hover:bg-psychic-1/60 nth-13:active:bg-psychic-1/70
          nth-14:bg-steel-1/50 nth-14:hover:bg-steel-1/60 nth-14:active:bg-steel-1/70
          nth-15:bg-dragon-1/50 nth-15:hover:bg-dragon-1/60 nth-15:active:bg-dragon-1/70
          nth-16:bg-fighting-1/50 nth-16:hover:bg-fighting-1/60 nth-16:active:bg-fighting-1/70
          nth-17:bg-dark-1/50 nth-17:hover:bg-dark-1/60 nth-17:active:bg-dark-1/70
          nth-18:bg-ghost-1/50 nth-18:hover:bg-ghost-1/60 nth-18:active:bg-ghost-1/70
          nth-19:bg-ice-1/50 nth-19:hover:bg-ice-1/60 nth-19:active:bg-ice-1/70"
        :is-loading="isLoading && loadingFor === `type_${prefix}`"
        @input="
          e => {
            emit('filter', { e, type: `type_${prefix}` })
            console.log(`type_${prefix}`)
          }
        "
        @update:model-value="val => emit('update:typeValue', val)"
      />
      <DropDown
        :model-value="orderValue"
        :name="`sort-${prefix}-${suffix || ''}`"
        class="grow"
        :options="SORT_OPTIONS"
        :is-loading="isLoading && loadingFor === `order_${prefix}`"
        @input="e => emit('filter', { e, type: `order_${prefix}` })"
        @update:model-value="val => emit('update:orderValue', val)"
      />
    </div>
  </div>
</template>
