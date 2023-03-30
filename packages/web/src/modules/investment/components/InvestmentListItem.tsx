import { useCallback } from 'react'

import moment from 'moment/moment'
import { ArrowUp } from 'phosphor-react'

import { ShortCDIInvestmentDocument } from '~/@types/Investment'
import { Button } from '~/components/Button'
import { ModalConfirm } from '~/components/ModalConfirm'
import { Text } from '~/components/Text'
import { useModal } from '~/hooks/useModal'
import { useToast } from '~/hooks/useToast'
import { api } from '~/services/api'
import {
  formatCurrency,
  formatNumber
} from '~/utils/formatters'

import { RegisterInvestmentModal } from '../modals/RegisterInvestmentModal'

export interface InvestmentListItemProps {
  investment: ShortCDIInvestmentDocument
}

export function InvestmentListItem({ investment }: InvestmentListItemProps) {
  const { createModal } = useModal()
  const { createToast } = useToast()

  const [deleteCdiInvestment] = api.useDeleteCdiInvestmentMutation()

  const handleEdit = useCallback(
    (investment: ShortCDIInvestmentDocument) => createModal({
      id: 'edit-investment',
      Component: RegisterInvestmentModal,
      props: { investment }
    }),
    [createModal]
  )

  const handleDelete = useCallback(
    (investment: ShortCDIInvestmentDocument) => createModal({
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
    [createModal, createToast, deleteCdiInvestment]
  )
  return (
    <>
      <div className="text-white border-2 border-gray-700 bg-slate-800 rounded-lg px-4 pt-3 pb-1">

        <div className="flex justify-between items-center flex-wrap">
          <Text className="italic text-gray-600 font-semibold" size="xl">
            {investment.name}
          </Text>

          <Text className="text-gray-600 font-bold" size="md">
            {investment.type} {investment.cdiFee}% CDI
          </Text>
        </div>

        <div className="flex justify-between items-center flex-wrap">
          <Text className="text-gray-600 font-bold" size="md">
            Início: {moment(investment.startDate).format('L')}
          </Text>

          <Text className="text-gray-600 font-bold" size="md">
            Vencimento: {!investment.dueDate ? '-' : moment(investment.dueDate).format('L')}
          </Text>
        </div>

        <div className="flex flex-col py-2">
          <Text className="text-gray-400 line-through font-semibold font-mono tracking-tight" size="lg">
            {formatCurrency(investment.investedValue)}
          </Text>

          <div className="flex items-center flex-wrap">
            <Text className="text-gray-500 font-bold font-mono tracking-tight whitespace-nowrap" size="xl">
              B: {formatCurrency(investment.grossValue)}
            </Text>

            <div className="flex items-center">
              <div className="border border-green-700 rounded-xl ml-3 px-1 flex items-center">
                <ArrowUp className="text-green-700 font-mono" weight="bold" />
                <Text className="text-green-700 font-bold font-mono" size="md">
                  {formatNumber(investment.grossGrowth)}%
                </Text>
              </div>

              <div className="border border-green-700 rounded-xl ml-3 px-1 flex items-center">
                <ArrowUp className="text-green-700 font-mono" weight="bold" />
                <Text className="text-green-700 font-bold font-mono tracking-tight" size="md">
                  {formatCurrency(investment.grossValueIncome)}
                </Text>
              </div>
            </div>

          </div>

          <div className="flex items-center">
            <Text className="text-gray-500 font-bold font-mono tracking-tight whitespace-nowrap" size="xl">
              L: {formatCurrency(investment.netValue)}
            </Text>

            <div className="flex items-center">
              <div className="border border-green-700 rounded-xl ml-3 px-1 flex items-center">
                <ArrowUp className="text-green-700" weight="bold" />
                <Text className="text-green-700 font-bold font-mono" size="md">
                  {formatNumber(investment.netGrowth)}%
                </Text>
              </div>

              <div className="border border-green-700 rounded-xl ml-3 px-1 flex items-center">
                <ArrowUp className="text-green-700 font-mono" weight="bold" />
                <Text className="text-green-700 font-bold font-mono tracking-tight" size="md">
                  {formatCurrency(investment.netValueIncome)}
                </Text>
              </div>
            </div>

          </div>

          <div className="flex justify-between items-center mt-3 flex-wrap">
            <Text className="text-gray-600 font-bold" size="md">
              Seu dinheiro está rendendo há {moment().diff(investment.startDate, 'days')} dias
            </Text>

            <Text className="text-gray-600 font-bold" size="md">
              Calculado em {moment(investment.lastDatePaid).format('L')}
            </Text>
          </div>

        </div>

      </div>
      {/* <table key={ investment.id } className="m-5 text-white">
        <tbody>
          <tr>
            <td className="border border-white">ID:</td>
            <td className="border border-white">{investment.id}</td>
          </tr>
          <tr>
            <td className="border border-white">Name:</td>
            <td className="border border-white">{investment.name}</td>
          </tr>
          <tr>
            <td className="border border-white">Type:</td>
            <td className="border border-white">{investment.type}</td>
          </tr>
          <tr>
            <td className="border border-white">CDI fee:</td>
            <td className="border border-white">{investment.cdiFee}%</td>
          </tr>
          <tr>
            <td className="border border-white">Start date:</td>
            <td className="border border-white">{moment(investment.startDate).format('L')}</td>
          </tr>
          <tr>
            <td className="border border-white">Due date:</td>
            <td className="border border-white">{investment.dueDate && moment(investment.dueDate).format('L')}</td>
          </tr>
          <tr>
            <td className="border border-white">Invested value:</td>
            <td className="border border-white" title={ investment.investedValue?.toString?.() }>{formatCurrency(investment.investedValue)}</td>
          </tr>
          <tr>
            <td className="border border-white">Gross value:</td>
            <td className="border border-white" title={ `${ investment.grossValue } (${ investment.grossGrowth }%)` }>{formatCurrency(investment.grossValue)} ({formatNumber(investment.grossGrowth)}%)</td>
          </tr>
          <tr>
            <td className="border border-white">Gross value income:</td>
            <td className="border border-white" title={ investment.grossValueIncome.toString() }>{formatCurrency(investment.grossValueIncome)}</td>
          </tr>
          <tr>
            <td className="border border-white">Net value:</td>
            <td className="border border-white" title={ `${ investment.netValue } (${ investment.netGrowth }%)` }>{formatCurrency(investment.netValue)} ({formatNumber(investment.netGrowth)}%)</td>
          </tr>
          <tr>
            <td className="border border-white">Net value income:</td>
            <td className="border border-white" title={ investment.netValueIncome.toString() }>{formatCurrency(investment.netValueIncome)}</td>
          </tr>
          <tr>
            <td className="border border-white">Last date paid:</td>
            <td className="border border-white">{moment(investment.lastDatePaid).format('L')}</td>
          </tr>
          <tr>
            <td className="border border-white">Last date fee consolidated:</td>
            <td className="border border-white">{moment(investment.lastDateFeeConsolidated).format('L')}</td>
          </tr>
          <tr>
            <td className="border border-white">
              <Button
                className="w-full"
                onClick={ () => handleEdit(investment) }
              >
                editar
              </Button>
            </td>
            <td className="border border-white">
              <Button
                className="w-full"
                onClick={ () => handleDelete(investment) }
              >
                deletar
              </Button>
            </td>
          </tr>
        </tbody>
      </table> */}
    </>
  )
}
