import { gsd, joinBroadPeaks, optimizePeaks } from 'ml-gsd';
import { absoluteMedian } from 'ml-spectra-processing/src/x/absoluteMedian';
import { extract } from 'ml-spectra-processing/src/xy/extract';
/**
 * Implementation of the peak picking method described by Cobas in:
 * A new approach to improving automated analysis of proton NMR spectra
 * through Global Spectral Deconvolution (GSD)
 * http://www.spectrosco-pyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
 * @param {object} data - Object of kind
 * @param {Object} peakList - nmr signals.
 * @param {Object} options - options object with some parameter for GSD.
 * @param {boolean} [options.compile = true] - If true, the Janalyzer function is run over signals to compile the patterns.
 * @param {number} [options.minMaxRatio = 0.01] - Threshold to determine if a given peak should be considered as a noise, bases on its relative height compared to the highest peak.
 * @param {number} [options.broadRatio = 0.00025] - If broadRatio is higher than 0, then all the peaks which second derivative smaller than broadRatio * maxAbsSecondDerivative will be marked with the soft mask equal to true.
 * @param {boolean} [options.smoothY = true] - Select the peak intensities from a smoothed version of the independent variables?
 * @param {number} [options.nL = 4] - factor to determine the width at the moment to group the peaks in signals in 'GSD.optimizePeaks' function.
 * @param {boolean} [options.optimize = true] - if it's true adjust an train of gaussian or lorentzian shapes to spectrum.
 * @param {string} [options.functionType = 'gaussian'] - This option allows us choose between 'gaussian' or 'lorentzian' function when options.optimize is true.
 * @param {number} [options.broadWidth = 0.25] - Threshold to determine if some peak is candidate to clustering into range.
 # @param {number} [options.noiseLevel]
 * @return {Array}
 */

export default function peakPicking(data, options = {}) {
  const {
    from,
    to,
    minMaxRatio = 0.01,
    broadRatio = 0.00025,
    smoothY = true,
    optimize,
    widthFactor = 4,
    realTopDetection = true,
    functionName = 'gaussian',
    broadWidth = 0.25,
    noiseLevel = absoluteMedian(data.x) * (options.thresholdFactor || 3),
    sgOptions = { windowSize: 9, polynomial: 3 },
  } = options;

  if (from !== undefined && to !== undefined) {
    data = extract(data, [{ from, to }]);
  }

  let peakList = gsd(data.x, data.y, {
    sgOptions,
    minMaxRatio,
    broadRatio,
    noiseLevel,
    smoothY,
    realTopDetection,
  });

  if (broadWidth) {
    peakList = joinBroadPeaks(peakList, { width: broadWidth });
  }
  if (optimize) {
    peakList = optimizePeaks(peakList, data.x, data.y, {
      widthFactor,
      functionName,
    });
  }

  return peakList;
}
