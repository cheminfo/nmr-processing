export function queryByHose(input, db, options) {
  const { levels } = options;

  levels.sort((a, b) => b - a);
  const toReturn = [];
  for (const element of input.diaIDs) {
    let res;
    let k = 0;
    while (!res && k < levels.length) {
      if (db[levels[k]]) {
        res = db[levels[k]][element.hose[levels[k]]];
      }
      k++;
    }
    if (!res) {
      res = [null];
      k = 0;
    }

    for (const atomNumber of element.atoms) {
      let atom = { diaIDs: [element.oclID] };
      atom.delta = res[0];
      atom.atomIDs = [atomNumber];
      atom.nbAtoms = 1;

      toReturn.push(atom);
    }
  }
  return toReturn;
}
