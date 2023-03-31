import { useMemo } from 'react'

import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

export interface FetchErrorMessageProps {
  error: FetchBaseQueryError | SerializedError
}

export function FetchErrorMessage({ error }: FetchErrorMessageProps) {
  const errMsg = useMemo(
    () => {
      if ('status' in error) {
        // you can access all properties of `FetchBaseQueryError` here
        return 'error' in error ? error.error : JSON.stringify(error.data)
      }
      return error.message
    },
    [error]
  )

  // you can access all properties of `SerializedError` here
  return (
    <div className="text-white font-mono w-max-full break-words">
      <div>An error has occurred:</div>
      <div>{errMsg}</div>
    </div>
  )
}
