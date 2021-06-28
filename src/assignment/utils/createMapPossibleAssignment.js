export function createMapPossibleAssignment(props) {
  const { errorCS, predictions, targets } = props;
  let expandMap = {};
  let errorAbs = Math.abs(errorCS);
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
          const { nbAtoms, allHydrogens } = prediction;
          const {
            integration,
            protonsCount,
          } = target;
          // console.log(`targetintegral ${target.integration} ${integration} protonsCount ${nbAtoms}, ${allHydrogens}`);
          const couldBeAssigned =
            integration > 0 && atomType === 'H'
              ? nbAtoms - integration < 1
              : protonsCount.length > 0
              ? protonsCount.some((count) => allHydrogens % count === 0)
              : true;

          if (couldBeAssigned) {
            if (errorCS === 0 || typeof prediction.delta === 'undefined') {
              // Chemical shift is not a restriction
              expandMap[predictionID].push(targetID);
            } else {
              let error = errorAbs;
              if (prediction.error) {
                error = Math.max(error, prediction.error);
              }
              console.log(`error ${error}, errorAbs ${errorAbs} predict delta ${prediction.delta} diff ${prediction.delta - target.signal.delta} discriminant ${(error + 0.03) / 2 + errorAbs}`)
              if (
                //@TODO: check this formula
                Math.abs(prediction.delta - target.signal.delta) <
                (error + 0.03) / 2 + errorAbs
              ) {
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
