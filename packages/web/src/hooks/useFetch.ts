import {
  useState,
  useEffect,
  useCallback
} from 'react'

import { AxiosInstance } from 'axios'
import isEmpty from 'lodash/isEmpty'
import useSWR, {
  SWRConfiguration,
  KeyedMutator,
  Fetcher,
  Key
} from 'swr'

export function useFetch<Data = unknown, Error = unknown>(
  axiosInstance: AxiosInstance,
  url: Key = '',
  swrConfiguration?: SWRConfiguration<Data, Error>
) {
  const fetcher = useCallback<Fetcher<Data>>(
    async(path: string) => {
      const response = await axiosInstance.get<Data>(path)
      return response.data
    },
    [axiosInstance]
  )

  const {
    data,
    error,
    mutate,
    isValidating
  } = useSWR<Data, Error>(url, fetcher, swrConfiguration)

  const [loading, setLoading] = useState(false)

  const refresh = useCallback<KeyedMutator<Data>>(
    async(...mutateOptions) => {
      setLoading(true)
      return await mutate(...mutateOptions)
    },
    [mutate]
  )

  useEffect(
    () => {
      if (isEmpty(data) && isValidating) {
        setLoading(true)
      } else if (!isValidating) {
        setLoading(false)
      }
    },
    [data, isValidating]
  )

  return {
    data,
    error,
    mutate,
    isValidating,
    loading,
    refresh
  }
}
