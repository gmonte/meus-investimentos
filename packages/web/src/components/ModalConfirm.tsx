import {
  useCallback,
  useState
} from 'react'

import { ModalProps } from '~/hooks/useModal'

import { Button } from './Button'
import { Modal } from './Modal'

export interface ModalConfirmProps extends ModalProps {
  title: string
  description: string
  onConfirm: () => unknown
  onCancel?: () => unknown
}

export function ModalConfirm({
  open,
  close,
  title,
  description,
  onConfirm,
  onCancel
}: ModalConfirmProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = useCallback(
    async () => {
      try {
        setLoading(true)
        await onConfirm()
        close()
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
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
          loading={ loading }
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
