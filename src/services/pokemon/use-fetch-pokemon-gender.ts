import { pokeApi } from '../instance'

export type PokemonGenderResponse = {
  pokemon_species_details: {
    pokemon_species: { name: string }
    rate: number
  }[]
}

export const useFetchPokemonGender = () => {
  const { mutate, isLoading, error } = pokeApi.batch<PokemonGenderResponse[]>([1, 2, 3].map(i => `/gender/${i}`))

  return {
    mutatePokemonGender: mutate,
    isLoadingPokemonGender: isLoading,
    errorPokemonGender: error,
  }
}
