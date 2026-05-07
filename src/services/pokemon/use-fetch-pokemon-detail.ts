import { pokeApi } from '../instance'

export type PokemonDetailResponse = {
  pokemon_entries: {
    pokemon_species: { name: string }
  }[]
}

export const useFetchPokemonDetail = (id: number) => {
  const { data, isLoading, error, refetch } = pokeApi.fetch<PokemonDetailResponse>('/pokedex/' + id)

  return {
    refetchPokemonDetail: refetch,
    pokemonDetail: data,
    isLoadingPokemonDetail: isLoading,
    errorPokemonDetail: error,
  }
}
