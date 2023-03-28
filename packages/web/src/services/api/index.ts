import { createApi } from '@reduxjs/toolkit/query/react'
import { REHYDRATE } from 'redux-persist'

import {
  CDIInvestmentDocument,
  InvestmentFormData
} from '~/@types/Investment'

import { baseQueryWithReauth } from './fetchBase'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath]
    }
  },
  tagTypes: ['CDIInvestmentsList', 'CDIInvestment'],
  endpoints: (builder) => ({

    getUserCdiInvestments: builder.query<CDIInvestmentDocument[], void>({
      query: () => '/readUserCdiInvestments',
      providesTags: (result) => result
        ? [
            ...result.map(
              ({ id }) => ({
                type: 'CDIInvestmentsList' as const,
                id
              })
            )
          ]
        : ['CDIInvestmentsList']
    }),

    getCdiInvestment: builder.query<CDIInvestmentDocument, string>({
      query: (id) => `/readCdiInvestment?id=${ id }`,
      providesTags: (result) => [
        {
          type: 'CDIInvestment' as const,
          id: result?.id
        }
      ]
    }),

    createCdiInvestment: builder.mutation<CDIInvestmentDocument, InvestmentFormData>({
      query: (investment) => ({
        url: '/createCdiInvestment',
        method: 'POST',
        body: investment
      }),
      invalidatesTags: ['CDIInvestmentsList']
    }),

    updateCdiInvestment: builder.mutation<CDIInvestmentDocument, InvestmentFormData>({
      query: (investment) => ({
        url: '/updateCdiInvestment',
        method: 'PUT',
        body: investment
      }),
      invalidatesTags: result => [
        {
          type: 'CDIInvestment' as const,
          id: result?.id
        },
        {
          type: 'CDIInvestmentsList' as const,
          id: result?.id
        }
      ]
    }),

    deleteCdiInvestment: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: '/deleteCdiInvestment',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: ['CDIInvestmentsList']
    })

  })
})
