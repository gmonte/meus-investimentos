import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { getBankList } from '../bank/getBankList'
import { COLLECTIONS } from '../constants'
import { getUserTargets } from '../target/getUserTargets'
import {
  CDIInvestmentDocument,
  FilledShortCDIInvestmentDocument
} from '../types'

export const readUserCdiInvestments = async (db: admin.firestore.Firestore, finished: string | undefined, user: UserRecord): Promise<FilledShortCDIInvestmentDocument[]> => {
  let query = db.collection(COLLECTIONS.CDI_INVESTMENTS)
    .where('user', '==', user.uid)

  if (finished === 'true') {
    query = query.where('finished', '==', true)
  } else if (finished === 'false') {
    query = query.where('finished', '==', false)
  }
  const snapshot = await query.orderBy('startDate', 'desc').get()

  const userTargets = await getUserTargets(db, user)
  const banks = await getBankList(db)

  return snapshot.docs.map<FilledShortCDIInvestmentDocument>(
    (doc) => {
      const {
        target,
        bank,
        ...cdiInvestment
      } = doc.data() as CDIInvestmentDocument
      return {
        ...cdiInvestment,
        target: userTargets.find(userTarget => userTarget.id === target),
        bank: banks.find(b => b.id === bank)
      }
    }
  )
}
