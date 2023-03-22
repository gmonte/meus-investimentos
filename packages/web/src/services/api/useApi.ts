import {
  SWRConfiguration,
  Key
} from 'swr'

import { useFetch } from '~/hooks/useFetch'

import { api } from '.'

export function useApi<Data = unknown, Error = unknown> (
  url: Key,
  swrConfiguration?: SWRConfiguration<Data, Error>
) {
  return useFetch<Data, Error>(api, url, swrConfiguration)
}
