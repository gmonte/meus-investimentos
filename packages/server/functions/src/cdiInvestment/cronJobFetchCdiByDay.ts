import * as admin from 'firebase-admin'
import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument } from '../types'
import { calculateCdiInvestment } from './calculateCdiInvestment'
import { fetchCdiByDay } from './fetchCdiByDay'

export const cronJobFetchCdiByDay = async (db: admin.firestore.Firestore, forceToCalculate = false) => {
  const missingDataLength = await fetchCdiByDay(db)

  if (missingDataLength || forceToCalculate) {
    const batch = db.batch()

    const investmentsSnapshot = await db.collection(COLLECTIONS.CDI_INVESTMENTS)
      .where('finished', '==', false)
      .get()

    console.log(`Start calculating cdi investments (${ investmentsSnapshot.docs.length })`)

    await Promise.all(
      investmentsSnapshot.docs.map(async (doc) => {
        const investment = doc.data() as CDIInvestmentDocument
        const investmentFully = await calculateCdiInvestment(db, investment)
        batch.update(doc.ref, investmentFully)
      })
    )

    console.log('All calculate was finished')

    await batch.commit()
  }
}
