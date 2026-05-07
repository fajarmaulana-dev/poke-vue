import { pokeApi } from '../instance'

export type PokemonMasterParam = {
  limit: number
}

export type PokemonMasterResponse = {
  results: {
    name: string
    url: string
  }[]
}

export const useFetchPokemonMaster = () => {
  const { mutate, isLoading, error } = pokeApi.mutation<PokemonMasterResponse, PokemonMasterParam>('/pokemon')

  return {
    mutatePokemonMaster: mutate,
    isLoadingPokemonMaster: isLoading,
    errorPokemonMaster: error,
  }
}
