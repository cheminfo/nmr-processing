import LM from 'ml-levenberg-marquardt';
import { Gaussian2D } from 'ml-peak-shape-generator';

const direction8X = [-1, -1, -1, 0, 0, 1, 1, 1];
const direction8Y = [-1, 0, 1, -1, 1, -1, 0, 1];
const direction16X = [-2, -2, -2, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 2, 2, 2];
const direction16Y = [-2, -1, 0, 1, 2, -2, 2, -2, 2, -2, 2, -2, -1, 0, 1, 2];

export function determineRealTop(peaks, options) {
  let { nCols, absoluteData, originalData, minX, maxX, minY, maxY } = options;
  for (let i = 0; i < peaks.length; i++) {
    let xIndex = Math.round(peaks[i].x);
    let yIndex = Math.round(peaks[i].y);

    let currentIndex = xIndex + yIndex * nCols;
    let { index, isMax } = determineMax(absoluteData, {
      xIndex,
      yIndex,
      nCols,
      shell: 1,
    });
    currentIndex = isMax
      ? index
      : determineMax(absoluteData, {
          xIndex,
          yIndex,
          nCols,
          shell: 2,
        }).index;

    let realTopCoordinates = fitGaussian(originalData, {
      nCols,
      index: currentIndex,
      minY,
      maxY,
      minX,
      maxX,
    });

    peaks[i] = Object.assign(peaks[i], realTopCoordinates);
  }
  return peaks;
}

function determineMax(data, options) {
  let { xIndex, yIndex, shell, nCols } = options;
  let currentIndex = xIndex + yIndex * nCols;
  let [directionX, directionY] =
    shell > 1 ? [direction16X, direction16Y] : [direction8X, direction8Y];

  let isMax = false;
  for (let i = 0; i < directionX.length; i++) {
    let c = xIndex + directionX[i];
    let r = yIndex + directionY[i];
    if (data[c + r * nCols] >= data[currentIndex]) {
      isMax = true;
      let candidateIndex = c + r * nCols;
      for (let k = 0; k < direction8Y.length; k++) {
        let nc = c + direction8X[k];
        let nr = r + direction8Y[k];
        if (data[nc + nr * nCols] > data[candidateIndex]) {
          isMax = false;
          break;
        }
      }
      if (isMax) {
        currentIndex = candidateIndex;
      }
    }
  }

  return { index: currentIndex, isMax };
}

function fitGaussian(data, options) {
  let { nCols, index, minY, maxY, minX, maxX } = options;

  let nRows = data.length / nCols;

  let intervalX = (maxX - minX) / (nCols - 1);
  let intervalY = (maxY - minY) / (nRows - 1);

  let col = index % nCols;
  let row = (index - col) / nCols;

  let newCol = 1;
  let newRow = 1;

  let max = Number.MIN_SAFE_INTEGER;
  let z = new Array(direction8X.length + 1);
  let xAxis = new Array(direction8X.length + 1);
  for (let i = -1, xi = 0; i < 2; i++) {
    for (let j = -1; j < 2; j++, xAxis[xi] = xi++) {
      let value = data[col + j + (row + i) * nCols];
      if (max < value) max = value;
      z[newCol + j + (newRow + i) * 3] = value;
    }
  }

  for (let i = 0; i < z.length; i++) z[i] /= max;

  let maxValues = [newCol + 1, newRow + 1, 1.5, 1, 1];
  let minValues = [newCol - 1, newRow - 1, -1.5, 0.001, 0.001];
  let initialValues = [newCol, newRow, z[newCol + newRow * 3], 0.2, 0.2];
  let gradientDifference = [1e-4, 1e-4, 1e-3, 1e-3, 1e-3];
  let func = paramGaussian2D(intervalX, intervalY, 3);

  let pFit = LM({ x: xAxis, y: z }, func, {
    damping: 1.5,
    maxIterations: 100,
    errorTolerance: 1e-8,
    initialValues,
    gradientDifference,
    maxValues,
    minValues,
  }).parameterValues;

  return {
    x: pFit[0] + col - 1,
    y: pFit[1] + row - 1,
    z: pFit[2] * max,
  };
}

function paramGaussian2D(intervalX, intervalY, nCols) {
  return function (p) {
    return function (t) {
      let nL = p.length / 5;
      let result = 0;
      let xIndex = t % nCols;
      let yIndex = (t - xIndex) / nCols;
      for (let i = 0; i < nL; i++) {
        result +=
          p[i + 2 * nL] *
          Gaussian2D.fct(
            (xIndex - p[i]) * intervalX,
            (yIndex - p[i + nL]) * intervalY,
            p[i + 3 * nL],
            p[i + 4 * nL],
          );
      }
      return result;
    };
  };
}
