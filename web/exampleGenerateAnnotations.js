import { writeFileSync } from 'fs';
import { join } from 'path';

const annotations = [];

for (let i = 0; i < 10; i++) {
  const from = { x: Math.random() * 100, y: Math.random() * 100 };
  const to = { x: Math.random() * 100, y: Math.random() * 100 };
  const annotation = {
    type: 'line',
    data: {
      position: [from, to],
      strokeWidth: '4px',
      strokeColor: 'red',
    },
  };
  annotations.push(annotation);
}

writeFileSync(
  join(__dirname, 'annotations.json'),
  JSON.stringify(annotations, undefined, 2),
  'utf8',
);
