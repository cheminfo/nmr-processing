/**
 * Ensure that assignment and diaID are arrays and coupling are sorted
 * @param {object} signal
 * @returns signal
 */
export function signalNormalize(signal) {
  signal = JSON.parse(JSON.stringify(signal));

  if (signal.assignment && !Array.isArray(signal.assignment)) {
    signal.assignment = [signal.assignment];
  }
  if (signal.diaID && !Array.isArray(signal.diaID)) {
    signal.diaID = [signal.diaID];
  }
  if (signal.j) {
    let couplings = signal.j;
    for (let coupling of couplings) {
      if (coupling.assignment && !Array.isArray(coupling.assignment)) {
        coupling.assignment = [coupling.assignment];
      }
      if (coupling.diaID && !Array.isArray(coupling.diaID)) {
        coupling.diaID = [coupling.diaID];
      }
    }
    signal.j = signal.j.sort((a, b) => b.coupling - a.coupling);
  }
  return signal;
}
