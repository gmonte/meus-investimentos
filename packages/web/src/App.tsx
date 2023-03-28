import { useEffect } from 'react'

import { Loader } from './components/Loader'
import { Router } from './routes'
import { useAppDispatch, useAppSelector } from './store'
import { selectLoading } from './store/loader/selectors'

export function App() {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoading)

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
