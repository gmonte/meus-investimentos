import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument } from '../types'
import { verifyInvestmentUserOwner } from '../utils/verifyUser'
import { calculateCdiInvestment } from './calculateCdiInvestment'

export const updateCdiInvestment = async (db: admin.firestore.Firestore, investment: CDIInvestmentDocument, user: UserRecord): Promise<CDIInvestmentDocument> => {
  if (investment.id) {
    const docRef = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc(investment.id)
    const snapshot = await docRef.get()
    const docData = await snapshot.data() as CDIInvestmentDocument

    verifyInvestmentUserOwner(docData, user)

    const investmentData = { ...docData, ...investment, user: user.uid }
    const investmentFully = await calculateCdiInvestment(db, investmentData)

    await docRef.update(investmentFully)

    return investmentFully
  }
  return {} as CDIInvestmentDocument
}