import { getIntegrationOfAttachedProton } from './getIntegrationOfAttachedProton';

export function partialScore(partial, props) {
  const {
    diaIDPeerPossibleAssignment,
    unassigned,
    atomType,
    restrictionByCS,
    predictions,
    targets,
    correlations,
  } = props;

  const { tolerance: toleranceCS, useChemicalShiftScore } = restrictionByCS;

  let partialInverse = {};
  let activeDomainOnPrediction = [];
  let countStars = 0;

  for (let i = 0; i < partial.length; i++) {
    const targetID = partial[i];
    if (targetID && targetID !== '*') {
      activeDomainOnPrediction.push(i);
      if (!partialInverse[targetID]) partialInverse[targetID] = [];
      partialInverse[targetID].push(diaIDPeerPossibleAssignment[i]);
    }
    if (targetID === '*') countStars++;
  }

  if (countStars > unassigned) return 0;

  let penaltyByStarts = countStars / partial.length;
  for (let targetID in partialInverse) {
    let targetToSource = partialInverse[targetID];
    let total = targetToSource.reduce((sum, value) => {
      return sum + predictions[atomType][value]['allHydrogens'];
    }, 0);

    const target = targets[atomType][targetID];
    const {
      integration = getIntegrationOfAttachedProton(target, correlations),
    } = target;

    if (total - integration >= 0.5) {
      return 0;
    }
  }

  //chemical shift score
  let count = 1;
  let chemicalShiftScore = 1;
  if (useChemicalShiftScore) {
    chemicalShiftScore = 0;
    count = 0;

    partial.forEach((targetID, index) => {
      if (targetID && targetID !== '*') {
        count++;
        let source = predictions[atomType][diaIDPeerPossibleAssignment[index]];
        let target = targets[atomType][targetID];
        let error = toleranceCS;
        if (source.error) {
          error = Math.max(source.error, toleranceCS);
        }
        if (typeof source.delta === 'undefined') {
          // Chemical shift is not a restriction
          chemicalShiftScore += 1;
        } else {
          let diff = Math.abs(source.delta - target.signal.delta);
          if (diff < error) {
            //@TODO: check for a better discriminant
            chemicalShiftScore += 1;
          } else {
            diff = Math.abs(diff - error);
            chemicalShiftScore += (-0.25 / error) * diff + 1;
          }
        }
      }
    });
    
    if (count > 0) {
      chemicalShiftScore /= count;
    }
  }

  let scoreOn2D = 0;
  let activeDomainOnTarget = Object.keys(partialInverse);
  if (activeDomainOnTarget.length > 1) {
    let andConstrains = {};
    for (let i = 0; i < activeDomainOnPrediction.length; i++) {
      let predictionI = predictions[atomType][diaIDPeerPossibleAssignment[i]];
      for (let j = i + 1; j < activeDomainOnPrediction.length; j++) {
        let predictionJ = predictions[atomType][diaIDPeerPossibleAssignment[j]];
        let pathLength = predictionI.pathLength[predictionJ.diaIDIndex];
        let isPossible = pathLength < 5;

        let partialI = partial[activeDomainOnPrediction[i]];
        let partialJ = partial[activeDomainOnPrediction[j]];

        let keyOnTargerMap =
          partialI > partialJ
            ? `${partialJ} ${partialI}`
            : `${partialI} ${partialJ}`;

        let areLinked = checkLinking(partialI, partialJ, targets[atomType]);

        let partialScore2D = isPossible
          ? areLinked
            ? 1
            : 0
          : !areLinked
          ? 1
          : 0;

        andConstrains[keyOnTargerMap] = andConstrains[keyOnTargerMap]
          ? Math.max(andConstrains[keyOnTargerMap], partialScore2D)
          : partialScore2D;
      }
    }

    let sumAnd = 0;
    for (let key in andConstrains) {
      sumAnd += andConstrains[key];
    }

    scoreOn2D =
      sumAnd /
      ((activeDomainOnTarget.length * (activeDomainOnTarget.length - 1)) / 2);
  }
  // console.log(`CSScore ${chemicalShiftScore}, score2D ${scoreOn2D}, penalty: ${penaltyByStarts}`);
  if (chemicalShiftScore === 0) return scoreOn2D - penaltyByStarts;

  if (scoreOn2D === 0) return chemicalShiftScore - penaltyByStarts;

  return (chemicalShiftScore + scoreOn2D) / 2 - penaltyByStarts;
}

function checkLinking(partialI, partialJ, correlations) {
  let correlationI = correlations[partialI];
  for (let key of ['link', 'indirectLinks']) {
    for (const link of correlationI[key]) {
      if (link.signal.id === partialJ) return true;
    }
  }
  return false;
}
