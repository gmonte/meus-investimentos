import { all } from 'redux-saga/effects'

import auth from './auth/sagas'

function* sagas() {
  yield all([
    ...auth
  ])
}

export default sagas
