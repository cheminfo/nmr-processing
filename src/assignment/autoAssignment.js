import { predictionProton } from '../prediction/predictionProton';
import { predictionCarbon } from '../prediction/predictionCarbon';
import { getAtomsInfo, getConnectivityMatrix } from 'openchemlib-utils';
import { formatCorrelations } from './utils/formatCorrelations';
import { buildAssignment } from '.utils/buildAssignment';
import { createMapPossibleAssignment } from './utils/createMapPossibleAssignment';

const predictors = { C: predictionCarbon, H: predictionProton };

/**
 *
 * @param {number} [props.errorCS = -1] - determine the restriction with respect to chemical shift, if it is negative the chemical shift is not taken in account in scoring
 * if it is equal to zero the chemical shift is not a restriction, and positive to restrict the assignment by chemical shift too.
 */

export function autoAssignment(props = {}) {
  const {
    molecule,
    correlations,
    restrictionByCS = {},
    unassigned = 0,
  } = props;

  const {
    tolerance = 1,
    useChemicalShiftScore = false,
    chemicalShiftRestriction = true,
  } = restrictionByCS;

  if (!molecule) throw new Error('It is needed a molecule to assign');
  if (!correlations) throw new Error('It is needed a target signals to assign');

  molecule = molecule.getCompactCopy();
  molecule.addImplicitHydrogens();
  addDiastereotopicMissingChirality(molecule);

  const atomsInfo = getAtomsInfo(molecule);
  const diaIDs = atomsInfo.map((atom) => atom.oclID);
  const pathLengthMatrix = getConnectivityMatrix(molecule, {
    pathLength: true,
  });

  const experimentTypes = extractExperimentType(correlations);

  //if hsqc is present in experimentTypes we can just predict 13C
  //spectrum and try to assign the carbons first.
  const atomTypesToPredict = experimentTypes.includes('hsqc')
    ? ['C']
    : ['C', 'H'];

  let nSources = 0;
  const predictions = {};

  //add error to predictions
  for (const atomType of atomTypesToPredict) {
    const { joinedSignals } = predictors[atomType](molecule);
    if (!predictions[atomType]) predictions[atomType] = {};
    for (let prediction of joinedSignals) {
      const diaID = prediction.diaIDs[0];
      const index = diaIDs.findIndex((dia) => dia.oclID === diaID);
      predictions[atomType][diaID] = {
        ...prediction,
        diaIDIndex: index,
        allHydrogens: molecule.getAllHydrogens(index),
        pathLength: pathLengthMatrix[index],
      };
    }
    nSources += joinedSignals.length;
  }

  const { targets, correlationsWithIndirectLinks } =
    formatCorrelations(correlations);

  const possibleAssignmentMap = createMapPossibleAssignment({
    restrictionByCS: {
      tolerance,
      useChemicalShiftScore,
      chemicalShiftRestriction,
    },
    predictions,
    targets,
  });

  const predictionDiaIDs = Object.keys(possibleAssignmentMap);

  const solutions = buildAssignment({
    restrictionByCS: {
      tolerance,
      useChemicalShiftScore,
      chemicalShiftRestriction,
    },
    timeout,
    minScore,
    comparator,
    nSources,
    unassigned,
    predictions,
    correlations: correlationsWithIndirectLinks,
    predictionDiaIDs,
    targets,
    possibleAssignmentMap,
  });
}

function extractExperimentType(correlations) {
  const experimentTypes = [];
  for (const correlation of correlations) {
    if (!experimentTypes.includes(correlation.experimentType)) {
      experimentTypes.push(experimentType);
    }
  }
  return experimentTypes;
}
