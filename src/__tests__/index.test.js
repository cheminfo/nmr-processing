import { autoPeaksPicking } from '..';

describe('index', function () {
  it('check presence of functions', () => {
    expect(autoPeaksPicking).toBeInstanceOf(Function);
  });
});
