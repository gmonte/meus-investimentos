import {
  ReactNode,
  useReducer,
  useMemo,
  useCallback
} from 'react'

import * as ToastPrimitive from '@radix-ui/react-toast'
import clsx from 'clsx'
import map from 'lodash/map'
import uuid from 'short-uuid'

import { ToastsContext } from './toastsContext'
import {
  CREATE_IMMEDIATELY_TOAST,
  CREATE_TOAST,
  OPEN_TOAST,
  CLOSE_TOAST,
  REMOVE_TOAST,
  RESET_TOASTS,
  toastsReducer
} from './toastsReducer'
import {
  UseToast,
  CreateToast,
  RemoveToast,
  ResetToasts
} from './types'

export type ToastsProviderProps = ToastPrimitive.ToastProviderProps

export function ToastsProvider({
  children,
  swipeDirection = 'right',
  ...props
}: ToastsProviderProps) {
  const [toasts, dispatch] = useReducer(toastsReducer, [])

  const createToast = useCallback<CreateToast>(
    (toast, immediately = false) => {
      const id = uuid().generate()

      if (immediately) {
        dispatch({
          type: CREATE_IMMEDIATELY_TOAST,
          toast: {
            ...toast,
            type: toast.type ?? 'info',
            id
          }
        })
      } else {
        dispatch({
          type: CREATE_TOAST,
          toast: {
            ...toast,
            type: toast.type ?? 'info',
            id
          }
        })
        setTimeout(() => {
          dispatch({
            type: OPEN_TOAST,
            options: { id }
          })
        }, 50)
      }
    },
    []
  )

  const removeToast = useCallback<RemoveToast>(
    (options, immediately = false) => {
      if (immediately) {
        dispatch({
          type: REMOVE_TOAST,
          options
        })
      } else {
        dispatch({
          type: CLOSE_TOAST,
          options
        })
        setTimeout(() => {
          dispatch({
            type: REMOVE_TOAST,
            options
          })
        }, 300)
      }
    },
    []
  )

  const resetToasts = useCallback<ResetToasts>(() => {
    dispatch({ type: RESET_TOASTS })
  }, [])

  const state = useMemo<UseToast>(
    () => ({
      createToast,
      removeToast,
      resetToasts,
      toasts
    }),
    [createToast, toasts, removeToast, resetToasts]
  )

  const renderedToasts = useMemo<ReactNode[]>(
    () =>
      map(toasts, toast => {
        const {
          id,
          open,
          type,
          description,
          title
        } = toast

        return (
          <ToastPrimitive.Root
            key={ id }
            className={ clsx(
              'bottom-4 inset-x-4 w-auto md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm shadow-lg rounded-lg',
              'radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right',
              'radix-state-closed:animate-toast-hide',
              'radix-swipe-end:animate-toast-swipe-out',
              'translate-x-radix-toast-swipe-move-x',
              'radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]',
              'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
              { 'bg-gray-800': type === 'info' },
              { 'bg-green-800': type === 'success' },
              { 'bg-yellow-700': type === 'warn' },
              { 'bg-red-900': type === 'error' }
            ) }
            open={ open }
            onOpenChange={ (newOpen) => !newOpen && removeToast({ id }) }
          >
            <div className="w-full px-5 py-4">
              <ToastPrimitive.Title className="font-medium text-gray-100">
                {title}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description
                className={ clsx(
                  'mt-1 text-md',
                  { 'text-gray-400': type === 'info' },
                  { 'text-gray-300': type === 'success' },
                  { 'text-gray-300': type === 'warn' },
                  { 'text-gray-300': type === 'error' }
                ) }
              >
                {description}
              </ToastPrimitive.Description>
            </div>
          </ToastPrimitive.Root>
        )
      }),
    [toasts, removeToast]
  )

  return (
    <ToastsContext.Provider value={ state }>
      {children}

      <ToastPrimitive.ToastProvider
        swipeDirection={ swipeDirection }
        { ...props }
      >
        <>
          {renderedToasts}
          <ToastPrimitive.Viewport
            className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[370px] max-w-full list-none flex-col gap-5 p-6 outline-none"
          />
        </>
      </ToastPrimitive.ToastProvider>
    </ToastsContext.Provider>
  )
}
