const patterns = ['s', 'd', 't', 'q', 'quint', 'h', 'sept', 'o', 'n'];

export function joinCouplings(signal, tolerance = 0.05) {
  let couplings = signal.j;
  if (couplings && couplings.length > 0) {
    signal = JSON.parse(JSON.stringify(signal));
    let cont = couplings[0].assignment ? couplings[0].assignment.length : 1;
    let newNmrJs = [];
    let diaIDs = [];
    let atoms = [];
    couplings.sort(function (a, b) {
      return b.coupling - a.coupling;
    });
    if (couplings[0].diaID) {
      diaIDs = [couplings[0].diaID];
    }
    if (couplings[0].assignment) {
      atoms = couplings[0].assignment;
    }
    for (let i = 0; i < couplings.length - 1; i++) {
      if (
        Math.abs(couplings[i].coupling - couplings[i + 1].coupling) < tolerance
      ) {
        cont += couplings[i + 1].assignment
          ? couplings[i + 1].assignment.length
          : 1;
        diaIDs.push(couplings[i].diaID);
        atoms = atoms.concat(couplings[i + 1].assignment);
      } else {
        let jTemp = {
          coupling: Math.abs(couplings[i].coupling),
          multiplicity: patterns[cont],
        };
        if (diaIDs.length > 0) {
          jTemp.diaID = diaIDs;
        }
        if (atoms.length > 0) {
          jTemp.assignment = atoms;
        }
        newNmrJs.push(jTemp);
        if (couplings[0].diaID) {
          diaIDs = [couplings[i].diaID];
        }
        if (couplings[0].assignment) {
          atoms = couplings[i].assignment;
        }
        pattern += patterns[cont];
        cont = couplings[i + 1].assignment
          ? couplings[i + 1].assignment.length
          : 1;
      }
    }
    let jTemp = {
      coupling: Math.abs(couplings[i].coupling),
      multiplicity: patterns[cont],
    };
    if (diaIDs.length > 0) {
      jTemp.diaID = diaIDs;
    }
    if (atoms.length > 0) {
      jTemp.assignment = atoms;
    }
    newNmrJs.push(jTemp);

    pattern += patterns[cont];
    signal.j = newNmrJs;
  }
}
