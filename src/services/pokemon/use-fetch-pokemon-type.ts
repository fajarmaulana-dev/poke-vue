import { POKEMON_TYPES } from '@/constants/pokemon'

import { pokeApi } from '../instance'

export type PokemonTypeResponse = {
  pokemon: {
    pokemon: { name: string }
  }[]
}

export const useFetchPokemonType = () => {
  const { mutate, isLoading, error } = pokeApi.batch<PokemonTypeResponse[]>(POKEMON_TYPES.map(type => `/type/${type}`))

  return {
    mutatePokemonType: mutate,
    isLoadingPokemonType: isLoading,
    errorPokemonType: error,
  }
}
