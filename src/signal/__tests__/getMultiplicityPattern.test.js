import signal from './signal.json';
import { getMultiplicityPattern } from '../getMultiplicityPattern';

describe('getMultiplicityPattern', () => {
  it('check dddd', () => {
    const result = getMultiplicityPattern(signal);
    expect(result).toBe('dddd');
  });
});
