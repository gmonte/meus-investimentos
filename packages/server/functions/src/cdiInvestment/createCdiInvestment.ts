import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import {
  CDIInvestmentDocument,
  CDIInvestmentHistoryDocument
} from '../types'
import { calculateCdiInvestment } from './calculateCdiInvestment'

export const createCdiInvestment = async (db: admin.firestore.Firestore, investment: CDIInvestmentDocument, user: UserRecord): Promise<void> => {
  try {
    const batch = db.batch()

    const { cdiInvestment, cdiHistory } = await calculateCdiInvestment(db, investment)
    const investmentDocRef = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc()
    const historyDocRef = await db.collection(COLLECTIONS.CDI_INVESTMENT_HISTORY).doc(investmentDocRef.id)

    const investmentToSave: CDIInvestmentDocument = {
      ...cdiInvestment,
      id: investmentDocRef.id,
      user: user.uid
    }

    const historyToSave: CDIInvestmentHistoryDocument = {
      id: historyDocRef.id,
      user: user.uid,
      history: cdiHistory
    }

    batch.create(investmentDocRef, investmentToSave)
    batch.create(historyDocRef, historyToSave)

    await batch.commit()
  } catch (err) {
    console.error(err)
    throw err
  }
}
