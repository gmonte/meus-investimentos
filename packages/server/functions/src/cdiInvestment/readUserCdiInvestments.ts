import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument } from '../types'

export const readUserCdiInvestments = async (db: admin.firestore.Firestore, user: UserRecord): Promise<CDIInvestmentDocument[]> => {
  const snapshot = await db.collection(COLLECTIONS.CDI_INVESTMENTS)
    .where('user', '==', user.uid)
    .get()

  return snapshot.docs.map<CDIInvestmentDocument>(doc => doc.data() as CDIInvestmentDocument)
}
