import rescale from 'ml-array-rescale';

import { signalsToSpinSystem } from './simulation/signalsToSpinSystem';
import simulate1D from './simulation/simulate1D';

/**
 * Generate a spectrum from an array of singals
 * @param {array} signals
 * @param {object} [options={}]
 * @param {number} [options.frequency=400] Frequency (in MHz) of the simulated spectrum
 * @param {number} [options.maxValue=1e8] Default height of the simulated spectrum
 * @param {number} [options.maxClusterSize=8] Maximal size of a cluster before dividing the problem. Smaller value increase the speed but reduce the quality
 * @param {object} [options.shape] Shape of the peaks, by default gaussian shape
 * @returns  {object} an object of the kind {x:[], y:[]}
 */
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
    maxValue = 1e8,
    maxClusterSize = 8,
  } = options;

  let spinSystem = signalsToSpinSystem(signals, { frequency, maxClusterSize });

  let spectrum = simulate1D(spinSystem, {
    frequency,
    shape,
  });

  if (maxValue) {
    spectrum.y = rescale(spectrum.y, { max: maxValue });
  }

  return spectrum;
}
