import { createSlice } from '@reduxjs/toolkit'

import {
  State,
  CreateAccountPayload,
  LoginPayload,
  LoginPopupPayload,
  LoginSuccessPayload,
  ForgotPasswordPayload
} from '~/@types/Auth'

const initialState: State = {
  authenticated: false,
  user: undefined,
  provider: undefined
}

export const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    forgotPassword (_state, _action: ForgotPasswordPayload) {},
    createAccount (_state, _action: CreateAccountPayload) {},
    login (_state, _action: LoginPayload) {},
    loginPopup (_state, _action: LoginPopupPayload) {},
    loginSuccess (state, action: LoginSuccessPayload) {
      state.authenticated = true
      state.user = action.payload.user
    },
    logout (state) {
      state.authenticated = false
    }
  }
})

export const AuthActions = slice.actions

export default slice.reducer
