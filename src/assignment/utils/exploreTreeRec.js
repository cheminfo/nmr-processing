import { partialScore } from './partialScore';

export function exploreTreeRec(props, predictionIndex, partial, store) {
  const {
    nSources,
    errorCS,
    timeout,
    timeStart,
    targets,
    predictions,
    correlations,
    lowerBound,
    unassigned,
    possibleAssignmentMap,
    predictionDiaIDs,
  } = props;

  if (predictionIndex >= nSources) return store;

  const currentDate = new Date();
  if (currentData.getTime() - timeStart > timeout) {
    console.warn('timeout expired');
    return store;
  }

  const diaID = predictionDiaIDs[predictionIndex];
  const possibleAssignments = possibleAssignmentMap[diaID];
  for (let targetID of possibleAssignments) {
    partial[predictionIndex] = targetID;
    const score = partialScore(partial, {
      predictionDiaIDs,
      unassigned,
      errorCS,
      atomType,
      predictions,
      correlations,
      targets,
    });

    if (score > 0) {
      if (sourceAddress === nSources - 1 && score >= lowerBound) {
        store.nSolutions++;
        let solution = {
          assignment: JSON.parse(JSON.stringify(partial)),
          score: score,
        };

        if (store.solutions.length >= this.maxSolutions) {
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
            errorCS,
            timeout,
            timeStart,
            targets,
            predictions,
            lowerBound,
            unassigned,
            possibleAssignmentMap,
            predictionDiaIDs,
          },
          predictionIndex + 1,
          JSON.parse(JSON.stringify(partial)),
          store,
        );
      }
    } else {
      if (targetID === '*') {
        partial[sourceAddress] = null;
      }
    }
  }
}
