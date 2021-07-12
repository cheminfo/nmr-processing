import treeSet from 'ml-tree-set';

import { exploreTreeRec } from './exploreTreeRec';

const comparator = (a, b) => {
  return b.score - a.score;
};

export function buildAssignment(props) {
  const {
    restrictionByCS,
    timeout,
    minScore,
    nSources,
    unassigned,
    predictions,
    maxSolutions,
    correlations,
    diaIDPeerPossibleAssignment,
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
    solutions: new treeSet(comparator),
    nSolutions: 0,
  }

  exploreTreeRec({
    nSources,
    restrictionByCS,
    timeout,
    timeStart,
    targets,
    predictions,
    correlations,
    maxSolutions,
    lowerBound,
    unassigned,
    possibleAssignmentMap,
    diaIDPeerPossibleAssignment,
  }, 0, partial, store);

  return store;
}