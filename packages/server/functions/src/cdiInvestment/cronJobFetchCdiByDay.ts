import * as admin from 'firebase-admin'

import { COLLECTIONS } from '../constants'
import {
  CDIInvestmentDocument,
  CDIInvestmentHistoryDocument
} from '../types'
import { calculateCdiInvestment } from './calculateCdiInvestment'
import { fetchCdiByDay } from './fetchCdiByDay'

export const cronJobFetchCdiByDay = async (db: admin.firestore.Firestore, forceToCalculate = false) => {
  const missingCdiIndexesLength = await fetchCdiByDay(db)

  console.log('cronJobFetchCdiByDay', {
    missingCdiIndexesLength,
    forceToCalculate
  })

  if (!!missingCdiIndexesLength || forceToCalculate) {
    const batch = db.batch()

    const investmentsSnapshot = await db.collection(COLLECTIONS.CDI_INVESTMENTS)
      .where('finished', '==', false)
      .get()

    console.log(`Starting cdi investments calculate (${ investmentsSnapshot.docs.length })`)
    console.time('All calculate was finished')
    await Promise.all(
      investmentsSnapshot.docs.map(async (investmentDoc) => {
        const investment = investmentDoc.data() as CDIInvestmentDocument
        const { cdiInvestment, cdiHistory } = await calculateCdiInvestment(db, investment)
        batch.update(investmentDoc.ref, cdiInvestment)

        const historyDoc = await db.collection(COLLECTIONS.CDI_INVESTMENT_HISTORY).doc(investmentDoc.id).get()
        const historyDocData = await historyDoc.data() as CDIInvestmentHistoryDocument
        batch.update(historyDoc.ref, {
          ...historyDocData,
          history: cdiHistory
        })
      })
    )
    console.timeLog('All calculate was finished')

    console.log('Commiting database changes...')
    console.time('Database changes has been commited')
    await batch.commit()
    console.timeLog('Database changes has been commited')
  }
}
