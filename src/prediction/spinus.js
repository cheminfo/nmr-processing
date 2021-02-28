import FormData from 'form-data';
import fetch from 'node-fetch';
import OCL from 'openchemlib';
import {
  initOCL,
  addDiastereotopicMissingChirality,
  getDiastereotopicAtomIDs,
} from 'openchemlib-utils';

import { signalJoinCouplings } from '../signal/signalJoinCouplings';

initOCL(OCL);

export function fromSmiles(smiles, options) {
  const molecule = OCL.Molecule.fromSmiles(smiles);
  return fromMolecule(molecule, options);
}

export function fromMolfile(molfile, options) {
  const molecule = OCL.Molecule.fromMolfile(molfile);
  return fromMolecule(molecule, options);
}

/**
 * Makes a prediction using spinus
 * @param {Molecule} molecule - could be a string of molfile, smile or Molecule instance.
 * @param {object} options
 * @return {Promise<Array>}
 */

async function fromMolecule(molecule) {
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

  const signals = spinusParser(result);
  const joinedSignals = signals.map((signal) =>
    signalJoinCouplings(signal, { tolerance: 0.2 }),
  );
  return {
    molfile,
    diaIDs: getDiastereotopicAtomIDs(molecule),
    joinedSignals,
    signals,
  };
}

function spinusParser(result) {
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
        assignment: Number(couplings[i]),
      });
    }
    signals.push(signal);
  }
  return signals;
}
