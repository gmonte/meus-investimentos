import { useMemo } from 'react'
import ApexChart from 'react-apexcharts'
import { renderToString } from 'react-dom/server'

import map from 'lodash/map'
import moment from 'moment/moment'
import { CircleNotch } from 'phosphor-react'

import { FetchErrorMessage } from '~/components/FetchErrorMessage'
import { Growth } from '~/components/Growth'
import { Modal } from '~/components/Modal'
import { Text } from '~/components/Text'
import { ModalProps } from '~/hooks/useModal'
import { api } from '~/services/api'
import {
  formatCurrency,
  formatNumber
} from '~/utils/formatters'

import { TooltipItem } from '../components/TooltipItem'

export interface InvestmentHistoryModalProps extends ModalProps {
  investmentId: string
}

export function InvestmentHistoryModal({
  open,
  close,
  investmentId
}: InvestmentHistoryModalProps) {
  const {
    data,
    isLoading,
    isError: isErrorGetCdiInvestmentHistory,
    error: errorGetCdiInvestmentHistory
  } = api.useGetCdiInvestmentHistoryQuery(investmentId)

  const error = useMemo(
    () => {
      if (isErrorGetCdiInvestmentHistory) {
        return <FetchErrorMessage error={ errorGetCdiInvestmentHistory } />
      }
      return null
    },
    [errorGetCdiInvestmentHistory, isErrorGetCdiInvestmentHistory]
  )

  const options = useMemo<ApexCharts.ApexOptions>(
    () => ({
      chart: {
        background: 'transparent',
        animations: { enabled: false },
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors: ['#c18e1f', '#3dbcaf', '#764184', '#2290de'],
      theme: { mode: 'dark' },
      dataLabels: { enabled: false },
      stroke: { curve: 'straight' },
      xaxis: {
        type: 'category',
        categories: map(data?.history, item => moment(item.date).format('L')),
        axisTicks: { show: false },
        labels: { show: false }
      },
      yaxis: {
        labels: { formatter: formatCurrency },
        showForNullSeries: false
      },
      tooltip: {
        custom({ dataPointIndex, w }: { dataPointIndex: number, w: { globals: { categoryLabels: string[], colors: string[], seriesNames: string [] } }}) {
          const historyItem = data?.history?.[dataPointIndex]
          const label = w.globals.categoryLabels[dataPointIndex]
          return renderToString(
            <>
              <div className="apexcharts-tooltip-title">
                {label}
              </div>

              <div className="mb-3">
                {!!historyItem && (
                  <>
                    {historyItem.paid && historyItem.grossValue && (
                      <TooltipItem
                        color={ w.globals.colors[0] }
                        label={ w.globals.seriesNames[0] }
                      >
                        <Text>
                          {formatCurrency(historyItem.grossValue)}
                        </Text>
                        <Growth>
                          {formatNumber(historyItem.grossGrowth)}%
                        </Growth>
                        <Growth>
                          {formatCurrency(historyItem.grossValueIncomeAccumulated)}
                        </Growth>
                      </TooltipItem>
                    )}

                    {!historyItem.paid && historyItem.grossValue && (
                      <TooltipItem
                        color={ w.globals.colors[2] }
                        label={ w.globals.seriesNames[2] }
                      >
                        <Text>
                          {formatCurrency(historyItem.grossValue)}
                        </Text>
                        <Growth>
                          {formatNumber(historyItem.grossGrowth)}%
                        </Growth>
                        <Growth>
                          {formatCurrency(historyItem.grossValueIncomeAccumulated)}
                        </Growth>
                      </TooltipItem>
                    )}

                    <TooltipItem
                      color="rgb(239 68 68)"
                      label="IOF"
                    >
                      <Text>
                        {formatCurrency(historyItem.iofValue)}
                      </Text>
                    </TooltipItem>

                    <TooltipItem
                      color="rgb(239 68 68)"
                      label="IR"
                    >
                      <Text>
                        {formatCurrency(historyItem.irValue)}
                      </Text>
                    </TooltipItem>

                    {historyItem.paid && historyItem.netValue && (
                      <TooltipItem
                        color={ w.globals.colors[1] }
                        label={ w.globals.seriesNames[1] }
                      >
                        <Text>
                          {formatCurrency(historyItem.netValue)}
                        </Text>
                        <Growth>
                          {formatNumber(historyItem.netGrowth)}%
                        </Growth>
                        <Growth>
                          {formatCurrency(historyItem.netValueIncomeAccumulated)}
                        </Growth>
                      </TooltipItem>
                    )}

                    {!historyItem.paid && historyItem.netValue && (
                      <TooltipItem
                        color={ w.globals.colors[3] }
                        label={ w.globals.seriesNames[3] }
                      >
                        <Text>
                          {formatCurrency(historyItem.netValue)}
                        </Text>
                        <Growth>
                          {formatNumber(historyItem.netGrowth)}%
                        </Growth>
                        <Growth>
                          {formatCurrency(historyItem.netValueIncomeAccumulated)}
                        </Growth>
                      </TooltipItem>
                    )}
                  </>
                )}
              </div>
            </>
          )
        }
      }
    }),
    [data?.history]
  )

  const series = useMemo<ApexAxisChartSeries>(
    () => [
      {
        name: 'Valor bruto',
        data: map(data?.history, item => item.paid ? item.grossValue : null)
      },
      {
        name: 'Valor líquido',
        data: map(data?.history, item => item.paid ? item.netValue : null)
      },
      {
        name: 'Valor bruto estimado',
        data: map(data?.history, item => item.paid ? null : item.grossValue)
      },
      {
        name: 'Valor líquido estimado',
        data: map(data?.history, item => item.paid ? null : item.netValue)
      }
    ],
    [data?.history]
  )

  return (
    <Modal.Root open={ open } close={ close } className="max-w-7xl">
      <Modal.Title>
        Histórico do Investimento
      </Modal.Title>

      {error ?? (
        <Modal.Description>
          <div className="py-6">
            {isLoading
              ? (
                <div className="flex justify-center">
                  <CircleNotch
                    weight="bold"
                    className="animate-spin text-cyan-300"
                    size={ 40 }
                  />
                </div>
                )
              : (
                <div>
                  <ApexChart
                    options={ options }
                    series={ series }
                    height={ 350 }
                    type="area"
                  />
                </div>
                )}
          </div>
        </Modal.Description>
      )}
    </Modal.Root>
  )
}
