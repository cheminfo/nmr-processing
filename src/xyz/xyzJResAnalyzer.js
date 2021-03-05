import assignDeep from 'assign-deep';
import simpleClustering from 'ml-simple-clustering';

import jAnalyzer from '../peaks/util/jAnalyzer';

const defaultOptions = {
  reference: 0,
  referenceMaxShiftError: 0.08,
  tolerances: [10, 100],
  nucleus: ['1H', '1H'],
  observeFrequencies: [400, 400],
  jAnalyzer: {
    jAxisKey: { jAxis: 'y', intensity: 'z' },
  },
};
export function xyzJResAnalyzer(signals, options = {}) {
  let jresAnalyzerOptions = assignDeep({}, defaultOptions, options);
  let { reference, referenceMaxShiftError } = jresAnalyzerOptions;
  let temporalSignals = compilePattern(signals, jresAnalyzerOptions);
  //check if the signal are symmetric around the reference
  let result = [];
  for (let i = 0; i < temporalSignals.length; i++) {
    let delta = temporalSignals[i].shiftY;
    if (Math.abs(delta - reference) > referenceMaxShiftError) continue;
    result.push(temporalSignals[i]);
  }
  return result;
}

function compilePattern(signals, options = {}) {
  let {
    observeFrequencies,
    tolerances,
    nucleus,
    jAnalyzer: jAnalyzerOptions,
  } = options;

  let signalOptions = {
    observeFrequencies,
    tolerances,
    nucleus,
    dx: signals[0].resolutionX,
    dy: signals[0].resolutionY,
  };

  //adapt to 1D jAnalyzer
  for (let i = 0; i < signals.length; i++) {
    let signal = signals[i];
    let peaks = signal.peaks;
    signal.nbPeaks = signal.peaks.length;
    signal.multiplicity = '';
    signal.pattern = '';
    signal.delta1 = signal.shiftY;
    signal.observe = observeFrequencies[1];
    signal.integralData = {
      from: Number.MAX_SAFE_INTEGER,
      to: Number.MIN_SAFE_INTEGER,
    };
    for (let j = 0; j < peaks.length; j++) {
      if (!peaks[j].width) peaks[j].width = 0.02;
    }
    peaks.sort((a, b) => a.y - b.y);
  }

  for (let i = 0; i < signals.length; i++) {
    jAnalyzer.compilePattern(signals[i], jAnalyzerOptions);

    if (
      signals[i].maskPattern &&
      signals[i].multiplicity !== 'm' &&
      signals[i].multiplicity !== ''
    ) {
      // Create a new signal with the removed peaks
      let peaksO = [];
      for (let j = signals[i].maskPattern.length - 1; j >= 0; j--) {
        if (signals[i].maskPattern[j] === false) {
          let peakR = signals[i].peaks.splice(j, 1)[0];
          peaksO.push(peakR);
          signals[i].mask.splice(j, 1);
          signals[i].mask2.splice(j, 1);
          signals[i].maskPattern.splice(j, 1);
          signals[i].nbPeaks--;
        }
      }
      if (peaksO.length > 0) {
        peaksO.reverse();
        let ranges = createSignals2D(peaksO, signalOptions);

        for (let j = 0; j < ranges.length; j++) {
          signals.push(ranges[j]);
        }
      }
    }
  }

  signals.sort((a, b) => {
    return b.shiftX - a.shiftX;
  });

  return signals;
}

function createSignals2D(peaks, options) {
  let { observeFrequencies, tolerances, nucleus, dx, dy } = options;

  let [nucleusX, nucleusY] = nucleus;
  let [toleranceX, toleranceY] = tolerances;
  let [observeFrequencyX, observeFrequencyY] = observeFrequencies;

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
        integralData: {
          from: Number.MAX_SAFE_INTEGER,
          to: Number.MIN_SAFE_INTEGER,
        },
      };
      signal.nbPeaks = 0;
      signal.multiplicity = '';
      signal.pattern = '';
      signal.observe = observeFrequencyY;
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
          signal.nbPeaks++;
          if (!peaks[jPeak].width) peaks[jPeak].width = 0.02;
          peaks2D.push(peaks[jPeak]);
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
        { from: minMax1[0], to: minMax1[1] },
        { from: minMax2[0], to: minMax2[1] },
      ];
      signal.shiftX /= sumZ;
      signal.shiftY /= sumZ;
      signal.delta1 = signal.shiftY;
      signal.peaks = peaks2D;
      signals.push(signal);
    }
  }
  return signals;
}
