import { useCallback } from 'react'

import { ModalProps } from '~/hooks/useModal'

import { Button } from './Button'
import { Modal } from './Modal'

export interface ModalConfirmProps extends ModalProps {
  title: string
  description: string
  onConfirm: () => void
  onCancel?: () => void
}

export function ModalConfirm({
  id,
  open,
  close,
  title,
  description,
  onConfirm,
  onCancel
}: ModalConfirmProps) {
  const handleConfirm = useCallback(
    () => {
      onConfirm()
      close()
    },
    [close, onConfirm]
  )

  const handleCancel = useCallback(
    () => {
      onCancel?.()
      close()
    },
    [close, onCancel]
  )

  return (
    <Modal.Root open={ open } close={ close } className="max-w-xs md:max-w-xs">
      <Modal.Title>
        {title}
      </Modal.Title>
      <Modal.Description>
        {description}
      </Modal.Description>

      <Modal.Footer>
        <Button
          onClick={ handleConfirm }
        >
          Confirmar
        </Button>

        <Button
          onClick={ handleCancel }
          className="bg-gray-800 hover:bg-gray-900 active:bg-black text-white"
        >
          Cancelar
        </Button>
      </Modal.Footer>

    </Modal.Root>
  )
}
