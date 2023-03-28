import * as functions from 'firebase-functions'
import * as cors from 'cors';

import { HttpMethod } from '../types'

const corsHandler = cors({ origin: true, credentials: true });

type Next = (request: functions.https.Request, response: functions.Response) => void | Promise<void>

export const enableCors = (method: HttpMethod, next: Next) => (request: functions.https.Request, response: functions.Response) => {
  corsHandler(request, response, async () => {
    if (request.method !== method) {
      response.status(400).send(`Bad request, this endpoint only accepts ${method} requests`)
      return
    }

    return await next(request, response)
  })
}
