import { createSlice } from '@reduxjs/toolkit'

import { State } from '~/@types/Loader'

const initialState: State = {
  loadingCounter: 0,
  loading: false
}

export const slice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    start (state) {
      state.loadingCounter += 1
      state.loading = true
    },
    stop (state) {
      const newLoadingCounter = state.loadingCounter > 1 ? (state.loadingCounter - 1) : 0
      state.loadingCounter = newLoadingCounter
      state.loading = newLoadingCounter > 0
    }
  }
})

export const LoaderActions = slice.actions

export default slice.reducer
