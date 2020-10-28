import { gsd, joinBroadPeaks, optimizePeaks } from 'ml-gsd';
import { xAbsoluteMedian, xyExtract } from 'ml-spectra-processing';
/**
 * Implementation of the peak picking method described by Cobas in:
 * A new approach to improving automated analysis of proton NMR spectra
 * through Global Spectral Deconvolution (GSD)
 * http://www.spectrosco-pyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
 * @param {DataXY} data - Object of kind
 * @param {Object} [options={}] - options object with some parameter for GSD.
 * @param {Boolean} [options.compile = true] - If true, the Janalyzer function is run over signals to compile the patterns.
 * @param {Number} [options.minMaxRatio = 0.01] - Threshold to determine if a given peak should be considered as a noise, bases on its relative height compared to the highest peak.
 * @param {Number} [options.broadRatio = 0.00025] - If broadRatio is higher than 0, then all the peaks which second derivative smaller than broadRatio * maxAbsSecondDerivative will be marked with the soft mask equal to true.
 * @param {Boolean} [options.smoothY = true] - Select the peak intensities from a smoothed version of the independent variables?
 * @param {Number} [options.nL = 4] - factor to determine the width at the moment to group the peaks in signals in 'GSD.optimizePeaks' function.
 * @param {Boolean} [options.optimize = true] - if it's true adjust an train of gaussian or lorentzian shapes to spectrum.
 * @param {String} [options.functionType = 'gaussian'] - This option allows us choose between 'gaussian' or 'lorentzian' function when options.optimize is true.
 * @param {Number} [options.broadWidth = 0.25] - Threshold to determine if some peak is candidate to clustering into range.
 # @param {Number} [options.noiseLevel]
 * @return {Array}
 */

export function xyAutoPeaksPicking(data, options = {}) {
  const {
    from,
    to,
    minMaxRatio = 0.01,
    broadRatio = 0.00025,
    smoothY = true,
    optimize,
    factorWidth = 4,
    realTopDetection = true,
    functionName = 'gaussian',
    broadWidth = 0.25,
    lookNegative = false,
    noiseLevel = xAbsoluteMedian(data.x) * (options.thresholdFactor || 3),
    sgOptions = { windowSize: 9, polynomial: 3 },
  } = options;

  if (from !== undefined && to !== undefined) {
    data = xyExtract(data, [{ from, to }]);
  }

  let getPeakOptions = {
    broadWidth,
    optimize,
    factorWidth,
    functionName,
    sgOptions,
    minMaxRatio,
    broadRatio,
    noiseLevel,
    smoothY,
    realTopDetection,
  };

  let result = getPeakList(data, getPeakOptions);
  return lookNegative
    ? result.concat(getNegativePeaks(data, getPeakOptions))
    : result;
}

function getPeakList(data, options) {
  const {
    broadWidth,
    optimize,
    factorWidth,
    functionName,
    sgOptions,
    minMaxRatio,
    broadRatio,
    noiseLevel,
    smoothY,
    realTopDetection,
  } = options;

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
      factorWidth,
      functionName,
    });
  }

  return peakList;
}

function getNegativePeaks(data, options) {
  let { x, y } = data;
  let negativeDataY = new Float64Array(data.y.length);
  for (let i = 0; i < negativeDataY.length; i++) {
    negativeDataY[i] = -1 * y[i];
  }

  let peakList = getPeakList({ x, y: negativeDataY }, options);

  for (let i = 0; i < peakList.length; i++) {
    peakList[i].y *= -1;
  }
  return peakList;
}
