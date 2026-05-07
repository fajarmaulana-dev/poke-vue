import type { Component } from 'vue'

import {
  Bug,
  Dark,
  Dragon,
  Electric,
  Fairy,
  Fighting,
  Fire,
  Flying,
  Ghost,
  Grass,
  Ground,
  Ice,
  Normal,
  Poison,
  Psychic,
  Rock,
  Steel,
  Water,
} from '@/assets/svg'
import { POKEMON_TYPES } from '@/constants/pokemon'

export const FILTER_OPTIONS = [
  { value: 'semua-tipe', text: 'Tampilkan Semua Tipe' },
  ...POKEMON_TYPES.map(type => ({ value: type, text: `Tampilkan Tipe ${type}` })),
]

export const SORT_OPTIONS = [
  { value: 'no-1-n', text: 'Nomor 1 - N' },
  { value: 'no-n-1', text: 'Nomor N - 1' },
  { value: 'name-a-z', text: 'Nama A - Z' },
  { value: 'name-z-a', text: 'Nama Z - A' },
]

export const POKE_CARD_FETCH_LIMIT = 32

export const ERROR_TOAST_ID = 'error-toast-id'

export const TYPE_ICONS: Record<string, { icon: Component; layer: string; bg: string; fill: string }> = {
  grass: { icon: Grass, layer: 'bg-grass-0', bg: 'bg-grass-1', fill: '*:fill-grass-1!' },
  poison: { icon: Poison, layer: 'bg-poison-0', bg: 'bg-poison-1', fill: '*:fill-poison-1!' },
  fire: { icon: Fire, layer: 'bg-fire-0', bg: 'bg-fire-1', fill: '*:fill-fire-1!' },
  flying: { icon: Flying, layer: 'bg-flying-0', bg: 'bg-flying-1', fill: '*:fill-flying-1!' },
  water: { icon: Water, layer: 'bg-water-0', bg: 'bg-water-1', fill: '*:fill-water-1!' },
  bug: { icon: Bug, layer: 'bg-bug-0', bg: 'bg-bug-1', fill: '*:fill-bug-1!' },
  electric: { icon: Electric, layer: 'bg-electric-0', bg: 'bg-electric-1', fill: '*:fill-electric-1!' },
  fairy: { icon: Fairy, layer: 'bg-fairy-0', bg: 'bg-fairy-1', fill: '*:fill-fairy-1!' },
  ground: { icon: Ground, layer: 'bg-ground-0', bg: 'bg-ground-1', fill: '*:fill-ground-1!' },
  rock: { icon: Rock, layer: 'bg-rock-0', bg: 'bg-rock-1', fill: '*:fill-rock-1!' },
  normal: { icon: Normal, layer: 'bg-normal-0', bg: 'bg-normal-1', fill: '*:fill-normal-1!' },
  psychic: { icon: Psychic, layer: 'bg-psychic-0', bg: 'bg-psychic-1', fill: '*:fill-psychic-1!' },
  steel: { icon: Steel, layer: 'bg-steel-0', bg: 'bg-steel-1', fill: '*:fill-steel-1!' },
  dragon: { icon: Dragon, layer: 'bg-dragon-0', bg: 'bg-dragon-1', fill: '*:fill-dragon-1!' },
  fighting: { icon: Fighting, layer: 'bg-fighting-0', bg: 'bg-fighting-1', fill: '*:fill-fighting-1!' },
  dark: { icon: Dark, layer: 'bg-dark-0', bg: 'bg-dark-1', fill: '*:fill-dark-1!' },
  ghost: { icon: Ghost, layer: 'bg-ghost-0', bg: 'bg-ghost-1', fill: '*:fill-ghost-1!' },
  ice: { icon: Ice, layer: 'bg-ice-0', bg: 'bg-ice-1', fill: '*:fill-ice-1!' },
}
