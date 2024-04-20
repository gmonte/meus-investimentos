import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'

import { COLLECTIONS } from '../constants'
import {
  CDIInvestmentDocument,
  UserResume
} from '../types'
import { calculateGrowth } from '../utils/calculateGrowth'

export const getUserResume = async (db: admin.firestore.Firestore, finished: string | undefined, user: UserRecord): Promise<UserResume> => {
  let query = db.collection(COLLECTIONS.CDI_INVESTMENTS)
    .where('user', '==', user.uid)

  if (finished === 'true') {
    query = query.where('finished', '==', true)
  } else if (finished === 'false') {
    query = query.where('finished', '==', false)
  }
  const snapshot = await query.orderBy('startDate', 'desc').get()

  const resume = snapshot.docs.reduce<Omit<UserResume, 'grossGrowth' | 'netGrowth'>>(
    (acc, doc) => {
      const {
        investedValue,
        grossValue,
        grossValueIncome,
        netValue,
        netValueIncome
      } = doc.data() as CDIInvestmentDocument
      return {
        investedValue: acc.investedValue + investedValue,
        grossValue: acc.grossValue + grossValue,
        grossValueIncome: acc.grossValueIncome + grossValueIncome,
        netValue: acc.netValue + netValue,
        netValueIncome: acc.netValueIncome + netValueIncome
      }
    },
    {
      investedValue: 0,
      grossValue: 0,
      grossValueIncome: 0,
      netValue: 0,
      netValueIncome: 0
    }
  )

  return {
    ...resume,
    grossGrowth: calculateGrowth(resume.investedValue, resume.grossValueIncome),
    netGrowth: calculateGrowth(resume.investedValue, resume.netValueIncome)
  }
}
