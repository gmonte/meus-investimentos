import { PropsWithChildren } from 'react'
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider
} from 'react-redux'

import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import createSagaMiddleware from 'redux-saga'

import reducers from './reducers'
import sagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: reducers,
  devTools: import.meta.env.MODE === 'development',
  middleware (getDefaultMiddleware) {
    const middlewares = getDefaultMiddleware({ serializableCheck: false })

    if (import.meta.env.MODE === 'development') {
      middlewares.push(createLogger({}))
    }

    middlewares.push(sagaMiddleware)

    return middlewares
  }
})

sagaMiddleware.run(sagas)

const persistor = persistStore(store)

export function StoreProvider ({ children }: PropsWithChildren) {
  return (
    <Provider store={ store }>
      <PersistGate loading={ null } persistor={ persistor }>
        {children}
      </PersistGate>
    </Provider>
  )
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
