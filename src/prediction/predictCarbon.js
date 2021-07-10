import fetch from 'cross-fetch';
import { addDiastereotopicMissingChirality } from 'openchemlib-utils';

import { signalsToRanges } from '../signals/signalsToRanges';

import { createInputJSON } from './utils/createInputJSON';
import { queryByHose } from './utils/queryByHOSE';

async function loadDB(database) {
  if (database) return database;
  const response = await fetch(
    'https://www.lactame.com/lib/nmr-processing/data/20210711/carbon.js',
  );
  return await response.json();
}

export async function predictCarbon(molecule, options = {}) {
  const { levels = [3, 2, 1, 0], database: carbonDB } = options;
  const database = await loadDB(carbonDB);

  molecule.addImplicitHydrogens();
  molecule.addMissingChirality();
  addDiastereotopicMissingChirality(molecule);

  const molfile = molecule.toMolfile();

  const inputJSON = createInputJSON(molecule, {
    levels,
  });

  let predictions = queryByHose(inputJSON, database, {
    levels,
  });

  const signals = formatSignals(predictions);
  const joinedSignals = joinSignalByDiaID(signals);
  return {
    molfile,
    diaIDs: inputJSON.diaIDs.map((e) => e.diaId),
    joinedSignals,
    signals,
    ranges: signalsToRanges(joinedSignals),
  };
}

function formatSignals(predictions) {
  let signals = [];
  for (const prediction of predictions) {
    const { atomIDs, nbAtoms, delta, diaIDs } = prediction;
    signals.push({
      delta,
      assignment: atomIDs,
      diaID: diaIDs,
      nbAtoms,
      j: [],
    });
  }
  return signals;
}

function joinSignalByDiaID(signals) {
  let joinedSignals = {};
  for (let signal of signals) {
    let diaID = signal.diaID[0];
    if (!joinedSignals[diaID]) {
      joinedSignals[diaID] = JSON.parse(JSON.stringify(signal));
    } else {
      joinedSignals[diaID].nbAtoms += signal.nbAtoms;
      joinedSignals[diaID].assignment.push(...signal.assignment);
    }
  }
  return Object.values(joinedSignals);
}
