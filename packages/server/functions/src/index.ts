import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { fetchCdiByDay } from './fetchCdiByDay'
import { createCdiInvestment } from './createCdiInvestment';
import { InvestmentDocument } from './types';
import { getCdiInvestment } from './getCdiInvestment';

admin.initializeApp();

const db = admin.firestore();

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayMorning = functions.pubsub.schedule('0 8 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(() => fetchCdiByDay(db));

// This will be run every day at (Minute Hour * * *)
exports.cronJobFetchCdiByDayEvening = functions.pubsub.schedule('0 18 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(() => fetchCdiByDay(db));

exports.fetchCdiByDay = functions.https.onRequest(async (request, response) => {
  await fetchCdiByDay(db);
  response.json({ success: true }).send();
});

exports.createCdiInvestment = functions.https.onRequest(async (request, response) => {
  const investment = await createCdiInvestment(db, request.body as InvestmentDocument);
  response.json(investment).send();
});

exports.getCdiInvestment = functions.https.onRequest(async (request, response) => {
  const investment = await getCdiInvestment(db, request.body as InvestmentDocument);
  response.json(investment).send();
});
