import type { FormHTMLAttributes, HTMLAttributes, InputHTMLAttributes } from 'vue'

import type { Status } from '@/types'

import type { Pane } from './hooks'
import type { TLazyBackground } from './hooks/use-lazy-background'

export interface FormWrapperProps extends /* @vue-ignore */ FormHTMLAttributes {}

export interface FormWrapperEmits {
  (e: 'action', formData: FormData): void
}

export interface LazyBackgroundProps extends /* @vue-ignore */ HTMLAttributes, TLazyBackground {}

export interface ToastProps extends /* @vue-ignore */ Omit<HTMLAttributes, 'id'>, Status {
  id: string
}

export interface PaneEmits {
  (e: 'shown', event: Event): void
  (e: 'hidden', event: Event): void
}

export interface PaneProps extends /* @vue-ignore */ Omit<HTMLAttributes, 'id'>, Omit<Pane, 'onShown' | 'onHidden'> {
  preventClose?: boolean
  wrapperClass?: string
}

export interface FormInputProps extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'id' | 'name'> {
  label?: string
  isLoading?: boolean
  max?: number
  id: string
  name?: string
  required?: boolean
  onPrefixClick?: () => void
  onSuffixClick?: () => void
}

export interface SelectOption {
  value: string | number
  text: string
}

export interface DropDownProps extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'value' | 'type' | 'id' | 'name'> {
  options: SelectOption[]
  name: string
  labelClass?: string
  placeholder?: string
  showValue?: boolean
  isLoading?: boolean
}

export interface SwitchProps extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'id' | 'name' | 'type'> {
  label?: string
  name: string
  id?: string
}
