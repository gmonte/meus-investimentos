import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

import { CDIInvestmentDocument, HttpMethod } from './types'
import { InvestmentUserOwnerError, verifyUser } from './utils/verifyUser'
import { createCdiInvestment } from './cdiInvestment/createCdiInvestment'
import { readCdiInvestment } from './cdiInvestment/readCdiInvestment'
import { updateCdiInvestment } from './cdiInvestment/updateCdiInvestment'
import { deleteCdiInvestment } from './cdiInvestment/deleteCdiInvestment'
import { cronJobFetchCdiByDay } from './cdiInvestment/cronJobFetchCdiByDay'
import { readUserCdiInvestments } from './cdiInvestment/readUserCdiInvestments'
import { enableCors } from './utils/enableCors'

const db = admin.firestore()

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayMorning = functions.pubsub.schedule('0 8 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(() => cronJobFetchCdiByDay(db, true))

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayNoon = functions.pubsub.schedule('0 12 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(() => cronJobFetchCdiByDay(db))

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayEvening = functions.pubsub.schedule('0 18 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(() => cronJobFetchCdiByDay(db))

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayNight = functions.pubsub.schedule('1 0 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(() => cronJobFetchCdiByDay(db))

exports.createCdiInvestment = functions.https.onRequest(
  enableCors(
    HttpMethod.POST,
    verifyUser(
      async (request, response, user) => {
        const body = request.body as CDIInvestmentDocument
        const investment = await createCdiInvestment(db, { ...body, user: user.uid })
        response.json(investment).send()
      }
    )
  )
)

exports.readCdiInvestment = functions.https.onRequest(
  enableCors(
    HttpMethod.GET,
    verifyUser(
      async (request, response, user) => {
        const { id } = request.query
        if (id) {
          try {
            const investment = await readCdiInvestment(db, { id } as CDIInvestmentDocument, user)
            response.json(investment).send()
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
            const investment = await updateCdiInvestment(db, request.body as CDIInvestmentDocument, user)
            response.json(investment).send()
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
        const investments = await readUserCdiInvestments(db, user)
        response.json(investments).send()
      }
    )
  )
)
