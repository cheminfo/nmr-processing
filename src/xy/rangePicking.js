import { peakPicking } from '../xy/peakPicking';
import { filterImpurities } from '../peaks/filterImpurities';
import { peaksToRanges } from '../peaks/peaksToRanges';

export function rangePicking(data, options = {}) {
  let peaks = peakPicking(data, options);
  peaks = filterImpurities(peaks);
  let ranges = peaksToRanges(peaks);

  return ranges;
}
