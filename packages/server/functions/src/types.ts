export interface TargetDocument {
  id?: string
  user: string
  name: string
}

export interface CDIResponse {
  data: string
  valor: string
}

export interface CDIDocument {
  date: Date | string
  value: number
}

export interface CDIInvestmentHistoryItem {
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

export interface CDIInvestmentHistoryDocument {
  id: string
  user: string
  history: CDIInvestmentHistoryItem[]
}

export type InvestmentType = 'CDB' | 'LCI' | 'LCA'

export interface CDIInvestmentDocument {
  id?: string
  bank?: string
  target?: string
  user: string
  type: InvestmentType
  startDate: Date | string
  dueDate?: Date | string
  rescueDate?: Date | string
  investedValue: number
  cdiFee: number
  finished?: boolean
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
  lastDatePaid?: Date | string | null
  lastDateFeeConsolidated?: Date | string | null
  profitabilityAvailableDate?: Date | string | null
  parentId?: string
}

export type ShortCDIInvestmentDocument = Omit<CDIInvestmentDocument, 'history'>

export type FilledShortCDIInvestmentDocument = Omit<ShortCDIInvestmentDocument, 'target'> & {
  target?: TargetDocument
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface UserResume {
  investedValue: number
  grossValue: number
  grossValueIncome: number
  grossGrowth: number
  netValue: number
  netValueIncome: number
  netGrowth: number
}

export interface RescueCDIInvestment {
  investmentId: string
  date: Date | string
  value: number
}
