export function createMapPossibleAssignment(props) {
  const { restrictionByCS, predictions, targets } = props;

  const { tolerance: toleranceCS, chemicalShiftRestriction } = restrictionByCS;

  let expandMap = {};
  let errorAbs = Math.abs(toleranceCS);
  const atomTypes = Object.keys(predictions);

  for (const atomType of atomTypes) {
    let predictionByAtomType = predictions[atomType];
    let targetByAtomType = targets[atomType];

    for (const predictionID in predictionByAtomType) {
      let prediction = predictionByAtomType[predictionID];
      prediction.error = Math.abs(prediction.error);
      expandMap[predictionID] = [];

      if (targetByAtomType) {
        for (const targetID in targetByAtomType) {
          let target = targetByAtomType[targetID];
          const { nbAtoms, protonsCount: protonsCountFromPrediction } =
            prediction;
          const { integration, protonsCount } = target;
          // console.log(
          //   `targetintegral ${integration} protonsCount ${nbAtoms}, ${allHydrogens}`,
          // );
          const couldBeAssigned =
            integration > 0 && atomType === 'H'
              ? nbAtoms - integration < 1
              : protonsCount.length > 0
              ? protonsCount.some(
                  (count) => protonsCountFromPrediction === count,
                )
              : true;

          if (couldBeAssigned) {
            if (
              !chemicalShiftRestriction ||
              typeof prediction.delta === 'undefined'
            ) {
              console.log('pasa aqui');
              // Chemical shift is not a restriction
              expandMap[predictionID].push(targetID);
            } else {
              let error = errorAbs;
              if (prediction.error) {
                error = Math.max(error, prediction.error);
              }
              console.log(
                `error ${error}, errorAbs ${target.signal.delta} predict delta ${prediction.delta} targetID ${targetID} predID ${predictionID}`,
              );
              let distAfterLimit = Math.abs(
                prediction.delta - target.signal.delta - errorAbs,
              );
              if (distAfterLimit < 4 * errorAbs) {
                expandMap[predictionID].push(targetID);
              }
            }
          }
        }
      }
      expandMap[predictionID].push('*');
    }
  }
  return expandMap;
}
