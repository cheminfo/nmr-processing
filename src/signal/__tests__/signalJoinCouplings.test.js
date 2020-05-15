import { signalJoinCouplings } from '../signalJoinCouplings';

import signal from './signal.json';
import signalJoinD from './signalJoinD.json';
import signalJoinT from './signalJoinT.json';

describe('signalJoinCouplings', () => {
  it('check dddd', () => {
    const result = signalJoinCouplings(signal);
    expect(result).toBe([
      { coupling: 9, multiplicity: 'd' },
      { coupling: 8, multiplicity: 'd' },
      {
        coupling: 7.00005,
        multiplicity: 't',
      },
    ]);
  });

  it('check dddd with tolerance 1.1', () => {
    const result = signalJoinCouplings(signalJoinD, { tolerance: 1.1 });
    expect(result).toBe([
      {
        nbAtoms: 1,
        delta: 3,
        j: [
          { coupling: 9, multiplicity: 'd', diaID: ['D'] },
          {
            coupling: 1,
            multiplicity: 'q',
            diaID: ['A', 'B', 'C'],
          },
        ],
      },
    ]);
  });

  it('check ttt with tolerance 1.1', () => {
    const result = signalJoinCouplings(signalJoinT, { tolerance: 1.1 });
    expect(result).toBe({
      nbAtoms: 1,
      delta: 3,
      j: [
        {
          coupling: 8.5,
          multiplicity: 'quint',
          diaID: ['C', 'D'],
        },
        {
          coupling: 1.5,
          multiplicity: 'sept',
          diaID: ['A', 'B'],
          assignment: ['abc', 'def'],
        },
      ],
    });
  });
});
