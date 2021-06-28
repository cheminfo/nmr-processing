import correlationData from './correlations';
import { createMapPossibleAssignment } from '../createMapPossibleAssignment';
import { formatCorrelations } from '../formatCorrelations';

const predictions = {
  "C": [
    {
      delta: 49.2,
      diaIDs: ['carbon1'],
      diaIDs: 0,
      allHydrogens: 2,
      pathLegth: [0, 1, 2, 1, 1],
    },
    {
      delta: 28,
      diaIDs: ['carbon2'],
      diaIDs: 1,
      allHydrogens: 0,
      pathLegth: [1, 0, 1, 2, 2],
    },
    {
      delta: 26.3,
      diaIDs: ['carbon3'],
      diaIDs: 2,
      allHydrogens: 0,
      pathLegth: [2, 1, 0, 3, 3],
    },
    {
      delta: 120,
      diaIDs: ['carbon4'],
      diaIDs: 3,
      allHydrogens: 2,
      pathLegth: [2, 1, 0, 3, 3],
    },
  ]
}

let correlations = correlationData.values;

const targets = formatCorrelations(correlations);

describe('AutoAssignment - createMapPossibleAssignment', () => {
  it('create map', () => {
    const result = createMapPossibleAssignment({
      errorCS: -1,
      predictions,
      targets,
    });
    console.log(result)
    expect(result['0']).toStrictEqual(['6dVPFnCT', '*']);
    expect(result['1']).toStrictEqual(['aFEmeB3j', '*']);
    expect(result['2']).toStrictEqual(['rc5vsGS0', '*']);
    expect(result['3']).toStrictEqual(['*']);
  })
})