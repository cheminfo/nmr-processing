import sum from 'ml-array-sum';

import { joinPatterns } from '../utilities/joinPatterns';

import { signalNormalize } from './signalNormalize';

/**
 * Join couplings smaller than a define tolerance.
 * The resulting coupling should be an average of the existing one.
 * This function will also ensure that assignment and diaID are arrays.
 * If distance is specified and is not always the same this property will be removed.
 * @param {object} signal
 * @param {object} [options={}]
 * @param {number} [options.tolerance=0.05] tolerance to merge the couplings
 * @returns signal
 */
export function signalJoinCouplings(signal, options = {}) {
  const { tolerance = 0.05 } = options;
  signal = signalNormalize(signal);

  if (!signal.j || signal.j.length < 2) return signal;

  // we group the couplings that are less than the expected tolerance
  let currentGroup = [signal.j[0]];
  let groups = [currentGroup];
  for (let i = 1; i < signal.j.length; i++) {
    let currentJ = signal.j[i];
    if (
      currentGroup[currentGroup.length - 1].coupling - currentJ.coupling <
      tolerance
    ) {
      currentGroup.push(currentJ);
    } else {
      currentGroup = [currentJ];
      groups.push(currentGroup);
    }
  }

  signal.j = [];
  for (let group of groups) {
    let coupling = sum(group.map((group) => group.coupling)) / group.length;
    let assignment = distinctValues(
      group
        .filter((group) => group.assignment && group.assignment.length > 0)
        .map((group) => group.assignment)
        .flat(),
    );
    let diaID = distinctValues(
      group
        .filter((group) => group.diaID && group.diaID.length > 0)
        .map((group) => group.diaID)
        .flat(),
    );
    let distances = distinctValues(group.map((group) => group.distance));
    let multiplicity = joinPatterns(group.map((group) => group.multiplicity));

    let newJ = {
      coupling,
      multiplicity,
    };
    if (diaID.length > 0) newJ.diaID = diaID;
    if (distances.length === 1 && distances[0]) newJ.distance = distances[0];
    if (assignment.length > 0) newJ.assignment = assignment;
    signal.j.push(newJ);
  }

  return signal;
}

function distinctValues(array) {
  return [...new Set(array)];
}
