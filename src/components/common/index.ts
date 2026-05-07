import CDropDown from './drop-down.vue'
import CFormInput from './form-input.vue'
import CFormWrapper from './form-wrapper.vue'
import CLazyBackground from './lazy-background.vue'
import CPane from './pane.vue'
import CSwitch from './switch.vue'
import CToast from './toast.vue'

export type * from './types'

/**
 * @description
 * Reusable form component with automatic FormData handling.
 *
 * Prevents default submit behavior, collects form data, and emits to parent.
 *
 * @example
 * Listen to submit event to receive FormData:
 *
 * handleSubmit(formData: FormData) - receives all named form inputs
 * formData.get('username') - access individual field values
 * Object.fromEntries(formData) - convert to plain object
 *
 * @emits submit - Emitted with FormData when form is submitted
 * @exposes formRef - HTMLFormElement reference for reset(), checkValidity(), etc
 * const formRef = useTemplateRef<InstanceType<typeof FormWrapper>>('myForm')
 */
export const FormWrapper = CFormWrapper

/**
 * @description
 * A wrapper component that lazily loads a background image when it enters the viewport.
 *
 * Uses the `useLazyBackground` hook to observe the element via the Intersection Observer API
 * and apply the background image only when visible.
 * This helps improve performance by deferring image loading until needed.
 *
 * The component renders a `<div>` with a `ref` attached for the lazy observer.
 * The `url` is passed to `useLazyBackground`, which handles loading behavior internally.
 *
 * @property {string} [url] - The image URL to be lazily loaded as the background.
 */
export const LazyBackground = CLazyBackground

/**
 * @description
 * A controlled toast notification component with smooth transitions and automatic style mapping.
 *
 * The `Toast` component displays contextual messages such as success, warning, info, or error alerts.
 * It uses a hidden checkbox mechanism to toggle its visibility, with animations handled via CSS
 * and logic managed by the `useToast` hook.
 *
 * - The component relies on `id` for toggling visibility; ensure each toast has a unique ID.
 * - The `type` prop controls both the color scheme and the icon (configured via `toast.configs`).
 * - The visibility state is managed through the `useToast` hook, which handles open/close behavior.
 *
 * Props for the `Toast` component.
 *
 * @property {string} [id] - The unique identifier for the toast, used to control visibility.
 * @property {string} [name] - The accessible name associated with the toast input.
 * @property {TStatus['type']} [type] - The type of toast, which determines icon and color styling (e.g., `"success"`, `"error"`, `"info"`, `"warning"`).
 */
export const Toast = CToast

/**
 * @description
 * A responsive, interactive sliding pane component.
 *
 * The `Pane` component provides a modal-like overlay that slides up from the bottom of the screen.
 * It supports both mouse and touch gestures, allowing users to drag or tap to close.
 * The pane automatically adapts between mobile and desktop layouts and can be customized with
 * additional class names or behavior through props.
 *
 * - Uses the `usePane` hook internally to manage gestures and visibility transitions.
 * - Controlled through a hidden checkbox using CSS peer selectors.
 * - Supports optional `preventClose` and `wrapperClass` props for customization.
 *
 * Props for the `Pane` component.
 *
 * @property {boolean} [preventClose] - Prevents the pane from being closed manually.
 * @property {string} [wrapperClass] - Additional CSS classes applied to the outer wrapper element.
 * @property {string} id - Unique identifier used for the pane toggle.
 * @property {string} [className] - Additional CSS classes for the pane container.
 * @property {boolean} [mobileOnly] - If true, the pane is only visible on mobile devices.
 * @property {HTMLElement | null} [scrollTarget] - Optional target element for scroll locking or event handling.
 * @property {HtmlHTMLAttributes} - All attribute of div element.
 * @emits shown - Callback fired when the pane becomes visible.
 * @emits hidden - Callback fired when the pane is hidden.
 */
export const Pane = CPane

/**
 * @description
 * `FormInput` is a stylized input component used for authentication forms.
 * It supports prefix and suffix elements (e.g., icons) and their corresponding click actions.
 *
 * Props for the `FormInput` component.
 *
 * @property {number} max - Give limit for maximum character
 * @property {string} label - Label of the input
 * @property {boolean} isLoading - Display spinner while true
 * @property {React.ReactNode} prefix - Optional React node to be displayed at the start of the input.
 * @property {React.ReactNode} suffix - Optional React node to be displayed at the end of the input.
 * @property {() => void} onPrefixClick - Callback when the prefix element is clicked.
 * @property {() => void} onSufffixClick - Callback when the suffix element is clicked.
 * @property {InputHTMLAttributes} - All attribute of input element without ref.
 */
export const FormInput = CFormInput

export const DropDown = CDropDown

export const Switch = CSwitch
