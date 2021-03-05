import { signalsToSpinSystem } from '../simulation/signalsToSpinSystem';
import simulate1D from '../simulation/simulate1D';

export function signalsToXY(signals, options = {}) {
  let {
    frequency = 400,
    shape = {
      kind: 'gaussian',
      options: {
        from: 0,
        to: 10,
        nbPoints: 16 * 1024,
      },
    },
    maxClusterSize = 8,
  } = options;

  let spinSystem = signalsToSpinSystem(signals, { frequency, maxClusterSize });

  let spectrum = simulate1D(spinSystem, {
    frequency,
    shape,
  });

  return spectrum;
}
