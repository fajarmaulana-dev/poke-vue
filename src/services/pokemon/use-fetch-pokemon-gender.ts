import { pokeApi } from '../instance'

export type PokemonGendeResponse = {
  pokemon_species_details: {
    pokemon_species: { name: string }
    rate: number
  }[]
}

export const useFetchPokemonGender = () => {
  const { mutate, isLoading, error } = pokeApi.batch<PokemonGendeResponse[]>([1, 2, 3].map(i => `/gender/${i}`))

  return {
    mutatePokemonGender: mutate,
    isLoadingPokemonGender: isLoading,
    errorPokemonGender: error,
  }
}
