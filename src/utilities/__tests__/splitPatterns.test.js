import { splitPatterns } from '../splitPatterns';

test('splitPatterns', () => {
  expect(splitPatterns('sqquintdt')).toStrictEqual([
    's',
    'q',
    'quint',
    'd',
    't',
  ]);

  expect(splitPatterns('s q quint dt')).toStrictEqual([
    's',
    'q',
    'quint',
    'd',
    't',
  ]);
  expect(splitPatterns('xqquintdt')).toStrictEqual(['q', 'quint', 'd', 't']);
});
