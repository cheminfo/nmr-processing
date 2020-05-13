import noisyBigPeakSmallPeak from 'nmr-xy-testdata/data/noisy/noisyBigPeakSmallPeak.json';
import { peakPicking } from '../src';

let options = {
  thresholdFactor: 3,
  compile: false,
  clean: false,
  optimize: false,
  integralType: 'sum',
  nH: 3,
  frequencyCluster: 16,
  widthFactor: 4,
  smoothY: false,
  broadWidth: 0.2,
  functionName: 'lorentzian',
  broadRatio: 0,
};

let peaks = peakPicking(noisyBigPeakSmallPeak, options);

let ranges = peaksToRanges(peaks);

console.log(peaks, ranges);
