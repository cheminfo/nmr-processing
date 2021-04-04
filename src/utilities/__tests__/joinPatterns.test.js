import { joinPatterns } from '../joinPatterns';

test('joinPatterns', () => {
  expect(joinPatterns(['s', 'd', 'd', 'q'])).toBe('h');
});
