import {
  createContext,
  useContext
} from 'react'

import { UseToast } from './types'

export const ToastsContext = createContext<UseToast>({} as UseToast)

export const useToast = (): UseToast => useContext<UseToast>(ToastsContext)
