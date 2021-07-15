import {
  getConnectivityMatrix,
  addDiastereotopicMissingChirality,
  getDiastereotopicAtomIDs,
} from 'openchemlib-utils';

import { predictCarbon } from '../prediction/predictCarbon';
import { predictProton } from '../prediction/predictProton';

import { buildAssignment } from './utils/buildAssignment';
import { createMapPossibleAssignment } from './utils/createMapPossibleAssignment';
import { formatCorrelations } from './utils/formatCorrelations';

const predictor = { H: predictProton, C: predictCarbon };
/**
 *
 * @param {number} [props.errorCS = -1] - determine the restriction with respect to chemical shift, if it is negative the chemical shift is not taken in account in scoring
 * if it is equal to zero the chemical shift is not a restriction, and positive to restrict the assignment by chemical shift too.
 */

export async function autoAssignment(molecule, props = {}) {
  let {
    correlations,
    restrictionByCS = {},
    justAssign,
    minScore = 1,
    maxSolutions = 10,
    unassigned = 0,
    timeout = 6000,
    predictionOptions = {},
  } = props;

  const {
    tolerance = 1,
    useChemicalShiftScore = false,
    chemicalShiftRestriction = true,
  } = restrictionByCS;

  if (!molecule) throw new Error('It is needed a molecule to assign');
  if (!correlations) throw new Error('It is needed a target signals to assign');

  // molecule = molecule.getCompactCopy();
  molecule.addImplicitHydrogens();
  addDiastereotopicMissingChirality(molecule);

  const pathLengthMatrix = getConnectivityMatrix(molecule, {
    pathLength: true,
  });

  const experimentTypes = extractExperimentType(correlations);

  //if hsqc is present in experimentTypes we can just predict 13C
  //spectrum and try to assign the carbons first.
  const atomTypesToPredict = justAssign
    ? justAssign
    : experimentTypes.includes('hsqc')
    ? ['C']
    : ['C', 'H'];

  let nSources = 0;
  const predictions = {};

  const getAllHydrogens = {
    'C': (m, i) => m.getAllHydrogens(i), 'H': () => 1
  }

  //add error to predictions
  for (const atomType of atomTypesToPredict) {
    const options = predictionOptions[atomType];
    const { joinedSignals } = await predictor[atomType](molecule, options);
    if (!predictions[atomType]) predictions[atomType] = {};
    for (let prediction of joinedSignals) {
      const diaID = prediction.diaID[0];
      const index = prediction.assignment[0];
      const allHydrogens = getAllHydrogens[atomType](molecule, index);
      predictions[atomType][diaID] = {
        ...prediction,
        diaIDIndex: index,
        allHydrogens: prediction.nbAtoms * allHydrogens,
        protonsCount: allHydrogens,
        pathLength: pathLengthMatrix[index],
      };
    }
    nSources += joinedSignals.length;
  }
  // writeFileSync(join(__dirname, './data/ethylbenzenePredictions.json'), JSON.stringify(predictions));
  // console.log(Object.keys(predictions.H).map(e => predictions.H[e].delta));
  // console.log(predictions.H);
  // console.log(predictions.C);/
  // console.log(diaIDs);
  // return;
  const { targets, correlations: correlationsWithIndirectLinks } =
    formatCorrelations(correlations);
  let possibleAssignmentMap = createMapPossibleAssignment({
    restrictionByCS: {
      tolerance,
      useChemicalShiftScore,
      chemicalShiftRestriction,
    },
    predictions,
    targets,
  });
  // console.log(possibleAssignmentMap)
  // return
  const diaIDPeerPossibleAssignment = Object.keys(possibleAssignmentMap);

  const solutions = buildAssignment({
    restrictionByCS: {
      tolerance,
      useChemicalShiftScore,
      chemicalShiftRestriction,
    },
    timeout,
    minScore,
    maxSolutions,
    nSources,
    unassigned,
    predictions,
    correlations: correlationsWithIndirectLinks,
    diaIDPeerPossibleAssignment,
    targets,
    possibleAssignmentMap,
  });
  return solutions.solutions.elements;
}

function extractExperimentType(correlations) {
  const experimentTypes = [];
  for (const correlation of correlations) {
    let experimentType = correlation.experimentType;
    if (experimentType === '1d') {
      experimentType = `${correlation.atomType}`;
    }
    if (!experimentTypes.includes(experimentType)) {
      experimentTypes.push(experimentType);
    }
    for (const link of correlation.link) {
      experimentType = correlation.experimentType;
      if (experimentType === '1d') {
        experimentType = `${
          Array.isArray(correlation.atomType)
            ? correlation.atomType.join(',')
            : correlation.atomType
        }`;
      }
      if (!experimentTypes.includes(experimentType)) {
        experimentTypes.push(experimentType);
      }
    }
  }
  return experimentTypes;
}
