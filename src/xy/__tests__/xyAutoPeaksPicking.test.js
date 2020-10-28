import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import noisyBigPeakSmallPeak from 'nmr-xy-testdata/data/noisy/noisyBigPeakSmallPeak.json';
import tripletQuadruplet from 'nmr-xy-testdata/data/pure/d1-2_j7.json';

import { xyAutoPeaksPicking } from '../xyAutoPeaksPicking';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('xyAutoPeaksPicking', function () {
  it('a triplet and a quadruple', () => {
    let options = {};

    let peaks = xyAutoPeaksPicking(tripletQuadruplet, options);
    expect(peaks).toHaveLength(7);
    expect(peaks[1]).toMatchCloseTo(
      {
        index: 43683,
        x: 0.999831631801563,
        y: 1484660289364.1968,
        width: 0.0021514892578125,
        soft: false,
        left: { x: 0.998748779296875, index: 43636 },
        right: { x: 1.0009002685546875, index: 43730 },
        base: 4.499931335449219,
      },
      4,
    );
  });
  it('mixed spectrum with small and big peaks', () => {
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

    let peaks = xyAutoPeaksPicking(noisyBigPeakSmallPeak, options);

    expect(peaks).toMatchCloseTo(
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
  it('negative spectrum', () => {
    let y = tripletQuadruplet.y;
    for (let i = 0; i < y.length; i++) {
      y[i] *= -1;
    }
    tripletQuadruplet.y = y;
    let options = { lookNegative: true };

    let peaks = xyAutoPeaksPicking(tripletQuadruplet, options);
    expect(peaks).toHaveLength(7);
    expect(peaks[1]).toMatchCloseTo(
      {
        index: 43683,
        x: 0.999831631801563,
        y: -1484660289364.1968,
        width: 0.0021514892578125,
        soft: false,
        left: { x: 0.998748779296875, index: 43636 },
        right: { x: 1.0009002685546875, index: 43730 },
        base: 4.499931335449219,
      },
      4,
    );
  });
});
