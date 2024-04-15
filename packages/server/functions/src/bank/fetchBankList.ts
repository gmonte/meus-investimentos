import axios, { AxiosResponse } from 'axios'
import * as admin from 'firebase-admin'
import { isArray } from 'lodash'
import * as moment from 'moment-timezone'

import { COLLECTIONS } from '../constants'
import { FetchBankListResponse } from '../types'
import { sleep } from '../utils/sleep'

const tryFetch = async (count = 1): Promise<AxiosResponse<FetchBankListResponse>> => {
  const currentMonthYear = `${ moment().format('YYYYMM') }`
  const response = await axios.get<FetchBankListResponse>('https://olinda.bcb.gov.br/olinda/servico/IFDATA/versao/v1/odata/IfDataCadastro(AnoMes=@AnoMes)', {
    params: {
      formato: 'json',
      '@AnoMes': currentMonthYear,
      top: 10000,
      select: 'CodInst,NomeInstituicao'
    }
  })

  if (isArray(response.data?.value)) {
    return response
  }

  if (count <= 5) {
    const timer = 1000
    console.warn(`Error on fetch data at ${ count } time. Retrying in ${ timer } ms...`)
    await sleep(timer)
    return await tryFetch(count + 1)
  }
  console.error(response.data)
  throw new Error(`Was not possible fetch data from ${ axios.getUri({
 url: response.config.url,
params: response.config.params
}) }`)
}

export const fetchBankList = async (db: admin.firestore.Firestore) => {
  try {
    const { data: { value } } = await tryFetch()

    const batch = db.batch()

    value.forEach((data) => {
      const docRef = db.collection(COLLECTIONS.BANKS).doc(data.CodInst)
      batch.set(docRef, { name: data.NomeInstituicao })
    })

    await batch.commit()
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message)
    }
  }
}
