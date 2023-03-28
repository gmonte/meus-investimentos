import { useCallback } from 'react'

import { Button } from '~/components/Button'
import { ModalConfirm } from '~/components/ModalConfirm'
import { useModal } from '~/hooks/useModal'
import { useAppDispatch } from '~/store'
import { AuthActions } from '~/store/auth'

export function Navbar() {
  const dispatch = useAppDispatch()

  const { createModal } = useModal()

  const handleLogout = useCallback(
    () => createModal({
      id: 'logout-confirm',
      Component: ModalConfirm,
      props: {
        title: 'Sair',
        description: 'Você realmente deseja sair do sistema?',
        onConfirm: () => dispatch(AuthActions.logout())
      }
    }),
    [createModal, dispatch]
  )

  return (
    <nav className="bg-cyan-500 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap">

          <div className="flex items-center flex-shrink-0 mr-6">
            <span className="font-semibold text-xl tracking-tight text-white">
              Meus Investimentos
            </span>
          </div>

          <div className="flex-grow flex items-center w-auto">
            <div className="text-sm flex-1">
              <Button
                className="bg-white hover:bg-gray-100 active:bg-gray-200"
              >
                Cadastrar Investimento
              </Button>
            </div>
            <div>
              <Button onClick={ handleLogout }>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
