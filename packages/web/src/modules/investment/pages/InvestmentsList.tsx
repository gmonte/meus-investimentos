import { useCallback } from 'react'

import moment from 'moment/moment'

import { CDIInvestmentDocument } from '~/@types/Investment'
import { Button } from '~/components/Button'
import { Loader } from '~/components/Loader'
import { ModalConfirm } from '~/components/ModalConfirm'
import { useModal } from '~/hooks/useModal'
import { useToast } from '~/hooks/useToast'
import { api } from '~/services/api'
import {
  formatCurrency,
  formatNumber
} from '~/utils/formatters'

import { RegisterInvestmentModal } from '../modals/RegisterInvestmentModal'

export default function InvestmentsList() {
  const { createModal } = useModal()
  const { createToast } = useToast()

  const {
    data,
    isLoading,
    isError,
    error
  } = api.useGetUserCdiInvestmentsQuery()

  const [deleteCdiInvestment] = api.useDeleteCdiInvestmentMutation()

  const handleEdit = useCallback(
    (investment: CDIInvestmentDocument) => createModal({
      id: 'edit-investment',
      Component: RegisterInvestmentModal,
      props: { investment }
    }),
    [createModal]
  )

  const handleDelete = useCallback(
    (investment: CDIInvestmentDocument) => createModal({
      id: 'delete-investment',
      Component: ModalConfirm,
      props: {
        title: 'Deletar investimento',
        description: 'Você tem certeza que deseja deletar o investimento?',
        async onConfirm() {
          await deleteCdiInvestment({ id: investment.id })
          createToast({
            type: 'success',
            title: 'Cadastro de investimento',
            description: 'Investimento deletado com sucesso!'
          })
        }
      }
    }),
    [createModal, createToast, deleteCdiInvestment]
  )

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    if ('status' in error) {
      // you can access all properties of `FetchBaseQueryError` here
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)

      return (
        <div>
          <div>An error has occurred:</div>
          <div>{errMsg}</div>
        </div>
      )
    } else {
      // you can access all properties of `SerializedError` here
      return <div>{error.message}</div>
    }
  }

  return (
    <div>
      {data?.map((investment) => (
        <table key={ investment.id } className="m-5 text-white">
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
              <td className="border border-white">{moment(investment.dueDate).format('L')}</td>
            </tr>
            <tr>
              <td className="border border-white">Invested value:</td>
              <td className="border border-white" title={ investment.investedValue.toString() }>{formatCurrency(investment.investedValue)}</td>
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
        </table>
      ))}
    </div>
  )
}
