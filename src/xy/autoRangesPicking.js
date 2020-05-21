import { filterImpurities } from '../peaks/filterImpurities';
import { peaksToRanges } from '../peaks/peaksToRanges';

import { autoPeaksPicking } from './autoPeaksPicking';

export function autoRangesPicking(data, options = {}) {
  let peaks = autoPeaksPicking(data, options);
  peaks = filterImpurities(peaks, options.impurities);
  let ranges = peaksToRanges(peaks, options);
  return ranges;
}
