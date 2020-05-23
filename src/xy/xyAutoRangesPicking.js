import { peaksFilterImpurities } from '../peaks/peaksFilterImpurities';
import { peaksToRanges } from '../peaks/peaksToRanges';

import { xyAutoPeaksPicking } from './xyAutoPeaksPicking';

export function xyAutoRangesPicking(data, options = {}) {
  let peaks = xyAutoPeaksPicking(data, options.peakPicking);
  peaks = peaksFilterImpurities(peaks, options.impurities);
  let ranges = peaksToRanges(peaks, options.ranges);

  return ranges;
}
