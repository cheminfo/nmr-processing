import { signalsToSpinSystem } from '../signalsToSpinSystem';

const signals = [
  {
    assignment: 4,
    nbAtoms: 1,
    delta: 0.856,
    j: [
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
  {
    assignment: 5,
    nbAtoms: 1,
    delta: 0.856,
    j: [
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
  {
    assignment: 6,
    nbAtoms: 1,
    delta: 0.856,
    j: [
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
  {
    assignment: 7,
    nbAtoms: 1,
    delta: 1.24,
    j: [
      { coupling: 7, assignment: 4 },
      { coupling: 7, assignment: 5 },
      { coupling: 7, assignment: 6 },
      { coupling: 7, assignment: 9 },
      { coupling: 7, assignment: 10 },
    ],
  },
  {
    assignment: 8,
    nbAtoms: 1,
    delta: 1.24,
    j: [
      { coupling: 7, assignment: 4 },
      { coupling: 7, assignment: 5 },
      { coupling: 7, assignment: 6 },
      { coupling: 7, assignment: 9 },
      { coupling: 7, assignment: 10 },
    ],
  },
  {
    assignment: 9,
    nbAtoms: 1,
    delta: 1.24,
    j: [
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
      { coupling: 7, assignment: 11 },
      { coupling: 7, assignment: 12 },
      { coupling: 7, assignment: 13 },
    ],
  },
  {
    assignment: 10,
    nbAtoms: 1,
    delta: 1.24,
    j: [
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
      { coupling: 7, assignment: 11 },
      { coupling: 7, assignment: 12 },
      { coupling: 7, assignment: 13 },
    ],
  },
  {
    assignment: 11,
    nbAtoms: 1,
    delta: 0.856,
    j: [
      { coupling: 7, assignment: 9 },
      { coupling: 7, assignment: 10 },
    ],
  },
  {
    assignment: 12,
    nbAtoms: 1,
    delta: 0.856,
    j: [
      { coupling: 7, assignment: 9 },
      { coupling: 7, assignment: 10 },
    ],
  },
  {
    assignment: 13,
    nbAtoms: 1,
    delta: 0.856,
    j: [
      { coupling: 7, assignment: 9 },
      { coupling: 7, assignment: 10 },
    ],
  },
];

describe('signals to spinSystem', () => {
  it('butane prediction', () => {
    let spinSystem = signalsToSpinSystem(signals, { maxClusterSize: 7 });
    let spinSystem2 = signalsToSpinSystem(signals, { maxClusterSize: 8 });
    expect(spinSystem.clusters).toHaveLength(4);
    expect(spinSystem.clusters[0]).toStrictEqual([0, 1, 2, -4, -5]);
    expect(spinSystem2.clusters).toHaveLength(4);
    expect(spinSystem2.clusters[0]).toStrictEqual([0, 1, 2, -4, -5]);
  });
});
