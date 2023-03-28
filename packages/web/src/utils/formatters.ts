export const precisionNumberWithoutRound = (number: number | string, precision = 2) => {
  const regex = new RegExp(`^-?\\d+(?:.\\d{0,${ precision || -1 }})?`)
  return Number(String(number).match(regex)?.[0] ?? 0)
}

export const formatNumber = (number: number | string, precision = 2) => {
  try {
    return Number(precisionNumberWithoutRound(number, precision)).toLocaleString('pt-BR')
  } catch (e) {
    console.error('formatNumber error:', e)
    return number
  }
}

export const formatCurrency = (num: number | string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(precisionNumberWithoutRound(num, 2))
}
