import correlationData from '../../data/correlations';
import predictions from '../../data/predictions';
import { createMapPossibleAssignment } from '../createMapPossibleAssignment';
import { formatCorrelations } from '../formatCorrelations';

const { targets } = formatCorrelations(correlationData);

describe('AutoAssignment - createMapPossibleAssignment', () => {
  it('create map', () => {
    const result = createMapPossibleAssignment({
      restrictionByCS: {
        tolerance: 1,
        useChemicalShiftScore: true,
      },
      predictions,
      targets,
    });
    console.log(result)
    expect(result['carbon1']).toStrictEqual(['6dVPFnCT', '*']);
    expect(result['carbon2']).toStrictEqual(['aFEmeB3j', '*']);
    expect(result['carbon3']).toStrictEqual(['rc5vsGS0', '*']);
    expect(result['carbon4']).toStrictEqual(['*']);
  })
})