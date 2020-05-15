import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import tripletQuadruplet from 'nmr-xy-testdata/data/pure/d1-1.2_j7.json';

import { xyAutoRangesPicking } from '../xyAutoRangesPicking';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('xyAutoRangesPicking', function () {
  it('a triplet and a quadruplet', () => {
    let ranges = xyAutoRangesPicking(tripletQuadruplet, {});

    expect(ranges).toMatchCloseTo(
      [
        {
          index: 80,
          x: 8,
          y: 303.6113688708498,
          width: 0.4,
          soft: false,
          left: { x: 7.8, index: 78 },
          right: { x: 8.2, index: 82 },
          base: 15,
        },
      ],
      4,
    );
  });
});
