import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'

import { RootState } from '~/store'
import { AuthActions } from '~/store/auth'
import { selectAccessToken } from '~/store/auth/selectors'

import { refreshToken } from './refreshToken'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',
  prepareHeaders(headers, { getState }) {
    const accessToken = selectAccessToken(getState() as RootState)
    if (accessToken) {
      headers.set('authorization', `Bearer ${ accessToken }`)
    }
    return headers
  }
})

export const baseQueryWithReauth: BaseQueryFn<
string | FetchArgs,
unknown,
FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  if (
    result.error &&
    result.error.status === 'PARSING_ERROR' &&
    result.error.originalStatus === 401
  ) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const accessToken = await refreshToken()
        api.dispatch(AuthActions.refreshTokenSuccess({ accessToken }))
        result = await baseQuery(args, api, extraOptions)
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message)
        }
        api.dispatch(AuthActions.logout())
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
