import { signalJoinCouplings } from '../signalJoinCouplings';

import signal from './signal.json';
import signalJoinD from './signalJoinD.json';
import signalJoinT from './signalJoinT.json';

describe('signalJoinCouplings', () => {
  it('check dddd', () => {
    const result = signalJoinCouplings(signal);
    expect(result.j).toStrictEqual([
      { coupling: 9, multiplicity: 'd' },
      { coupling: 8, multiplicity: 'd' },
      {
        coupling: 7,
        multiplicity: 't',
      },
    ]);
  });

  it('check dddd with tolerance 1.1', () => {
    const result = signalJoinCouplings(signalJoinD, { tolerance: 1.1 });
    expect(result).toStrictEqual({
      nbAtoms: 1,
      delta: 3,
      j: [
        { coupling: 9, multiplicity: 'd', diaID: ['D'] },
        {
          coupling: 1,
          multiplicity: 'q',
          diaID: ['C', 'B', 'A'],
        },
      ],
    });
  });

  it('check ttt with tolerance 1.1', () => {
    const result = signalJoinCouplings(signalJoinT, { tolerance: 1.1 });
    expect(result).toStrictEqual({
      nbAtoms: 1,
      delta: 3,
      j: [
        {
          coupling: 8,
          multiplicity: 'quint',
          diaID: ['D', 'C'],
        },
        {
          coupling: 1,
          multiplicity: 'sept',
          diaID: ['B', 'A'],
          assignment: ['def', 'abc'],
        },
      ],
    });
  });
});
