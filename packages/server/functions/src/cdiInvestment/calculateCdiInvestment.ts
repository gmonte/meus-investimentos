import * as admin from 'firebase-admin'
import * as moment from 'moment-timezone'
import { last, findLast } from 'lodash'

import { COLLECTIONS } from '../constants'
import {
  CDIInvestmentDocument,
  CDIDocument,
  CDIInvestmentHistoryItem
} from '../types'
import { calculateIOF } from '../utils/calculateIOF'
import { calculateIR } from '../utils/calculateIR'
import { calculateGrowth } from '../utils/calculateGrowth'

export const calculateCdiInvestment = async (db: admin.firestore.Firestore, investment: CDIInvestmentDocument): Promise<{
  cdiInvestment: CDIInvestmentDocument,
  cdiHistory: CDIInvestmentHistoryItem[]
}> => {
  const today = moment().startOf('day')

  const investmentEnd = (investment.rescueDate && moment(investment.rescueDate).add(-1, 'day').format('YYYY-MM-DD')) || investment.dueDate || moment(today).add(3, 'months').format('YYYY-MM-DD')

  const cdiInvestment: CDIInvestmentDocument = {
    ...investment,
    grossValue: investment.investedValue,
    grossValueIncome: 0,
    grossGrowth: 0,
    netValue: investment.investedValue,
    netValueIncome: 0,
    netGrowth: 0,
    estimatedGrossValue: investment.investedValue,
    estimatedGrossValueIncome: 0,
    estimatedGrossGrowth: 0,
    estimatedNetValue: investment.investedValue,
    estimatedNetValueIncome: 0,
    estimatedNetGrowth: 0,
    finished: today.isAfter(investmentEnd),
    lastDateFeeConsolidated: null,
    lastDatePaid: null,
    profitabilityAvailableDate: null
  }

  const cdiHistory: CDIInvestmentHistoryItem[] = [] 

  let investDate = moment(investment.startDate)

  const cdiIndexesSnapshot = await db.collection(COLLECTIONS.CDI_INDEXES)
    .where('date', '>=', investment.startDate)
    .where('date', '<=', investmentEnd)
    .orderBy('date', 'asc')
    .get()

  const cdiIndexes = cdiIndexesSnapshot.docs.map<CDIDocument>(doc => doc.data() as CDIDocument)
  let lastCdiIndex = last(cdiIndexes)
  if (!lastCdiIndex) {
    const snapshot = await db.collection(COLLECTIONS.CDI_INDEXES).orderBy('date', 'desc').limit(1).get()
    const [lastRegister] = snapshot.docs.map<CDIDocument>(doc => doc.data() as CDIDocument)
    lastCdiIndex = lastRegister
  }

  if (lastCdiIndex) {
    while (investDate.isSameOrBefore(investmentEnd)) {
      const date = investDate.format('YYYY-MM-DD')

      let paid
      if (investment.rescueDate) {
        paid = investDate.isBefore(investment.rescueDate)
      } else if (cdiInvestment.finished) {
        paid = true
      } else {
        paid = investDate.isBefore(today)
      }

      let cdiByDay
      let isFeeConsolidated
      if (investDate.isSameOrBefore(lastCdiIndex.date)) {
        isFeeConsolidated = true
        cdiByDay = cdiIndexes.find(cdi => cdi.date === date) || { value: 0 }
      } else {
        isFeeConsolidated = false
        if (investDate.isoWeekday() === 6 || investDate.isoWeekday() === 7) { // weekend
          cdiByDay = { value: 0 }
        } else {
          cdiByDay = lastCdiIndex
        }
      }

      const cdiFeeDaily = (investment.cdiFee * cdiByDay.value) / 100

      const lastHistory = last(cdiHistory)
      const lastGrossValueToCalculate = lastHistory?.grossValue ?? investment.investedValue

      const grossValueIncome = lastGrossValueToCalculate * (cdiFeeDaily / 100)
      const grossValue = lastGrossValueToCalculate + grossValueIncome
      const grossValueIncomeAccumulated = (lastHistory?.grossValueIncomeAccumulated || 0) + grossValueIncome
      const grossGrowth = calculateGrowth(investment.investedValue, grossValueIncomeAccumulated)

      const {
        fee: iofFee,
        value: iofValue,
      } = calculateIOF(grossValueIncomeAccumulated, investment, date)

      let netValueIncomeAccumulated = grossValueIncomeAccumulated - iofValue

      const {
        percentage: irFee,
        value: irValue,
      } = calculateIR(netValueIncomeAccumulated, investment, date)

      netValueIncomeAccumulated = netValueIncomeAccumulated - irValue

      const netValue = netValueIncomeAccumulated + investment.investedValue
      const netGrowth = calculateGrowth(investment.investedValue, netValueIncomeAccumulated)

      const investmentHistoryByDay: CDIInvestmentHistoryItem = {
        date,
        cdiFeeDaily,
        paid,
        isFeeConsolidated,
        grossValueIncome,
        grossValueIncomeAccumulated,
        grossValue,
        grossGrowth,
        iofFee,
        iofValue,
        irFee,
        irValue,
        netValueIncomeAccumulated,
        netValue,
        netGrowth
      }

      cdiHistory.push(investmentHistoryByDay)
      investDate.add(1, 'day')
    }

    const lastHistoryPaid = findLast(cdiHistory, { paid: true })
    cdiInvestment.grossValue = lastHistoryPaid?.grossValue ?? cdiInvestment.grossValue
    cdiInvestment.grossValueIncome = lastHistoryPaid?.grossValueIncomeAccumulated ?? cdiInvestment.grossValueIncome
    cdiInvestment.grossGrowth = lastHistoryPaid?.grossGrowth ?? cdiInvestment.grossGrowth
    cdiInvestment.netValue = lastHistoryPaid?.netValue ?? cdiInvestment.netValue
    cdiInvestment.netValueIncome = lastHistoryPaid?.netValueIncomeAccumulated ?? cdiInvestment.netValueIncome
    cdiInvestment.netGrowth = lastHistoryPaid?.netGrowth ?? cdiInvestment.netGrowth
    cdiInvestment.lastDatePaid = lastHistoryPaid?.date ?? cdiInvestment.lastDatePaid
    cdiInvestment.profitabilityAvailableDate = cdiInvestment.lastDatePaid ? moment(cdiInvestment.lastDatePaid).add(1, 'day').format('YYYY-MM-DD') : cdiInvestment.profitabilityAvailableDate
    
    cdiInvestment.lastDateFeeConsolidated = findLast(cdiHistory, { isFeeConsolidated: true })?.date ?? cdiInvestment.lastDateFeeConsolidated

    const lastHistory = last(cdiHistory)
    cdiInvestment.estimatedGrossValue = lastHistory?.grossValue ?? cdiInvestment.grossValue
    cdiInvestment.estimatedGrossValueIncome = lastHistory?.grossValueIncomeAccumulated ?? cdiInvestment.grossValueIncome
    cdiInvestment.estimatedGrossGrowth = lastHistory?.grossGrowth ?? cdiInvestment.grossGrowth
    cdiInvestment.estimatedNetValue = lastHistory?.netValue ?? cdiInvestment.netValue
    cdiInvestment.estimatedNetValueIncome = lastHistory?.netValueIncomeAccumulated ?? cdiInvestment.netValueIncome
    cdiInvestment.estimatedNetGrowth = lastHistory?.netGrowth ?? cdiInvestment.netGrowth
  }

  return {
    cdiInvestment,
    cdiHistory
  }
}
