import { CheckCircle, InfoCircle, WarningCircle, WarningTriangle } from '@iconoir/vue'

import { type Status } from '@/types'
import { EStatus } from '@/types/enum'

export default {
  styleByType: ({ type }: Status) => {
    switch (type) {
      case EStatus.Error:
        return 'bg-fighting-0 border-fighting-1 text-fighting-1'
      case EStatus.Info:
        return 'bg-water-0 border-water-1 text-water-1'
      case EStatus.Success:
        return 'bg-grass-0 border-grass-1 text-grass-1'
      case EStatus.Warning:
        return 'bg-fire-0 border-fire-1 text-fire-1'
      default:
        return 'bg-water-0 border-water-1 text-water-1'
    }
  },
  iconByType: ({ type }: Status) => {
    switch (type) {
      case EStatus.Error:
        return WarningCircle
      case EStatus.Info:
        return InfoCircle
      case EStatus.Success:
        return CheckCircle
      case EStatus.Warning:
        return WarningTriangle
      default:
        return InfoCircle
    }
  },
}
