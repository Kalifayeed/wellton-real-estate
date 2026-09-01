import { readdirSync, statSync, readFileSync } from 'fs';
import path from 'path';
import { transform } from 'esbuild';

const root = path.resolve(process.cwd(), 'src');
const files = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(name)) files.push(full);
  }
}
walk(root);

let errors = 0;
for (const f of files) {
  const code = readFileSync(f, 'utf8');
  try {
    await transform(code, { loader: f.endsWith('.tsx') ? 'tsx' : 'ts', jsx: 'automatic' });
  } catch (e) {
    errors++;
    console.log(`ERROR ${path.relative(process.cwd(), f)}: ${e.message.split('\n')[0]}`);
  }
}
console.log(`Checked ${files.length} files. Errors: ${errors}`);
