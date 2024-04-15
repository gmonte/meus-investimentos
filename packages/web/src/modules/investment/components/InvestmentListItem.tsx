import {
  useCallback,
  useMemo
} from 'react'

import moment from 'moment/moment'
import {
  ChartLineUp,
  PencilSimple,
  Trash
} from 'phosphor-react'

import { ShortCDIInvestmentDocument } from '~/@types/Investment'
import { Button } from '~/components/Button'
import { Growth } from '~/components/Growth'
import { ModalConfirm } from '~/components/ModalConfirm'
import { Text } from '~/components/Text'
import { useModal } from '~/hooks/useModal'
import { useToast } from '~/hooks/useToast'
import { api } from '~/services/api'
import {
  formatCurrency,
  formatNumber
} from '~/utils/formatters'

import { InvestmentHistoryModal } from '../modals/InvestmentHistoryModal'
import { RegisterInvestmentModal } from '../modals/RegisterInvestmentModal'
import { RescueInvestmentModal } from '../modals/RescueInvestmentModal'

export interface InvestmentListItemProps {
  investment: ShortCDIInvestmentDocument
}

export function InvestmentListItem({ investment }: InvestmentListItemProps) {
  const { createModal } = useModal()
  const { createToast } = useToast()

  const [deleteCdiInvestment] = api.useDeleteCdiInvestmentMutation()

  const profitabilityDaysCount = useMemo(
    () => {
      if (investment.profitabilityAvailableDate) {
        return moment(investment.profitabilityAvailableDate, 'YYYY-MM-DD')
          .diff(investment.startDate, 'days')
      }
      return 0
    },
    [investment.profitabilityAvailableDate, investment.startDate]
  )

  const handleHistory = useCallback(
    () => createModal({
      id: 'rescue-investment',
      Component: InvestmentHistoryModal,
      props: { investmentId: investment.id }
    }),
    [createModal, investment.id]
  )

  const handleRescue = useCallback(
    () => createModal({
      id: 'rescue-investment',
      Component: RescueInvestmentModal,
      props: { investment }
    }),
    [createModal, investment]
  )

  const handleEdit = useCallback(
    () => createModal({
      id: 'edit-investment',
      Component: RegisterInvestmentModal,
      props: { investment }
    }),
    [createModal, investment]
  )

  const handleDelete = useCallback(
    () => createModal({
      id: 'delete-investment',
      Component: ModalConfirm,
      props: {
        title: 'Deletar investimento',
        description: 'Você tem certeza que deseja deletar o investimento? Essa ação é irreversível.',
        async onConfirm() {
          await deleteCdiInvestment({ id: investment.id })
          createToast({
            type: 'success',
            title: 'Investimento deletado com sucesso!'
          })
        }
      }
    }),
    [createModal, createToast, deleteCdiInvestment, investment.id]
  )

  return (
    <div className="rounded-lg border-2 border-gray-700 bg-slate-800 px-4 pb-1 pt-3 text-white">

      <div className="flex flex-wrap items-center justify-between">

        <div className="flex items-center gap-3">
          {investment.target && (
            <Text className="font-semibold italic text-gray-300" size="xl">
              {investment.target.name}
            </Text>
          )}

          <Text className="font-bold text-gray-600" size="md">
            {investment.type} {investment.cdiFee}% CDI
          </Text>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-transparent !p-0 text-gray-500 hover:bg-transparent hover:text-white active:bg-transparent"
              onClick={ handleHistory }
            >
              <ChartLineUp size={ 20 } weight="bold" />
            </Button>

            <Button
              className="bg-transparent !p-0 text-gray-500 hover:bg-transparent hover:text-white active:bg-transparent"
              onClick={ handleEdit }
            >
              <PencilSimple size={ 20 } />
            </Button>

            <Button
              className="bg-transparent !p-0 text-gray-500 hover:bg-transparent hover:text-red-400 active:bg-transparent"
              onClick={ handleDelete }
            >
              <Trash size={ 20 } />
            </Button>
          </div>
        </div>

      </div>

      <div className="flex flex-wrap items-center justify-between">
        <Text className="font-bold text-gray-600" size="md">
          Início: {moment(investment.startDate).format('L')}
        </Text>

        <Text className="font-bold text-gray-600" size="md">
          Vencimento: {!investment.dueDate ? '-' : moment(investment.dueDate).format('L')}
        </Text>
      </div>

      <div className="flex flex-col py-2 max-[465px]:mt-2 max-[465px]:gap-2">
        <div className="flex items-center max-[465px]:flex-col">
          <Text className="font-mono font-semibold tracking-tight text-gray-400 line-through" size="lg">
            {formatCurrency(investment.investedValue)}
          </Text>
        </div>

        <div className="flex items-center max-[465px]:flex-col">
          <div>
            <Text className="font-bold text-gray-400" size="xl">
              Bruto:{' '}
            </Text>
            <Text className="whitespace-nowrap font-mono font-bold tracking-tight text-gray-200" size="xl">
              {formatCurrency(investment.grossValue)}
            </Text>
          </div>

          <div className="flex items-center">
            <Growth className="min-[466px]:ml-3">
              {formatNumber(investment.grossGrowth)}%
            </Growth>

            <Growth className="ml-3">
              {formatCurrency(investment.grossValueIncome)}
            </Growth>
          </div>

        </div>

        <div className="flex items-center max-[465px]:flex-col">
          <div>
            <Text className="font-bold text-gray-400" size="xl">
              Líquido:{' '}
            </Text>
            <Text className="whitespace-nowrap font-mono font-bold tracking-tight text-gray-200" size="xl">
              {formatCurrency(investment.netValue)}
            </Text>
          </div>

          <div className="flex items-center">
            <Growth className="min-[466px]:ml-3">
              {formatNumber(investment.netGrowth)}%
            </Growth>

            <Growth className="ml-3">
              {formatCurrency(investment.netValueIncome)}
            </Growth>
          </div>

        </div>

        <div className="mt-3 flex justify-between max-[465px]:flex-col min-[466px]:items-center">
          <div className="flex flex-col flex-wrap">
            {profitabilityDaysCount
              ? (
                <>
                  <Text className="font-bold text-gray-600" size="md">
                    Seu dinheiro {investment.finished ? 'rendeu por' : 'está rendendo há'}{' '}
                    {profitabilityDaysCount} dia{profitabilityDaysCount > 1 && 's'}
                  </Text>

                  <Text className="font-bold text-gray-600" size="md">
                    {investment.finished
                      ? `Resgatado em ${ moment(investment.rescueDate ?? investment.dueDate).format('L') }`
                      : `Rentabilidade disponível em ${ moment(investment.profitabilityAvailableDate).format('L') }`
                    }
                  </Text>
                </>
                )
              : (
                <Text className="font-bold text-gray-600" size="md">
                  O seu dinheiro ainda não começou a render
                </Text>
                )}
          </div>

          {
            !investment.finished
              ? (
                <Button
                  className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 max-[465px]:mt-3"
                  onClick={ handleRescue }
                >
                  Resgatar
                </Button>
                )
              : (
                <Button
                  className="max-[465px]:mt-3"
                  disabled
                >
                  Resgatado
                </Button>
                )
          }
        </div>

      </div>

    </div>
  )
}
