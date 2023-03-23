import * as moment from 'moment'
import { CDIInvestmentDocument, InvestmentType } from '../types'

const getPercentage = (type: InvestmentType, daysFromStart: number): number => {
  if (type === 'LCI' || type === 'LCA') {
    return 0
  }

  if (daysFromStart <= 180) return 22.5
  if (daysFromStart <= 360) return 20
  if (daysFromStart <= 720) return 17.5
  return 15
}

export const calculateIR = (grossValueIncome: number, investment: CDIInvestmentDocument, investmentDate: string | Date) => {
  const percentage = getPercentage(investment.type, moment(investmentDate).diff(investment.startDate, 'days'))

  return {
    percentage,
    value: grossValueIncome * (percentage / 100)
  }
}