import { BankDocument } from './Bank'
import { TargetDocument } from './Target'

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
  investmentId: string
  user: string
  history: CDIInvestmentHistoryItem[]
}

export type InvestmentType = 'CDB' | 'LCI' | 'LCA'

export interface CDIInvestmentDocument {
  id: string
  bank?: BankDocument
  target?: TargetDocument
  user: string
  type: InvestmentType
  startDate: string
  dueDate?: string
  rescueDate?: string
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
  lastDatePaid?: string | null
  lastDateFeeConsolidated?: string | null
  profitabilityAvailableDate?: string | null
  parentId?: string
  historyId: string
}

export interface ShortCDIInvestmentDocument extends Omit<CDIInvestmentDocument, 'history'> {}

export interface InvestmentFormData {
  id?: string
  bank?: string
  target?: string
  type: InvestmentType
  startDate: string
  dueDate?: string
  investedValue: number
  cdiFee: number
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
  date: string
  value: number
}

export interface RescueFormData extends RescueCDIInvestment {}
