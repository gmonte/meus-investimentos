import { createApi } from '@reduxjs/toolkit/query/react'
import { REHYDRATE } from 'redux-persist'

import { CDIInvestmentDocument } from '~/@types/Api'

import { baseQueryWithReauth } from './fetchBase'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath]
    }
  },
  endpoints: (builder) => ({

    getUserCdiInvestments: builder.query<CDIInvestmentDocument[], void>({ query: () => '/readUserCdiInvestments' }),

    getCdiInvestment: builder.query<CDIInvestmentDocument, string>({ query: (id) => `/readCdiInvestment?id=${ id }` })

  })
})
