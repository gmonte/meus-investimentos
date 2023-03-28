import { getAuth } from 'firebase/auth'
import { useEffect, useLayoutEffect } from 'react'
import { User } from './@types/Auth'

import { Loader } from './components/Loader'
import { Router } from './routes'
import { api } from './services/api'
import { app } from './services/firebase'
import { useAppDispatch, useAppSelector } from './store'
import { AuthActions } from './store/auth'
import { selectLoading } from './store/loader/selectors'

export function App() {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoading)

  // useLayoutEffect(
  //   () => {
  //     const auth = getAuth(app)

  //     auth.onIdTokenChanged(async (firebaseUser) => {
  //       const user = firebaseUser as User

  //       if (user) {
  //         console.log('LOGADO')
  //         const idToken = await user.getIdToken()
  //         api.defaults.headers.common.Authorization = `Bearer ${idToken}`
  //         dispatch(AuthActions.loginSuccess({ user: { ...user } }))
  //       } else {
  //         console.log('NAO LOGADO')
  //         const {
  //           Authorization,
  //           ...common
  //         } = api.defaults.headers.common
  //         api.defaults.headers.common = common
  //       }
  //     })
  //   },
  //   [dispatch]
  // )

  useEffect(
    () => {
      console.warn('Application running environment mode:', import.meta.env.MODE)
    },
    []
  )

  return (
    <div style={ { flex: 1 } }>
      <Router />
      {loading && <Loader />}
    </div>
  )
}
