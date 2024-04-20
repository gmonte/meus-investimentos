import * as moment from 'moment'

import { CDIInvestmentDocument } from '../types'

const getPercentage = (days: number): number => {
  const feeByDays = {
    day_1: 96,
    day_2: 93,
    day_3: 90,
    day_4: 86,
    day_5: 83,
    day_6: 80,
    day_7: 76,
    day_8: 73,
    day_9: 70,
    day_10: 66,
    day_11: 63,
    day_12: 60,
    day_13: 56,
    day_14: 53,
    day_15: 50,
    day_16: 46,
    day_17: 43,
    day_18: 40,
    day_19: 36,
    day_20: 33,
    day_21: 30,
    day_22: 26,
    day_23: 23,
    day_24: 20,
    day_25: 16,
    day_26: 13,
    day_27: 10,
    day_28: 6,
    day_29: 3
  }

  // @ts-expect-error
  return feeByDays[`day_${ days }`] || 0
}

export const calculateIOF = (grossValueIncome: number, investment: CDIInvestmentDocument, investmentDate: string | Date) => {
  const fee = getPercentage(moment(investmentDate).diff(investment.startDate, 'days') + 1)

  return {
    fee,
    value: grossValueIncome * (fee / 100)
  }
}
