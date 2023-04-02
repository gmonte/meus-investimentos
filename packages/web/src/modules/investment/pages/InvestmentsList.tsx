import {
  useMemo,
  useState
} from 'react'

import { isEmpty } from 'lodash'

import { ButtonsGroup } from '~/components/ButtonsGroup'
import { FetchErrorMessage } from '~/components/FetchErrorMessage'
import { Loader } from '~/components/Loader'
import { Text } from '~/components/Text'
import { api } from '~/services/api'

import { InvestmentListItem } from '../components/InvestmentListItem'
import { UserResume } from '../components/UserResume'

export default function InvestmentsList() {
  const [finished, setFinished] = useState<boolean | null>(false)

  const {
    data: userCdiInvestments,
    isFetching: isFetchingUserCdiInvestments,
    isError: isErrorUserCdiInvestments,
    error: errorUserCdiInvestments
  } = api.useGetUserCdiInvestmentsQuery(finished)

  const {
    data: userResume,
    isFetching: isFetchingUserResume,
    isError: isErrorUserResume,
    error: errorUserResume
  } = api.useGetUserResumeQuery(finished)

  const emptyMsg = useMemo(
    () => {
      if (isEmpty(userCdiInvestments) && !isFetchingUserCdiInvestments) {
        if (finished === true) return 'Você não possui investimentos finalizados'
        if (finished === false) return 'Você não possui investimentos ativos'
        return 'Você não possui investimentos cadastrados'
      }
      return null
    },
    [finished, isFetchingUserCdiInvestments, userCdiInvestments]
  )

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

  const isFetching = useMemo(
    () => isFetchingUserCdiInvestments || isFetchingUserResume,
    [isFetchingUserCdiInvestments, isFetchingUserResume]
  )

  return (
    <div className="flex flex-1 justify-center">
      <div className="max-w-xl flex-1 p-4 gap-5 flex flex-col">

        {isFetching && <Loader />}

        {error ?? (
          <>
            <ButtonsGroup.Root>
              <ButtonsGroup.Item
                active={ finished === false }
                onClick={ () => setFinished(false) }
              >
                Ativos
              </ButtonsGroup.Item>
              <ButtonsGroup.Item
                active={ finished === true }
                onClick={ () => setFinished(true) }
              >
                Finalizados
              </ButtonsGroup.Item>
              <ButtonsGroup.Item
                active={ finished === null }
                onClick={ () => setFinished(null) }
              >
                Todos
              </ButtonsGroup.Item>
            </ButtonsGroup.Root>

            <UserResume userResume={ userResume } />

            {emptyMsg && (
              <Text className="text-center text-gray-500 mt-10">
                {emptyMsg}
              </Text>
            )}

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
