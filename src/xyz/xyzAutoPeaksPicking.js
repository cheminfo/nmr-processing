import * as convolution from 'ml-matrix-convolution';
import * as matrixPeakFinders from 'ml-matrix-peaks-finder';
import simpleClustering from 'ml-simple-clustering';

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
    thresholdFactor = 0.5,
    isHomoNuclear,
    nucleus = ['1H', '1H'],
    observeFrequencies,
    enhanceSymmetry = false,
    clean = true,
    maxPercentCutOff = 0.03,
    toleranceX = 24,
    toleranceY = 24,
    convolutionByFFT = true,
  } = options;

  if (thresholdFactor === 0) {
    thresholdFactor = 1;
  }
  if (thresholdFactor < 0) {
    thresholdFactor = -thresholdFactor;
  }
  let nbPoints = spectraData.z[0].length;
  let nbSubSpectra = spectraData.z.length;
  let absoluteData = new Float64Array(nbPoints * nbSubSpectra);
  let originalData = new Float64Array(nbPoints * nbSubSpectra);

  for (let iSubSpectra = 0; iSubSpectra < nbSubSpectra; iSubSpectra++) {
    let spectrum = spectraData.z[iSubSpectra];
    for (let iCol = 0; iCol < nbPoints; iCol++) {
      let index = iSubSpectra * nbPoints + iCol;
      absoluteData[index] = Math.abs(spectrum[iCol]);
      originalData[index] = spectrum[iCol];
    }
  }
  let nStdDev = getLoGnStdDevNMR(isHomoNuclear);
  let [nucleusX, nucleusY] = nucleus;
  let [observeFrequencyX, observeFrequencyY] = observeFrequencies;
  let convolutedSpectrum = convolutionByFFT
    ? convolution.fft(absoluteData, smallFilter, {
        rows: nbSubSpectra,
        cols: nbPoints,
      })
    : convolution.direct(absoluteData, smallFilter, {
        rows: nbSubSpectra,
        cols: nbPoints,
      });

  let signals = [];
  if (isHomoNuclear) {
    let peaksMC1 = matrixPeakFinders.findPeaks2DRegion(absoluteData, {
      originalData: originalData,
      filteredData: convolutedSpectrum,
      rows: nbSubSpectra,
      cols: nbPoints,
      nStdDev: nStdDev * thresholdFactor,
    });

    let peaksMax1 = matrixPeakFinders.findPeaks2DMax(absoluteData, {
      originalData: originalData,
      filteredData: convolutedSpectrum,
      rows: nbSubSpectra,
      cols: nbPoints,
      nStdDev: (nStdDev + 0.5) * thresholdFactor,
    });

    for (let i = 0; i < peaksMC1.length; i++) {
      peaksMax1.push(peaksMC1[i]);
    }

    signals = createSignals2D(peaksMax1, spectraData, {
      toleranceX,
      toleranceY,
      nucleusX,
      nucleusY,
      observeFrequencyX,
      observeFrequencyY,
    });

    if (enhanceSymmetry) {
      signals = PeakOptimizer.enhanceSymmetry(signals);
    }
  } else {
    let peaksMC1 = matrixPeakFinders.findPeaks2DRegion(absoluteData, {
      originalData: originalData,
      filteredData: convolutedSpectrum,
      rows: nbSubSpectra,
      cols: nbPoints,
      nStdDev: nStdDev * thresholdFactor,
    });

    if (clean) {
      // Remove peaks with less than x% of the intensity of the highest peak
      peaksMC1 = PeakOptimizer.clean(peaksMC1, maxPercentCutOff);
    }

    signals = createSignals2D(peaksMC1, spectraData, {
      toleranceX,
      toleranceY,
      nucleusX,
      nucleusY,
      observeFrequencyX,
      observeFrequencyY,
    });
  }

  return signals;
}

// How noisy is the spectrum depending on the kind of experiment.
const getLoGnStdDevNMR = (isHomoNuclear) => {
  return isHomoNuclear ? 1.5 : 3;
};

/**
 * This function converts a set of 2D-peaks in 2D-signals. Each signal could be composed
 * of many 2D-peaks, and it has some additional information related to the NMR spectrum.
 * @param {Array} peaks
 * @param {Object} spectraData
 * @param {Object} options
 * @return {Array}
 * @private
 */
const createSignals2D = (peaks, spectraData, options) => {
  let {
    observeFrequencyX,
    observeFrequencyY,
    toleranceX,
    toleranceY,
    nucleusX,
    nucleusY,
  } = options;

  let firstY = spectraData.minY;
  let lastY = spectraData.maxY;
  let firstX = spectraData.minX;
  let lastX = spectraData.maxX;

  let dy = (lastY - firstY) / (spectraData.z.length - 1); //@TODO: check the dimensionality
  let dx = (lastX - firstX) / (spectraData.z[0].length - 1);

  for (let i = peaks.length - 1; i >= 0; i--) {
    peaks[i].x = firstX + dx * peaks[i].x;
    peaks[i].y = firstY + dy * peaks[i].y;

    // Still having problems to correctly detect peaks on those areas. So I'm removing everything there.
    if (peaks[i].y < -1 || peaks[i].y >= 210) {
      peaks.splice(i, 1);
    }
  }

  // The connectivity matrix is an square and symmetric matrix, so we'll only store the upper diagonal in an
  // array like form
  let connectivity = [];
  toleranceX *= toleranceX;
  toleranceY *= toleranceY;
  for (let i = 0; i < peaks.length; i++) {
    for (let j = i; j < peaks.length; j++) {
      if (
        Math.pow((peaks[i].x - peaks[j].x) * observeFrequencyX, 2) <
          toleranceX &&
        Math.pow((peaks[i].y - peaks[j].y) * observeFrequencyY, 2) < toleranceY
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
          if (peaks[jPeak].x < minMax1[0]) {
            minMax1[0] = peaks[jPeak].x;
          }
          if (peaks[jPeak].x > minMax1[1]) {
            minMax1[1] = peaks[jPeak].x;
          }
          if (peaks[jPeak].y < minMax2[0]) {
            minMax2[0] = peaks[jPeak].y;
          }
          if (peaks[jPeak].y > minMax2[1]) {
            minMax2[1] = peaks[jPeak].y;
          }
        }
      }
      signal.fromTo = [
        { from: minMax1[0], to: minMax1[1] },
        { from: minMax2[0], to: minMax2[1] },
      ];
      signal.shiftX /= sumZ;
      signal.shiftY /= sumZ;
      signal.peaks = peaks2D;
      signals.push(signal);
    }
  }
  return signals;
};
