import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'
import * as cors from 'cors';

import { CDIInvestmentDocument } from '../types'

const auth = admin.auth()
const corsHandler = cors({ origin: true });

type Next = (request: functions.https.Request, response: functions.Response, user: UserRecord) => void | Promise<void>
export class InvestmentUserOwnerError extends Error { }

export const verifyUser = (next: Next) => async (request: functions.https.Request, response: functions.Response) => {
  corsHandler(request, response, async () => {
    if (request.method !== 'POST') {
      response.status(400).send('Bad request, this endpoint only accepts POST requests')
      return
    }

    const idToken: string | undefined = request.headers.authorization?.split('Bearer ')[1]
    if (!idToken) {
      response.status(401).send('You are not authorized to perform this action')
      return
    }

    try {
      const decodedIdToken: admin.auth.DecodedIdToken = await auth.verifyIdToken(idToken)
      if (decodedIdToken && decodedIdToken.uid) {
        const user = await admin.auth().getUser(decodedIdToken.uid)
        if (user) {
          await next(request, response, user)
          return
        }
      }

      response.status(401).send('You are not authorized to perform this action')
    } catch (error) {
      response.status(401).send('You are not authorized to perform this action')
    }
  })
}

export const verifyInvestmentUserOwner = (investment: CDIInvestmentDocument, user: UserRecord) => {
  console.log(investment.user, user.uid, investment.user !== user.uid)
  if (investment.user !== user.uid) {
    throw new InvestmentUserOwnerError('User is not the investment owner')
  }
}