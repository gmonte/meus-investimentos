export interface CDIResponse {
  data: string
  valor: string
}

export interface CDIDocument {
  date: Date | string
  value: number
}

export interface InvestmentByDay {
  date: Date | string
  cdiFeeDaily: number
  grossValueIncome: number
  grossValueIncomeAccumulated: number
  grossValue: number
  grossGrowth: number
  paid: boolean
  isFeeConsolidated: boolean
  iofValue: number
  iofFee: number
  irValue: number
  irFee: number
  netValue: number
  netValueIncomeAccumulated: number
  netGrowth: number
}

export type InvestmentType = 'CDB' | 'LCI' | 'LCA'

export interface CDIInvestmentDocument {
  id?: string
  name?: string
  user: string
  type: InvestmentType
  startDate: Date | string
  dueDate?: Date | string
  rescueDate?: Date | string
  investedValue: number
  cdiFee: number
  finished?: boolean
  history: InvestmentByDay[]
  grossValue: number
  grossValueIncome: number
  grossGrowth: number
  netValue: number
  netValueIncome: number
  netGrowth: number
  estimatedGrossValue: number
  estimatedGrossValueIncome: number
  estimatedGrossGrowth: number
  estimatedNetValue: number
  estimatedNetValueIncome: number
  estimatedNetGrowth: number
  lastDatePaid?: Date | string
  lastDateFeeConsolidated?: Date | string
}

export type ShortCDIInvestmentDocument = Omit<CDIInvestmentDocument, 'history'>

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}
