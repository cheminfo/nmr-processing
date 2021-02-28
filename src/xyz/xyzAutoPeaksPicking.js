import { Matrix } from 'ml-matrix';
import * as convolution from 'ml-matrix-convolution';
import * as matrixPeakFinders from 'ml-matrix-peaks-finder';
import simpleClustering from 'ml-simple-clustering';

import { determineRealTop } from '../peaks/util/determineRealTop';
import { getKernel } from '../peaks/util/getKernel';
import * as PeakOptimizer from '../peaks/util/peakOptimizer';

const smallFilter = [
  [0, 0, 1, 2, 2, 2, 1, 0, 0],
  [0, 1, 4, 7, 7, 7, 4, 1, 0],
  [1, 4, 5, 3, 0, 3, 5, 4, 1],
  [2, 7, 3, -12, -23, -12, 3, 7, 2],
  [2, 7, 0, -23, -40, -23, 0, 7, 2],
  [2, 7, 3, -12, -23, -12, 3, 7, 2],
  [1, 4, 5, 3, 0, 3, 5, 4, 1],
  [0, 1, 3, 7, 7, 7, 3, 1, 0],
  [0, 0, 1, 2, 2, 2, 1, 0, 0],
];

export function xyzAutoPeaksPicking(spectraData, options = {}) {
  let {
    sizeToPad = 14,
    realTopDetection = true,
    thresholdFactor = 0.5,
    nucleus = ['1H', '1H'],
    observeFrequencies,
    enhanceSymmetry = false,
    clean = true,
    maxPercentCutOff = 0.03,
    tolerances = [24, 24],
    convolutionByFFT = true,
    kernel: kernelOptions,
  } = options;

  thresholdFactor = thresholdFactor === 0 ? 1 : Math.abs(thresholdFactor);

  let nbPoints = spectraData.z[0].length;
  let nbSubSpectra = spectraData.z.length;

  if (nbSubSpectra < sizeToPad) {
    spectraData = padData(spectraData, { width: sizeToPad });
    nbPoints = spectraData.z[0].length;
    nbSubSpectra = spectraData.z.length;
  }

  let absoluteData = new Float64Array(nbPoints * nbSubSpectra);
  let originalData = new Float64Array(nbPoints * nbSubSpectra);

  for (let iSubSpectra = 0; iSubSpectra < nbSubSpectra; iSubSpectra++) {
    let spectrum = spectraData.z[iSubSpectra];
    for (let iCol = 0; iCol < nbPoints; iCol++) {
      let index = iSubSpectra * nbPoints + iCol;
      absoluteData[index] = Math.abs(spectrum[iCol]);
      originalData[index] = spectrum[iCol]; //@todo pensar si se puede evitar originalData
    }
  }

  let kernel = kernelOptions ? getKernel(kernelOptions) : smallFilter;

  let convolutedSpectrum = convolutionByFFT
    ? convolution.fft(absoluteData, kernel, {
        rows: nbSubSpectra,
        cols: nbPoints,
      })
    : convolution.direct(absoluteData, kernel, {
        rows: nbSubSpectra,
        cols: nbPoints,
      });

  let peaksMC1 = matrixPeakFinders.findPeaks2DRegion(absoluteData, {
    originalData,
    filteredData: convolutedSpectrum,
    rows: nbSubSpectra,
    cols: nbPoints,
    nStdDev: thresholdFactor,
  });

  if (clean) {
    // Remove peaks with less than x% of the intensity of the highest peak
    peaksMC1 = PeakOptimizer.clean(peaksMC1, maxPercentCutOff);
  }

  let signals = createSignals2D(peaksMC1, {
    nRows: nbSubSpectra,
    nCols: nbPoints,
    minX: spectraData.minX,
    maxX: spectraData.maxX,
    minY: spectraData.minY,
    maxY: spectraData.maxY,
    absoluteData,
    originalData,
    tolerances,
    nucleus,
    observeFrequencies,
    realTopDetection,
  });

  if (enhanceSymmetry) {
    signals = PeakOptimizer.enhanceSymmetry(signals);
  }

  return signals;
}

// How noisy is the spectrum depending on the kind of experiment.
//const getLoGnStdDevNMR = (isHomoNuclear) => {
//  return isHomoNuclear ? 1.5 : 3;
//};

/**
 * This function converts a set of 2D-peaks in 2D-signals. Each signal could be composed
 * of many 2D-peaks, and it has some additional information related to the NMR spectrum.
 * @param {Array} peaks
 * @param {Object} spectraData
 * @param {Object} options
 * @return {Array}
 * @private
 */
const createSignals2D = (peaks, options) => {
  let {
    nCols,
    nRows,
    absoluteData,
    originalData,
    observeFrequencies,
    tolerances,
    nucleus,
    realTopDetection,
    minY,
    maxY,
    minX,
    maxX,
  } = options;

  let [nucleusX, nucleusY] = nucleus;
  let [toleranceX, toleranceY] = tolerances;
  let [observeFrequencyX, observeFrequencyY] = observeFrequencies;

  let dy = (maxY - minY) / (nRows - 1);
  let dx = (maxX - minX) / (nCols - 1);

  if (realTopDetection) {
    peaks = determineRealTop(peaks, {
      nCols,
      absoluteData,
      originalData,
      minX,
      maxX,
      minY,
      maxY,
    });
  }

  for (let i = peaks.length - 1; i >= 0; i--) {
    let { x, y } = peaks[i];
    peaks[i].x = minX + dx * x;
    peaks[i].y = minY + dy * y;

    // Still having problems to correctly detect peaks on those areas. So I'm removing everything there.
    if (peaks[i].y < -1 || peaks[i].y >= 210) {
      peaks.splice(i, 1);
    }
  }
  // The connectivity matrix is an square and symmetric matrix, so we'll only store the upper diagonal in an
  // array like form
  let connectivity = [];
  for (let i = 0; i < peaks.length; i++) {
    for (let j = i; j < peaks.length; j++) {
      if (
        Math.abs(peaks[i].x - peaks[j].x) * observeFrequencyX < toleranceX &&
        Math.abs(peaks[i].y - peaks[j].y) * observeFrequencyY < toleranceY
      ) {
        // 24*24Hz We cannot distinguish peaks with less than 20 Hz of separation
        connectivity.push(1);
      } else {
        connectivity.push(0);
      }
    }
  }
  let clusters = simpleClustering(connectivity);

  let signals = [];
  if (clusters) {
    for (let iCluster = 0; iCluster < clusters.length; iCluster++) {
      let signal = {
        nucleusX,
        nucleusY,
      };
      signal.resolutionX = dx;
      signal.resolutionY = dy;
      let peaks2D = [];
      signal.shiftX = 0;
      signal.shiftY = 0;
      let minMax1 = [Number.MAX_VALUE, 0];
      let minMax2 = [Number.MAX_VALUE, 0];
      let sumZ = 0;
      for (let jPeak = clusters[iCluster].length - 1; jPeak >= 0; jPeak--) {
        if (clusters[iCluster][jPeak] === 1) {
          peaks2D.push({
            x: peaks[jPeak].x,
            y: peaks[jPeak].y,
            z: peaks[jPeak].z,
          });
          signal.shiftX += peaks[jPeak].x * peaks[jPeak].z;
          signal.shiftY += peaks[jPeak].y * peaks[jPeak].z;
          sumZ += peaks[jPeak].z;
          if (peaks[jPeak].minX < minMax1[0]) {
            minMax1[0] = peaks[jPeak].minX;
          }
          if (peaks[jPeak].maxX > minMax1[1]) {
            minMax1[1] = peaks[jPeak].maxX;
          }
          if (peaks[jPeak].minY < minMax2[0]) {
            minMax2[0] = peaks[jPeak].minY;
          }
          if (peaks[jPeak].maxY > minMax2[1]) {
            minMax2[1] = peaks[jPeak].maxY;
          }
        }
      }

      signal.fromTo = [
        { from: minX + dx * minMax1[0], to: minX + dx * minMax1[1] },
        { from: minY + dy * minMax2[0], to: minY + dy * minMax2[1] },
      ];
      signal.shiftX /= sumZ;
      signal.shiftY /= sumZ;
      signal.peaks = peaks2D;
      signals.push(signal);
    }
  }
  return signals;
};

const padData = (spectraData, options = {}) => {
  let { minX, maxX, minY, maxY } = spectraData;
  let { width } = options;

  let nbPoints = spectraData.z[0].length;
  let nbSubSpectra = spectraData.z.length;

  let yInterval = (maxY - minY) / (nbSubSpectra - 1);
  let xInterval = (maxX - minX) / (nbPoints - 1);

  let yDiff = width - nbSubSpectra;
  let xDiff = Math.max(width - nbPoints, 0);
  if (xDiff % 2) xDiff++;
  if (yDiff % 2) yDiff++;

  let xOffset = xDiff / 2;
  let yOffset = yDiff / 2;
  let newMatrix = Matrix.zeros(nbSubSpectra + yDiff, nbPoints + xDiff);
  for (let i = 0; i < nbSubSpectra; i++) {
    for (let j = 0; j < nbPoints; j++) {
      newMatrix.set(i + yOffset, j + xOffset, spectraData.z[i][j]);
    }
  }

  return {
    z: newMatrix.to2DArray(),
    minX: minX - xOffset * xInterval,
    maxX: maxX + xOffset * xInterval,
    minY: minY - yOffset * yInterval,
    maxY: maxY + yOffset * yInterval,
  };
};
