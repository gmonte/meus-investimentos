import * as admin from 'firebase-admin'
import * as moment from 'moment'
import axios from 'axios'

import { collections } from './constants'
import { CDIDocument, CDIResponse } from './types'

export const fetchCdiByDay = async (db: admin.firestore.Firestore) => {
  const snapshot = await db.collection(collections.cdiIndexes).orderBy('date', 'desc').limit(1).get()
  const [lastRegister] = snapshot.docs.map<CDIDocument>(doc => doc.data() as CDIDocument)

  const initialDate = lastRegister?.date && moment(lastRegister.date).add(1, 'day')

  const { data } = await axios.get<CDIResponse[]>('https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados', {
    params: {
      formato: 'json',
      dataInicial: !initialDate ? '01/01/2018' : initialDate.format('DD/MM/YYYY'),
      dataFinal: moment().format('DD/MM/YYYY')
    }
  })

  const allMissingData = !initialDate ? data : data.filter(item => moment(item.data, 'DD/MM/YYYY').isSameOrAfter(initialDate))

  await Promise.all(
    allMissingData.map(async (missingData) => {
      return await db.collection(collections.cdiIndexes).doc().set({
        date: moment(missingData.data, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        value: Number(missingData.valor)
      })
    })
  )

  return null;
}