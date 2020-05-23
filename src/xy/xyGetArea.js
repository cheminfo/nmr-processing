import { xGetFromToIndex } from 'ml-spectra-processing';

export function xyGetArea(data, options = {}) {
  const { x, y } = data;
  const { fromIndex, toIndex } = xGetFromToIndex(x, options);

  let integral = 0;
  for (let i = fromIndex; i < toIndex; i++) {
    integral += y[i];
  }

  return integral * Math.abs(x[0] - x[1]);
}
