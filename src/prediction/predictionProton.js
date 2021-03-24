import FormData from 'form-data';
import fetch from 'node-fetch';
import {
  addDiastereotopicMissingChirality,
  getDiastereotopicAtomIDs,
} from 'openchemlib-utils';

import { signalJoinCouplings } from '../signal/signalJoinCouplings';
import { signalsToRanges } from '../signals/signalsToRanges.js';

/**
 * Makes a prediction using proton.
 * @param {Molecule} molecule - OCL Molecule instance.
 * @param {object} options
 * @return {Promise<Array>}
 */
export async function predictionProton(molecule) {
  molecule = molecule.getCompactCopy();
  molecule.addImplicitHydrogens();
  addDiastereotopicMissingChirality(molecule);
  const molfile = molecule.toMolfile();
  const formData = new FormData();
  formData.append('molfile', molfile);

  const response = await fetch('https://www.nmrdb.org/service/predictor', {
    method: 'POST',
    body: formData,
  });
  const result = await response.text();

  const signals = protonParser(result);
  const joinedSignals = signals.map((signal) =>
    signalJoinCouplings(signal, { tolerance: 0.2 }),
  );
  return {
    molfile,
    diaIDs: getDiastereotopicAtomIDs(molecule),
    joinedSignals,
    signals,
    ranges: signalsToRanges(signals),
  };
}

function protonParser(result) {
  let lines = result.split('\n').filter((line) => line);
  let signals = [];
  for (let line of lines) {
    let fields = line.split('\t');
    let couplings = fields.slice(4);
    let signal = {
      assignment: fields[0] - 1,
      nbAtoms: 1,
      delta: Number(fields[2]),
      j: [],
    };
    for (let i = 0; i < couplings.length; i += 3) {
      signal.j.push({
        coupling: Number(couplings[i + 2]),
        assignment: Number(couplings[i] - 1),
      });
    }
    signals.push(signal);
  }
  return signals;
}
