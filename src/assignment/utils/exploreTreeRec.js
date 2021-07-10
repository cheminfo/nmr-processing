import { partialScore } from './partialScore';



export function exploreTreeRec(props, predictionIndex, partial, store) {
  const {
    nSources,
    restrictionByCS,
    timeout,
    timeStart,
    maxSolutions,
    targets,
    predictions,
    correlations,
    lowerBound,
    unassigned,
    possibleAssignmentMap,
    diaIDPeerPossibleAssignment,
  } = props;
  console.log(predictionIndex)
  if (predictionIndex >= nSources) return store;

  const currentDate = new Date();
  if (currentDate.getTime() - timeStart > timeout) {
    console.warn('timeout expired');
    return store;
  }
  const diaID = diaIDPeerPossibleAssignment[predictionIndex];
  const atomType = getAtomTypeFromPredictions(diaID, predictions);
  const possibleAssignments = possibleAssignmentMap[diaID];

  let targetIndex = 0;
  for (let targetID of possibleAssignments) {
    partial[predictionIndex] = targetID;
    const score = partialScore(partial, {
      diaIDPeerPossibleAssignment,
      unassigned,
      restrictionByCS,
      atomType,
      predictions,
      correlations,
      targets,
    });
    console.log(`score ${score} nSources ${nSources}, index ${predictionIndex}, targetIndex ${targetIndex++}`);
    if (score > 0) {
      
      if (predictionIndex === nSources - 1 && score >= lowerBound) {
        store.nSolutions++;
        let solution = {
          assignment: JSON.parse(JSON.stringify(partial)),
          score: score,
        };

        if (store.solutions.length >= maxSolutions) {
          if (store.score > store.solutions.last().score) {
            store.solutions.pollLast();
            store.solutions.add(solution);
          }
        } else {
          store.solutions.add(solution);
        }
      } else {
        exploreTreeRec(
          {
            nSources,
            restrictionByCS,
            timeout,
            timeStart,
            targets,
            predictions,
            lowerBound,
            unassigned,
            possibleAssignmentMap,
            diaIDPeerPossibleAssignment,
          },
          predictionIndex + 1,
          JSON.parse(JSON.stringify(partial)),
          store,
        );
      }
    } else {
      if (targetID === '*') {
        partial[predictionIndex] = null;
      }
    }
  }

  return store;
}

function getAtomTypeFromPredictions(diaID, predictions) {
  for (let atomType in predictions) {
    if (predictions[atomType][diaID]) return atomType;
  }
}