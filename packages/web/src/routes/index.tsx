import { BrowserRouter } from 'react-router-dom'

import { useAppSelector } from '~/store'
import { selectAuthenticated } from '~/store/auth/selectors'

import { AuthenticatedRoutes } from './AuthenticatedRoutes'
import { GuestRoutes } from './GuestRoutes'

export function Router () {
  const authenticated = useAppSelector(selectAuthenticated)

  return (
    <BrowserRouter>
      {authenticated ? <AuthenticatedRoutes /> : <GuestRoutes />}
    </BrowserRouter>
  )
}
