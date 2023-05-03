import { createApi } from '@reduxjs/toolkit/query/react'
import { REHYDRATE } from 'redux-persist'

import {
  ShortCDIInvestmentDocument,
  CDIInvestmentDocument,
  InvestmentFormData,
  UserResume,
  RescueCDIInvestment,
  CDIInvestmentHistoryDocument
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
  tagTypes: ['CDIInvestmentsList', 'CDIInvestmentHistory', 'UserResume'],
  endpoints: (builder) => ({

    getUserCdiInvestments: builder.query<ShortCDIInvestmentDocument[], boolean | null>({
      query: (finished) => `/readUserCdiInvestments${ finished === null ? '' : `?finished=${ finished }` }`,
      providesTags: (result) => result
        ? [
            ...result.map(
              ({ id }) => ({
                type: 'CDIInvestmentsList' as const,
                id
              })
            ),
            'CDIInvestmentsList'
          ]
        : ['CDIInvestmentsList']
    }),

    getCdiInvestmentHistory: builder.query<CDIInvestmentHistoryDocument, string>({
      query: (id) => `/readCdiInvestmentHistory?id=${ id }`,
      providesTags: (result) => [
        {
          type: 'CDIInvestmentHistory' as const,
          id: result?.id
        },
        'CDIInvestmentHistory'
      ]
    }),

    getUserResume: builder.query<UserResume, boolean | null>({
      query: (finished) => `/getUserResume${ finished === null ? '' : `?finished=${ finished }` }`,
      providesTags: ['UserResume']
    }),

    createCdiInvestment: builder.mutation<CDIInvestmentDocument, InvestmentFormData>({
      query: (investment) => ({
        url: '/createCdiInvestment',
        method: 'POST',
        body: investment
      }),
      invalidatesTags: ['CDIInvestmentsList', 'UserResume']
    }),

    updateCdiInvestment: builder.mutation<CDIInvestmentDocument, InvestmentFormData>({
      query: (investment) => ({
        url: '/updateCdiInvestment',
        method: 'PUT',
        body: investment
      }),
      invalidatesTags: result => [
        {
          type: 'CDIInvestmentHistory' as const,
          id: result?.id
        },
        {
          type: 'CDIInvestmentsList' as const,
          id: result?.id
        },
        'UserResume'
      ]
    }),

    deleteCdiInvestment: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: '/deleteCdiInvestment',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: 'CDIInvestmentHistory' as const,
          id: arg.id
        },
        'CDIInvestmentsList',
        'UserResume'
      ]
    }),

    rescueCdiInvestment: builder.mutation<void, RescueCDIInvestment>({
      query: (rescueInvestment) => ({
        url: '/rescueCdiInvestment',
        method: 'POST',
        body: rescueInvestment
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: 'CDIInvestmentHistory' as const,
          id: arg.investmentId
        },
        {
          type: 'CDIInvestmentsList' as const,
          id: arg.investmentId
        },
        'UserResume'
      ]
    })

  })
})
