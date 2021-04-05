import { signalsJoin } from '../signalsJoin';

import signals from './data/signals.json';

test('signalsJoin', () => {
  const result = signalsJoin(signals);
  expect(result).toStrictEqual([
    {
      nbAtoms: 2,
      delta: 3.25,
      diaID: ['D'],
      assignment: ['a', 'b'],
      j: [
        { diaID: ['A'], distance: 3, multiplicity: 'd', coupling: 3 },
        { diaID: ['B'], distance: 3, multiplicity: 'd', coupling: 2 },
      ],
    },
    {
      nbAtoms: 1,
      delta: 3.5,
      diaID: ['X'],
      assignment: [],
      j: [
        { diaID: ['B', 'C'], multiplicity: 't', distance: 3, coupling: 1.0005 },
      ],
    },
  ]);
});
