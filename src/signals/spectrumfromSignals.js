import SpinSystem from '../simulation/SpinSystem';
import simulate1D from '../simulation/simulate1D';

export function spectrumfromSignals(signals, options = {}) {
  options = Object.assign(
    {},
    {
      nbPoints: 16 * 1024,
      maxClusterSize: 8,
      output: 'xy',
    },
    options,
  );

  const spinSystem = SpinSystem.fromPrediction(signals);
  spinSystem.ensureClusterSize(options);
  let spectrum = simulate1D(spinSystem, options);
  return spectrum;
}
