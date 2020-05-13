import xRange from '../util/xRange';

export default function createTestData(options = {}) {
  let {
    nbPoints = 101,
    deltaPeak1 = 2,
    intensity = 1,
    w = 0.1,
    deltaPeak2 = 8,
    intensity2 = intensity * 50,
    w2 = w,
    noiseAmplitude = 2,
  } = options;

  let x = xRange(0, 10, nbPoints);
  let y = new Array(nbPoints);

  for (let i = 0; i < nbPoints; i++) {
    y[i] =
      (((2 * intensity) / Math.PI) * w) /
        (4 * Math.pow(deltaPeak1 - x[i], 2) + Math.pow(w, 2)) +
      (((2 * intensity2) / Math.PI) * w2) /
        (4 * Math.pow(deltaPeak2 - x[i], 2) + Math.pow(w2, 2)) +
      (Math.random() * noiseAmplitude - noiseAmplitude * 0.5);
  }
  return { x, y };
}
