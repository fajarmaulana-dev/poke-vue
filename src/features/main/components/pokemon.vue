<script setup lang="ts">
import { ArrowLeft } from '@iconoir/vue'
import { ref } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import { useRoute } from 'vue-router'

import { DotsSpinner } from '@/assets/spinner'
import CircleSpinner from '@/assets/spinner/circle-spinner.vue'
import { POKEMON_REGIONS } from '@/constants/pokemon'
import { useIntersectionObserver } from '@/hooks/intersection-observer'

import type { usePokemon } from '../hooks/use-pokemon'
import PokemonCard from './pokemon-card.vue'
import PokemonFilter from './pokemon-filter.vue'

const route = useRoute()

const {
  pokemons,
  isLoading,
  isLoadingMore,
  isLoadingFilter,
  loadingFor,
  loadingMoreFor,
  isLastData,
  currentFilter,
  loadMoreData,
  addToFavorite,
  removeFromFavorite,
  isFavorite,
  currentHeaderPosition,
  REGIONS,
  selectedMainType,
  selectedMainOrder,
  selectedRegion,
  selectedFavouriteType,
  selectedFavouriteOrder,
  selectedCatchedType,
  selectedCatchedOrder,
  handleSelectFilter,
  handleFilterEnter,
} = inject('pokemonContext') as ReturnType<typeof usePokemon>

const pokemonByRegion = ref<HTMLDivElement>()
const loadMorePokemon = ref<HTMLDivElement>()
const loadMorePokemonByRegion = ref<HTMLDivElement>()

useIntersectionObserver([loadMorePokemon, loadMorePokemonByRegion], () => {
  if (isLoading.value || isLoadingFilter.value) return
  loadMoreData('p')
})
</script>

<template>
  <div
    class="bg-white relative z-3 flex flex-col sm:rounded-2xl h-[calc(100vh-52px)] xs:h-[calc(100vh-60px)]
      sm:h-[calc(100vh-40px)] shrink-0 sm:shrink w-full sm:w-1/2 md:w-2/3 shadow-blur-10 shadow-gray-200/40
      overflow-hidden"
  >
    <router-link
      class="fixed inset-0 bg-black/30 z-2 transition-opacity duration-300"
      :class="[currentHeaderPosition, { 'opacity-0 pointer-events-none': !route.query.filter }]"
      aria-label="filter-layer"
      :to="{ path: '/', query: { ...route.query, filter: undefined }, replace: true }"
    />
    <div
      class="fixed z-3 top-0 inset-x-0 sm:relative sm:translate-y-0 p-4 pb-0 bg-white shadow-blur-y-1 shadow-gray-200
        rounded-b-3xl sm:rounded-b-none sm:rounded-t-2xl transition-transform duration-300 will-change-transform
        sm:translate-x-0!"
      :class="[currentHeaderPosition, { '-translate-y-full': !route.query.filter }]"
    >
      <PokemonFilter
        v-model:type-value="selectedMainType"
        v-model:order-value="selectedMainOrder"
        :search-value="currentFilter.search_p || ''"
        prefix="p"
        :is-loading="isLoadingFilter"
        :loading-for="loadingFor"
        :class="['pokedex', 'favorit'].includes(route.query.page as string) ? 'hidden sm:flex' : 'flex!'"
        @enter="handleFilterEnter"
        @filter="({ e, type }) => handleSelectFilter(type, e)"
      />
      <PokemonFilter
        v-model:type-value="selectedFavouriteType"
        v-model:order-value="selectedFavouriteOrder"
        :search-value="currentFilter.search_f || ''"
        prefix="f"
        suffix="mobile"
        :is-loading="isLoadingFilter"
        :loading-for="loadingFor"
        :class="['sm:hidden', { hidden: route.query.page !== 'favorit' }]"
        @filter="({ e, type }) => handleSelectFilter(type, e)"
      />
      <PokemonFilter
        v-model:type-value="selectedCatchedType"
        v-model:order-value="selectedCatchedOrder"
        :search-value="currentFilter.search_c || ''"
        prefix="c"
        suffix="mobile"
        :is-loading="isLoadingFilter"
        :loading-for="loadingFor"
        :class="['sm:hidden', { hidden: route.query.page !== 'pokedex' }]"
        @filter="({ e, type }) => handleSelectFilter(type, e)"
      />
      <div class="hidden p-4 pt-0 -mx-4 sm:flex gap-2 overflow-x-auto no-scroll">
        <button
          v-for="region in REGIONS"
          :key="region"
          class="relative h-8 text-sm whitespace-nowrap w-full px-2.5 rounded-full grid place-items-center border-2
            transition duration-300 disabled:opacity-60"
          :disabled="isLoadingFilter"
          :class="
            selectedRegion === region
              ? 'text-slate-800 bg-rose-200 border-rose-200 font-semibold'
              : `border-slate-500/60 text-slate-500/60 bg-white font-medium hover:border-slate-500 hover:text-slate-500
                active:border-slate-600 active:text-slate-600`
          "
          @click="() => handleSelectFilter('region_p', { value: region.includes(' ') ? '' : region })"
        >
          {{ region }}
        </button>
      </div>
    </div>
    <div
      class="overflow-y-auto px-4 mt-16 pt-4 pb-11 xs:pb-14 sm:mt-0 sm:p-4 poke-cards poke-cards-p"
      :class="{ 'flex-1 flex items-center justify-center': isLoading || !pokemons.length }"
    >
      <div v-if="isLoading || !pokemons.length" class="w-full flex justify-center items-center flex-col gap-6">
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
      <div class="flex flex-wrap md:grid md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-4 sm:gap-5">
        <PokemonCard
          v-for="pokemon in pokemons"
          :id="pokemon.id"
          :key="pokemon.id"
          :name="pokemon.name"
          :types="pokemon.types"
          :image="pokemon.image"
          with_favourite
          :favourite_date="isFavorite(pokemon.id) ? 'active' : ''"
          @favourite="() => (isFavorite(pokemon.id) ? removeFromFavorite(pokemon.id) : addToFavorite(pokemon))"
        />
      </div>
      <div
        v-show="pokemons.length"
        ref="loadMorePokemon"
        class="grid place-items-center w-full overflow-hidden"
        :class="isLastData['p'] ? 'h-0' : 'h-10'"
      >
        <DotsSpinner
          v-if="(isLoadingFilter && loadingFor.endsWith('p')) || (isLoadingMore && loadingMoreFor === 'p')"
          class="*:fill-fill-1 w-14 h-auto translate-y-3"
        />
      </div>
    </div>
  </div>
  <div
    class="flex shrink-0 max-w-full relative sm:hidden transition-transform duration-300 will-change-transform"
    :class="{ '-translate-x-full': route.query.page === 'wilayah' && route.query.region_p && !isLoadingFilter }"
  >
    <div class="h-[calc(100vh-60px)] min-w-full overflow-y-auto p-5 pb-21 mt-15">
      <strong class="text-lg xs:text-xl">Wilayah</strong>
      <p class="text-sm xs:text-base mt-1 mb-6">Jelajahi wilayah tertentu untuk menemukan pokemon yang kamu inginkan</p>
      <button
        v-for="(region, idx) in POKEMON_REGIONS"
        :key="idx"
        :aria-label="region"
        class="h-32 w-full rounded-2xl overflow-hidden shadow-blur-10 shadow-gray-200 px-6 py-4 transition duration-300
          group cursor-pointer relative flex items-center gap-3 xs:gap-5 justify-between bg-cover bg-center bg-no-repeat
          mb-4 last:mb-0 before:absolute before:inset-0 before:bg-linear-to-r before:from-black/80 before:to-black/20"
        :style="{ backgroundImage: `url(https://res.cloudinary.com/dxa4bdtdx/image/upload/${region}.avif)` }"
        @click="
          () => {
            pokemonByRegion?.scrollTo({ top: 0 })
            handleSelectFilter('region_p', { value: region })
          }
        "
      >
        <div class="text-white relative">
          <div class="flex items-center gap-2">
            <b class="text-lg xs:text-xl capitalize">{{ region }}</b>
            <CircleSpinner v-if="isLoadingFilter && route.query.region_p === region" class="size-4! xs:size-5!" />
          </div>
          <span class="text-sm xs:text-base whitespace-nowrap">Generasi ke-{{ idx + 1 }}</span>
        </div>
        <div class="flex flex-wrap items-center justify-end w-48 relative">
          <img
            v-for="i in 3"
            :key="`${idx}-${i}`"
            :src="`https://res.cloudinary.com/dxa4bdtdx/image/upload/${region}-0${i}.avif`"
            :alt="`${region}-0${i}`"
            width="64"
            height="64"
            class="w-10 h-10 xs:w-16 xs:h-16"
          />
        </div>
      </button>
    </div>
    <div
      ref="pokemonByRegion"
      class="overflow-y-auto h-[calc(100vh-120px)] min-w-full p-4 mt-16 sm:mt-0 poke-cards poke-cards-p"
      :class="{ 'flex-1 flex items-center justify-center': isLoading || !pokemons.length }"
    >
      <div v-if="isLoading || !pokemons.length" class="w-full flex justify-center items-center flex-col gap-6">
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
      <div class="flex flex-wrap md:grid md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-4 sm:gap-5">
        <PokemonCard
          v-for="pokemon in pokemons"
          :id="pokemon.id"
          :key="pokemon.id"
          :name="pokemon.name"
          :types="pokemon.types"
          :image="pokemon.image"
          with_favourite
          :favourite_date="isFavorite(pokemon.id) ? 'active' : ''"
          @favourite="() => (isFavorite(pokemon.id) ? removeFromFavorite(pokemon.id) : addToFavorite(pokemon))"
        />
      </div>
      <div
        v-show="pokemons.length"
        ref="loadMorePokemonByRegion"
        class="grid place-items-center w-full overflow-hidden"
        :class="isLastData['p'] ? 'h-0' : 'h-10'"
      >
        <DotsSpinner
          v-if="(isLoadingFilter && loadingFor.endsWith('p')) || (isLoadingMore && loadingMoreFor === 'p')"
          class="*:fill-fill-1 w-14 h-auto translate-y-3"
        />
      </div>
      <router-link
        to="/?page=wilayah"
        class="flex w-fit px-4 items-center gap-2 h-14 rounded-2xl bg-rose-200 hover:bg-rose-300 active:bg-rose-300/80
          transition-colors duration-300 sticky bottom-0 ml-auto right-0 shadow-blur-4 shadow-black/10 z-1"
      >
        <ArrowLeft class="h-3.75 w-3.75 text-fill-1 stroke-4" />
        <b class="font-medium text-fill-1 text-lg xs:text-xl capitalize">{{ route.query.region_p }}</b>
      </router-link>
    </div>
  </div>
</template>
