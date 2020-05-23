import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import tripletQuadruplet from 'nmr-xy-testdata/data/pure/d1-1.2_j7.json';

import { xyAutoRangesPicking } from '../xyAutoRangesPicking';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('xyAutoRangesPicking', function () {
  it('a triplet and a quadruplet', () => {
    let ranges = xyAutoRangesPicking(tripletQuadruplet, {});
    expect(ranges).toHaveLength(2);
  });
});
