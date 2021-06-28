import treeSet from 'ml-tree-set';
import { exploreTreeRec } from './exploreTreeRec';

export function buildAssignment(props) {
  const {
    errorCS,
    timeout,
    minScore,
    comparator,
    nSources,
    unassigned,
    predictions,
    correlations,
    predictionDiaIDs,
    targets,
    possibleAssignmentMap,
  } = props;

  let date = new Date();
  let timeStart = date.getTime();
  let lowerBound = minScore;
  let scores = new Float64Array(nSources);
  let partial = new Array(nSources);

  for (let i = 0; i < nSources; i++) {
    scores[i] = 1;
    partial[i] = null;
  }

  let store = {
    solutions: [],
    nSolutions = new treeSet(comparator),
  }
  
  return exploreTreeRec({
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
  }, 0, partial, store);
}