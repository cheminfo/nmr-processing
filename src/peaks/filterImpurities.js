import { impurities } from '../constants/impurities';

const toCheck = ['solvent_residual_peak', 'H2O', 'TMS'];

export function filterImpurities(peakList, options = {}) {
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
