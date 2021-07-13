import OCL from 'openchemlib';

import { autoAssignment } from '../autoAssignment';
import arbutinData from '../data/ethyl-benzene.json';

describe('automatic assignment', () => {
  it('simple assignment', async () => {
    const molfile = String(arbutinData.molecules[0].molfile);
    const correlationData = arbutinData.correlations.values;
    const molecule = OCL.Molecule.fromMolfile(molfile);
    let result = await autoAssignment(molecule, {
      unassigned: 1,
      justAssign: ['C'],
      correlations: correlationData,
      minScore: 0.1,
      restrictionByCS: {
        tolerance: 1,
        useChemicalShiftScore: true,
        chemicalShiftRestriction: true,
      },
    });
    console.log(result);
  });
});
