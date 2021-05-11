import fetch from 'cross-fetch';
import FormData from 'form-data';
import {
  addDiastereotopicMissingChirality,
  getConnectivityMatrix,
  getDiastereotopicAtomIDs,
} from 'openchemlib-utils';

import { signalsJoin } from '../signals/signalsJoin';
import { signalsToRanges } from '../signals/signalsToRanges.js';

/**
 * Makes a prediction using proton.
 * @param {Molecule} molecule - OCL Molecule instance.
 * @param {object} [options={}]
 * @param {function} [options.cache] A callback receiving a molfile and the result
 * @return {Promise<Array>}
 */
export async function predictionProton(molecule, options = {}) {
  const { cache } = options;
  molecule = molecule.getCompactCopy();
  molecule.addImplicitHydrogens();
  addDiastereotopicMissingChirality(molecule);
  const molfile = molecule.toMolfile();

  let result;
  if (cache) {
    result = cache(molfile);
  }
  if (result === undefined) {
    const formData = new FormData();
    formData.append('molfile', molfile);
    const response = await fetch('https://www.nmrdb.org/service/predictor', {
      method: 'POST',
      body: formData,
    });
    result = await response.text();
    if (cache) {
      cache(molfile, result);
    }
  }

  const diaIDs = getDiastereotopicAtomIDs(molecule);
  const signals = protonParser(result, molecule, diaIDs);
  const joinedSignals = signalsJoin(signals);
  return {
    molfile,
    diaIDs,
    joinedSignals,
    signals,
    ranges: signalsToRanges(joinedSignals),
  };
}

function protonParser(result, molecule, diaIDs) {
  let distanceMatrix = getConnectivityMatrix(molecule, { pathLength: true });
  let lines = result.split('\n').filter((line) => line);
  let signals = [];
  for (let line of lines) {
    let fields = line.split('\t');
    let couplings = fields.slice(4);
    let atom = fields[0] - 1;
    let signal = {
      assignment: [atom],
      diaID: [diaIDs[atom]],
      nbAtoms: 1,
      delta: Number(fields[2]),
      j: [],
    };
    for (let i = 0; i < couplings.length; i += 3) {
      let linked = Number(couplings[i] - 1);
      signal.j.push({
        coupling: Number(couplings[i + 2]),
        assignment: [linked],
        diaID: [diaIDs[linked]],
        multiplicity: 'd',
        distance: distanceMatrix[atom][linked],
      });
      signal.j.sort((a, b) => b.coupling - a.coupling);
    }
    signals.push(signal);
  }
  return signals;
}
