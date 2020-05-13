import { couplingPatterns } from '../constants/couplingPatterns';

export function getPattern(signal) {
  let couplings = signal.j;
  let pattern = '';
  if (couplings && couplings.length > 0) {
    for (let coupling of couplings) {
      pattern += coupling.multiplicity;
    }
  } else if (signal.delta) {
    pattern = 's';
  } else {
    pattern = 'm';
  }
  return pattern;
}
