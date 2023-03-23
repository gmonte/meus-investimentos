import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { CDIInvestmentDocument } from './types';
import { fetchCdiByDay } from './cdiInvestment/fetchCdiByDay'
import { createCdiInvestment } from './cdiInvestment/createCdiInvestment';
import { readCdiInvestment } from './cdiInvestment/readCdiInvestment';
import { updateCdiInvestment } from './cdiInvestment/updateCdiInvestment';
import { deleteCdiInvestment } from './cdiInvestment/deleteCdiInvestment';
import { cronJobFetchCdiByDay } from './cdiInvestment/cronJobFetchCdiByDay';

admin.initializeApp();

const db = admin.firestore();

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayMorning = functions.pubsub.schedule('0 8 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(() => cronJobFetchCdiByDay(db));

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayEvening = functions.pubsub.schedule('0 18 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(() => cronJobFetchCdiByDay(db));

exports.fetchCdiByDay = functions.https.onRequest(async (request, response) => {
  await fetchCdiByDay(db);
  response.json().send();
});

exports.createCdiInvestment = functions.https.onRequest(async (request, response) => {
  const investment = await createCdiInvestment(db, request.body as CDIInvestmentDocument);
  response.json(investment).send();
});

exports.readCdiInvestment = functions.https.onRequest(async (request, response) => {
  const investment = await readCdiInvestment(db, request.body as CDIInvestmentDocument);
  response.json(investment).send();
});

exports.updateCdiInvestment = functions.https.onRequest(async (request, response) => {
  const { id } = request.body as CDIInvestmentDocument
  if (id) {
    const investment = await updateCdiInvestment(db, request.body as CDIInvestmentDocument);
    response.json(investment).send();
  } else {
    response.status(204).send()
  }
});

exports.deleteCdiInvestment = functions.https.onRequest(async (request, response) => {
  const { id } = request.body as CDIInvestmentDocument
  if (id) {
    await deleteCdiInvestment(db, request.body as CDIInvestmentDocument);
    response.send();
  } else {
    response.status(204).send()
  }
});
