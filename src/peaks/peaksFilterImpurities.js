import { impurities } from '../constants/impurities';

const toCheck = ['solvent_residual_peak', 'H2O', 'TMS'];

/**
 * Try to remove peaks of impurities.
 * @param {array} peakList - A list of initial parameters to be optimized. e.g. coming from a peak picking [{x, y, width}].
 * @param {object} [options = {}] - options
 * @param {string} [options.solvent = ''] - solvent name.
 * @param {string} [options.error = 0.025] - tolerance in ppm to assign a impurity.
 */

export function peaksFilterImpurities(peakList, options = {}) {
  let { solvent = '', error = 0.025 } = options;
  solvent = solvent.toLowerCase();
  if (solvent === '(cd3)2so') solvent = 'dmso';
  if (solvent === 'meod') solvent = 'cd3od';
  let solventImpurities = impurities[solvent];
  if (solventImpurities) {
    for (let impurity of toCheck) {
      let impurityShifts = solventImpurities[impurity.toLowerCase()];
      checkImpurity(peakList, impurityShifts, { error: error });
    }
  }
  return peakList;
}

function checkImpurity(peakList, impurity, options) {
  let j, tolerance, difference;
  let i = impurity.length;
  while (i--) {
    j = peakList.length;
    while (j--) {
      if (!peakList[j].asymmetric) {
        tolerance = options.error + peakList[j].width;
        difference = Math.abs(impurity[i].shift - peakList[j].x);
        if (difference < tolerance) {
          // && (impurity[i].multiplicity === '' || (impurity[i].multiplicity.indexOf(peakList[j].multiplicity)) { // some impurities has multiplicities like 'bs' but at presents it is unsupported
          peakList.splice(j, 1);
        }
      }
    }
  }
}
