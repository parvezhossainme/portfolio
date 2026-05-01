import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const targetPath = resolve(process.cwd(), 'node_modules/next/dist/compiled/browserslist/index.js');
const warningText = '[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`';

if (!existsSync(targetPath)) {
  process.exit(0);
}

const source = readFileSync(targetPath, 'utf8');

if (!source.includes(warningText)) {
  process.exit(0);
}

const patchedSource = source.replace(
  `1764339020978<(new Date).setMonth((new Date).getMonth()-2)&&console.warn(${JSON.stringify(warningText)})`,
  'false&&console.warn("baseline-browser-mapping warning suppressed")'
);

if (patchedSource === source) {
  console.error('Unable to patch baseline-browser-mapping warning in Next compiled browserslist bundle.');
  process.exit(1);
}

writeFileSync(targetPath, patchedSource);
console.log('Patched Next browserslist bundle to suppress the baseline browser-mapping warning.');