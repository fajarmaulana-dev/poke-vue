import type { SelectOption } from '@/components/common'

export type Pokemon = {
  id: string
  image: string
  name: string
  types: string[]
  spreads: string[]
}

export type Favorite = {
  id: string
  state: boolean
  date: string
}

export type MyPokemon = Omit<Favorite, 'state'>

export type PokemonCard = Omit<Pokemon, 'spreads'> & {
  loading?: boolean
  catch_date?: string
  with_favorite?: boolean
  favorite_date?: string
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
  (e: 'enter', data: { e: KeyboardEvent }): void
}

export interface PokemonCardEmits {
  (e: 'favorite', id: string): void
  (e: 'remove', pokemon: Pokemon): void
  (e: 'open', id: string): void
}
