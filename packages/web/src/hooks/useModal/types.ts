import { ElementType } from 'react'

// eslint-disable-next-line
export interface Modal<T = any> {
  id: string
  Component: ElementType<T>
  props?: Omit<T, 'id' | 'open' | 'close'>
  open?: boolean
}

export type CreateModal = <T>(options: Modal<T>, immediately?: boolean) => void

export interface OpenModalOptions {
  id: string
}

export interface CloseModalOptions {
  id: string
}

export interface RemoveModalOptions {
  id: string
}

export type RemoveModal = (options: RemoveModalOptions, immediately?: boolean) => void

export type ResetModals = () => void

export type Action =
  | { type: 'CREATE_IMMEDIATELY_MODAL', modal: Modal }
  | { type: 'CREATE_MODAL', modal: Modal }
  | { type: 'OPEN_MODAL', modal: OpenModalOptions }
  | { type: 'CLOSE_MODAL', modal: CloseModalOptions }
  | { type: 'REMOVE_MODAL', modal: RemoveModalOptions }
  | { type: 'RESET_MODALS' }

export interface ModalProps {
  id: string
  open: boolean
  close: () => void
}

export interface UseModal {
  createModal: CreateModal
  removeModal: RemoveModal
  resetModals: ResetModals
  modals: Modal[]
}
