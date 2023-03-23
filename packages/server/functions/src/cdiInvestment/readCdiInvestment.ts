import * as admin from 'firebase-admin'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument } from '../types'

export const readCdiInvestment = async (db: admin.firestore.Firestore, investment: CDIInvestmentDocument): Promise<CDIInvestmentDocument> => {
  if (investment.id) {
    const docRef = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc(investment.id)
    const snapshot = await docRef.get()
    const investmentFully = await snapshot.data() as CDIInvestmentDocument
    return investmentFully
  }
  return {} as CDIInvestmentDocument
}