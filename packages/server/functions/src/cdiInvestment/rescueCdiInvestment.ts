import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'
import { find } from 'lodash'
import * as moment from 'moment-timezone'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument, CDIInvestmentHistoryDocument, RescueCDIInvestment } from '../types'
import { verifyUserOwner } from '../utils/verifyUser'
import { createCdiInvestment } from './createCdiInvestment'
import { updateCdiInvestment } from './updateCdiInvestment'

export const rescueCdiInvestment = async (db: admin.firestore.Firestore, data: RescueCDIInvestment, user: UserRecord): Promise<void> => {
  const snapshot = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc(data.investmentId).get()

  const cdiInvestment = await snapshot.data() as CDIInvestmentDocument

  verifyUserOwner(cdiInvestment, user)

  const isTotalRescue = (cdiInvestment.netValue - data.value) < 0.01

  if (isTotalRescue) {
    await updateCdiInvestment(db, { ...cdiInvestment, rescueDate: data.date }, user)
  } else {
    // is partial rescue
    const historySnapshot = await db.collection(COLLECTIONS.CDI_INVESTMENT_HISTORY).doc(data.investmentId).get()
    const cdiHistory = await historySnapshot.data() as CDIInvestmentHistoryDocument

    const dayBeforeRescue = find(cdiHistory.history, { date: moment(data.date).add(-1, 'day').format('YYYY-MM-DD') })

    if (dayBeforeRescue) {
      const proportionalInvestedValue = (data.value * cdiInvestment.investedValue) / dayBeforeRescue.netValue

      const rescuedInvestment: CDIInvestmentDocument = {
        ...cdiInvestment,
        investedValue: proportionalInvestedValue,
        rescueDate: data.date,
        parentId: cdiInvestment.id
      }
      await createCdiInvestment(db, rescuedInvestment, user)

      const refreshedOriginalInvestment: CDIInvestmentDocument = {
        ...cdiInvestment,
        investedValue: cdiInvestment.investedValue - proportionalInvestedValue
      }
      await updateCdiInvestment(db, refreshedOriginalInvestment, user)
    }
  }
}
