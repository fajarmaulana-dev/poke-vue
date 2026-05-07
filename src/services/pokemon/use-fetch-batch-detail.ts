import { pokeApi } from '../instance'
import type { PokemonDetailResponse } from './use-fetch-pokemon-detail'

export const useFetchBatchDetail = () => {
  const { mutate, isLoading, error } = pokeApi.batch<PokemonDetailResponse[]>()

  return {
    mutateBatchDetail: mutate,
    isLoadingBatchDetail: isLoading,
    errorBatchDetail: error,
  }
}
