import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import { TargetDocument } from '../types'

export const getUserTargets = async (db: admin.firestore.Firestore, user: UserRecord): Promise<TargetDocument[]> => {
  const userTargets = await db.collection(COLLECTIONS.TARGETS)
    .where('user', '==', user.uid)
    .get()

  return userTargets.docs.map(item => ({
    id: item.id,
    ...(item.data() as TargetDocument)
  }))
}
