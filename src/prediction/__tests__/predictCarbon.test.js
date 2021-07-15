import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib/minimal';

import { predictCarbon } from '../predictCarbon';

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

describe('carbon prediction', () => {
  it('ethylbenzene', async () => {
    const molecule = OCL.Molecule.fromMolfile(molfile);
    const prediction = await predictCarbon(molecule);
    expect(prediction.joinedSignals).toHaveLength(6);
    expect(prediction.signals).toHaveLength(8);
    expect(prediction.joinedSignals[0]).toStrictEqual({
      delta: 128.4,
      assignment: [0, 6],
      diaID: ['daD@@LdRTIT@E@@q@TGzP`NET'],
      nbAtoms: 2,
      j: [],
    });
  });
  it('localDB', async () => {
    const molecule = OCL.Molecule.fromMolfile(molfile);
    const database = JSON.parse(
      readFileSync(join(__dirname, 'data/carbon.json')),
    );
    const prediction = await predictCarbon(molecule, { database });
    expect(prediction.joinedSignals).toHaveLength(6);
    expect(prediction.signals).toHaveLength(8);
    expect(prediction.joinedSignals[0]).toStrictEqual({
      delta: 128.4,
      assignment: [0, 6],
      diaID: ['daD@@LdRTIT@E@@q@TGzP`NET'],
      nbAtoms: 2,
      j: [],
    });
  });
});
