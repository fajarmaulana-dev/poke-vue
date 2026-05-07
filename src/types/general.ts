import type { SVGAttributes } from '@vue/runtime-dom'

export type Primitive = string | number | boolean

export interface SvgIcon extends /* @vue-ignore */ SVGAttributes {
  color?: string
  size?: number
  thick?: number
}
