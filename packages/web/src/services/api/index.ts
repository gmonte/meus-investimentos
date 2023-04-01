import { createApi } from '@reduxjs/toolkit/query/react'
import { map } from 'lodash'
import { REHYDRATE } from 'redux-persist'

import {
  ShortCDIInvestmentDocument,
  CDIInvestmentDocument,
  InvestmentFormData,
  UserResume,
  RescueCDIInvestment
} from '~/@types/Investment'

import { baseQueryWithReauth } from './fetchBase'

export const tagTypes = {
  CDIInvestmentsList: 'CDIInvestmentsList',
  CDIInvestment: 'CDIInvestment',
  UserResume: 'UserResume'
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath]
    }
  },
  tagTypes: map(tagTypes, (tagType) => tagType),
  endpoints: (builder) => ({

    getUserCdiInvestments: builder.query<ShortCDIInvestmentDocument[], string>({
      query: (finished) => `/readUserCdiInvestments${ finished === 'null' ? '' : `?finished=${ finished }` }`,
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

    getCdiInvestment: builder.query<CDIInvestmentDocument, string>({
      query: (id) => `/readCdiInvestment?id=${ id }`,
      providesTags: (result) => [
        {
          type: 'CDIInvestment' as const,
          id: result?.id
        },
        'CDIInvestment'
      ]
    }),

    getUserResume: builder.query<UserResume, string>({
      query: (finished) => `/getUserResume${ finished === 'null' ? '' : `?finished=${ finished }` }`,
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
          type: 'CDIInvestment' as const,
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
      invalidatesTags: ['CDIInvestmentsList', 'UserResume']
    }),

    rescueCdiInvestment: builder.mutation<void, RescueCDIInvestment>({
      query: (rescueInvestment) => ({
        url: '/rescueCdiInvestment',
        method: 'POST',
        body: rescueInvestment
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: 'CDIInvestment' as const,
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
