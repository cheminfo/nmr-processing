import Matrix from 'ml-matrix';
import simpleClustering from 'ml-simple-clustering';

import { ensureClusterSize } from './ensureClusterSize';

export function signalsToSpinSystem(signals, options = {}) {
  let { frequency = 400, maxClusterSize = 8 } = options;
  const nSpins = signals.length;
  const chemicalShifts = new Array(nSpins);
  const multiplicity = new Array(nSpins);
  const couplingConstants = Matrix.zeros(nSpins, nSpins);
  //create a list of assignments
  const ids = {};
  for (let i = 0; i < nSpins; i++) {
    multiplicity[i] = 2;
    chemicalShifts[i] = signals[i].delta;
    ids[signals[i].assignment] = i;
  }
  //create the coupling matrix
  for (let i = 0; i < nSpins; i++) {
    let { assignment: signalAssignment, j: jCoupling } = signals[i];
    for (let k = 0; k < jCoupling.length; k++) {
      let { coupling, assignment } = jCoupling[k];
      couplingConstants.set(ids[signalAssignment], ids[assignment], coupling);
      couplingConstants.set(ids[assignment], ids[signalAssignment], coupling);
    }
  }

  const connectivity = Matrix.ones(
    couplingConstants.rows,
    couplingConstants.rows,
  );
  for (let i = 0; i < couplingConstants.rows; i++) {
    for (let j = i; j < couplingConstants.columns; j++) {
      if (couplingConstants.get(i, j) === 0) {
        connectivity.set(i, j, 0);
        connectivity.set(j, i, 0);
      }
    }
  }

  let clusters = simpleClustering(connectivity.to2DArray(), {
    out: 'indexes',
  });

  let spinSystem = {
    clusters,
    couplingConstants,
    chemicalShifts,
    multiplicity,
    connectivity,
  };

  spinSystem.clusters = ensureClusterSize(spinSystem, {
    frequency,
    maxClusterSize,
  });

  return spinSystem;
}
