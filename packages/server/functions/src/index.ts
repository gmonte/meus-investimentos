import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as moment from 'moment-timezone'

import { createCdiInvestment } from './cdiInvestment/createCdiInvestment'
import { cronJobFetchCdiByDay } from './cdiInvestment/cronJobFetchCdiByDay'
import { deleteCdiInvestment } from './cdiInvestment/deleteCdiInvestment'
import { getUserResume } from './cdiInvestment/getUserResume'
import { readCdiInvestmentHistory } from './cdiInvestment/readCdiInvestmentHistory'
import { readUserCdiInvestments } from './cdiInvestment/readUserCdiInvestments'
import { rescueCdiInvestment } from './cdiInvestment/rescueCdiInvestment'
import { updateCdiInvestment } from './cdiInvestment/updateCdiInvestment'
import {
  CDIInvestmentDocument,
  CDIInvestmentHistoryDocument,
  HttpMethod,
  RescueCDIInvestment
} from './types'
import { enableCors } from './utils/enableCors'
import {
  InvestmentUserOwnerError,
  verifyUser
} from './utils/verifyUser'

admin.initializeApp()

const db = admin.firestore()

moment.tz.setDefault('America/Sao_Paulo')

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayNight = functions
  .runWith({ timeoutSeconds: 540 })
  .pubsub
  .schedule('1 0 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(async () => await cronJobFetchCdiByDay(db, true))

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayMorning = functions
  .runWith({ timeoutSeconds: 540 })
  .pubsub
  .schedule('0 8 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(async () => await cronJobFetchCdiByDay(db))

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayNoon = functions
  .runWith({ timeoutSeconds: 540 })
  .pubsub
  .schedule('0 12 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(async () => await cronJobFetchCdiByDay(db))

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayEvening = functions
  .runWith({ timeoutSeconds: 540 })
  .pubsub
  .schedule('0 18 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(async () => await cronJobFetchCdiByDay(db))

exports.createCdiInvestment = functions.https.onRequest(
  enableCors(
    HttpMethod.POST,
    verifyUser(
      async (request, response, user) => {
        const body = request.body as CDIInvestmentDocument
        await createCdiInvestment(db, body, user)
        response.send()
      }
    )
  )
)

exports.readCdiInvestmentHistory = functions.https.onRequest(
  enableCors(
    HttpMethod.GET,
    verifyUser(
      async (request, response, user) => {
        const { id } = request.query
        if (id) {
          try {
            const cdiHistory = await readCdiInvestmentHistory(db, { id } as CDIInvestmentHistoryDocument, user)
            response.json(cdiHistory)
          } catch (err) {
            if (err instanceof InvestmentUserOwnerError) {
              response.status(403).send(err.message)
            } else {
              console.error(err)
              response.status(500).send()
            }
          }
        } else {
          response.status(204).send()
        }
      }
    )
  )
)

exports.updateCdiInvestment = functions.https.onRequest(
  enableCors(
    HttpMethod.PUT,
    verifyUser(
      async (request, response, user) => {
        const { id } = request.body as CDIInvestmentDocument
        if (id) {
          try {
            await updateCdiInvestment(db, request.body as CDIInvestmentDocument, user)
            response.send()
          } catch (err) {
            if (err instanceof InvestmentUserOwnerError) {
              response.status(403).send(err.message)
            } else {
              console.error(err)
              response.status(500).send()
            }
          }
        } else {
          response.status(204).send()
        }
      }
    )
  )
)

exports.deleteCdiInvestment = functions.https.onRequest(
  enableCors(
    HttpMethod.DELETE,
    verifyUser(
      async (request, response, user) => {
        const { id } = request.body as CDIInvestmentDocument
        if (id) {
          try {
            await deleteCdiInvestment(db, request.body as CDIInvestmentDocument, user)
            response.send()
          } catch (err) {
            if (err instanceof InvestmentUserOwnerError) {
              response.status(403).send(err.message)
            } else {
              console.error(err)
              response.status(500).send()
            }
          }
        } else {
          response.status(204).send()
        }
      }
    )
  )
)

exports.readUserCdiInvestments = functions.https.onRequest(
  enableCors(
    HttpMethod.GET,
    verifyUser(
      async (request, response, user) => {
        const { finished } = request.query
        const investments = await readUserCdiInvestments(db, finished as string | undefined, user)
        response.json(investments)
      }
    )
  )
)

exports.getUserResume = functions.https.onRequest(
  enableCors(
    HttpMethod.GET,
    verifyUser(
      async (request, response, user) => {
        const { finished } = request.query
        const userResume = await getUserResume(db, finished as string | undefined, user)
        response.json(userResume)
      }
    )
  )
)

exports.rescueCdiInvestment = functions.https.onRequest(
  enableCors(
    HttpMethod.POST,
    verifyUser(
      async (request, response, user) => {
        const body = request.body as RescueCDIInvestment
        await rescueCdiInvestment(db, body, user)
        response.send()
      }
    )
  )
)

// exports.changeDatabase = functions.https.onRequest(
//   enableCors(
//     HttpMethod.POST,
//     async (request, response) => {
//       const query = await db.collection(COLLECTIONS.CDI_INVESTMENTS).get()

//       const collection = query.docs.map((doc) => {
//         return {
//           ref:doc.ref,
//           data: doc.data() as CDIInvestmentDocument
//         }
//       })

//       const batch = db.batch()

//       collection.forEach(item => {
//         batch.update(item.ref, { name: admin.firestore.FieldValue.delete() })
//       })

//       await batch.commit()

//       response.send()
//     }
//   )
// )
