import * as admin from 'firebase-admin'
import * as moment from 'moment'
import axios from 'axios'

import { COLLECTIONS } from '../constants'
import { CDIDocument, CDIResponse } from '../types'

export const fetchCdiByDay = async (db: admin.firestore.Firestore) => {
  const snapshot = await db.collection(COLLECTIONS.CDI_INDEXES).orderBy('date', 'desc').limit(1).get()
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

  const batch = db.batch()

  allMissingData.forEach((missingData) => {
    const docRef = db.collection(COLLECTIONS.CDI_INDEXES).doc()
    batch.set(docRef, {
      date: moment(missingData.data, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      value: Number(missingData.valor)
    })
  })

  await batch.commit()

  console.log('Created CDI items:', allMissingData)

  return allMissingData.length
}