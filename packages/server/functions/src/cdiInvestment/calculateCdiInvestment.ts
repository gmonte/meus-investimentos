import * as admin from 'firebase-admin'
import * as moment from 'moment'
import { last, findLast } from 'lodash'

import { COLLECTIONS } from '../constants'
import {
  CDIInvestmentDocument,
  InvestmentByDay,
  CDIDocument
} from '../types'
import { calculateIOF } from '../utils/calculateIOF'
import { calculateIR } from '../utils/calculateIR'
import { calculateGrowth } from '../utils/calculateGrowth'

export const calculateCdiInvestment = async (db: admin.firestore.Firestore, investment: CDIInvestmentDocument): Promise<CDIInvestmentDocument> => {
  const today = moment().startOf('day')

  const investmentFully: CDIInvestmentDocument = {
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
    finished: !!investment.dueDate && today.isAfter(investment.dueDate),
    history: []
  }

  const investmentEnd = investment.dueDate || moment(today).add(3, 'months').format('YYYY-MM-DD')
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
      } else if (investmentFully.finished) {
        paid = true
      } else {
        paid = investDate.isBefore(today)
      }

      let cdiByDay
      let isFeeProjected
      if (investDate.isSameOrBefore(lastCdiIndex.date)) {
        isFeeProjected = false
        cdiByDay = cdiIndexes.find(cdi => cdi.date === date) || { value: 0 }
      } else {
        isFeeProjected = true
        if (investDate.isoWeekday() === 6 || investDate.isoWeekday() === 7) { // weekend
          cdiByDay = { value: 0 }
        } else {
          cdiByDay = lastCdiIndex
        }
      }

      const cdiFeeDaily = (investment.cdiFee * cdiByDay.value) / 100

      const lastHistory = last(investmentFully.history)
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

      const investmentByDay: InvestmentByDay = {
        date,
        cdiFeeDaily,
        paid,
        isFeeProjected,
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

      investmentFully.history.push(investmentByDay)
      investDate.add(1, 'day')
    }

    const lastHistoryPaid = findLast(investmentFully.history, { paid: true })
    investmentFully.grossValue = lastHistoryPaid?.grossValue ?? investmentFully.grossValue
    investmentFully.grossValueIncome = lastHistoryPaid?.grossValueIncomeAccumulated ?? investmentFully.grossValueIncome
    investmentFully.grossGrowth = lastHistoryPaid?.grossGrowth ?? investmentFully.grossGrowth
    investmentFully.netValue = lastHistoryPaid?.netValue ?? investmentFully.netValue
    investmentFully.netValueIncome = lastHistoryPaid?.netValueIncomeAccumulated ?? investmentFully.netValueIncome
    investmentFully.netGrowth = lastHistoryPaid?.netGrowth ?? investmentFully.netGrowth

    const lastHistory = last(investmentFully.history)
    investmentFully.estimatedGrossValue = lastHistory?.grossValue ?? investmentFully.grossValue
    investmentFully.estimatedGrossValueIncome = lastHistory?.grossValueIncomeAccumulated ?? investmentFully.grossValueIncome
    investmentFully.estimatedGrossGrowth = lastHistory?.grossGrowth ?? investmentFully.grossGrowth
    investmentFully.estimatedNetValue = lastHistory?.netValue ?? investmentFully.netValue
    investmentFully.estimatedNetValueIncome = lastHistory?.netValueIncomeAccumulated ?? investmentFully.netValueIncome
    investmentFully.estimatedNetGrowth = lastHistory?.netGrowth ?? investmentFully.netGrowth
  }

  return investmentFully
}
