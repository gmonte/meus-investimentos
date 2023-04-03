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
    <div className="text-white border-2 border-gray-700 bg-slate-800 rounded-lg px-4 pt-3 pb-1">

      <div className="flex justify-between items-center flex-wrap">

        <div className="flex gap-3 items-center">
          {investment.name && (
            <Text className="italic text-gray-300 font-semibold" size="xl">
              {investment.name}
            </Text>
          )}

          <Text className="text-gray-600 font-bold" size="md">
            {investment.type} {investment.cdiFee}% CDI
          </Text>
        </div>

        <div>
          <div className="flex gap-2 items-center">
            <Button
              className="py-0 px-0 text-gray-500 hover:text-white bg-transparent hover:bg-transparent active:bg-transparent"
              onClick={ handleHistory }
            >
              <ChartLineUp size={ 20 } weight="bold" />
            </Button>

            <Button
              className="py-0 px-0 text-gray-500 hover:text-white bg-transparent hover:bg-transparent active:bg-transparent"
              onClick={ handleEdit }
            >
              <PencilSimple size={ 20 } />
            </Button>

            <Button
              className="py-0 px-0 text-gray-500 hover:text-red-400 bg-transparent hover:bg-transparent active:bg-transparent"
              onClick={ handleDelete }
            >
              <Trash size={ 20 } />
            </Button>
          </div>
        </div>

      </div>

      <div className="flex justify-between items-center flex-wrap">
        <Text className="text-gray-600 font-bold" size="md">
          Início: {moment(investment.startDate).format('L')}
        </Text>

        <Text className="text-gray-600 font-bold" size="md">
          Vencimento: {!investment.dueDate ? '-' : moment(investment.dueDate).format('L')}
        </Text>
      </div>

      <div className="flex flex-col py-2 max-[465px]:gap-2 max-[465px]:mt-2">
        <div className="flex items-center max-[465px]:flex-col">
          <Text className="text-gray-400 line-through font-semibold font-mono tracking-tight" size="lg">
            {formatCurrency(investment.investedValue)}
          </Text>
        </div>

        <div className="flex items-center max-[465px]:flex-col">
          <div>
            <Text className="text-gray-400 font-bold" size="xl">
              Bruto:{' '}
            </Text>
            <Text className="text-gray-200 font-bold font-mono tracking-tight whitespace-nowrap" size="xl">
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
            <Text className="text-gray-400 font-bold" size="xl">
              Líquido:{' '}
            </Text>
            <Text className="text-gray-200 font-bold font-mono tracking-tight whitespace-nowrap" size="xl">
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

        <div className="mt-3 flex justify-between min-[466px]:items-center max-[465px]:flex-col">
          <div className="flex flex-col flex-wrap">
            {profitabilityDaysCount
              ? (
                <>
                  <Text className="text-gray-600 font-bold" size="md">
                    Seu dinheiro {investment.finished ? 'rendeu por' : 'está rendendo há'}{' '}
                    {profitabilityDaysCount} dia{profitabilityDaysCount > 1 && 's'}
                  </Text>

                  <Text className="text-gray-600 font-bold" size="md">
                    {investment.finished
                      ? `Resgatado em ${ moment(investment.rescueDate ?? investment.dueDate).format('L') }`
                      : `Rentabilidade disponível em ${ moment(investment.profitabilityAvailableDate).format('L') }`
                    }
                  </Text>
                </>
                )
              : (
                <Text className="text-gray-600 font-bold" size="md">
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
