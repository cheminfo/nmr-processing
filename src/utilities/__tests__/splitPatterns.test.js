import { splitPatterns } from '../splitPatterns';

test('splitPatterns', () => {
  expect(splitPatterns('sqquintdt')).toStrictEqual([
    's',
    'q',
    'quint',
    'd',
    't',
  ]);
});
