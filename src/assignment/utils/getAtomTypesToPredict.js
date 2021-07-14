/**
 * if hsqc is present in experimentTypes we can just predict 13C
 * spectrum and try to assign the carbons first.
 * @param {*} correlations
 * @param {*} justAssign
 */

function getAtomTypesToPredict(correlations, justAssign) {
  if (Array.isArray(justAssign)) {
    if (justAssign.some((e) => e === 'H' || e === 'C')) {
      return justAssign;
    }
  }

  const experimentTypes = extractExperimentType(correlations);
  console.log(experimentTypes)
  const atomTypesToPredict = experimentTypes.includes('hsqc')
    ? ['C']
    : ['C', 'H'];

  return atomTypesToPredict;
}

export default getAtomTypesToPredict;

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
