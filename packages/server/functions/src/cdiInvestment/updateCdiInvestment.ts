import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import {
  CDIInvestmentDocument,
  CDIInvestmentHistoryDocument
} from '../types'
import { verifyUserOwner } from '../utils/verifyUser'
import { calculateCdiInvestment } from './calculateCdiInvestment'

export const updateCdiInvestment = async (db: admin.firestore.Firestore, investment: CDIInvestmentDocument, user: UserRecord): Promise<void> => {
  if (investment.id) {
    const investmentDoc = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc(investment.id).get()
    const investmentDocData = await investmentDoc.data() as CDIInvestmentDocument

    verifyUserOwner(investmentDocData, user)

    const investmentData = {
      ...investmentDocData,
      ...investment,
      user: user.uid
    }
    const { cdiInvestment, cdiHistory } = await calculateCdiInvestment(db, investmentData)

    const historyDoc = await db.collection(COLLECTIONS.CDI_INVESTMENT_HISTORY).doc(investment.id).get()
    const historyDocData = await historyDoc.data() as CDIInvestmentHistoryDocument

    verifyUserOwner(historyDocData, user)

    const batch = db.batch()
    batch.update(investmentDoc.ref, cdiInvestment)
    batch.update(historyDoc.ref, {
      ...historyDocData,
      history: cdiHistory
    })

    await batch.commit()
  }
}
