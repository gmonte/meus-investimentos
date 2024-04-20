import * as admin from 'firebase-admin'

import { COLLECTIONS } from '../constants'
import { BankDocument } from '../types'

export const getBankList = async (db: admin.firestore.Firestore): Promise<BankDocument[]> => {
  const banks = await db.collection(COLLECTIONS.BANKS)
    .orderBy('name', 'asc')
    .get()

  return banks.docs.map(item => ({
    ...(item.data() as BankDocument),
    id: item.id
  }))
}
