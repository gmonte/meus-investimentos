import { PayloadAction } from '@reduxjs/toolkit'
import { User as FirebaseUser } from 'firebase/auth'

export interface User extends FirebaseUser {
  accessToken?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface CreateAccountData {
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordData {
  email: string
}

export interface State {
  authenticated: boolean
  user?: User
  provider?: string
}

export type ForgotPasswordPayload = PayloadAction<{
  data: ForgotPasswordData
  onSuccess?: () => void
  onError?: (message?: string) => void
}>

export type CreateAccountPayload = PayloadAction<{
  data: CreateAccountData
  onSuccess?: () => void
  onError?: (message?: string) => void
}>

export type LoginPayload = PayloadAction<{
  data: SignInData
  onError?: (message?: string) => void
}>

export type LoginPopupPayload = PayloadAction<{
  providerId: string
  onError?: (message?: string) => void
}>

export type LoginSuccessPayload = PayloadAction<{
  user: User
}>

export type RefreshTokenSuccessPayload = PayloadAction<{
  accessToken: string
}>
