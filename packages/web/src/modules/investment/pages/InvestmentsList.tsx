import { useMemo } from 'react'

import { FetchErrorMessage } from '~/components/FetchErrorMessage'
import { Loader } from '~/components/Loader'
import { api } from '~/services/api'

import { InvestmentListItem } from '../components/InvestmentListItem'
import { UserResume } from '../components/UserResume'

export default function InvestmentsList() {
  const {
    data: userCdiInvestments,
    isFetching: isFetchingUserCdiInvestments,
    isError: isErrorUserCdiInvestments,
    error: errorUserCdiInvestments
  } = api.useGetUserCdiInvestmentsQuery()

  const {
    data: userResume,
    isFetching: isFetchingUserResume,
    isError: isErrorUserResume,
    error: errorUserResume
  } = api.useGetUserResumeQuery()

  const error = useMemo(
    () => {
      if (isErrorUserCdiInvestments) {
        return <FetchErrorMessage error={ errorUserCdiInvestments } />
      }
      if (isErrorUserResume) {
        return <FetchErrorMessage error={ errorUserResume } />
      }
      return null
    },
    [errorUserCdiInvestments, errorUserResume, isErrorUserCdiInvestments, isErrorUserResume]
  )

  const loading = useMemo(
    () => isFetchingUserCdiInvestments || isFetchingUserResume,
    [isFetchingUserCdiInvestments, isFetchingUserResume]
  )

  return (
    <div className="flex flex-1 justify-center">
      <div className="max-w-xl flex-1 p-4 gap-5 flex flex-col">

        {loading && (
          <Loader />
        )}

        {error ?? (
          <>
            <UserResume userResume={ userResume } />
            {userCdiInvestments?.map((investment) => (
              <InvestmentListItem
                key={ investment.id }
                investment={ investment }
              />
            ))}
          </>
        )}

      </div>
    </div>
  )
}
