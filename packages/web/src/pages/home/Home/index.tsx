import moment from 'moment/moment'

import { Loader } from '~/components/Loader'
import { api } from '~/services/api'
import {
  formatCurrency,
  formatNumber
} from '~/utils/formatters'

function Home() {
  const {
    data,
    isLoading,
    isError,
    error
  } = api.useGetUserCdiInvestmentsQuery()

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
        <table key={ investment.id } style={ { marginBottom: 20 } }>
          <tbody>

            <tr>
              <td style={ { border: '1px solid black' } }>ID:</td>
              <td style={ { border: '1px solid black' } }>{investment.id}</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Name:</td>
              <td style={ { border: '1px solid black' } }>{investment.name}</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Type:</td>
              <td style={ { border: '1px solid black' } }>{investment.type}</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>CDI fee:</td>
              <td style={ { border: '1px solid black' } }>{investment.cdiFee}%</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Start date:</td>
              <td style={ { border: '1px solid black' } }>{moment(investment.startDate).format('L')}</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Due date:</td>
              <td style={ { border: '1px solid black' } }>{moment(investment.dueDate).format('L')}</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Invested value:</td>
              <td style={ { border: '1px solid black' } } title={ investment.investedValue.toString() }>{formatCurrency(investment.investedValue)}</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Gross value:</td>
              <td style={ { border: '1px solid black' } } title={ `${ investment.grossValue } (${ investment.grossGrowth }%)` }>{formatCurrency(investment.grossValue)} ({formatNumber(investment.grossGrowth)}%)</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Gross value income:</td>
              <td style={ { border: '1px solid black' } } title={ investment.grossValueIncome.toString() }>{formatCurrency(investment.grossValueIncome)}</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Net value:</td>
              <td style={ { border: '1px solid black' } } title={ `${ investment.netValue } (${ investment.netGrowth }%)` }>{formatCurrency(investment.netValue)} ({formatNumber(investment.netGrowth)}%)</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Net value income:</td>
              <td style={ { border: '1px solid black' } } title={ investment.netValueIncome.toString() }>{formatCurrency(investment.netValueIncome)}</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Last date paid:</td>
              <td style={ { border: '1px solid black' } }>{moment(investment.lastDatePaid).format('L')}</td>
            </tr>
            <tr>
              <td style={ { border: '1px solid black' } }>Last date fee consolidated:</td>
              <td style={ { border: '1px solid black' } }>{moment(investment.lastDateFeeConsolidated).format('L')}</td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  )
}

export default Home
