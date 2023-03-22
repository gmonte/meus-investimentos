import { Reducer } from 'react'

import filter from 'lodash/filter'
import map from 'lodash/map'
import uniqBy from 'lodash/uniqBy'

import {
  Modal,
  Action
} from './types'

export const CREATE_MODAL = 'CREATE_MODAL'
export const CREATE_IMMEDIATELY_MODAL = 'CREATE_IMMEDIATELY_MODAL'
export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const REMOVE_MODAL = 'REMOVE_MODAL'
export const RESET_MODALS = 'RESET_MODALS'

export const modalsReducer: Reducer<Modal[], Action> = (modals, action) => {
  switch (action.type) {
    case CREATE_IMMEDIATELY_MODAL:
      return uniqBy(
        [
          ...modals,
          {
            ...action.modal,
            open: true
          }
        ],
        'id'
      )

    case CREATE_MODAL:
      return uniqBy(
        [
          ...modals,
          {
            ...action.modal,
            open: false
          }
        ],
        'id'
      )

    case OPEN_MODAL:
      return map(modals, modal => {
        if (modal.id === action.modal.id) {
          return {
            ...modal,
            open: true
          }
        }
        return modal
      })

    case CLOSE_MODAL:
      return map(modals, modal => {
        if (modal.id === action.modal.id) {
          return {
            ...modal,
            open: false
          }
        }
        return modal
      })

    case REMOVE_MODAL:
      return filter(modals, modal => modal.id !== action.modal.id)

    case RESET_MODALS:
      return []

    default:
      return modals
  }
}
