import signal from './signal.json';
import signalJoinD from './signalJoinD.json';
import signalJoinT from './signalJoinT.json';
import { joinCouplings } from '../joinCouplings';

describe('joinCouplings', () => {
  it('check dddd', () => {
    const result = joinCouplings(signal);
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
    const result = joinCouplings(signalJoinD, { tolerance: 1.1 });
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
    const result = joinCouplings(signalJoinT, { tolerance: 1.1 });
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
