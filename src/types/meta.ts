import type { ApiMeta } from '@/services/api'

import type { EStatus } from './enum'

export type Status = {
  type?: EStatus.Error | EStatus.Success | EStatus.Info | EStatus.Warning
}

export type MetaData<T> = {
  meta: ApiMeta
  data: T
}
