import { writeFileSync } from 'fs';
import { join } from 'path';

import createTestData from './createTestData';

let data = createTestData();

writeFileSync(
  join(__dirname, 'noise.json'),
  JSON.stringify(data, undefined, 2),
  'utf8',
);
