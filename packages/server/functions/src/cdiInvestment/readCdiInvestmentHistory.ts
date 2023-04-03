import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentHistoryDocument } from '../types'
import { verifyUserOwner } from '../utils/verifyUser'

export const readCdiInvestmentHistory = async (db: admin.firestore.Firestore, { id }: CDIInvestmentHistoryDocument, user: UserRecord): Promise<CDIInvestmentHistoryDocument> => {
  if (id) {
    const historyDoc = await db.collection(COLLECTIONS.CDI_INVESTMENT_HISTORY).doc(id).get()
    const cdiHistory = await historyDoc.data() as CDIInvestmentHistoryDocument

    verifyUserOwner(cdiHistory, user)

    return cdiHistory
  }
  return {} as CDIInvestmentHistoryDocument
}