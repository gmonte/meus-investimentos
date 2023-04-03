import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

const auth = admin.auth()

type Next = (request: functions.https.Request, response: functions.Response, user: UserRecord) => void | Promise<void>

export class InvestmentUserOwnerError extends Error { }

export const verifyUser = (next: Next) => async (request: functions.https.Request, response: functions.Response) => {
  const idToken: string | undefined = request.headers.authorization?.split('Bearer ')[1]
  if (!idToken) {
    response.status(401).send('You are not authorized to perform this action')
    return
  }

  let decodedIdToken: admin.auth.DecodedIdToken
  try {
    decodedIdToken = await auth.verifyIdToken(idToken)
  } catch (err) {
    response.status(401).send('You are not authorized to perform this action')
    return
  }

  try {
    if (decodedIdToken && decodedIdToken.uid) {
      const user = await admin.auth().getUser(decodedIdToken.uid)
      if (user) {
        await next(request, response, user)
        return
      }
    }

    response.status(401).send('You are not authorized to perform this action')
  } catch (error) {
    response.status(500).send(error)
  }
}

export const verifyUserOwner = (obj: { user: string }, user: UserRecord) => {
  if (obj.user !== user.uid) {
    throw new InvestmentUserOwnerError('User is not the owner')
  }
}
