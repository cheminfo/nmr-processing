import { gsd, joinBroadPeaks, optimizePeaks } from 'ml-gsd';
import {
  xyExtract,
  xNoiseSanPlot,
  xAbsoluteMedian,
} from 'ml-spectra-processing';
/**
 * Implementation of the peak picking method described by Cobas in:
 * A new approach to improving automated analysis of proton NMR spectra
 * through Global Spectral Deconvolution (GSD)
 * http://www.spectrosco-pyeurope.com/images/stories/ColumnPDFs/TD_23_1.pdf
 * @param {DataXY} data - Object of kind
 * @param {object} [options={}] - options object with some parameter for GSD.
 * @param {number} [options.minMaxRatio = 0.01] - Threshold to determine if a given peak should be considered as a noise, bases on its relative height compared to the highest peak.
 * @param {number} [options.broadRatio = 0.00025] - If broadRatio is higher than 0, then all the peaks which second derivative smaller than broadRatio * maxAbsSecondDerivative will be marked with the soft mask equal to true.
 * @param {number} [options.broadWidth = 0.25] - Threshold to determine if some peak is candidate to clustering into range.
 * @param {number} [options.thresholdFactor=3] - the factor that multiplies the noise level to set up a threshold to select peaks with respect to the intensity.
 * @param {number} [options.noiseLevel = median(data.y) * (options.thresholdFactor || 3)] - Noise threshold in spectrum y units. Default is three/thresholdFactor times the absolute median of data.y.
 * @param {number} [options.factorWidth = 4] - factor to determine the width at the moment to group the peaks in signals in 'GSD.optimizePeaks' function.
 * @param {object} [options.shape={}] - it's specify the kind of shape used to fitting.
 * @param {string} [options.shape.kind = 'gaussian'] - kind of shape; lorentzian, gaussian and pseudovoigt are supported.
 * @param {object} [options.optimization = {}] - it's specify the kind and options of the algorithm use to optimize parameters.
 * @param {string} [options.optimization.kind = 'lm'] - kind of algorithm. By default it's levenberg-marquardt.
 * @param {object} [options.optimization.options = {}] - options for the specific kind of algorithm.
 * @param {Boolean} [options.smoothY = true] - Select the peak intensities from a smoothed version of the independent variables?
 * @param {Boolean} [options.optimize = true] - if it's true adjust an train of gaussian or lorentzian shapes to spectrum.
 * @return {Array}
 */

export function xyAutoPeaksPicking(data, options = {}) {
  const {
    from,
    to,
    noiseLevel,
    thresholdFactor = 3,
    minMaxRatio = 0.05,
    broadRatio = 0.00025,
    useSanPlot = false,
    smoothY = true,
    optimize = false,
    factorWidth = 4,
    realTopDetection = true,
    shape = { kind: 'gaussian' },
    optimization = { kind: 'lm' },
    broadWidth = 0.25,
    lookNegative = false,
    sgOptions = { windowSize: 9, polynomial: 3 },
  } = options;

  if (from !== undefined && to !== undefined) {
    data = xyExtract(data, [{ from, to }]);
  }

  const cutOff = getCutOff(data.y, { noiseLevel, useSanPlot, thresholdFactor });

  let getPeakOptions = {
    shape,
    broadWidth,
    optimize,
    factorWidth,
    sgOptions,
    minMaxRatio,
    broadRatio,
    noiseLevel: cutOff.positive,
    smoothY,
    optimization,
    realTopDetection,
  };

  let peaks = getPeakList(data, getPeakOptions);

  if (lookNegative) {
    getPeakOptions.noiseLevel = cutOff.negative;
    peaks.push(...getNegativePeaks(data, getPeakOptions));
  }

  return peaks;
}

function getPeakList(data, options) {
  const {
    shape,
    broadWidth,
    optimize,
    factorWidth,
    sgOptions,
    minMaxRatio,
    broadRatio,
    noiseLevel,
    smoothY,
    optimization,
    realTopDetection,
  } = options;

  let peakList = gsd(data, {
    sgOptions,
    minMaxRatio,
    broadRatio,
    noiseLevel,
    smoothY,
    realTopDetection,
  });

  if (broadWidth) {
    peakList = joinBroadPeaks(peakList, {
      width: broadWidth,
      shape,
      optimization,
    });
  }

  if (optimize) {
    peakList = optimizePeaks(data, peakList, {
      shape,
      factorWidth,
      optimization,
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

function getCutOff(data, options = {}) {
  const { noiseLevel, useSanPlot, thresholdFactor } = options;

  const formatResult = (noiseLevel) =>
    typeof noiseLevel === 'number'
      ? { positive: noiseLevel, negative: -noiseLevel }
      : noiseLevel;

  if (noiseLevel) {
    return formatResult(noiseLevel);
  } else {
    return useSanPlot
      ? xNoiseSanPlot(data, { factorStd: thresholdFactor })
      : formatResult(xAbsoluteMedian(data) * thresholdFactor);
  }
}
