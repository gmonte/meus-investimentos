export interface CDIResponse {
  data: string
  valor: string
}

export interface CDIDocument {
  date: Date | string
  value: number
}

export interface InvestmentDocument {
  id?: string
  user?: string
  startDate: Date | string
  dueDate?: Date | string
  rescueDate?: Date | string
  investedValue: number
  cdiFee: number
}

export interface InvestmentByDay {
  date: Date | string
  cdiFeeDaily: number
  grossValueIncome: number
  grossValueIncomeAccumulated: number
  grossValue: number
  predicted: boolean
  iofValue: number
  iofFee: number
  irValue: number
  irFee: number
  netValue: number
  netValueIncomeAccumulated: number
}

export interface InvestmentFully extends InvestmentDocument {
  history: InvestmentByDay[]
  grossValue: number
  grossValueIncome: number
  netValue: number
  netValueIncome: number
  predictedGrossValue: number
  predictedGrossValueIncome: number
  predictedNetValue: number
  predictedNetValueIncome: number
}