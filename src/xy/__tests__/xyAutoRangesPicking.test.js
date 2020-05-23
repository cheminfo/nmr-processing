import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import tripletQuadruplet from 'nmr-xy-testdata/data/pure/d1-2_j7.json';

import { xyAutoRangesPicking } from '../xyAutoRangesPicking';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('xyAutoRangesPicking', function () {
  it('a triplet and a quadruplet', () => {
    let ranges = xyAutoRangesPicking(tripletQuadruplet, {});
    expect(ranges).toHaveLength(2);
    expect(ranges[0]).toMatchCloseTo(
      {
        from: 1.96744,
        to: 2.03298,
        integral: 50,
        signal: [
          {
            multiplicity: 'q',
            j: [{ coupling: 7, multiplicity: 'q' }],
            delta: 2,
          },
        ],
      },
      3,
    );
    expect(ranges[1]).toMatchCloseTo(
      {
        from: 0.97588,
        to: 1.02378,
        integral: 50,
        signal: [
          {
            multiplicity: 't',
            j: [{ coupling: 7, multiplicity: 't' }],
            delta: 1,
          },
        ],
      },
      3,
    );
  });
});
