import * as admin from 'firebase-admin'
import { collections } from './constants'
import { InvestmentDocument } from './types'

export const createCdiInvestment = async (db: admin.firestore.Firestore, investment: InvestmentDocument): Promise<InvestmentDocument> => {
  const res = await db.collection(collections.investments).add(investment)
  return { id: res.id, ...investment }
}