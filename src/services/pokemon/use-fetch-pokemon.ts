import { pokeApi } from '../instance'

export type PokemonResponse = {
  id: number
  name: string
  sprites: { front_default: string }
  types: { type: { name: string } }[]
}

export const useFetchPokemon = () => {
  const { mutate, isLoading, error } = pokeApi.batch<PokemonResponse[]>()

  return {
    mutatePokemon: mutate,
    isLoadingPokemon: isLoading,
    errorPokemon: error,
  }
}
