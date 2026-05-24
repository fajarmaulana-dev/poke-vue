<script setup lang="ts">
import { Heart } from '@iconoir/vue'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'

import { DotsSpinner } from '@/assets/spinner'
import CircleSpinner from '@/assets/spinner/circle-spinner.vue'
import { useIntersectionObserver } from '@/hooks/intersection-observer'

import type { usePokemon } from '../hooks/use-pokemon'
import PokemonCard from './pokemon-card.vue'
import PokemonFilter from './pokemon-filter.vue'

const route = useRoute()

const {
  favourites,
  isLoading,
  isLoadingMore,
  isLoadingFilter,
  loadingFor,
  loadingMoreFor,
  isLastData,
  currentFilter,
  loadMoreData,
  removeFromFavorite,
  selectedFavouriteType,
  selectedFavouriteOrder,
  handleSelectFilter,
} = inject('pokemonContext') as ReturnType<typeof usePokemon>

const loadMoreFavourite = ref<HTMLDivElement>()

useIntersectionObserver(loadMoreFavourite, () => {
  if (isLoading.value || isLoadingFilter.value) return
  loadMoreData('f')
})
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl transition-all duration-300 w-full shrink-0 sm:shrink"
    :class="!route.query.page || route.query.page !== 'pokedex' ? 'h-full sm:h-[calc(100vh-206px)]' : 'h-full sm:h-20'"
  >
    <div
      class="bg-white flex flex-col rounded-2xl h-full shadow-blur-10 shadow-gray-200/40 overflow-hidden
        sm:transition-transform sm:duration-300 will-change-transform"
      :class="!route.query.page || route.query.page !== 'pokedex' ? 'translate-y-0' : '-translate-y-full'"
    >
      <div class="p-4 shadow-blur-y-1 shadow-gray-200 rounded-t-2xl hidden sm:block">
        <b class="text-lg font-bold text-slate-800 capitalize">Favorit</b>
        <PokemonFilter
          v-model:type-value="selectedFavouriteType"
          v-model:order-value="selectedFavouriteOrder"
          :search-value="currentFilter.search_f || ''"
          prefix="f"
          :is-loading="isLoadingFilter"
          :loading-for="loadingFor"
          class="pt-4 pb-0!"
          @filter="({ e, type }) => handleSelectFilter(type, e)"
        />
      </div>
      <div
        class="overflow-y-auto poke-cards poke-cards-f mt-16 p-4 pb-18 sm:mt-0 sm:p-4! max-h-[calc(100vh-124px)]
          sm:max-h-none"
        :class="{ 'flex-1 flex items-center justify-center': isLoading || !favourites.length }"
      >
        <div v-if="isLoading || !favourites.length" class="w-full flex justify-center items-center flex-col gap-6">
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
            v-for="pokemon in favourites"
            :id="pokemon.id"
            :key="pokemon.id"
            :name="pokemon.name"
            :types="pokemon.types"
            :image="pokemon.image"
            removable
            @remove="removeFromFavorite"
          />
        </div>
        <div
          v-show="favourites.length"
          ref="loadMoreFavourite"
          class="grid place-items-center w-full overflow-hidden"
          :class="isLastData['f'] ? 'h-0' : 'h-10'"
        >
          <DotsSpinner
            v-if="(isLoadingFilter && loadingFor.endsWith('f')) || (isLoadingMore && loadingMoreFor === 'f')"
            class="*:fill-fill-1 w-14 h-auto translate-y-3"
          />
        </div>
      </div>
    </div>
    <router-link
      :to="{ query: { ...route.query, page: 'favorit' } }"
      class="absolute left-0 top-0 h-20 w-full bg-rose-200 text-slate-800 hover:bg-rose-300/80 active:bg-rose-300
        sm:transition sm:duration-300 sm:will-change-transform rounded-2xl shadow-blur-10 shadow-gray-200/40 px-4
        items-center justify-between gap-2 text-xl font-bold capitalize hidden sm:flex"
      :class="!route.query.page || route.query.page !== 'pokedex' ? '-translate-y-20' : 'translate-y-0'"
    >
      Favorit
      <Heart class="w-8 h-8 stroke-3" />
    </router-link>
  </div>
</template>
