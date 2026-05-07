import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import type { Pokemon } from '@/features/main/types'

export const usePokemonStore = defineStore('pokemon', () => {
  const favorites = ref<Pokemon[]>(JSON.parse(localStorage.getItem('fav-pokemons') || '[]'))
  const catched = ref<Pokemon[]>([])

  const addToFavorite = (pokemon: Pokemon) => {
    if (favorites.value.find(p => p.id === pokemon.id)) return
    favorites.value.push(pokemon)
  }

  const removeFromFavorite = (id: string) => {
    favorites.value = favorites.value.filter(p => p.id !== id)
  }

  const addToCatched = (pokemon: Pokemon) => {
    if (catched.value.find(p => p.id === pokemon.id)) return
    catched.value.push(pokemon)
  }

  const removeFromCatched = (id: string) => {
    catched.value = catched.value.filter(p => p.id !== id)
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
    catched,
    addToFavorite,
    removeFromFavorite,
    addToCatched,
    removeFromCatched,
  }
})
