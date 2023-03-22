import { RootState } from '..'

export const selectAuthenticated = (state: RootState) => state.auth.authenticated

export const selectUser = (state: RootState) => state.auth.user
