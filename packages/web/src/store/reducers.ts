import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import storage from 'redux-persist/lib/storage'

import { api } from '~/services/api'

import { auth } from './auth'
import { loader } from './loader'

const rootPersistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel1,
  blacklist: [loader.name, api.reducerPath]
}

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [auth.name]: auth.reducer,
  [loader.name]: loader.reducer
})

export default persistReducer<ReturnType<typeof rootReducer>>(rootPersistConfig, rootReducer)
