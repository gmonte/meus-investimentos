import { useMemo } from 'react'

import { LineChart } from 'amazing-react-charts'
import { CircleNotch } from 'phosphor-react'

import { Button } from '~/components/Button'
import { FetchErrorMessage } from '~/components/FetchErrorMessage'
import { Modal } from '~/components/Modal'
import { ModalProps } from '~/hooks/useModal'
import { api } from '~/services/api'

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

  console.log('data', data)

  return (
    <Modal.Root open={ open } close={ close }>
      <Modal.Title>
        Histórico de Investimento
      </Modal.Title>

      {error ?? (
        <Modal.Description>
          {isLoading
            ? (
              <div className="flex justify-center mt-8">
                <CircleNotch
                  weight="bold"
                  className="animate-spin text-cyan-300"
                  size={ 40 }
                />
              </div>
              )
            : (
              <LineChart
                showLabel
                title="Concurrent lines"
                xType="time"
                toolboxTooltip={ { saveAsImage: 'saving' } }
                dateFormat="yyyy-MM"
                colors={ ['red', 'green', 'blue'] }
                data={ [
                  {
                    name: 'top line',
                    values: [
                      {
                        label: '2019-01',
                        result: 10
                      },
                      {
                        label: '2019-02',
                        result: 40
                      },
                      {
                        label: '2019-03',
                        result: 30
                      },
                      {
                        label: '2019-04',
                        result: 20
                      },
                      {
                        label: '2019-05',
                        result: 40
                      },
                      {
                        label: '2019-06',
                        result: 50
                      },
                      {
                        label: '2019-07',
                        result: 15
                      },
                      {
                        label: '2019-08',
                        result: 70
                      },
                      {
                        label: '2019-09',
                        result: 80
                      },
                      {
                        label: '2019-10',
                        result: 90
                      },
                      {
                        label: '2019-11',
                        result: 70
                      },
                      {
                        label: '2019-12',
                        result: 80
                      },
                      {
                        label: '2019-01',
                        result: 90
                      }
                    ]
                  },
                  {
                    name: 'bottom line',
                    values: [
                      {
                        label: '2019-01',
                        result: 1
                      },
                      {
                        label: '2019-02',
                        result: 4
                      },
                      {
                        label: '2019-03',
                        result: 3
                      },
                      {
                        label: '2019-04',
                        result: 2
                      },
                      {
                        label: '2019-05',
                        result: 4
                      },
                      {
                        label: '2019-06',
                        result: 5
                      },
                      {
                        label: '2019-07',
                        result: 1
                      },
                      {
                        label: '2019-08',
                        result: 7
                      },
                      {
                        label: '2019-09',
                        result: 8
                      },
                      {
                        label: '2019-10',
                        result: 9
                      },
                      {
                        label: '2019-11',
                        result: 70
                      },
                      {
                        label: '2019-12',
                        result: 80
                      },
                      {
                        label: '2019-01',
                        result: 90
                      }
                    ]
                  }
                ] }
              />
              )}
        </Modal.Description>
      )}

      <Modal.Footer>
        <Button onClick={ close }>
          Fechar
        </Button>
      </Modal.Footer>

    </Modal.Root>
  )
}
