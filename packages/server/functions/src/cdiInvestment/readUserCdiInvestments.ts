import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument, ShortCDIInvestmentDocument } from '../types'

export const readUserCdiInvestments = async (db: admin.firestore.Firestore, user: UserRecord): Promise<ShortCDIInvestmentDocument[]> => {
  const snapshot = await db.collection(COLLECTIONS.CDI_INVESTMENTS)
    .where('user', '==', user.uid)
    .orderBy('startDate', 'desc')
    .get()

  return snapshot.docs.map<ShortCDIInvestmentDocument>((doc) => {
    const { history, ...data } = doc.data() as CDIInvestmentDocument
    return data
  })
}
