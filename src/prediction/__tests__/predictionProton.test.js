import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import md5 from 'md5';
import OCL from 'openchemlib/minimal';

import { predictionProton } from '../predictionProton';

const molfile = `Benzene, ethyl-, ID: C100414
  NIST    16081116462D 1   1.00000     0.00000
Copyright by the U.S. Sec. Commerce on behalf of U.S.A. All rights reserved.
  8  8  0     0  0              1 V2000
    0.5015    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
    0.0000    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    1.5046    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
    2.0062    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    3.0092    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    1.5046    1.7554    0.0000 C   0  0  0  0  0  0           0  0  0
    0.5015    1.7052    0.0000 C   0  0  0  0  0  0           0  0  0
    3.5108    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
  1  2  2  0     0  0
  3  1  1  0     0  0
  2  7  1  0     0  0
  4  3  2  0     0  0
  4  5  1  0     0  0
  6  4  1  0     0  0
  5  8  1  0     0  0
  7  6  2  0     0  0
M  END
`;

const cache = (molfile, value) => {
  const hash = md5(molfile);
  const cacheDir = join(__dirname, 'cache');
  const cacheFilename = join(cacheDir, hash);
  if (!existsSync(cacheDir)) mkdirSync(cacheDir);
  if (value === undefined) {
    if (existsSync(cacheFilename)) {
      return readFileSync(cacheFilename, 'utf8');
    } else {
      return;
    }
  } else {
    writeFileSync(cacheFilename, value, 'utf8');
  }
};

describe('predictionProton', () => {
  it('1H chemical shift prediction', async function () {
    const molecule = OCL.Molecule.fromMolfile(molfile);
    const prediction = await predictionProton(molecule, { cache });
    expect(Object.keys(prediction)).toStrictEqual([
      'molfile',
      'diaIDs',
      'joinedSignals',
      'signals',
      'ranges',
    ]);
    let firstSignal = prediction.signals[0];
    expect(firstSignal).toStrictEqual({
      assignment: [8],
      diaID: ['did@`@f\\bbRaih@J@A~dHBIU@'],
      nbAtoms: 1,
      delta: 7.26,
      j: [
        {
          coupling: 7.758,
          assignment: [10],
          diaID: ['did@`@fTfYUn`HH@GzP`HeT'],
          multiplicity: 'd',
          distance: 3,
        },
        {
          coupling: 7.718,
          assignment: [9],
          diaID: ['did@`@fTfUvf`@h@GzP`HeT'],
          multiplicity: 'd',
          distance: 3,
        },
        {
          coupling: 1.596,
          assignment: [14],
          diaID: ['did@`@f\\bbRaih@J@A~dHBIU@'],
          multiplicity: 'd',
          distance: 4,
        },
        {
          coupling: 0.507,
          assignment: [13],
          diaID: ['did@`@fTfYUn`HH@GzP`HeT'],
          multiplicity: 'd',
          distance: 5,
        },
      ],
    });
  });
});
