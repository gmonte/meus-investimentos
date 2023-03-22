import { Reducer } from 'react'

import filter from 'lodash/filter'
import map from 'lodash/map'
import uniqBy from 'lodash/uniqBy'

import {
  Toast,
  Action
} from './types'

export const CREATE_TOAST = 'CREATE_TOAST'
export const CREATE_IMMEDIATELY_TOAST = 'CREATE_IMMEDIATELY_TOAST'
export const OPEN_TOAST = 'OPEN_TOAST'
export const CLOSE_TOAST = 'CLOSE_TOAST'
export const REMOVE_TOAST = 'REMOVE_TOAST'
export const RESET_TOASTS = 'RESET_TOASTS'

export const toastsReducer: Reducer<Toast[], Action> = (toasts, action) => {
  switch (action.type) {
    case CREATE_IMMEDIATELY_TOAST:
      return uniqBy(
        [
          ...toasts,
          {
            ...action.toast,
            open: true
          }
        ],
        'id'
      )

    case CREATE_TOAST:
      return uniqBy(
        [
          ...toasts,
          {
            ...action.toast,
            open: false
          }
        ],
        'id'
      )

    case OPEN_TOAST:
      return map(toasts, toast => {
        if (toast.id === action.options.id) {
          return {
            ...toast,
            open: true
          }
        }
        return toast
      })

    case CLOSE_TOAST:
      return map(toasts, toast => {
        if (toast.id === action.options.id) {
          return {
            ...toast,
            open: false
          }
        }
        return toast
      })

    case REMOVE_TOAST:
      return filter(toasts, toast => toast.id !== action.options.id)

    case RESET_TOASTS:
      return []

    default:
      return toasts
  }
}
