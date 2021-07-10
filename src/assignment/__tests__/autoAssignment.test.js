import { autoAssignment } from '../autoAssignment';
import OCL from 'openchemlib';

import arbutinData from '../data/ethyl-benzene.json';

describe('automatic assignment', () => {
  it('simple assignment', async () => {
    const molfile = String(arbutinData.molecules[0].molfile);
    const correlationData = arbutinData.correlations.values;
    const molecule = OCL.Molecule.fromMolfile(molfile);
    let result = await autoAssignment(molecule, {
      justAssign: ['C'],
      correlations: correlationData,
      lowerBound: 0.01,
      restrictionByCS: {
        tolerance: 1,
        useChemicalShiftScore: true,
        chemicalShiftRestriction: false,
      },
    });
    console.log(result);
  });
});
