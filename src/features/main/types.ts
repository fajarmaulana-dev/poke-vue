import type { SelectOption } from '@/components/common'

export type Pokemon = {
  id: string
  image: string
  name: string
  types: string[]
  spreads: string[]
}

export type Favourite = {
  id: string
  state: boolean
  date: string
}

export type MyPokemon = Omit<Favourite, 'state'>

export type PokemonCard = Omit<Pokemon, 'spreads'> & {
  catch_date?: string
  with_favourite?: boolean
  favourite_date?: string
  removable?: boolean
}

export interface PokemonFilterProps {
  prefix: 'p' | 'f' | 'c'
  suffix?: string
  isLoading: boolean
  loadingFor:
    | 'search_p'
    | 'search_f'
    | 'search_c'
    | 'type_p'
    | 'type_f'
    | 'type_c'
    | 'order_p'
    | 'order_f'
    | 'order_c'
    | 'region_p'
  searchValue: string
  typeValue: string
  orderValue: string
}

export interface PokemonFilterEmits {
  (e: 'filter', data: { e: Event; type: PokemonFilterProps['loadingFor'] }): void
  (e: 'update:typeValue', value?: SelectOption['value']): void
  (e: 'update:orderValue', value?: SelectOption['value']): void
}

export interface PokemonCardEmits {
  (e: 'favourite', id: string): void
  (e: 'remove', id: string): void
  (e: 'open', id: string): void
}
