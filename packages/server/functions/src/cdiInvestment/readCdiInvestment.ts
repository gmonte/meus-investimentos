import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument } from '../types'
import { verifyInvestmentUserOwner } from '../utils/verifyUser'

export const readCdiInvestment = async (db: admin.firestore.Firestore, { id }: CDIInvestmentDocument, user: UserRecord): Promise<CDIInvestmentDocument> => {
  if (id) {
    const docRef = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc(id)
    const snapshot = await docRef.get()
    const investmentFully = await snapshot.data() as CDIInvestmentDocument

    verifyInvestmentUserOwner(investmentFully, user)

    return investmentFully
  }
  return {} as CDIInvestmentDocument
}