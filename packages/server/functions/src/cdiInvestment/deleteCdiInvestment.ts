import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument, CDIInvestmentHistoryDocument } from '../types'
import { verifyUserOwner } from '../utils/verifyUser'

export const deleteCdiInvestment = async (db: admin.firestore.Firestore, investment: CDIInvestmentDocument, user: UserRecord): Promise<void> => {
  if (investment.id) {
    const investmentDoc = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc(investment.id).get()
    const cdiInvestment = await investmentDoc.data() as CDIInvestmentDocument

    verifyUserOwner(cdiInvestment, user)

    const historyDoc = await db.collection(COLLECTIONS.CDI_INVESTMENT_HISTORY).doc(investment.id).get()
    const cdiHistory = await historyDoc.data() as CDIInvestmentHistoryDocument

    verifyUserOwner(cdiHistory, user)

    const batch = db.batch()
    batch.delete(investmentDoc.ref)
    batch.delete(historyDoc.ref)
    await batch.commit()
  }
}