export interface InvestmentByDay {
  date: string
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
  id: string
  name?: string
  user: string
  type: InvestmentType
  startDate: string
  dueDate?: string
  rescueDate?: string
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
  lastDatePaid?: string | null
  lastDateFeeConsolidated?: string | null
  profitabilityAvailableDate?: string | null
}

export interface ShortCDIInvestmentDocument extends Omit<CDIInvestmentDocument, 'history'> {}

export interface InvestmentFormData {
  id?: string
  name?: string
  type: InvestmentType
  startDate: string
  dueDate?: string
  investedValue: number
  cdiFee: number
}

export type UserResume = {
  investedValue: number
  grossValue: number
  grossValueIncome: number
  grossGrowth: number
  netValue: number
  netValueIncome: number
  netGrowth: number
}
