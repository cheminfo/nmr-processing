import { couplingPatterns } from '../constants/couplingPatterns';
import { couplingValues } from '../constants/couplingValues';

/**
 *
 * @param {array<string>} patterns
 * @returns
 */
export function joinPatterns(patterns) {
  let sum = 0;
  for (let pattern of patterns) {
    if (couplingValues[pattern] !== undefined) {
      sum += couplingValues[pattern];
    } else {
      throw new Error(`Unknown multiplicity: ${pattern}`);
    }
  }
  return couplingPatterns[sum];
}
