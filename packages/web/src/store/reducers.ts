import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import auth from './auth'
import loader from './loader'

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['loader']
}

const rootReducer = combineReducers({
  auth,
  loader
})

export default persistReducer(rootPersistConfig, rootReducer)
