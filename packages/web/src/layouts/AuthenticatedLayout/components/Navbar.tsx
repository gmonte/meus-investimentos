import { useCallback } from 'react'

import { Button } from '~/components/Button'
import { ModalConfirm } from '~/components/ModalConfirm'
import { useModal } from '~/hooks/useModal'
import { RegisterInvestmentModal } from '~/modules/investment/modals/RegisterInvestmentModal'
import { useAppDispatch } from '~/store'
import { AuthActions } from '~/store/auth'

export function Navbar() {
  const dispatch = useAppDispatch()

  const { createModal } = useModal()

  const handleCreateInvestment = useCallback(
    () => createModal({
      id: 'create-investment',
      Component: RegisterInvestmentModal
    }),
    [createModal]
  )

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
    <nav className="sticky top-0 bg-cyan-500 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between">

          <div className="mr-6 flex shrink-0 items-center">
            <span className="text-xl font-semibold tracking-tight text-white">
              Meus Investimentos
            </span>
          </div>

          <div className="flex w-auto grow items-center">
            <div className="flex-1 text-sm">
              <Button
                className="bg-white hover:bg-gray-100 active:bg-gray-200"
                onClick={ handleCreateInvestment }
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
