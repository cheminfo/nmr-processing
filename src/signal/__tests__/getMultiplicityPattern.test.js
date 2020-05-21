import { getMultiplicityPattern } from '../getMultiplicityPattern';

import signal from './signal.json';

describe('getMultiplicityPattern', () => {
  it('check dddd', () => {
    const result = getMultiplicityPattern(signal);
    expect(result).toBe('dddd');
  });
});
