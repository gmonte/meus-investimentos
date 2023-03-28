import { FirebaseError } from 'firebase/app'
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification
} from 'firebase/auth'
import { takeLatest } from 'redux-saga/effects'
import {
  call,
  put
} from 'typed-redux-saga'

import {
  CreateAccountPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginPopupPayload
} from '~/@types/Auth'
import { api } from '~/services/api'
import { app } from '~/services/firebase'

import { AuthActions } from '.'
import { LoaderActions } from '../loader'

function* forgotPassword({
  payload: {
    data,
    onSuccess = () => { },
    onError = () => { }
  }
}: ForgotPasswordPayload) {
  try {
    yield put(LoaderActions.start())

    const { email } = data

    const auth = getAuth(app)
    yield * call(sendPasswordResetEmail, auth, email)

    yield * call(onSuccess)
  } catch (err) {
    console.error(err)
    let message = 'Tente novamente mais tarde'
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado'
      }
    }
    yield * call(onError, message)
  } finally {
    yield put(LoaderActions.stop())
  }
}

function* createAccount({
  payload: {
    data,
    onSuccess = () => {},
    onError = () => {}
  }
}: CreateAccountPayload) {
  try {
    yield put(LoaderActions.start())

    const { email, password } = data

    const auth = getAuth(app)
    const { user } = yield * call(createUserWithEmailAndPassword, auth, email, password)

    yield * call(sendEmailVerification, user)

    yield * call(onSuccess)
  } catch (err) {
    let message = 'Tente novamente mais tarde'
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/email-already-in-use') {
        message = 'Endereço de e-mail já cadastrado. Tente fazer login ou recuperar sua senha.'
      }
    }
    yield * call(onError, message)
  } finally {
    yield put(LoaderActions.stop())
  }
}

function* login({ payload: { data, onError = () => {} } }: LoginPayload) {
  try {
    yield put(LoaderActions.start())

    const { email, password } = data

    const auth = getAuth(app)
    const { user } = yield * call(signInWithEmailAndPassword, auth, email, password)

    if (!user?.emailVerified) {
      yield * call(sendEmailVerification, user)
      yield * call(onError, 'Você precisa verificar seu e-mail antes de fazer login. Enviamos um novo email de verificação para você.')
    } else {
      yield put(AuthActions.loginSuccess({ user }))
    }
  } catch (err) {
    let message = 'Tente novamente mais tarde'
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/wrong-password') {
        message = 'Senha incorreta. Tente novamente.'
      } else if (err.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado'
      }
    }
    yield * call(onError, message)
  } finally {
    yield put(LoaderActions.stop())
  }
}

function* loginPopup({ payload: { providerId, onError = () => { } } }: LoginPopupPayload) {
  try {
    yield put(LoaderActions.start())

    let provider
    const auth = getAuth(app)

    switch (providerId) {
      case 'github': {
        provider = new GithubAuthProvider()
        break
      }
      case 'google': {
        provider = new GoogleAuthProvider()
        break
      }
      default: break
    }

    if (provider) {
      const { user } = yield * call(signInWithPopup, auth, provider)

      if (user) {
        yield put(AuthActions.loginSuccess({ user }))
      }
    }
  } catch (err) {
    let message = 'Tente novamente mais tarde'
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        message = `Conta existente, porém não está vinculada ao ${ providerId }. Por favor escolha outra forma de login.`
      }
    }
    yield * call(onError, message)
  } finally {
    yield put(LoaderActions.stop())
  }
}

function* logout() {
  yield put(api.util.resetApiState())
  const auth = getAuth(app)
  yield call(signOut, auth)
}

export default [
  takeLatest(AuthActions.forgotPassword.type, forgotPassword),
  takeLatest(AuthActions.createAccount.type, createAccount),
  takeLatest(AuthActions.login.type, login),
  takeLatest(AuthActions.loginPopup.type, loginPopup),
  takeLatest(AuthActions.logout.type, logout)
]
