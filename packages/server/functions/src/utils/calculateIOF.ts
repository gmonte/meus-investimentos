import * as moment from 'moment'
import { CDIInvestmentDocument } from '../types'

const getPercentage = (days: number): number => {
  const feeByDays = {
    '1': 96,
    '2': 93,
    '3': 90,
    '4': 86,
    '5': 83,
    '6': 80,
    '7': 76,
    '8': 73,
    '9': 70,
    '10': 66,
    '11': 63,
    '12': 60,
    '13': 56,
    '14': 53,
    '15': 50,
    '16': 46,
    '17': 43,
    '18': 40,
    '19': 36,
    '20': 33,
    '21': 30,
    '22': 26,
    '23': 23,
    '24': 20,
    '25': 16,
    '26': 13,
    '27': 10,
    '28': 6,
    '29': 3
  }

  //@ts-ignore
  return feeByDays[days.toString()] || 0
}

export const calculateIOF = (grossValueIncome: number, investment: CDIInvestmentDocument, investmentDate: string | Date) => {
  const fee = getPercentage(moment(investmentDate).diff(investment.startDate, 'days') + 1)

  return {
    fee,
    value: grossValueIncome * (fee / 100)
  }
}