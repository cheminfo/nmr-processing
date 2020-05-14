import { autoPeaksPicking } from './autoPeaksPicking';
import { filterImpurities } from '../peaks/filterImpurities';
import { peaksToRanges } from '../peaks/peaksToRanges';

export function rangePicking(data, options = {}) {
  let peaks = autoPeaksPicking(data, options.peakPicking);
  peaks = filterImpurities(peaks, options.impurities);
  let ranges = peaksToRanges(peaks, options.ranges);

  return ranges;
}
