import * as admin from 'firebase-admin'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument } from '../types'
import { calculateCdiInvestment } from './calculateCdiInvestment'

export const createCdiInvestment = async (db: admin.firestore.Firestore, investment: CDIInvestmentDocument): Promise<CDIInvestmentDocument> => {
  try {
    const investmentFully = await calculateCdiInvestment(db, investment)
    const docRef = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc()
    const investmentToSave: CDIInvestmentDocument = { id: docRef.id, ...investmentFully }
    await docRef.set(investmentToSave)
  
    return investmentToSave
  } catch (err) {
    console.error(err)
    throw err
  }
}