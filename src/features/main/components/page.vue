<script setup lang="ts">
import { ArrowLeft, Heart, Key, LogOut, Plus, Pokeball, User } from '@iconoir/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { DotsSpinner } from '@/assets/spinner'
import CircleSpinner from '@/assets/spinner/circle-spinner.vue'
import { Switch, Toast } from '@/components/common'
import FormInput from '@/components/common/form-input.vue'
import FormWrapper from '@/components/common/form-wrapper.vue'
import { POKEMON_REGIONS } from '@/constants/pokemon'
import { EStatus } from '@/types/enum'

import { ERROR_TOAST_ID, FILTER_OPTIONS, SORT_OPTIONS } from '../config'
import { usePokemon } from '../hooks/use-pokemon'
import type { PokemonFilterProps } from '../types'
import PokemonCard from './pokemon-card.vue'
import PokemonFilter from './pokemon-filter.vue'

const route = useRoute()
const router = useRouter()

const TABS = [
  { id: 'profile', label: 'Profil' },
  { id: 'password', label: 'Ubah Sandi' },
] as const

const activeTab = ref<(typeof TABS)[number]['id']>('profile')
const activeTabIndex = computed(() => TABS.findIndex(tab => tab.id === activeTab.value))

const {
  pokemons,
  favourites,
  catches,
  isLoading,
  isLoadingMore,
  isLoadingFilter,
  loadingFor,
  isLastData,
  currentFilter,
  updateFilter,
  loadMoreData,
  addToFavorite,
  removeFromFavorite,
  allFavorites,
} = usePokemon()

const isFavorite = (id: string) => !!allFavorites.value.find(f => f.id === id)

const currentPagePosition = computed(() => {
  const page = route.query.page as string
  if (page === 'wilayah') return '-translate-x-full'
  if (['pokedex', 'favorit'].includes(page)) return '-translate-x-[200%]'
  return 'translate-x-0'
})

const currentHeaderPosition = computed(() => {
  const page = route.query.page as string
  if (page === 'wilayah') return 'translate-x-full'
  if (['pokedex', 'favorit'].includes(page)) return 'translate-x-[200%]'
  return 'translate-x-0'
})

const currentProfilePosition = computed(() => {
  const isProfile = route.query.is_profile as string
  const page = route.query.page as string
  if (page === 'wilayah')
    return isProfile ? 'translate-x-full sm:translate-x-0' : 'translate-x-[200%] sm:translate-x-full'
  if (['pokedex', 'favorit'].includes(page))
    return isProfile ? 'translate-x-[200%] sm:translate-x-0' : 'translate-x-[300%] sm:translate-x-full'
  return isProfile ? 'translate-x-0' : 'translate-x-full'
})

const REGIONS = ['Semua Wilayah', ...POKEMON_REGIONS]
const selectedMainType = computed(() => currentFilter.value.type_p?.toString() || FILTER_OPTIONS[0].value)
const selectedMainOrder = computed(() => currentFilter.value.order_p?.toString() || SORT_OPTIONS[0].value)
const selectedRegion = computed(() => currentFilter.value.region_p?.toString() || REGIONS[0])
const selectedFavouriteType = computed(() => currentFilter.value.type_f?.toString() || FILTER_OPTIONS[0].value)
const selectedFavouriteOrder = computed(() => currentFilter.value.order_f?.toString() || SORT_OPTIONS[0].value)
const selectedCatchedType = computed(() => currentFilter.value.type_c?.toString() || FILTER_OPTIONS[0].value)
const selectedCatchedOrder = computed(() => currentFilter.value.order_c?.toString() || SORT_OPTIONS[0].value)

const handleSelectFilter = (type: PokemonFilterProps['loadingFor'], e: Event | { value: string }) => {
  const target = e instanceof Event ? (e.target as HTMLInputElement) : e
  updateFilter({ [type]: target.value })
}

const pokemonByRegion = ref<HTMLDivElement>()
const loadMorePokemon = ref<HTMLDivElement>()
const loadMorePokemonByRegion = ref<HTMLDivElement>()
const loadMoreFavourite = ref<HTMLDivElement>()
const loadMoreCatched = ref<HTMLDivElement>()
let observer: IntersectionObserver | null = null
onMounted(() => {
  const entryMap = { p_m: loadMorePokemon, p_r: loadMorePokemonByRegion, f: loadMoreFavourite, c: loadMoreCatched }
  observer = new IntersectionObserver(
    entries => {
      if (isLoading.value || isLoadingFilter.value) return
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const matchingEntry = Object.entries(entryMap).find(([_, target]) => target.value === entry.target)

        if (!matchingEntry) return
        const [prefix] = matchingEntry
        loadMoreData(prefix.split('_')[0] as PokemonFilterProps['prefix'])
      })
    },
    { threshold: 0.5 },
  )

  Object.values(entryMap).forEach(entry => {
    if (entry.value && observer) observer.observe(entry.value)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="bg-white sm:bg-slate-100 w-full min-h-screen">
    <div
      class="sm:p-5 flex sm:gap-5 max-w-screen-xl 2xl:px-0 mx-auto transition-transform duration-300
        will-change-transform sm:translate-x-0!"
      :class="currentPagePosition"
    >
      <div
        class="bg-white relative z-3 flex flex-col sm:rounded-2xl h-[calc(100vh-60px)] sm:h-[calc(100vh-40px)] shrink-0
          sm:shrink w-full sm:w-1/2 md:w-2/3 shadow-blur-10 shadow-gray-200/40 overflow-hidden"
      >
        <router-link
          class="fixed inset-0 bg-black/30 z-2 transition-opacity duration-300"
          :class="[currentHeaderPosition, { 'opacity-0 pointer-events-none': !route.query.filter }]"
          aria-label="filter-layer"
          :to="{ path: '/', query: { ...route.query, filter: undefined } }"
        />
        <div
          class="fixed z-3 top-0 inset-x-0 sm:relative sm:translate-y-0 p-4 pb-0 bg-white shadow-blur-y-1
            shadow-gray-200 rounded-b-3xl sm:rounded-b-none sm:rounded-t-2xl transition-transform duration-300
            will-change-transform sm:translate-x-0!"
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
                  : `border-slate-500/60 text-slate-500/60 bg-white font-medium hover:border-slate-500
                    hover:text-slate-500 active:border-slate-600 active:text-slate-600`
              "
              @click="() => handleSelectFilter('region_p', { value: region.includes(' ') ? '' : region })"
            >
              {{ region }}
            </button>
          </div>
        </div>
        <div
          class="overflow-y-auto px-4 mt-16 pt-4 pb-16 sm:mt-0 sm:p-4 poke-cards"
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
              v-if="(isLoadingFilter || isLoadingMore) && loadingFor.endsWith('p')"
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
          <p class="text-sm xs:text-base mt-1 mb-6">
            Jelajahi wilayah tertentu untuk menemukan pokemon yang kamu inginkan
          </p>
          <button
            v-for="(region, idx) in POKEMON_REGIONS"
            :key="idx"
            :aria-label="region"
            class="h-32 w-full rounded-2xl overflow-hidden shadow-blur-10 shadow-gray-200 px-6 py-4 transition
              duration-300 group cursor-pointer relative flex items-center gap-3 xs:gap-5 justify-between bg-cover
              bg-center bg-no-repeat mb-4 last:mb-0 before:absolute before:inset-0 before:bg-linear-to-r
              before:from-black/80 before:to-black/20"
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
          class="overflow-y-auto h-[calc(100vh-120px)] min-w-full p-4 mt-16 sm:mt-0 poke-cards"
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
              v-if="(isLoadingFilter || isLoadingMore) && loadingFor.endsWith('p')"
              class="*:fill-fill-1 w-14 h-auto translate-y-3"
            />
          </div>
          <router-link
            to="/?page=wilayah"
            class="flex w-fit px-4 items-center gap-2 h-14 rounded-2xl bg-rose-200 hover:bg-rose-300
              active:bg-rose-300/80 transition-colors duration-300 sticky bottom-0 ml-auto right-0 shadow-blur-4
              shadow-black/10 z-1"
          >
            <ArrowLeft class="h-3.75 w-3.75 text-fill-1 stroke-4" />
            <b class="font-medium text-fill-1 text-lg xs:text-xl capitalize">{{ route.query.region_p }}</b>
          </router-link>
        </div>
      </div>
      <div
        class="shrink-0 sm:shrink w-full sm:w-1/2 md:w-1/3 md:min-w-97 h-screen sm:h-full relative bg-white
          sm:bg-transparent overflow-x-hidden"
      >
        <div
          class="flex justify-between gap-3 sm:gap-4 items-center px-4 py-2 sm:p-0 sm:pt-2 sm:pl-2 fixed top-0 inset-x-0
            bg-white sm:relative sm:bg-transparent shadow-blur-y-1 shadow-gray-200 sm:shadow-none mb-4 sm:translate-x-0!
            transition-transform duration-300"
          :class="[currentHeaderPosition, route.query.filter ? 'z-2' : 'z-3']"
        >
          <button
            class="flex items-center gap-2 sm:gap-4 group w-[calc(100%-52px)] sm:w-[calc(100%-64px)]"
            @click="router.push({ query: { ...route.query, is_profile: 'true' } })"
          >
            <div class="relative shrink-0 w-12 h-12 scale-70 sm:scale-100">
              <svg
                viewBox="0 0 50 50"
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 -rotate-90"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="23"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  class="text-rose-200"
                />
                <circle
                  cx="25"
                  cy="25"
                  r="23"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-dasharray="144.5"
                  stroke-dashoffset="144.5"
                  style="transition: stroke-dashoffset 0.5s ease-in-out"
                  class="text-fill-1 group-hover:[stroke-dashoffset:0]"
                />
              </svg>
              <span class="block w-full h-full rounded-full overflow-hidden relative z-1">
                <img
                  src="https://res.cloudinary.com/dxa4bdtdx/image/upload/hisui-02.avif"
                  alt="logo"
                  class="object-cover object-center w-full h-full"
                />
              </span>
            </div>
            <div class="flex-1 overflow-hidden">
              <p class="font-bold sm:text-lg text-slate-800 truncate text-left">Fajar Maulana</p>
              <p class="text-xs sm:text-sm text-gray-500 truncate text-left">fajarmaulana.dev@gmail.com</p>
            </div>
          </button>
          <button
            class="w-10 sm:w-12 shrink-0 h-10 sm:h-12 grid place-items-center bg-rose-200 hover:bg-rose-300/80
              active:bg-rose-300 transition-colors duration-300 rounded-lg"
          >
            <LogOut class="w-6 sm:w-8 h-auto stroke-2" />
          </button>
        </div>
        <div
          class="flex sm:flex-col sm:gap-3.5 h-full transition-transform duration-300 will-change-transform"
          :class="{ '-translate-x-full sm:translate-x-0': route.query.page === 'pokedex' }"
        >
          <div
            class="relative overflow-hidden rounded-2xl transition-all duration-300 w-full shrink-0 sm:shrink"
            :class="
              !route.query.page || route.query.page !== 'pokedex' ? 'h-full sm:h-[calc(100vh-206px)]' : 'h-full sm:h-20'
            "
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
                class="overflow-y-auto poke-cards mt-16 p-4 pb-18 sm:mt-0 sm:p-4! max-h-[calc(100vh-124px)]
                  sm:max-h-none"
                :class="{ 'flex-1 flex items-center justify-center': isLoading || !favourites.length }"
              >
                <div
                  v-if="isLoading || !favourites.length"
                  class="w-full flex justify-center items-center flex-col gap-6"
                >
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
                    v-if="(isLoadingFilter || isLoadingMore) && loadingFor.endsWith('f')"
                    class="*:fill-fill-1 w-14 h-auto translate-y-3"
                  />
                </div>
              </div>
            </div>
            <router-link
              :to="{ query: { ...route.query, page: 'favorit' } }"
              class="absolute left-0 top-0 h-20 w-full bg-rose-200 text-slate-800 hover:bg-rose-300/80
                active:bg-rose-300 sm:transition sm:duration-300 sm:will-change-transform rounded-2xl shadow-blur-10
                shadow-gray-200/40 px-4 items-center justify-between gap-2 text-xl font-bold capitalize hidden sm:flex"
              :class="!route.query.page || route.query.page !== 'pokedex' ? '-translate-y-20' : 'translate-y-0'"
            >
              Favorit
              <Heart class="w-8 h-8 stroke-3" />
            </router-link>
          </div>
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
                class="overflow-y-auto poke-cards mt-16 p-4 pb-18 sm:mt-0 sm:p-4! max-h-[calc(100vh-124px)]
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
                    v-if="(isLoadingFilter || isLoadingMore) && loadingFor.endsWith('c')"
                    class="*:fill-fill-1 w-14 h-auto translate-y-3"
                  />
                </div>
              </div>
            </div>
            <router-link
              :to="{ query: { ...route.query, page: 'pokedex' } }"
              class="absolute left-0 bottom-0 h-20 w-full bg-rose-200 text-slate-800 hover:bg-rose-300/80
                active:bg-rose-300 sm:transition sm:duration-300 sm:will-change-transform rounded-2xl shadow-blur-10
                shadow-gray-200/40 px-4 items-center justify-between gap-2 text-xl font-bold capitalize hidden sm:flex"
              :class="route.query.page === 'pokedex' ? 'translate-y-20' : 'translate-y-0'"
            >
              Pokedex
              <Pokeball class="w-8 h-8 stroke-3" />
            </router-link>
          </div>
        </div>
        <div
          class="fixed sm:absolute flex inset-0 bottom-13 xs:bottom-15 sm:bottom-0 bg-white z-3 rounded-xl
            overflow-hidden transition-transform duration-300"
          :class="currentProfilePosition"
        >
          <FormWrapper
            class="flex flex-col min-w-full p-4 pb-0 h-full transition-transform duration-300"
            :style="{ transform: `translateX(-${activeTabIndex * 100}%)` }"
          >
            <div class="flex gap-4 items-center justify-between">
              <button
                class="flex items-center font-semibold text-fill-1 xs:text-lg group shrink-0"
                @click="router.push({ query: { ...route.query, is_profile: undefined } })"
              >
                <i
                  class="w-7 h-7 rounded-full grid place-items-center group-hover:bg-fill-0/20 group-active:bg-fill-0/40
                    transition duration-300 -translate-x-1"
                >
                  <ArrowLeft class="h-4 w-auto text-fill-1 stroke-4" />
                </i>
                <span class="ml-1">{{ TABS[activeTabIndex].label }}</span>
              </button>
              <button
                class="h-9 font-semibold grid place-items-center rounded-full bg-rose-200 text-slate-800
                  hover:bg-rose-300/80 active:bg-rose-300 transition duration-300 px-4 disabled:opacity-50 shrink-0"
              >
                Simpan
              </button>
            </div>
            <div class="py-5 flex flex-col gap-5 items-center border-b-4 border-slate-200">
              <div class="w-36 h-36 bg-slate-200 rounded-full grid place-items-center relative">
                <User class="text-slate-500 stroke-2 w-24 h-24" />
                <label
                  class="w-13.5 h-13.5 rounded-full grid place-items-center bg-rose-400 hover:bg-rose-500
                    transition-colors duration-300 active:bg-rose-600 absolute bottom-0 right-0 border-5 border-white"
                >
                  <input
                    accept="image/*"
                    type="file"
                    name="profile-picture"
                    class="hidden"
                    @click="({ target }: any) => (target.value = null)"
                  />
                  <CircleSpinner />
                  <Plus class="text-white w-9 h-9 stroke-3" />
                </label>
              </div>
              <FormInput id="name" name="name" placeholder="Masukkan namamu ..." class="w-full lg:max-w-9/10">
                <template #prefix>
                  <User class="h-4.5 w-4.5 stroke-3 *:stroke-slate-500/90" />
                </template>
              </FormInput>
            </div>
            <div class="flex-1 flex flex-col justify-between min-h-0">
              <div class="flex-1 overflow-y-auto min-h-0">
                <b class="block mt-6 xs:text-lg font-bold">Autentikasi</b>
                <div class="mt-4 flex items-center justify-between gap-6 border-b-2 border-slate-200 pb-2.5">
                  <div>
                    <b class="text-sm xs:text-base font-semibold">Login dengan Biometrik</b>
                    <p class="text-xs xs:text-sm">Aktivasi fitur login dengan biometrik.</p>
                  </div>
                  <Switch id="biometric" name="biometric" />
                </div>
                <div class="mt-4 flex items-center justify-between gap-6 border-b-2 border-slate-200 pb-2.5">
                  <div>
                    <b class="text-sm xs:text-base font-semibold">Login dengan 2FA</b>
                    <p class="text-xs xs:text-sm">
                      Aktivasi perlindungan ekstra dengan permintaan kode OTP tiap kali login.
                    </p>
                  </div>
                  <Switch id="2fa" name="2fa" />
                </div>
              </div>
              <div class="flex justify-center items-center h-14 shrink-0">
                <div class="flex p-1 bg-slate-100 rounded-full relative w-full h-10">
                  <button
                    v-for="tab in TABS"
                    :key="tab.id"
                    type="button"
                    class="relative z-1 flex-1 h-full text-sm font-bold transition-colors duration-300"
                    :class="activeTab === tab.id ? 'text-fill-1' : 'text-slate-500'"
                    @click="activeTab = tab.id"
                  >
                    {{ tab.label }}
                  </button>
                  <div
                    class="absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300"
                    :style="{
                      left: `calc(${(activeTabIndex * 100) / TABS.length}% + 4px)`,
                      width: `calc(${100 / TABS.length}% - 8px)`,
                    }"
                  />
                </div>
              </div>
            </div>
          </FormWrapper>
          <FormWrapper
            class="flex flex-col min-w-full p-4 pb-0 h-full transition-transform duration-300"
            :style="{ transform: `translateX(-${activeTabIndex * 100}%)` }"
          >
            <div class="flex gap-4 items-center justify-between">
              <button
                class="flex items-center font-semibold text-fill-1 xs:text-lg group shrink-0"
                @click="router.push({ query: { ...route.query, is_profile: undefined } })"
              >
                <i
                  class="w-7 h-7 rounded-full grid place-items-center group-hover:bg-fill-0/20 group-active:bg-fill-0/40
                    transition duration-300 -translate-x-1"
                >
                  <ArrowLeft class="h-4 w-auto text-fill-1 stroke-4" />
                </i>
                <span class="ml-1">{{ TABS[activeTabIndex].label }}</span>
              </button>
              <button
                class="h-9 font-semibold grid place-items-center rounded-full bg-rose-200 text-slate-800
                  hover:bg-rose-300/80 active:bg-rose-300 transition duration-300 px-4 disabled:opacity-50 shrink-0"
              >
                Simpan
              </button>
            </div>
            <div class="flex-1 overflow-y-auto mt-6">
              <div class="flex flex-col gap-5">
                <FormInput
                  id="current_password"
                  name="current_password"
                  type="password"
                  label="Kata Sandi Sekarang"
                  placeholder="Masukkan kata sandi sekarang ..."
                >
                  <template #prefix>
                    <Key class="h-4.5 w-4.5 stroke-3 *:stroke-slate-500/90" />
                  </template>
                </FormInput>
                <FormInput
                  id="new_password"
                  name="new_password"
                  type="password"
                  label="Kata Sandi Baru"
                  placeholder="Masukkan kata sandi baru ..."
                >
                  <template #prefix>
                    <Key class="h-4.5 w-4.5 stroke-3 *:stroke-slate-500/90" />
                  </template>
                </FormInput>
                <FormInput
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  label="Konfirmasi Kata Sandi Baru"
                  placeholder="Ulangi kata sandi baru ..."
                >
                  <template #prefix>
                    <Key class="h-4.5 w-4.5 stroke-3 *:stroke-slate-500/90" />
                  </template>
                </FormInput>
              </div>
            </div>
            <div class="flex justify-center items-center h-14 shrink-0">
              <div class="flex p-1 bg-slate-100 rounded-full relative w-full h-10">
                <button
                  v-for="tab in TABS"
                  :key="tab.id"
                  type="button"
                  class="relative z-1 flex-1 h-full text-sm font-bold transition-colors duration-300"
                  :class="activeTab === tab.id ? 'text-fill-1' : 'text-slate-500'"
                  @click="activeTab = tab.id"
                >
                  {{ tab.label }}
                </button>
                <div
                  class="absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300"
                  :style="{
                    left: `calc(${(activeTabIndex * 100) / TABS.length}% + 4px)`,
                    width: `calc(${100 / TABS.length}% - 8px)`,
                  }"
                />
              </div>
            </div>
          </FormWrapper>
        </div>
      </div>
    </div>
    <Toast :id="ERROR_TOAST_ID" :type="EStatus.Error">
      Gagal mengambil data Pokemon. Silakan periksa koneksi internet Anda atau coba lagi nanti.
    </Toast>
  </div>
</template>
