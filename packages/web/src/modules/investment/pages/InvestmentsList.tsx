import { Loader } from '~/components/Loader'
import { api } from '~/services/api'

import { InvestmentListItem } from '../components/InvestmentListItem'

export default function InvestmentsList() {
  const {
    data,
    isFetching,
    isError,
    error
  } = api.useGetUserCdiInvestmentsQuery()

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
    <div className="flex flex-1 justify-center">
      <div className="max-w-xl flex-1 p-4 gap-5 flex flex-col">
        {isFetching && (
          <Loader />
        )}

        {data?.map((investment) => (
          <InvestmentListItem
            key={ investment.id }
            investment={ investment }
          />
        ))}
      </div>
    </div>
  )
}
