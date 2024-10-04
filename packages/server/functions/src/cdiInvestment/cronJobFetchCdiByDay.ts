import * as admin from 'firebase-admin'

import { COLLECTIONS } from '../constants'
import { fetchCdiByDay } from './fetchCdiByDay'
import { updateCdiInvestment } from './updateCdiInvestment'

export const cronJobFetchCdiByDay = async (db: admin.firestore.Firestore, forceToCalculate = false) => {
  const missingCdiIndexesLength = await fetchCdiByDay(db)

  console.log('cronJobFetchCdiByDay', {
    missingCdiIndexesLength,
    forceToCalculate
  })

  if (!!missingCdiIndexesLength || forceToCalculate) {
    const investmentsSnapshot = await db.collection(COLLECTIONS.CDI_INVESTMENTS)
      .where('finished', '==', false)
      .get()

    console.log(`Starting cdi investments calculate (${ investmentsSnapshot.docs.length })`)
    console.time('All calculate was finished')
    await Promise.all(
      investmentsSnapshot.docs.map(async (investmentDoc) => {
        await updateCdiInvestment(db, { id: investmentDoc.id })
      })
    )
    console.timeLog('All calculate was finished')

    console.log('Commiting database changes...')
    console.time('Database changes has been commited')
    console.timeLog('Database changes has been commited')
  }
}
