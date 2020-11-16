import { peaksFilterImpurities } from '../peaks/peaksFilterImpurities';
import { peaksToRanges } from '../peaks/peaksToRanges';

import { xyAutoPeaksPicking } from './xyAutoPeaksPicking';

/**
 * Detect peaks, optimize parameters and compile multiplicity if required.
 * @param {DataXY} data - Object of kind
 * @param {object} [options={}] - options object with some parameter for GSD.
 * @param {object} [options.peakPicking = {}] - options to peak detection and optimization.
 * @param {number} [options.peakPicking.minMaxRatio = 0.01] - Threshold to determine if a given peak should be considered as a noise, bases on its relative height compared to the highest peak.
 * @param {number} [options.peakPicking.broadRatio = 0.00025] - If broadRatio is higher than 0, then all the peaks which second derivative smaller than broadRatio * maxAbsSecondDerivative will be marked with the soft mask equal to true.
 * @param {number} [options.peakPicking.broadWidth = 0.25] - Threshold to determine if some peak is candidate to clustering into range.
 * @param {number} [options.peakPicking.noiseLevel = median(data.y) * (options.thresholdFactor || 3)] - Noise threshold in spectrum y units. Default is three/thresholdFactor times the absolute median of data.y.
 * @param {number} [options.peakPicking.factorWidth = 4] - factor to determine the width at the moment to group the peaks in signals in 'GSD.optimizePeaks' function.
 * @param {object} [options.peakPicking.shape={}] - it's specify the kind of shape used to fitting.
 * @param {string} [options.peakPicking.shape.kind = 'gaussian'] - kind of shape; lorentzian, gaussian and pseudovoigt are supported.
 * @param {object} [options.peakPicking.optimization = {}] - it's specify the kind and options of the algorithm use to optimize parameters.
 * @param {string} [options.peakPicking.optimization.kind = 'lm'] - kind of algorithm. By default it's levenberg-marquardt.
 * @param {object} [options.peakPicking.optimization.options = {}] - options for the specific kind of algorithm.
 * @param {Boolean} [options.peakPicking.compile = true] - If true, the Janalyzer function is run over signals to compile the patterns.
 * @param {Boolean} [options.peakPicking.smoothY = true] - Select the peak intensities from a smoothed version of the independent variables?
 * @param {Boolean} [options.peakPicking.optimize = true] - if it's true adjust an train of gaussian or lorentzian shapes to spectrum.
 * @param {object} [options.impurities = {}] - impurities options.
 * @param {string} [options.impurities.solvent = ''] - solvent name.
 * @param {string} [options.impurities.error = 0.025] - tolerance in ppm to assign a impurity.
 * @returns {array} - Array of ranges with {from, to, integral, signals: [{delta, j, multiplicity, peaks}]}
 */

export function xyAutoRangesPicking(data, options = {}) {
  let peaks = xyAutoPeaksPicking(data, options.peakPicking);

  peaks = peaksFilterImpurities(peaks, options.impurities);

  let ranges = peaksToRanges(data, peaks, options.peakPicking);
  return ranges;
}
