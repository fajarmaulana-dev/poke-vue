<script setup lang="ts">
import { LogOut } from '@iconoir/vue'
import { provide } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'

import { Toast } from '@/components/common'
import { EStatus } from '@/types/enum'

import { ERROR_TOAST_ID } from '../config'
import { usePokemon } from '../hooks/use-pokemon'
import Favorite from './favorite.vue'
import Pokemon from './pokemon.vue'
import Profile from './profile.vue'
import SavedPokemon from './saved-pokemon.vue'

const route = useRoute()
const router = useRouter()

const context = usePokemon()
provide('pokemonContext', context)

const { currentPagePosition, currentHeaderPosition } = context
</script>

<template>
  <div class="bg-white sm:bg-slate-100 w-full min-h-screen">
    <div
      class="sm:p-5 flex sm:gap-5 max-w-screen-xl 2xl:px-0 mx-auto transition-transform duration-300
        will-change-transform sm:translate-x-0!"
      :class="currentPagePosition"
    >
      <Pokemon />
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
          <Favorite />
          <SavedPokemon />
        </div>
        <Profile />
      </div>
    </div>
    <Toast :id="ERROR_TOAST_ID" :type="EStatus.Error">
      Gagal mengambil data Pokemon. Silakan periksa koneksi internet Anda atau coba lagi nanti.
    </Toast>
  </div>
</template>
