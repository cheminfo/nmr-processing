import binarySearch from 'binary-search';
import { Matrix, EVD } from 'ml-matrix';
import { SparseMatrix } from 'ml-sparse-matrix';
import { SpectrumGenerator } from 'spectrum-generator';

import getPauliMatrix from './getPauliMatrix';

const smallValue = 1e-2;

/**
 * This function simulates a one dimensional nmr spectrum. This function returns an array containing the relative intensities of the spectrum in the specified simulation window (from-to).
 * @param {object} spinSystem - The SpinSystem object to be simulated
 * @param {object} [options={}] - options.
 * @param {number} [options.frequency=400] - The frequency in Mhz of the fake spectrometer that records the spectrum.
 * @param {number} [options.lineWidth=1] - The linewidth of the output spectrum, expresed in Hz.
 * @param {object} options.shape - options for spectrum-generator.
 * @param {string} [options.shape.kind='gaussian'] - kind of shape to generate the spectrum.
 * @param {object} options.shape.options - spectrum and shape options. See spectrum-generator for more information about shape options.
 * @param {number} [options.from=0] - The low limit of the ordinate variable.
 * @param {number} [options.to=10] - The upper limit of the ordinate variable.
 * @param {number} [options.nbPoints=16*1024] - Number of points of the output spectrum.
 * @param {number} [options.maxClusterSize=8] - Maximum number of atoms on each cluster that can be considered to be simulated together. It affects the the quality and speed of the simulation.
 * @return {object}
 */
export default function simulate1D(spinSystem, options) {
  let {
    lineWidth = 1,
    maxClusterSize = 10,
    frequency: frequencyMHz = 400,
    shape = {
      kind: 'gaussian',
      options: {
        from: 0,
        to: 10,
        nbPoints: 1024,
      },
    },
  } = options;

  let { options: shapeOptions } = shape;
  let peakWidth = lineWidth / frequencyMHz;

  shapeOptions.peakWidthFct = () => peakWidth;
  let spectrumGenerator = new SpectrumGenerator(shapeOptions);

  const chemicalShifts = spinSystem.chemicalShifts.slice();
  for (let i = 0; i < chemicalShifts.length; i++) {
    chemicalShifts[i] = chemicalShifts[i] * frequencyMHz;
  }

  const multiplicity = spinSystem.multiplicity;
  for (let h = 0; h < spinSystem.clusters.length; h++) {
    const cluster = spinSystem.clusters[h];

    let clusterFake = new Array(cluster.length);
    for (let i = 0; i < cluster.length; i++) {
      clusterFake[i] = cluster[i] < 0 ? -cluster[i] - 1 : cluster[i];
    }

    let weight = 1;
    let sumI = 0;
    let frequencies = [];
    let intensities = [];
    if (cluster.length > maxClusterSize) {
      // This is a single spin, but the cluster exceeds the maxClusterSize criteria
      // we use the simple multiplicity algorithm
      // Add the central peak. It will be split with every single J coupling.
      let index = 0;
      while (cluster[index++] < 0);
      index = cluster[index - 1];
      frequencies.push(-chemicalShifts[index]);
      for (let i = 0; i < cluster.length; i++) {
        if (cluster[i] < 0) {
          let jc = spinSystem.couplingConstants.get(index, clusterFake[i]) / 2;
          let currentSize = frequencies.length;
          for (let j = 0; j < currentSize; j++) {
            frequencies.push(frequencies[j] + jc);
            frequencies[j] -= jc;
          }
        }
      }

      frequencies = Float64Array.from(frequencies).sort();
      sumI = frequencies.length;
      weight = 1;

      for (let i = 0; i < sumI; i++) {
        intensities.push(1);
      }
    } else {
      const hamiltonian = getHamiltonian(
        chemicalShifts,
        spinSystem.couplingConstants,
        multiplicity,
        spinSystem.connectivity,
        clusterFake,
      );
      const hamSize = hamiltonian.rows;
      const evd = new EVD(hamiltonian);
      const V = evd.eigenvectorMatrix;
      const diagB = evd.realEigenvalues;
      const assignmentMatrix = new SparseMatrix(hamSize, hamSize);
      const multLen = cluster.length;
      weight = 0;
      for (let n = 0; n < multLen; n++) {
        const L = getPauliMatrix(multiplicity[clusterFake[n]]);

        let temp = 1;
        for (let j = 0; j < n; j++) {
          temp *= multiplicity[clusterFake[j]];
        }
        const A = SparseMatrix.eye(temp);

        temp = 1;
        for (let j = n + 1; j < multLen; j++) {
          temp *= multiplicity[clusterFake[j]];
        }
        const B = SparseMatrix.eye(temp);
        const tempMat = A.kroneckerProduct(L.m).kroneckerProduct(B);
        if (cluster[n] >= 0) {
          assignmentMatrix.add(tempMat.mul(cluster[n] + 1));
          weight++;
        } else {
          assignmentMatrix.add(tempMat.mul(cluster[n]));
        }
      }

      let rhoip = Matrix.zeros(hamSize, hamSize);
      assignmentMatrix.forEachNonZero((i, j, v) => {
        if (v > 0) {
          for (let k = 0; k < V.columns; k++) {
            let element = V.get(j, k);
            if (element !== 0) {
              rhoip.set(i, k, rhoip.get(i, k) + element);
            }
          }
        }
        return v;
      });

      let rhoip2 = rhoip.clone();
      assignmentMatrix.forEachNonZero((i, j, v) => {
        if (v < 0) {
          for (let k = 0; k < V.columns; k++) {
            let element = V.get(j, k);
            if (element !== 0) {
              rhoip2.set(i, k, rhoip2.get(i, k) + element);
            }
          }
        }
        return v;
      });
      const tV = V.transpose();

      rhoip = tV.mmul(rhoip);
      rhoip = new SparseMatrix(rhoip.to2DArray(), { threshold: smallValue });
      triuTimesAbs(rhoip, smallValue);
      rhoip2 = tV.mmul(rhoip2);

      rhoip2 = new SparseMatrix(rhoip2.to2DArray(), { threshold: smallValue });
      rhoip2.forEachNonZero((i, j, v) => {
        return v;
      });
      triuTimesAbs(rhoip2, smallValue);
      rhoip2.forEachNonZero((i, j, v) => {
        let val = rhoip.get(i, j);
        val = Math.min(Math.abs(val), Math.abs(v));
        val *= val;

        sumI += val;
        let valFreq = diagB[i] - diagB[j];
        let insertIn = binarySearch(frequencies, valFreq, (a, b) => a - b);
        if (insertIn < 0) {
          frequencies.splice(-1 - insertIn, 0, valFreq);
          intensities.splice(-1 - insertIn, 0, val);
        } else {
          intensities[insertIn] += val;
        }
      });
    }

    const numFreq = frequencies.length;

    if (numFreq > 0) {
      weight /= sumI;
      const diff = lineWidth / 64;
      let valFreq = frequencies[0];
      let inte = intensities[0];
      let count = 1;
      for (let i = 1; i < numFreq; i++) {
        if (Math.abs(frequencies[i] - valFreq / count) < diff) {
          inte += intensities[i];
          valFreq += frequencies[i];
          count++;
        } else {
          spectrumGenerator.addPeak({
            x: -valFreq / count / frequencyMHz,
            y: inte * weight,
          });
          valFreq = frequencies[i];
          inte = intensities[i];
          count = 1;
        }
      }

      spectrumGenerator.addPeak({
        x: -valFreq / count / frequencyMHz,
        y: inte * weight,
      });
    }
  }
  return spectrumGenerator.data;
}

function triuTimesAbs(A, val) {
  A.forEachNonZero((i, j, v) => {
    if (i > j) return 0;
    if (Math.abs(v) <= val) return 0;
    return v;
  });
}
/**
 * Create a hamiltonian matrix for the given spinsystem
 * @param {Array} chemicalShifts - An array containing the chemical shift in Hz
 * @param {Array} couplingConstants - An array containing the coupling constants in Hz
 * @param {Array} multiplicity - An array specifiying the multiplicities of each scalar coupling
 * @param {Array} conMatrix - A one step connectivity matrix for the given spin system
 * @param {Array} cluster - An binary array specifiying the spins to be considered for this hamiltonial
 * @return {object}
 */
function getHamiltonian(
  chemicalShifts,
  couplingConstants,
  multiplicity,
  conMatrix,
  cluster,
) {
  let hamSize = 1;
  for (let i = 0; i < cluster.length; i++) {
    hamSize *= multiplicity[cluster[i]];
  }

  const clusterHam = new SparseMatrix(hamSize, hamSize);

  for (let pos = 0; pos < cluster.length; pos++) {
    let n = cluster[pos];

    const L = getPauliMatrix(multiplicity[n]);

    let A1, B1;
    let temp = 1;
    for (let i = 0; i < pos; i++) {
      temp *= multiplicity[cluster[i]];
    }
    A1 = SparseMatrix.eye(temp);

    temp = 1;
    for (let i = pos + 1; i < cluster.length; i++) {
      temp *= multiplicity[cluster[i]];
    }
    B1 = SparseMatrix.eye(temp);

    const alpha = chemicalShifts[n];
    const kronProd = A1.kroneckerProduct(L.z).kroneckerProduct(B1);
    clusterHam.add(kronProd.mul(alpha));
    for (let pos2 = 0; pos2 < cluster.length; pos2++) {
      const k = cluster[pos2];
      if (conMatrix.get(n, k) === 1) {
        const S = getPauliMatrix(multiplicity[k]);

        let A2, B2;
        let temp = 1;
        for (let i = 0; i < pos2; i++) {
          temp *= multiplicity[cluster[i]];
        }
        A2 = SparseMatrix.eye(temp);

        temp = 1;
        for (let i = pos2 + 1; i < cluster.length; i++) {
          temp *= multiplicity[cluster[i]];
        }
        B2 = SparseMatrix.eye(temp);

        const kron1 = A1.kroneckerProduct(L.x)
          .kroneckerProduct(B1)
          .mmul(A2.kroneckerProduct(S.x).kroneckerProduct(B2));
        kron1.add(
          A1.kroneckerProduct(L.y)
            .kroneckerProduct(B1)
            .mul(-1)
            .mmul(A2.kroneckerProduct(S.y).kroneckerProduct(B2)),
        );
        kron1.add(
          A1.kroneckerProduct(L.z)
            .kroneckerProduct(B1)
            .mmul(A2.kroneckerProduct(S.z).kroneckerProduct(B2)),
        );

        clusterHam.add(kron1.mul(couplingConstants.get(n, k) / 2));
      }
    }
  }
  return clusterHam;
}
