import axios, { AxiosResponse } from 'axios'
import * as admin from 'firebase-admin'
import { isArray } from 'lodash'
import * as moment from 'moment-timezone'

import { COLLECTIONS } from '../constants'
import {
  CDIDocument,
  CDIResponse
} from '../types'
import { sleep } from '../utils/sleep'

const tryFetch = async (initialDate: moment.Moment | false, count = 1): Promise<AxiosResponse<CDIResponse[]>> => {
  const response = await axios.get<CDIResponse[]>('https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados', {
    params: {
      formato: 'json',
      dataInicial: !initialDate ? '01/01/2018' : initialDate.format('DD/MM/YYYY'),
      dataFinal: moment().format('DD/MM/YYYY')
    }
  })

  if (isArray(response.data)) {
    return response
  }

  if (count <= 5) {
    const timer = 1000
    console.warn(`Error on fetch data at ${ count } time. Retrying in ${ timer } ms...`)
    await sleep(timer)
    return await tryFetch(initialDate, count + 1)
  }
  console.error(response.data)
  throw new Error(`Was not possible to fetch data from ${ axios.getUri({
    url: response.config.url,
    params: response.config.params
  }) }`)
}

export const fetchCdiByDay = async (db: admin.firestore.Firestore) => {
  try {
    const snapshot = await db.collection(COLLECTIONS.CDI_INDEXES).orderBy('date', 'desc').limit(1).get()
    const [lastRegister] = snapshot.docs.map<CDIDocument>(doc => doc.data() as CDIDocument)

    const initialDate = !!lastRegister?.date && moment(lastRegister.date).add(1, 'day')

    try {
      const { data } = await tryFetch(initialDate)

      const allMissingData = !initialDate ? data : data.filter(item => moment(item.data, 'DD/MM/YYYY').isSameOrAfter(initialDate))

      const batch = db.batch()

      allMissingData.forEach((missingData) => {
        const docRef = db.collection(COLLECTIONS.CDI_INDEXES).doc()
        batch.set(docRef, {
          date: moment(missingData.data, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          value: Number(missingData.valor),
          createdAt: moment().format()
        })
      })

      await batch.commit()

      console.log('Created CDI items:', allMissingData)

      return allMissingData.length
    } catch (err) {
      if (initialDate) {
        console.error(`Cannot get CDI Index for ${ initialDate.format('YYYY-MM-DD') }`)
      }
      throw (err)
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message)
    }
    return 0
  }
}
