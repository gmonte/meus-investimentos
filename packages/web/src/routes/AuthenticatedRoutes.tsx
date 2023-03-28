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
import { AuthenticatedLayout } from '~/layouts/AuthenticatedLayout'

const InvestmentsList = lazy(async () => await import('~/modules/investment/pages/InvestmentsList'))

export function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={ <AuthenticatedLayout /> }>

        <Route index element={ (
          <Suspense fallback={ <Loader/> }>
            <InvestmentsList />
          </Suspense>
        ) } />

      </Route>

      <Route path="*" element={ <Navigate to="/" replace /> } />
    </Routes>
  )
}
