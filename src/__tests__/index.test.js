import { peakPicking } from '..';

describe('index', function () {
  it('check presence of functions', () => {
    expect(peakPicking).toBeInstanceOf(Function);
  });
});
