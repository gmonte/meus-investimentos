import { getAuth } from 'firebase/auth'

import { sleep } from '~/utils/sleep'

import { app } from '../firebase'

export const refreshToken = async (count = 1): Promise<string> => {
  const auth = getAuth(app)

  const accessToken = await auth.currentUser?.getIdToken?.()

  if (accessToken) {
    return accessToken
  }

  if (!accessToken && count <= 5) {
    const timer = 500
    console.warn(`Error on refresh token at ${ count } time. Retrying in ${ timer } ms...`)
    await sleep(timer)
    return await refreshToken(count + 1)
  }

  // We can't refresh, throw the error anyway
  throw new Error('Was not possible get a new token')
}
