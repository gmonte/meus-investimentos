import * as moment from 'moment'
import { CDIInvestmentDocument, InvestmentType } from '../types'

const getPercentage = (type: InvestmentType, days: number): number => {
  if (type === 'LCI' || type === 'LCA') {
    return 0
  }

  if (days <= 180) return 22.5
  if (days <= 360) return 20
  if (days <= 720) return 17.5
  return 15
}

export const calculateIR = (grossValueIncome: number, investment: CDIInvestmentDocument, investmentDate: string | Date) => {
  const percentage = getPercentage(investment.type, moment(investmentDate).diff(investment.startDate, 'days') + 1)

  return {
    percentage,
    value: grossValueIncome * (percentage / 100)
  }
}