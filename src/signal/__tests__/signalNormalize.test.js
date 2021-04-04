import { signalNormalize } from '../signalNormalize';

import tttt from './data/tttt.json';

describe('signalNormalize', () => {
  it('tttt', () => {
    const result = signalNormalize(tttt);
    expect(result).toStrictEqual({
      nbAtoms: 1,
      delta: 3,
      assignment: [2],
      diaID: ['C'],
      j: [
        { coupling: 9, multiplicity: 't', diaID: ['D'] },
        { coupling: 8, multiplicity: 't', diaID: ['C'] },
        {
          coupling: 2,
          multiplicity: 't',
          diaID: ['B'],
          assignment: ['def'],
        },
        {
          coupling: 1,
          multiplicity: 't',
          diaID: ['A'],
          assignment: ['abc'],
        },
      ],
    });
  });
});
