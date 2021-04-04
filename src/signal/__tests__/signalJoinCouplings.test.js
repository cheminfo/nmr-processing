import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { signalJoinCouplings } from '../signalJoinCouplings';

import dddd from './data/dddd.json';
import ddddAssignment from './data/ddddAssignment.json';
import ddddDiaID from './data/ddddDiaID.json';
import tttt from './data/tttt.json';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('signalJoinCouplings', () => {
  it('dddd to ddt', () => {
    const result = signalJoinCouplings(dddd);
    expect(result.j).toStrictEqual([
      { coupling: 9, multiplicity: 'd' },
      { coupling: 8, multiplicity: 'd' },
      {
        coupling: 7.00005,
        multiplicity: 't',
      },
    ]);
  });

  it('dddd to ddt with assignment', () => {
    const result = signalJoinCouplings(ddddAssignment);
    expect(result).toBeDeepCloseTo({
      assignment: [8],
      nbAtoms: 1,
      delta: 7.26,
      j: [
        { coupling: 9, multiplicity: 'd', assignment: [13] },
        { coupling: 8, multiplicity: 'd', assignment: [14] },
        { coupling: 7.0005, multiplicity: 't', assignment: [9, 10] },
      ],
    });
  });

  it('check dddd with tolerance 1.1', () => {
    const result = signalJoinCouplings(ddddDiaID, { tolerance: 1.1 });
    expect(result).toStrictEqual({
      nbAtoms: 1,
      delta: 3,
      j: [
        { coupling: 9, multiplicity: 'd', diaID: ['D'] },
        {
          coupling: 2,
          multiplicity: 'q',
          diaID: ['C', 'B', 'A'],
        },
      ],
    });
  });

  it('check ttt with tolerance 1.1', () => {
    const result = signalJoinCouplings(tttt, { tolerance: 1.1 });
    expect(result).toStrictEqual({
      nbAtoms: 1,
      delta: 3,
      assignment: [2],
      diaID: ['C'],
      j: [
        {
          coupling: 8.5,
          multiplicity: 'quint',
          diaID: ['D', 'C'],
        },
        {
          coupling: 1.5,
          multiplicity: 'quint',
          diaID: ['B', 'A'],
          assignment: ['def', 'abc'],
        },
      ],
    });
  });
});
