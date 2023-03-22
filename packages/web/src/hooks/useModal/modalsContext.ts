import {
  createContext,
  useContext
} from 'react'

import { UseModal } from './types'

export const ModalsContext = createContext<UseModal>({} as UseModal)

export const useModal = (): UseModal => useContext<UseModal>(ModalsContext)
