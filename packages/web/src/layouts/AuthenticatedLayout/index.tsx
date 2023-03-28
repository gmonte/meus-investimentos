import { Outlet } from 'react-router-dom'

import { Button } from '~/components/Button'
import { useAppDispatch } from '~/store'
import { AuthActions } from '~/store/auth'

export function AuthenticatedLayout() {
  const dispatch = useAppDispatch()

  return (
    <div>
      <Button onClick={ () => dispatch(AuthActions.logout()) }>
        sair
      </Button>
      <Outlet />
    </div>
  )
}
