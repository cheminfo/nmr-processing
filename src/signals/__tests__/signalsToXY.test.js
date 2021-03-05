import { signalsToXY } from '../signalsToXY';

const signals = [
  {
    assignment: 8,
    nbAtoms: 1,
    delta: 7.26,
    j: [
      { coupling: 7.758, assignment: 10 },
      { coupling: 7.718, assignment: 9 },
      { coupling: 1.596, assignment: 14 },
      { coupling: 0.507, assignment: 13 },
    ],
  },
  {
    assignment: 9,
    nbAtoms: 1,
    delta: 7.196,
    j: [
      { coupling: 7.718, assignment: 8 },
      { coupling: 7.718, assignment: 14 },
      { coupling: 1.293, assignment: 13 },
      { coupling: 1.292, assignment: 10 },
    ],
  },
  {
    assignment: 10,
    nbAtoms: 1,
    delta: 7.162,
    j: [
      { coupling: 7.758, assignment: 8 },
      { coupling: 1.292, assignment: 9 },
      { coupling: 0.985, assignment: 13 },
      { coupling: 0.507, assignment: 14 },
    ],
  },
  {
    assignment: 11,
    nbAtoms: 1,
    delta: 2.653,
    j: [
      { coupling: 7.392, assignment: 15 },
      { coupling: 7.392, assignment: 16 },
      { coupling: 7.392, assignment: 17 },
    ],
  },
  {
    assignment: 12,
    nbAtoms: 1,
    delta: 2.653,
    j: [
      { coupling: 7.392, assignment: 15 },
      { coupling: 7.392, assignment: 16 },
      { coupling: 7.392, assignment: 17 },
    ],
  },
  {
    assignment: 13,
    nbAtoms: 1,
    delta: 7.162,
    j: [
      { coupling: 7.758, assignment: 14 },
      { coupling: 1.293, assignment: 9 },
      { coupling: 0.985, assignment: 10 },
      { coupling: 0.507, assignment: 8 },
    ],
  },
  {
    assignment: 14,
    nbAtoms: 1,
    delta: 7.26,
    j: [
      { coupling: 7.758, assignment: 13 },
      { coupling: 7.718, assignment: 9 },
      { coupling: 1.596, assignment: 8 },
      { coupling: 0.507, assignment: 10 },
    ],
  },
  {
    assignment: 15,
    nbAtoms: 1,
    delta: 0.992,
    j: [
      { coupling: 7.392, assignment: 11 },
      { coupling: 7.392, assignment: 12 },
    ],
  },
  {
    assignment: 16,
    nbAtoms: 1,
    delta: 0.992,
    j: [
      { coupling: 7.392, assignment: 11 },
      { coupling: 7.392, assignment: 12 },
    ],
  },
  {
    assignment: 17,
    nbAtoms: 1,
    delta: 0.992,
    j: [
      { coupling: 7.392, assignment: 11 },
      { coupling: 7.392, assignment: 12 },
    ],
  },
];
describe('spectrum from prediction', () => {
  it('1H chemical shift prediction', async function () {
    const spectrum = signalsToXY(signals, {
      shape: {
        kind: 'gaussian',
        options: { from: 0, to: 10, nbPoints: 16 * 1024 },
      },
    });
    expect(spectrum.x).toHaveLength(16 * 1024);
  });
});
