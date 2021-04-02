import isAnyArray from 'is-any-array';
import { agnes } from 'ml-hclust';
import Matrix from 'ml-matrix';

export function splitSpinSystem(spinSystem, options = {}) {
  let { chemicalShifts, couplingConstants, connectivity } = spinSystem;
  let { frequency = 400, maxClusterSize = 8 } = options;
  let betas = calculateBetas(chemicalShifts, couplingConstants, frequency);
  let initClusters = agnes(betas, { method: 'single', isDistanceMatrix: true });
  let clusterList = [];
  let nSpins = chemicalShifts.length;
  splitCluster(initClusters, clusterList, {
    maxClusterSize,
    force: false,
    nSpins,
    connectivity,
  });
  let mergedClusters = mergeClusters(clusterList, maxClusterSize);
  let nClusters = mergedClusters.length;
  let clusters = new Array(nClusters);
  for (let j = 0; j < nClusters; j++) {
    clusters[j] = [];
    for (let i = 0; i < nSpins; i++) {
      let element = mergedClusters[j][i];
      if (element === 0) continue;
      clusters[j].push(element < 0 ? -(i + 1) : i);
    }
  }

  return clusters;
}

function splitCluster(cluster, clusterList, options = {}) {
  let { maxClusterSize, force, nSpins, connectivity } = options;
  if (!force && cluster.index.length <= maxClusterSize) {
    clusterList.push(getMembers(cluster, nSpins));
  } else {
    for (let child of cluster.children) {
      if (!isNaN(child.index) || child.index.length <= maxClusterSize) {
        let members = getMembers(child, nSpins);
        // Add the neighbors that shares at least 1 coupling with the given cluster
        let count = 0;
        for (let i = 0; i < nSpins; i++) {
          if (members[i] === 1) {
            for (let j = 0; j < nSpins; j++) {
              if (connectivity.get(i, j) === 1 && members[j] === 0) {
                members[j] = -1;
                count++;
              }
            }
            count++;
          }
        }

        if (count <= maxClusterSize) {
          clusterList.push(members);
        } else {
          if (isNaN(child.index)) {
            splitCluster(child, clusterList, {
              maxClusterSize,
              force: true,
              nSpins,
              connectivity,
            });
          } else {
            // We have to threat this spin alone and use the resurrection algorithm instead of the simulation
            members[child.index] = 2;
            clusterList.push(members);
          }
        }
      } else {
        splitCluster(child, clusterList, {
          maxClusterSize,
          force: false,
          nSpins,
          connectivity,
        });
      }
    }
  }
}

function calculateBetas(chemicalShifts, couplingConstants, frequency) {
  let nRows = couplingConstants.rows;
  let nColumns = couplingConstants.columns;
  let betas = Matrix.zeros(nRows, nRows);
  // Before clustering, we must add hidden couplingConstants, we could use molecular information if available
  for (let i = 0; i < nRows; i++) {
    for (let j = i; j < nColumns; j++) {
      let element = couplingConstants.get(i, j);
      if (chemicalShifts[i] - chemicalShifts[j] !== 0) {
        let value =
          1 -
          Math.abs(
            element / ((chemicalShifts[i] - chemicalShifts[j]) * frequency),
          );
        betas.set(i, j, value);
        betas.set(j, i, value);
      } else if (!(i === j || element !== 0)) {
        betas.set(i, j, 1);
        betas.set(j, i, 1);
      }
    }
  }
  return betas.to2DArray();
}

function mergeClusters(list, maxClusterSize) {
  for (let i = list.length - 1; i >= 0; i--) {
    let clusterA = list[i];
    let nElements = clusterA.length;
    let index = 0;

    // Is it a candidate to be merged?
    while (index < nElements && clusterA[index++] !== -1);
    if (index >= nElements) continue;

    for (let j = list.length - 1; j >= i + 1; j--) {
      let clusterB = list[j];
      // Do they have common elements?
      let count = 0;
      let common = 0;
      for (let index = 0; index < nElements; index++) {
        if (clusterA[index] * clusterB[index] === -1) common++;
        if (clusterA[index] !== 0 || clusterB[index] !== 0) count++;
      }

      if (common > 0 && count <= maxClusterSize) {
        // Then we can merge those 2 clusters
        for (let index = 0; index < nElements; index++) {
          if (clusterB[index] === 1) {
            clusterA[index] = 1;
          } else if (clusterB[index] === -1 && clusterA[index] !== 1) {
            clusterA[index] = -1;
          }
        }
        list.splice(j, 1);
      }
    }
  }
  return list;
}
function getMembers(cluster, nSpins) {
  let members = new Int16Array(nSpins);
  if (isAnyArray(cluster.index)) {
    for (let c of cluster.index) {
      members[Number(c.index)] = 1;
    }
  } else if (!isNaN(cluster.index)) {
    members[Number(cluster.index)] = 1;
  }
  return members;
}
