import { computed, ref } from '@vue/reactivity'
import { onMounted, watch } from '@vue/runtime-core'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { MOBILE_BOUND } from '@/constants'
import { POKE_FETCH_LIMIT } from '@/constants/env'
import { POKEMON_REGIONS, POKEMON_TYPES } from '@/constants/pokemon'
import { useDebounceFunc } from '@/hooks/debounce'
import { useQueryParams } from '@/hooks/router'
import {
  useFetchBatchDetail,
  useFetchPokemon,
  useFetchPokemonGender,
  useFetchPokemonMaster,
  useFetchPokemonRegion,
  useFetchPokemonType,
} from '@/services/pokemon'
import { usePokemonStore } from '@/stores/pokemon'
import { blurById, clickById } from '@/utils/general'

import { ERROR_TOAST_ID, FILTER_OPTIONS, POKE_CARD_FETCH_LIMIT, SORT_OPTIONS } from '../config'
import type { Pokemon, PokemonFilterProps } from '../types'

export const usePokemon = () => {
  const route = useRoute()

  const { mutatePokemon, isLoadingPokemon } = useFetchPokemon()
  const { mutatePokemonGender } = useFetchPokemonGender()
  const { mutatePokemonMaster } = useFetchPokemonMaster()
  const { mutatePokemonRegion } = useFetchPokemonRegion()
  const { mutatePokemonType } = useFetchPokemonType()
  const { mutateBatchDetail } = useFetchBatchDetail()

  const pokemonStore = usePokemonStore()
  const pokemons = ref<Pokemon[]>([])
  const catches = ref<Pokemon[]>([])
  const favourites = ref<Pokemon[]>([])
  const isLoading = ref(true)
  const isLoadingFilter = ref(false)
  const loadingFor = ref<PokemonFilterProps['loadingFor']>('search_p')
  const loadingMoreFor = ref<PokemonFilterProps['prefix'] | null>(null)
  const isLastData = ref({
    p: false,
    f: false,
    c: false,
  })

  const masterData = ref({
    names: [] as { name: string; id: string }[],
    spreads: {} as Record<string, string[]>,
    variants: {} as Record<string, string[]>,
    genders: [] as { name: string; possibility: number }[],
  })

  const [query, updateQuery] = useQueryParams<Record<string, string>>({
    search_p: '',
    type_p: 'semua-tipe',
    region_p: '',
    order_p: 'no-1-n',
    search_f: '',
    type_f: 'semua-tipe',
    order_f: 'no-1-n',
    search_c: '',
    type_c: 'semua-tipe',
    order_c: 'no-1-n',
  })

  const localFilter = ref({ ...query.value })

  watch(
    query,
    newQuery => {
      Object.assign(localFilter.value, newQuery)
    },
    { deep: true },
  )

  const debouncedUpdateQuery = useDebounceFunc(updateQuery, 750)

  const updateFilter = (newFilter: Record<string, string>) => {
    Object.assign(localFilter.value, newFilter)
    const isSearch = Object.keys(newFilter).some(key => key.startsWith('search_'))

    if (isSearch) return debouncedUpdateQuery(newFilter)
    updateQuery(newFilter)
  }

  const idFromUrl = (url: string) => url.split('/').slice(-2, -1)[0]

  const getData = async (ids: string[]) => {
    if (!ids.length) return []
    try {
      const pokemons = await mutatePokemon(ids.map(id => `/pokemon/${parseInt(id)}`))
      return pokemons.reduce((acc: Pokemon[], { data }) => {
        const { id, name, sprites, types: detailTypes } = data
        const image = sprites.front_default
        const poketypes = detailTypes.map(d => d.type.name)

        if (image) {
          acc.push({
            id: id.toString().padStart(4, '0'),
            name,
            image,
            types: poketypes,
            spreads: Object.keys(masterData.value.spreads).filter(s => masterData.value.spreads[s].includes(name)),
          })
        }
        return acc
      }, [])
    } catch {
      clickById(ERROR_TOAST_ID)
      return []
    }
  }

  const getUntilLimit = async (
    source: { name: string; id: string }[],
    offset: number,
    acc: Pokemon[],
  ): Promise<Pokemon[]> => {
    if (acc.length >= POKE_CARD_FETCH_LIMIT || offset >= source.length) return acc.slice(0, POKE_CARD_FETCH_LIMIT)
    const ids = source.slice(offset, offset + POKE_CARD_FETCH_LIMIT).map(p => p.id)
    if (ids.length === 0) return acc

    const newData = await getData(ids)
    const combined = [...acc, ...newData]
    if (combined.length < POKE_CARD_FETCH_LIMIT && offset + POKE_CARD_FETCH_LIMIT < source.length) {
      return getUntilLimit(source, offset + POKE_CARD_FETCH_LIMIT, combined)
    }

    return combined.slice(0, POKE_CARD_FETCH_LIMIT)
  }

  const getProcessedMasterData = (prefix: PokemonFilterProps['prefix']) => {
    const q = query.value
    const { names, spreads, variants } = masterData.value

    let source: { name: string; id: string }[] = []
    if (prefix === 'p') {
      source = names
    } else if (prefix === 'f') {
      source = pokemonStore.favorites.map(p => ({ name: p.name, id: p.id }))
    } else if (prefix === 'c') {
      source = []
    }

    let result = source.filter(p => {
      const s = q[`search_${prefix}`]?.toLowerCase()
      const t = q[`type_${prefix}`]
      const matchSearch = !s || p.name.includes(s) || p.id.includes(s)
      const matchType = !t || t === 'semua-tipe' || variants[t]?.includes(p.name)
      const matchRegion = prefix !== 'p' || !q.region_p || spreads[q.region_p]?.includes(p.name)
      return matchSearch && matchType && matchRegion
    })

    const sort = q[`order_${prefix}`]
    result.sort((a, b) => {
      if (sort === 'no-1-n') return a.id.localeCompare(b.id)
      if (sort === 'no-n-1') return b.id.localeCompare(a.id)
      if (sort === 'name-a-z') return a.name.localeCompare(b.name)
      if (sort === 'name-z-a') return b.name.localeCompare(a.name)
      return 0
    })

    return result
  }

  const fetchFilteredData = async (prefix: PokemonFilterProps['prefix']) => {
    document.querySelectorAll(`.poke-cards-${prefix}`).forEach(el => el.scrollTo({ top: 0 }))
    isLastData.value[prefix] = false
    isLoadingFilter.value = true
    const sortedMaster = getProcessedMasterData(prefix)

    const results = await getUntilLimit(sortedMaster, 0, [])
    if (prefix === 'p') pokemons.value = results
    if (prefix === 'f') favourites.value = results
    if (prefix === 'c') catches.value = results

    isLoadingFilter.value = false
  }

  const loadMoreData = async (prefix: PokemonFilterProps['prefix']) => {
    if (isLoadingFilter.value || isLoadingPokemon.value || isLastData.value[prefix]) return
    loadingMoreFor.value = prefix
    try {
      const sortedMaster = getProcessedMasterData(prefix)

      const currentList = prefix === 'p' ? pokemons.value : prefix === 'f' ? favourites.value : catches.value
      const lastPokemon = currentList[currentList.length - 1]
      if (!lastPokemon) return

      const currentIdx = sortedMaster.findIndex(p => p.id === lastPokemon.id)

      if (currentIdx === -1 || currentIdx >= sortedMaster.length - 1) {
        isLastData.value[prefix] = true
        return
      }

      const nextOffset = currentIdx + 1
      const newDetails = await getUntilLimit(sortedMaster, nextOffset, [])

      if (newDetails.length === 0) {
        isLastData.value[prefix] = true
        return
      }

      if (prefix === 'p') pokemons.value = [...pokemons.value, ...newDetails]
      if (prefix === 'f') favourites.value = [...favourites.value, ...newDetails]
      if (prefix === 'c') catches.value = [...catches.value, ...newDetails]
    } finally {
      loadingMoreFor.value = null
    }
  }

  const initData = async () => {
    isLoading.value = true
    const [pokeMaster, pokeGender, pokeRegion, pokeType] = await Promise.all([
      mutatePokemonMaster({ limit: POKE_FETCH_LIMIT }),
      mutatePokemonGender(),
      mutatePokemonRegion(),
      mutatePokemonType(),
    ])

    const pokedexRequests = pokeRegion.flatMap((res, idx) => {
      return res.data.pokedexes
        .filter(p => !p.name.includes('updated') || p.name.includes('extended'))
        .map(p => ({ url: `/pokedex/${idFromUrl(p.url)}`, regionTag: POKEMON_REGIONS[idx] }))
    })

    const pokedexResults = await mutateBatchDetail(pokedexRequests.map(r => r.url))
    const spreads: Record<string, string[]> = {}
    pokedexRequests.forEach((req, idx) => {
      const names = pokedexResults[idx].data.pokemon_entries.map(e => e.pokemon_species.name)
      spreads[req.regionTag] = [...(spreads[req.regionTag] || []), ...names]
    })

    const names = pokeMaster.data.results.map(p => ({
      name: p.name,
      id: idFromUrl(p.url).padStart(4, '0'),
    }))

    const genderMap = new Map()
    pokeGender.forEach(({ data: { pokemon_species_details } }, idx) => {
      const isFemale = idx === 1
      pokemon_species_details.forEach(d => {
        if (!genderMap.has(d.pokemon_species.name)) {
          genderMap.set(d.pokemon_species.name, isFemale ? 8 - d.rate : d.rate)
        }
      })
    })
    const genders = names.map(n => ({
      name: n.name,
      possibility: genderMap.get(n.name) ?? -2,
    }))

    const variants = Object.fromEntries(
      pokeType.map(({ data }, idx) => [POKEMON_TYPES[idx], data.pokemon.map(p => p.pokemon.name)]),
    )

    masterData.value = { names, spreads, variants, genders }

    await fetchFilteredData('p')
    await fetchFilteredData('f')
    isLoading.value = false
  }

  const addToFavorite = (pokemon: Pokemon) => {
    pokemonStore.addToFavorite(pokemon)
    fetchFilteredData('f')
  }

  const removeFromFavorite = (id: string) => {
    pokemonStore.removeFromFavorite(id)
    fetchFilteredData('f')
  }

  watch(
    () => [
      query.value.search_p,
      query.value.type_p,
      query.value.region_p,
      query.value.order_p,
      query.value.search_f,
      query.value.type_f,
      query.value.order_f,
      query.value.search_c,
      query.value.type_c,
      query.value.order_c,
    ],
    (newValues, oldValues) => {
      const changedIndex = newValues.findIndex((val, i) => val !== oldValues[i])
      if (changedIndex < 0) return
      const prefix = changedIndex <= 3 ? 'p' : changedIndex <= 6 ? 'f' : 'c'
      loadingFor.value = Object.keys(query.value)[changedIndex] as PokemonFilterProps['loadingFor']
      fetchFilteredData(prefix)
    },
  )

  watch(
    () => route.query.page,
    newValue => {
      switch (newValue) {
        case 'pokedex':
          loadingFor.value = 'search_c'
          break
        case 'favorit':
          loadingFor.value = 'search_f'
          break
        default:
          loadingFor.value = 'search_p'
          break
      }
    },
    { immediate: true },
  )

  const router = useRouter()

  const isFavorite = (id: string) => !!pokemonStore.favorites.find(f => f.id === id)

  const currentPagePosition = computed(() => {
    const page = route.query.page as string
    if (page === 'wilayah') return '-translate-x-full'
    if (['pokedex', 'favorit'].includes(page)) return '-translate-x-[200%]'
    return 'translate-x-0'
  })

  const currentHeaderPosition = computed(() => {
    const page = route.query.page as string
    if (page === 'wilayah') return 'translate-x-full'
    if (['pokedex', 'favorit'].includes(page)) return 'translate-x-[200%]'
    return 'translate-x-0'
  })

  const currentProfilePosition = computed(() => {
    const isProfile = route.query.is_profile as string
    const page = route.query.page as string
    if (page === 'wilayah')
      return isProfile ? 'translate-x-full sm:translate-x-0' : 'translate-x-[200%] sm:translate-x-full'
    if (['pokedex', 'favorit'].includes(page))
      return isProfile ? 'translate-x-[200%] sm:translate-x-0' : 'translate-x-[300%] sm:translate-x-full'
    return isProfile ? 'translate-x-0' : 'translate-x-full'
  })

  const REGIONS = ['Semua Wilayah', ...POKEMON_REGIONS]
  const selectedMainType = computed(() => localFilter.value.type_p?.toString() || FILTER_OPTIONS[0].value)
  const selectedMainOrder = computed(() => localFilter.value.order_p?.toString() || SORT_OPTIONS[0].value)
  const selectedRegion = computed(() => localFilter.value.region_p?.toString() || REGIONS[0])
  const selectedFavouriteType = computed(() => localFilter.value.type_f?.toString() || FILTER_OPTIONS[0].value)
  const selectedFavouriteOrder = computed(() => localFilter.value.order_f?.toString() || SORT_OPTIONS[0].value)
  const selectedCatchedType = computed(() => localFilter.value.type_c?.toString() || FILTER_OPTIONS[0].value)
  const selectedCatchedOrder = computed(() => localFilter.value.order_c?.toString() || SORT_OPTIONS[0].value)

  const handleSelectFilter = (type: PokemonFilterProps['loadingFor'], e: Event | { value: string }) => {
    const target = e instanceof Event ? (e.target as HTMLInputElement) : e
    updateFilter({ [type]: target.value })
  }

  const handleFilterEnter = () => {
    if (window.innerWidth >= MOBILE_BOUND) return
    blurById('search-p')
    router.replace({ path: '/', query: { ...route.query, filter: undefined } })
  }

  onMounted(() => {
    initData()
  })

  return {
    pokemons,
    favourites,
    catches,
    isLoading,
    isLoadingFilter,
    loadingFor,
    loadingMoreFor,
    currentFilter: localFilter,
    isLoadingMore: isLoadingPokemon,
    isLastData,
    updateFilter,
    loadMoreData,
    addToFavorite,
    removeFromFavorite,
    allFavorites: storeToRefs(pokemonStore).favorites,
    isFavorite,
    currentPagePosition,
    currentHeaderPosition,
    currentProfilePosition,
    REGIONS,
    selectedMainType,
    selectedMainOrder,
    selectedRegion,
    selectedFavouriteType,
    selectedFavouriteOrder,
    selectedCatchedType,
    selectedCatchedOrder,
    handleSelectFilter,
    handleFilterEnter,
  }
}
