import { signalMultiplicityPattern } from '../signalMultiplicityPattern';

import signal from './signal.json';

describe('signalMultiplicityPattern', () => {
  it('check dddd', () => {
    const result = signalMultiplicityPattern(signal);
    expect(result).toBe('dddd');
  });
});
