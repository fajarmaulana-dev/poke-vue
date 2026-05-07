export const HERO_CONFIG = {}

export const DEFAULT_META = {
  title: 'PokeDex - Catch All Pokemons',
  description: 'Application to explore and catch all pokemons',
  keywords: 'pokemon, pokedex, catch, play, pikachu, poke',
  ogImage: 'https://res.cloudinary.com/dxa4bdtdx/image/upload/hisui_xwmjev.avif',
}

// for page with id, please use /[id] to replace the id path. eg. /pendaftaran/[id], /pendaftaran/[id]/path, etc.
export const PAGE_METAS: Record<string, unknown> = {
  '/': {
    ...DEFAULT_META,
  },
}

export function getHeadProps(path: string) {
  return PAGE_METAS[path] || DEFAULT_META
}
