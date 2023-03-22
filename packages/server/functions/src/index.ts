import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as moment from 'moment'
import axios from 'axios'

admin.initializeApp();

const db = admin.firestore();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const getCdiByDay = async () => {
  const snapshot = await db.collection('CDI').orderBy('date', 'desc').limit(1).get()
  const [lastRegister] = snapshot.docs.map<CDIDocument>(doc => doc.data() as CDIDocument)

  const initialDate = lastRegister?.date && moment(lastRegister.date, 'YYYY-MM-DD').add(1, 'day')

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
      return await db.collection('CDI').doc().set({
        date: moment(missingData.data, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        value: Number(missingData.valor)
      })
    })
  )

  return null;
}


// This will be run every day at (Minute Hour * * *)
exports.getCdiByDayMorning = functions.pubsub.schedule('0 8 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(getCdiByDay);

// This will be run every day at (Minute Hour * * *)
exports.getCdiByDayEvening = functions.pubsub.schedule('0 18 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(getCdiByDay);