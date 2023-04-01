import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument, ShortCDIInvestmentDocument } from '../types'

export const readUserCdiInvestments = async (db: admin.firestore.Firestore, finished: string | undefined, user: UserRecord): Promise<ShortCDIInvestmentDocument[]> => {
  let query = db.collection(COLLECTIONS.CDI_INVESTMENTS)
    .where('user', '==', user.uid)

  if (finished === 'true') {
    query = query.where('finished', '==', true)
  } else if (finished === 'false') {
    query = query.where('finished', '==', false)
  }
  const snapshot = await query.orderBy('startDate', 'desc').get()

  return snapshot.docs.map<ShortCDIInvestmentDocument>((doc) => {
    const { history, ...data } = doc.data() as CDIInvestmentDocument
    return data
  })
}
