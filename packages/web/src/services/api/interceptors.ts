import { Store } from 'redux'
import axios from 'axios'

import { getAuth } from 'firebase/auth'

import { AuthActions } from '~/store/auth'
import { selectAccessToken, selectAuthenticated } from '~/store/auth/selectors'

import { app } from '../firebase'
import { api } from './'

export const sleep = (timer: number) => new Promise((resolve) => setTimeout(resolve, timer))

export const createAccessTokenSubscriber = (store: Store) => {
  /*
    Add header Authorization when store contains accessToken
    or remove when it not contains accessToken
  */
  store.subscribe(() => {
    const accessToken = selectAccessToken(store.getState())
    if (!accessToken) {
      if (api.defaults.headers.common.Authorization) {
        const { Authorization, ...common } = api.defaults.headers.common || {}
        api.defaults.headers.common = common
      }
    } else if (accessToken !== api.defaults.headers.common.Authorization) {
      api.defaults.headers.common.Authorization = `Bearer ${ accessToken }`
    }
  })
}

export const createRefreshTokenInterceptor = (store: Store) => {
  let isAlreadyFetchingAccessToken = false
  let subscribers: ((accessToken: string) => void)[] = []

  api.interceptors.response.use(
    response => response,
    async (error) => {
      const {
        response: { status, config }
      } = error

      const isAuthenticated = selectAuthenticated(store.getState())

      // if can do refresh token
      if (isAuthenticated && status === 401) {
        try {
          /* Proceed to the token refresh procedure
          We create a new Promise that will retry the request,
          clone all the request configuration from the failed
          request in the error object. */

          const retryOriginalRequest = new Promise(resolve => {
          /* We need to add the request retry to the queue
          since there another request that already attempt to
          refresh the token */
            subscribers.push((accessToken) => {
              config.headers.Authorization = `Bearer ${ accessToken }`
              resolve(axios(config))
            })
          })

          if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true

            const getAccessToken = async (count = 1): Promise<string> => {
              const auth = getAuth(app)

              const accessToken = await auth.currentUser?.getIdToken?.()

              if (accessToken) {
                return accessToken
              }
              
              if (!accessToken && count <= 5) {
                const timer = 500
                console.warn(`Error on fetch data at ${count} time. Retrying in ${timer} ms...`)
                await sleep(timer)
                return getAccessToken(count + 1)
              }

              // We can't refresh, throw the error anyway
              throw error
            }

            const accessToken = await getAccessToken()

            store.dispatch(
              AuthActions.refreshTokenSuccess({ accessToken })
            )

            isAlreadyFetchingAccessToken = false
            // When the refresh is successful, we start retrying the requests one by one and empty the queue
            subscribers.forEach(callback => callback(accessToken))
            subscribers = []
          }
          return retryOriginalRequest
        } catch (err) {
          subscribers = []
          store.dispatch(AuthActions.logout())
          return Promise.reject(new Error('Access denied! Please try to login again!'))
        }
      }

      // If the error is due to other reasons, we just throw it back to axios
      return Promise.reject(error)
    }
  )
}
