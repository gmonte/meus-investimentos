import * as admin from 'firebase-admin'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument } from '../types'

export const deleteCdiInvestment = async (db: admin.firestore.Firestore, investment: CDIInvestmentDocument): Promise<void> => {
  if (investment.id) {
    const docRef = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc(investment.id)
    await docRef.delete()
  }
}