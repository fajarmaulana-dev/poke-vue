<script setup lang="ts">
import { Pokeball } from '@iconoir/vue'
import { ref } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import { useRoute } from 'vue-router'

import { DotsSpinner } from '@/assets/spinner'
import CircleSpinner from '@/assets/spinner/circle-spinner.vue'
import { useIntersectionObserver } from '@/hooks/intersection-observer'

import { POKEMON_CONTEXT } from '../config'
import type { usePokemon } from '../hooks/use-pokemon'
import PokemonCard from './pokemon-card.vue'
import PokemonFilter from './pokemon-filter.vue'

const route = useRoute()

const {
  catches,
  isLoading,
  isLoadingMore,
  isLoadingFilter,
  loadingFor,
  loadingMoreFor,
  isLastData,
  currentFilter,
  loadMoreData,
  selectedCatchedType,
  selectedCatchedOrder,
  handleSelectFilter,
} = inject(POKEMON_CONTEXT) as ReturnType<typeof usePokemon>

const loadMoreCatched = ref<HTMLDivElement>()

useIntersectionObserver(loadMoreCatched, () => {
  if (isLoading.value || isLoadingFilter.value) return
  loadMoreData('c')
})
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl shrink-0 w-full sm:shrink"
    :class="route.query.page === 'pokedex' ? 'h-full sm:h-[calc(100vh-206px)]' : 'h-full sm:h-20'"
  >
    <div
      class="bg-white flex flex-col rounded-2xl h-full shadow-blur-10 shadow-gray-200/40 overflow-hidden
        sm:transition-transform sm:duration-300 will-change-transform"
      :class="route.query.page === 'pokedex' ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="p-4 shadow-blur-y-1 shadow-gray-200 rounded-t-2xl hidden sm:block">
        <b class="text-lg font-bold text-slate-800 capitalize">Pokedex</b>
        <PokemonFilter
          v-model:type-value="selectedCatchedType"
          v-model:order-value="selectedCatchedOrder"
          :search-value="currentFilter.search_c || ''"
          prefix="c"
          :is-loading="isLoadingFilter"
          :loading-for="loadingFor"
          class="pt-4 pb-0!"
          @filter="({ e, type }) => handleSelectFilter(type, e)"
        />
      </div>
      <div
        class="overflow-y-auto poke-cards poke-cards-c mt-16 p-4 pb-18 sm:mt-0 sm:p-4! max-h-[calc(100vh-124px)]
          sm:max-h-none"
        :class="{ 'flex-1 flex items-center justify-center': isLoading || !catches.length }"
      >
        <div v-if="isLoading || !catches.length" class="w-full flex justify-center items-center flex-col gap-6">
          <img
            src="https://res.cloudinary.com/dxa4bdtdx/image/upload/notfound_iav02l.avif"
            alt="not-found-main"
            height="240"
            width="279"
            class="w-45 sm:w-36 xl:w-45"
          />
          <div class="flex flex-col items-center text-center px-6">
            <b class="text-2xl text-fill-1">{{ isLoading ? 'Loading pokemon...' : '404 - Not Found' }}</b>
            <p v-if="!isLoading" class="text-slate-800 mt-1 max-w-3/4 sm:max-w-none desc-404">
              Oopss... Pokemon yang kamu cari tidak tersedia disini
            </p>
            <CircleSpinner v-else class="border-t-fill-1! border-b-fill-1! mt-2" />
          </div>
        </div>
        <div class="flex flex-wrap md:grid md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-4 xs:gap-5">
          <PokemonCard
            v-for="{ id, image, name, types } in catches"
            :id="id"
            :key="id"
            :name="name"
            :types="types"
            :image="image"
            removable
          />
        </div>
        <div
          v-show="catches.length"
          ref="loadMoreCatched"
          class="grid place-items-center w-full overflow-hidden"
          :class="isLastData['c'] ? 'h-0' : 'h-10'"
        >
          <DotsSpinner
            v-if="(isLoadingFilter && loadingFor.endsWith('c')) || (isLoadingMore && loadingMoreFor === 'c')"
            class="*:fill-fill-1 w-14 h-auto translate-y-3"
          />
        </div>
      </div>
    </div>
    <router-link
      :to="{ query: { ...route.query, page: 'pokedex' } }"
      class="absolute left-0 bottom-0 h-20 w-full bg-rose-200 text-slate-800 hover:bg-rose-300/80 active:bg-rose-300
        sm:transition sm:duration-300 sm:will-change-transform rounded-2xl shadow-blur-10 shadow-gray-200/40 px-4
        items-center justify-between gap-2 text-xl font-bold capitalize hidden sm:flex"
      :class="route.query.page === 'pokedex' ? 'translate-y-20' : 'translate-y-0'"
    >
      Pokedex
      <Pokeball class="w-8 h-8 stroke-3" />
    </router-link>
  </div>
</template>
