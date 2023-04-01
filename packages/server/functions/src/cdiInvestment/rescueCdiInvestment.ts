import * as admin from 'firebase-admin'
import { UserRecord } from 'firebase-functions/v1/auth'
import { find } from 'lodash'
import * as moment from 'moment-timezone'

import { COLLECTIONS } from '../constants'
import { CDIInvestmentDocument, RescueCDIInvestment } from '../types'
import { verifyInvestmentUserOwner } from '../utils/verifyUser'
import { createCdiInvestment } from './createCdiInvestment'
import { updateCdiInvestment } from './updateCdiInvestment'

export const rescueCdiInvestment = async (db: admin.firestore.Firestore, data: RescueCDIInvestment, user: UserRecord): Promise<void> => {
  const snapshot = await db.collection(COLLECTIONS.CDI_INVESTMENTS).doc(data.investmentId).get()

  const investmentFully = await snapshot.data() as CDIInvestmentDocument

  verifyInvestmentUserOwner(investmentFully, user)

  const isTotalRescue = (investmentFully.netValue - data.value) < 0.01

  if (isTotalRescue) {
    await updateCdiInvestment(db, { ...investmentFully, rescueDate: data.date }, user)
  } else {
    // is partial rescue
    const dayBeforeRescue = find(investmentFully.history, { date: moment(data.date).add(-1, 'day').format('YYYY-MM-DD') })

    if (dayBeforeRescue) {
      const proportionalInvestedValue = (data.value * investmentFully.investedValue) / dayBeforeRescue.netValue

      const rescuedInvestment: CDIInvestmentDocument = {
        ...investmentFully,
        investedValue: proportionalInvestedValue,
        rescueDate: data.date,
        parentId: investmentFully.id
      }
      await createCdiInvestment(db, rescuedInvestment, user)

      const refreshedOriginalInvestment: CDIInvestmentDocument = {
        ...investmentFully,
        investedValue: investmentFully.investedValue - proportionalInvestedValue
      }
      await updateCdiInvestment(db, refreshedOriginalInvestment, user)
    }
  }
}
