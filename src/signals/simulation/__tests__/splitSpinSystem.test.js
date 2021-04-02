import { signalsToSpinSystem } from '../signalsToSpinSystem';
import { splitSpinSystem } from '../splitSpinSystem';

const butaneSignals = [
  {
    assignment: 4,
    nbAtoms: 1,
    delta: 1,
    j: [
      { coupling: 18, assignment: 5 },
      { coupling: 18, assignment: 6 },
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
  {
    assignment: 5,
    nbAtoms: 1,
    delta: 1,
    j: [
      { coupling: 18, assignment: 4 },
      { coupling: 18, assignment: 6 },
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
  {
    assignment: 6,
    nbAtoms: 1,
    delta: 1,
    j: [
      { coupling: 18, assignment: 4 },
      { coupling: 18, assignment: 5 },
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
  {
    assignment: 7,
    nbAtoms: 1,
    delta: 1.5,
    j: [
      { coupling: 18, assignment: 8 },
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
    delta: 1.5,
    j: [
      { coupling: 18, assignment: 7 },
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
    delta: 1.5,
    j: [
      { coupling: 18, assignment: 10 },
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
    delta: 1.5,
    j: [
      { coupling: 18, assignment: 9 },
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
    delta: 1,
    j: [
      { coupling: 18, assignment: 13 },
      { coupling: 18, assignment: 12 },
      { coupling: 7, assignment: 9 },
      { coupling: 7, assignment: 10 },
    ],
  },
  {
    assignment: 12,
    nbAtoms: 1,
    delta: 1,
    j: [
      { coupling: 18, assignment: 11 },
      { coupling: 18, assignment: 13 },
      { coupling: 7, assignment: 9 },
      { coupling: 7, assignment: 10 },
    ],
  },
  {
    assignment: 13,
    nbAtoms: 1,
    delta: 1,
    j: [
      { coupling: 18, assignment: 11 },
      { coupling: 18, assignment: 12 },
      { coupling: 7, assignment: 9 },
      { coupling: 7, assignment: 10 },
    ],
  },
];

const propylCloride = [
  {
    assignment: 4,
    nbAtoms: 1,
    delta: 1,
    j: [
      { coupling: 18, assignment: 5 },
      { coupling: 18, assignment: 6 },
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
  {
    assignment: 5,
    nbAtoms: 1,
    delta: 1,
    j: [
      { coupling: 18, assignment: 4 },
      { coupling: 18, assignment: 6 },
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
  {
    assignment: 6,
    nbAtoms: 1,
    delta: 1,
    j: [
      { coupling: 18, assignment: 4 },
      { coupling: 18, assignment: 5 },
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
  {
    //CH2
    assignment: 7,
    nbAtoms: 1,
    delta: 1.5,
    j: [
      { coupling: 18, assignment: 8 },
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
    delta: 1.5,
    j: [
      { coupling: 18, assignment: 7 },
      { coupling: 7, assignment: 4 },
      { coupling: 7, assignment: 5 },
      { coupling: 7, assignment: 6 },
      { coupling: 7, assignment: 9 },
      { coupling: 7, assignment: 10 },
    ],
  },
  {
    //CH2Cl
    assignment: 9,
    nbAtoms: 1,
    delta: 4.5,
    j: [
      { coupling: 18, assignment: 10 },
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
  {
    assignment: 10,
    nbAtoms: 1,
    delta: 4.5,
    j: [
      { coupling: 18, assignment: 9 },
      { coupling: 7, assignment: 7 },
      { coupling: 7, assignment: 8 },
    ],
  },
];

describe('split spin system', () => {
  it('split butane', () => {
    let spinSystem = signalsToSpinSystem(butaneSignals);
    let result = splitSpinSystem(spinSystem, { maxClusterSize: 7 });
    expect(result[0]).toHaveLength(7);
    expect(result[0]).toStrictEqual([0, 1, 2, 3, 4, -6, -7]);
    expect(result[1]).toStrictEqual([-4, -5, 5, 6, 7, 8, 9]);
  });

  it('split propilclorine', () => {
    let spinSystem = signalsToSpinSystem(propylCloride);
    let result = splitSpinSystem(spinSystem, { maxClusterSize: 5 });
    expect(result[0]).toHaveLength(4);
    expect(result[1]).toHaveLength(5);
    expect(result[1]).toStrictEqual([0, 1, 2, -4, -5]);
    expect(result[0]).toStrictEqual([-4, -5, 5, 6]);
  });
});
