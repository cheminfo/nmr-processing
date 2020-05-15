import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import noisyBigPeakSmallPeak from 'nmr-xy-testdata/data/noisy/noisyBigPeakSmallPeak.json';

import { xyAutoPeaksPicking } from '../xyAutoPeaksPicking';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('xyAutoPeaksPicking', function () {
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
});
