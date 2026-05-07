import { POKEMON_REGIONS } from '@/constants/pokemon'

import { pokeApi } from '../instance'

export type PokemonRegionResponse = {
  pokedexes: { name: string; url: string }[]
}

export const useFetchPokemonRegion = () => {
  const { mutate, isLoading, error } = pokeApi.batch<PokemonRegionResponse[]>(
    POKEMON_REGIONS.map((_, i) => `/region/${i + 1}`),
  )

  return {
    mutatePokemonRegion: mutate,
    isLoadingPokemonRegion: isLoading,
    errorPokemonRegion: error,
  }
}
