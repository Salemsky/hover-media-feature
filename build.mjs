import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { gzipSync } from 'node:zlib';

import { minify_sync } from 'terser';

import pkg from './package.json' with { type: 'json' };

const data = readFileSync('index.mjs', 'utf8');

for (let mod in pkg.exports['.']) {
  if (mod !== 'require' && mod !== 'import') continue;
  const path = pkg.exports['.'][mod];

  mod = mod === 'require' ? data.replace('export const', 'exports.') : data;
  const code =
    minify_sync(mod, {
      compress: true,
      mangle: { toplevel: true },
    }).code || '';

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, code);

  const [raw, gzip] = [Buffer.byteLength(code), gzipSync(code).byteLength].map(
    (n) => (n < 1024 ? `${n} b` : `${(n / 1024).toFixed(2)} kb`),
  );

  console.log('%s - %s (%s)', path, raw, gzip);
}
