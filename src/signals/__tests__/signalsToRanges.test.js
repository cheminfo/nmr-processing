import { signalsToRanges } from '../signalsToRanges';

describe('signalsToRanges', function () {
  it('simple signals', () => {
    const signals = [{ delta: 1, nbAtoms: 1 }];
    const ranges = signalsToRanges(signals);
    expect(ranges).toStrictEqual([
      {
        from: 0.95,
        to: 1.05,
        integral: 1,
        signal: [{ delta: 1, nbAtoms: 1 }],
      },
    ]);
  });
  it('simple join signals', () => {
    const signals = [
      { delta: 1, nbAtoms: 1 },
      { delta: 1.02, nbAtoms: 2 },
    ];
    const ranges = signalsToRanges(signals);
    expect(ranges).toStrictEqual([
      {
        from: 0.95,
        to: 1.07,
        integral: 3,
        signal: [
          { delta: 1, nbAtoms: 1 },
          { delta: 1.02, nbAtoms: 2 },
        ],
      },
    ]);
  });
  it('advanced signals', () => {
    const signals = [
      { delta: 1, nbAtoms: 1 },
      { delta: 1.02, nbAtoms: 2 },
      { delta: 2, nbAtoms: 1, j: [{ coupling: 10 }] },
      { delta: 2.06, nbAtoms: 2, j: [{ coupling: 10 }] },
      { delta: 2.1, nbAtoms: 3, j: [{ coupling: 10 }, { coupling: 40 }] },
    ];
    const ranges = signalsToRanges(signals);
    expect(ranges).toStrictEqual([
      {
        from: 0.95,
        to: 1.07,
        integral: 3,
        signal: [
          { delta: 1, nbAtoms: 1 },
          { delta: 1.02, nbAtoms: 2 },
        ],
      },
      {
        from: 1.9375,
        to: 2.2125,
        integral: 6,
        signal: [
          { delta: 2, nbAtoms: 1, j: [{ coupling: 10 }] },
          { delta: 2.1, nbAtoms: 3, j: [{ coupling: 10 }, { coupling: 40 }] },
          { delta: 2.06, nbAtoms: 2, j: [{ coupling: 10 }] },
        ],
      },
    ]);
  });
});
