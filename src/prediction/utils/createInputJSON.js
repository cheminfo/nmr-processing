import {
  getGroupedDiastereotopicAtomIDs,
  getHoseCodesFromDiastereotopicID,
} from 'openchemlib-utils';
import OCL from 'openchemlib/minimal';

export function createInputJSON(molecule, options) {
  const { levels } = options;

  let diaIDs = getGroupedDiastereotopicAtomIDs(molecule);

  diaIDs = diaIDs
    .filter((e) => e.atomLabel === 'C')
    .sort(function (a, b) {
      if (a.atomLabel === b.atomLabel) {
        return b.counter - a.counter;
      }
      return a.atomLabel < b.atomLabel ? 1 : -1;
    });

  const atoms = {};
  for (const diaId of diaIDs) {
    diaId.hose = getHoseCodesFromDiastereotopicID(
      OCL.Molecule.fromIDCode(diaId.oclID),
      {
        maxSphereSize: levels[0],
      },
    );

    for (const atomID of diaId.atoms) {
      atoms[atomID] = diaId.oclID;
    }
  }

  let toReturn = {
    id: molecule.getIDCode(),
    atom: atoms,
    diaIDs,
  };

  return toReturn;
}
