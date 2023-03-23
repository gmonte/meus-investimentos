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
  paid: boolean
  isFeeProjected: boolean
  iofValue: number
  iofFee: number
  irValue: number
  irFee: number
  netValue: number
  netValueIncomeAccumulated: number
}

export type InvestmentType = 'CDB' | 'LCI' | 'LCA'

export interface CDIInvestmentDocument {
  id?: string
  user?: string
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
  netValue: number
  netValueIncome: number
  estimatedGrossValue: number
  estimatedGrossValueIncome: number
  estimatedNetValue: number
  estimatedNetValueIncome: number
}
