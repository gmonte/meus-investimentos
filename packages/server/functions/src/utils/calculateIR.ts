import * as moment from 'moment'

const getPercentage = (daysFromStart: number): number => {
  if (daysFromStart <= 180) return 22.5
  if (daysFromStart <= 360) return 20
  if (daysFromStart <= 720) return 17.5
  return 15
}

export const calculateIR = (grossValueIncome: number, startDate: string | Date, investmentDate: string | Date) => {
  const percentage = getPercentage(moment(investmentDate).diff(startDate, 'days'))

  return {
    percentage,
    value: grossValueIncome * (percentage / 100)
  }
}