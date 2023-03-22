export interface Toast {
  id: string
  type?: 'info' | 'success' | 'warn' | 'error'
  title?: string
  description?: string
  open?: boolean
}

export type CreateToast = (
  options: Omit<Toast, 'id' | 'open'>,
  immediately?: boolean
) => void

export interface ToastOptions {
  id: string
}

export type RemoveToast = (options: ToastOptions, immediately?: boolean) => void

export type ResetToasts = () => void

export type Action =
  | { type: 'CREATE_IMMEDIATELY_TOAST', toast: Toast }
  | { type: 'CREATE_TOAST', toast: Toast }
  | { type: 'OPEN_TOAST', options: ToastOptions }
  | { type: 'CLOSE_TOAST', options: ToastOptions }
  | { type: 'REMOVE_TOAST', options: ToastOptions }
  | { type: 'RESET_TOASTS' }

export interface ToastProps extends Toast {
  close: () => void
}

export interface UseToast {
  createToast: CreateToast
  removeToast: RemoveToast
  resetToasts: ResetToasts
  toasts: Toast[]
}
