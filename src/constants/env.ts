import type { ApiInstanceOptions } from '@/services/api'

export const MAIN_API = {
  baseURL: import.meta.env.VITE_MAIN_API as string, // example: https://jsonplaceholder.typicode.com
  source: 'base',
} as ApiInstanceOptions

export const POKE_API = {
  baseURL: import.meta.env.VITE_POKE_URL as string,
  source: 'poke',
} as ApiInstanceOptions

export const POKE_FETCH_LIMIT = Number(import.meta.env.VITE_POKE_FETCH_LIMIT as string)
