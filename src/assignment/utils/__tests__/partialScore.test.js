import correlationData from '../data/correlations';
import predictions from '../data/predictions';
import { formatCorrelations } from '../formatCorrelations';
import { partialScore } from '../partialScore';

describe('partial score', () => {
  const { targets, correlations } = formatCorrelations(correlationData);
  const diaIDPeerPossibleAssignment = ['carbon1', 'carbon2', 'carbon3', 'carbon4'];
 
  it('scoring a partial assignation with chemicalShift scoring ', () => {
    let partial = new Array(4);
    partial[0] = '6dVPFnCT';
    const result = partialScore(partial, {
      predictions,
      atomType: 'C',
      targets,
      restrictionByCS: {
        tolerance: 1,
        useChemicalShiftScore: true,
      },
      unassigned: 0,
      diaIDPeerPossibleAssignment,
      correlations
    });
     expect(result).toBeCloseTo(0.855, 2);
  })

  it('without chemicalShift scoring ', () => {
    let partial = new Array(4);
    partial[0] = '6dVPFnCT';
    const result = partialScore(partial, {
      predictions,
      atomType: 'C',
      targets,
      restrictionByCS: {
        tolerance: 1,
        useChemicalShiftScore: false,
      },
      unassigned: 0,
      diaIDPeerPossibleAssignment,
      correlations,
    });
     expect(result).toBeCloseTo(1, 2);
  })

  it('with wrong assignment with chemicalShif scoring', () => {
    let partial = new Array(4);
    partial[0] = 'aFEmeB3j';
    const result = partialScore(partial, {
      predictions,
      atomType: 'C',
      targets,
      restrictionByCS: {
        tolerance: 1,
        useChemicalShiftScore: true,
      },
      unassigned: 0,
      diaIDPeerPossibleAssignment,
      correlations,
    });
     expect(result).toBeCloseTo(0, 2);
  });

  it('with wrong assignment without chemicalShif scoring', () => {
    let partial = new Array(4);
    partial[0] = 'aFEmeB3j';
    const result = partialScore(partial, {
      predictions,
      atomType: 'C',
      targets,
      restrictionByCS: {
        tolerance: 1,
        useChemicalShiftScore: false,
      },
      unassigned: 0,
      diaIDPeerPossibleAssignment,
      correlations,
    });
     expect(result).toBeCloseTo(0, 2);
  });

  it('with correct assignment with chemicalShif scoring without hydrogens', () => {
    let partial = new Array(4);
    partial[1] = 'aFEmeB3j';
    const result = partialScore(partial, {
      predictions,
      atomType: 'C',
      targets,
      restrictionByCS: {
        tolerance: 1,
        useChemicalShiftScore: true,
      },
      unassigned: 0,
      diaIDPeerPossibleAssignment,
      correlations,
    });
     expect(result).toBeCloseTo(0.981, 2);
  });
  it('with multi-assignments one wrong with chemicalShif scoring', () => {
    let partial = new Array(4);
    partial[0] = '6dVPFnCT';
    partial[1] = 'rc5vsGS0';
    const result = partialScore(partial, {
      predictions,
      atomType: 'C',
      targets,
      restrictionByCS: {
        tolerance: 1,
        useChemicalShiftScore: true,
      },
      unassigned: 0,
      diaIDPeerPossibleAssignment,
      correlations,
    });
     expect(result).toBeCloseTo(0.8562, 3);

     //fix the assignment of the second atom
     partial[1] = 'aFEmeB3j';
     const result2 = partialScore(partial, {
      predictions,
      atomType: 'C',
      targets,
      restrictionByCS: {
        tolerance: 1,
        useChemicalShiftScore: true,
      },
      unassigned: 0,
      diaIDPeerPossibleAssignment,
      correlations,
    });
    expect(result < result2).toBe(true);
  })
})