import {
  lazy,
  Suspense
} from 'react'
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { Loader } from '~/components/Loader'
import { GuestLayout } from '~/layouts/GuestLayout'

const SignIn = lazy(async () => await import('~/pages/auth/SignIn'))

export function GuestRoutes () {
  return (
    <Routes>

      <Route path="/auth" element={ <GuestLayout /> }>
        <Route index element={ <Navigate to="/auth/sign-in" replace /> } />

        <Route path="/auth/sign-in" element={ (
          <Suspense fallback={ <Loader /> }>
            <SignIn />
          </Suspense>
        ) } />

      </Route>

      <Route path="*" element={ <Navigate to="/auth" replace /> } />
    </Routes>
  )
}
