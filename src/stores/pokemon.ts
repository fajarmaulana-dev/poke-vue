import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import type { Pokemon } from '@/features/main/types'

export const usePokemonStore = defineStore('pokemon', () => {
  const favorites = ref<Pokemon[]>(JSON.parse(localStorage.getItem('fav-pokemons') || '[]'))
  const catches = ref<Pokemon[]>([])
  const favorite = ref<Pokemon>()
  const catched = ref<Pokemon>()

  const addToFavorites = (pokemon: Pokemon) => {
    if (favorites.value.find(p => p.id === pokemon.id)) return
    favorites.value.push(pokemon)
  }

  const removeFromFavorites = (id: string) => {
    favorites.value = favorites.value.filter(p => p.id !== id)
  }

  const addToCatches = (pokemon: Pokemon) => {
    if (catches.value.find(p => p.id === pokemon.id)) return
    catches.value.push(pokemon)
  }

  const removeFromCatches = (id: string) => {
    catches.value = catches.value.filter(p => p.id !== id)
  }

  const updateFavorite = (pokemon: Pokemon) => {
    favorite.value = pokemon
  }

  const updateCatched = (pokemon: Pokemon) => {
    catched.value = pokemon
  }

  watch(
    favorites,
    val => {
      localStorage.setItem('fav-pokemons', JSON.stringify(val))
    },
    { deep: true },
  )

  return {
    favorites,
    catches,
    favorite,
    catched,
    addToFavorites,
    removeFromFavorites,
    addToCatches,
    removeFromCatches,
    updateCatched,
    updateFavorite,
  }
})
