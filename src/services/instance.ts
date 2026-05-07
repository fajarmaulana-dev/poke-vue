import { MAIN_API, POKE_API } from '@/constants/env'

import createApi from './useApi'

const mainApi = createApi({ ...MAIN_API })
const pokeApi = createApi({ ...POKE_API })

export { mainApi, pokeApi }
