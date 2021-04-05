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
        { diaID: ['A'], distance: 3, coupling: 3 },
        { diaID: ['B'], distance: 3, coupling: 2 },
      ],
    },
    {
      nbAtoms: 1,
      delta: 3.5,
      diaID: ['X'],
      assignment: [],
      j: [
        { diaID: ['B'], distance: 3, coupling: 2 },
        { diaID: ['C'], distance: 3, coupling: 1 },
      ],
    },
  ]);
});
