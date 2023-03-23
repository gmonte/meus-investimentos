import * as admin from 'firebase-admin'
import * as moment from 'moment'
import { last, findLast } from 'lodash'
import { collections } from './constants'
import { InvestmentFully, InvestmentDocument, InvestmentByDay, CDIDocument } from './types'
import { calculateIOF } from './utils/calculateIOF'
import { calculateIR } from './utils/calculateIR'

export const getCdiInvestment = async (db: admin.firestore.Firestore, { id }: InvestmentDocument): Promise<InvestmentFully> => {
  if (id) {
    const snapshot = await db.collection(collections.investments).doc(id).get()
    if (snapshot) {
      const investment = await snapshot.data() as InvestmentDocument
      const investmentFully: InvestmentFully = {
        ...investment,
        grossValue: investment.investedValue,
        grossValueIncome: 0,
        netValue: investment.investedValue,
        netValueIncome: 0,
        predictedGrossValue: investment.investedValue,
        predictedGrossValueIncome: 0,
        predictedNetValue: investment.investedValue,
        predictedNetValueIncome: 0,
        history: [],
      }

      const today = moment()
      const investmentEnd = investment.dueDate || moment(today).add(3, 'months').format('YYYY-MM-DD')
      let investDate = moment(investment.startDate)

      const cdiIndexesSnapshot = await db.collection(collections.cdiIndexes)
        .where('date', '>=', investment.startDate)
        .where('date', '<=', investmentEnd)
        .orderBy('date', 'asc')
        .get()

      const cdiIndexes = cdiIndexesSnapshot.docs.map<CDIDocument>(doc => doc.data() as CDIDocument)
      const lastCdiIndex = last(cdiIndexes)

      if (lastCdiIndex) {
        while (investDate.isSameOrBefore(investmentEnd)) {
          const date = investDate.format('YYYY-MM-DD')

          let predicted = !!investment.rescueDate && investDate.isSameOrAfter(investment.rescueDate)
          let cdiByDay
          if (investDate.isSameOrBefore(moment(lastCdiIndex.date))) {
            cdiByDay = cdiIndexes.find(cdi => cdi.date === date) || { value: 0 }
          } else {
            predicted = true
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

          const {
            fee: iofFee,
            value: iofValue,
          } = calculateIOF(grossValueIncomeAccumulated, investment.startDate, date)

          let netValueIncomeAccumulated = grossValueIncomeAccumulated - iofValue

          const {
            percentage: irFee,
            value: irValue,
          } = calculateIR(netValueIncomeAccumulated, investment.startDate, date)

          netValueIncomeAccumulated = netValueIncomeAccumulated - irValue

          const netValue = netValueIncomeAccumulated + investment.investedValue

          const investmentByDay: InvestmentByDay = {
            date,
            cdiFeeDaily,
            predicted,
            grossValueIncome,
            grossValueIncomeAccumulated,
            grossValue,
            iofFee,
            iofValue,
            irFee,
            irValue,
            netValueIncomeAccumulated,
            netValue
          }

          investmentFully.history.push(investmentByDay)
          investDate.add(1, 'day')
        }

        const lastHistoryNotPredicted = findLast(investmentFully.history, { predicted: false })
        investmentFully.grossValue = lastHistoryNotPredicted?.grossValue ?? investmentFully.grossValue
        investmentFully.grossValueIncome = lastHistoryNotPredicted?.grossValueIncomeAccumulated ?? investmentFully.grossValueIncome
        investmentFully.netValue = lastHistoryNotPredicted?.netValue ?? investmentFully.netValue
        investmentFully.netValueIncome = lastHistoryNotPredicted?.netValueIncomeAccumulated ?? investmentFully.netValueIncome

        const lastHistory = last(investmentFully.history)
        investmentFully.predictedGrossValue = lastHistory?.grossValue ?? investmentFully.grossValue
        investmentFully.predictedGrossValueIncome = lastHistory?.grossValueIncomeAccumulated ?? investmentFully.grossValueIncome
        investmentFully.predictedNetValue = lastHistory?.netValue ?? investmentFully.netValue
        investmentFully.predictedNetValueIncome = lastHistory?.netValueIncomeAccumulated ?? investmentFully.netValueIncome

        return investmentFully
      }
    }
  }
  return {} as InvestmentFully
}