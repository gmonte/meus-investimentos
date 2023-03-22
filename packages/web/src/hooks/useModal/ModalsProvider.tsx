import {
  ReactNode,
  useReducer,
  useMemo,
  useCallback,
  PropsWithChildren
} from 'react'

import map from 'lodash/map'

import { ModalsContext } from './modalsContext'
import {
  CREATE_IMMEDIATELY_MODAL,
  CREATE_MODAL,
  OPEN_MODAL,
  CLOSE_MODAL,
  REMOVE_MODAL,
  RESET_MODALS,
  modalsReducer
} from './modalsReducer'
import {
  UseModal,
  CreateModal,
  RemoveModal,
  ResetModals
} from './types'

export function ModalsProvider({ children }: PropsWithChildren) {
  const [modals, dispatch] = useReducer(modalsReducer, [])

  const createModal = useCallback<CreateModal>(
    (modal, immediately = false) => {
      if (immediately) {
        dispatch({
          type: CREATE_IMMEDIATELY_MODAL,
          modal
        })
      } else {
        dispatch({
          type: CREATE_MODAL,
          modal
        })
        setTimeout(() => {
          dispatch({
            type: OPEN_MODAL,
            modal
          })
        }, 50)
      }
    },
    []
  )

  const removeModal = useCallback<RemoveModal>(
    (modal, immediately = false) => {
      if (immediately) {
        dispatch({
          type: REMOVE_MODAL,
          modal
        })
      } else {
        dispatch({
          type: CLOSE_MODAL,
          modal
        })
        setTimeout(() => {
          dispatch({
            type: REMOVE_MODAL,
            modal
          })
        }, 300)
      }
    },
    []
  )

  const resetModals = useCallback<ResetModals>(() => {
    dispatch({ type: RESET_MODALS })
  }, [])

  const state = useMemo<UseModal>(
    () => ({
      createModal,
      removeModal,
      resetModals,
      modals
    }),
    [createModal, modals, removeModal, resetModals]
  )

  const renderedModals = useMemo<ReactNode[]>(
    () =>
      map(modals, modal => {
        const {
          id,
          open,
          Component,
          props: modalProps = {}
        } = modal

        return (
          <Component
            key={ id }
            id={ id }
            close={ (): void => removeModal({ id }) }
            open={ open }
            { ...modalProps }
          />
        )
      }),
    [modals, removeModal]
  )

  return (
    <ModalsContext.Provider value={ state }>
      {children}

      {renderedModals}
    </ModalsContext.Provider>
  )
}
