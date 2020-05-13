import { writeFileSync } from 'fs';
import { join } from 'path';

const data = {
  x: [],
  y: [],
};

for (let i = 0; i <= 100; i++) {
  data.x.push(i);
  data.y.push(Math.random(i) * 100);
}

writeFileSync(
  join(__dirname, 'data.json'),
  JSON.stringify(data, undefined, 2),
  'utf8',
);
