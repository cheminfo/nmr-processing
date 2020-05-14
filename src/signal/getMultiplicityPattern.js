/**
 * Return
 * @param {*} signal
 */

export function getMultiplicityPattern(signal) {
  let js = signal.j;
  let pattern = '';
  if (js && js.length > 0) {
    for (let coupling of js) {
      pattern += coupling.multiplicity;
    }
  } else if (signal.delta) {
    pattern = 's';
  } else {
    pattern = 'm';
  }
  return pattern;
}
