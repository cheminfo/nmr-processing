import { signalsToSpinSystem } from '../simulation/signalsToSpinSystem';
import simulate1D from '../simulation/simulate1D';

export function signalsToXY(signals, options = {}) {
  let {
    frequency = 400,
    nbPoints = 16 * 1024,
    maxClusterSize = 8,
    output = 'xy',
  } = options;

  let spinSystem = signalsToSpinSystem(signals, { frequency, maxClusterSize });

  let spectrum = simulate1D(spinSystem, {
    frequency,
    nbPoints,
    output,
  });

  return spectrum;
}
