import * as admin from 'firebase-admin'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument } from '../types'
import { calculateCdiInvestment } from './calculateCdiInvestment'

export const updateCdiInvestment = async (db: admin.firestore.Firestore, investment: CDIInvestmentDocument): Promise<CDIInvestmentDocument> => {
  if (investment.id) {
    const docRef = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc(investment.id)
    const snapshot = await docRef.get()
    const docData = await snapshot.data()

    const investmentData = { ...docData, ...investment }
    const investmentFully = await calculateCdiInvestment(db, investmentData)

    await docRef.update(investmentFully)

    return investmentFully
  }
  return {} as CDIInvestmentDocument
}