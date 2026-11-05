// Builds wajha-model.bundle.mjs: Wajha's own model code plus fflate, in one ESM file.
// Developers run this. Users of the final skill never do, because the built file ships.
//
//   node build-bundle.mjs            (needs a Wajha clone at the pinned commit)
//
// Set WAJHA_CLONE to use a clone somewhere else.
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PINNED = '2246e6d3c9260497abe250b068e8a12a5e55f75e';

const here = dirname(fileURLToPath(import.meta.url));
const clone = resolve(process.env.WAJHA_CLONE ?? join(here, '..', '..', '..', 'wajha-clone'));
const outFile = join(here, 'wajha-model.bundle.mjs');

const head = execFileSync('git', ['-C', clone, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (head !== PINNED) {
  console.error(`The Wajha clone is at ${head}, but this proof is pinned to ${PINNED}.`);
  console.error(`Run: git -C "${clone}" checkout ${PINNED.slice(0, 7)}`);
  process.exit(1);
}
const dirty = execFileSync('git', ['-C', clone, 'status', '--porcelain', '--', 'src'], { encoding: 'utf8' }).trim();
if (dirty) {
  console.error('The clone has changes under src/. The bundle must come from the pinned commit only.');
  console.error(dirty);
  process.exit(1);
}

// License files may use Windows line endings, which would put stray characters in the header.
const readLicense = (path) => readFileSync(path, 'utf8').split(/\r?\n/).join('\n').trim();
const wajhaLicense = readLicense(join(clone, 'LICENSE'));
const fflateLicense = readLicense(join(clone, 'node_modules', 'fflate', 'LICENSE'));
const fflateVersion = JSON.parse(readFileSync(join(clone, 'node_modules', 'fflate', 'package.json'), 'utf8')).version;

const banner = `/*!
 * wajha-model.bundle.mjs
 *
 * GENERATED FILE. Do not edit. Rebuild with: node build-bundle.mjs
 *
 * This file contains code from two MIT-licensed projects. Their notices are kept below,
 * as the MIT license requires.
 *
 * 1. Wajha (https://github.com/M-Alkassem/Wajha)
 *    Source: src/model (projectFromTemplate, validateProject, validateTemplate, catalog)
 *            and src/platform/limits.ts (image checks).
 *    Pinned commit: ${PINNED}
 *
${wajhaLicense.replace(/^/gm, ' *    ').replace(/\s+$/gm, '')}
 *
 * 2. fflate ${fflateVersion} (https://github.com/101arrowz/fflate)
 *
${fflateLicense.replace(/^/gm, ' *    ').replace(/\s+$/gm, '')}
 */`;

// What the bundle exports. Nothing else from Wajha is reachable.
const entry = `
export { projectFromTemplate } from './src/model/instantiate';
export { validateProject, validateTemplate } from './src/model/validate';
export { LANGUAGES, FAMILIES } from './src/model/catalog';
export { LIMITS, isLangCode } from './src/model/rules';
export { IMAGE_LIMITS, sniffImageExt, readImageSize, fitsImageLimits } from './src/platform/limits';
export { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';
`;

const result = await build({
  stdin: { contents: entry, resolveDir: clone, sourcefile: 'wajha-model-entry.ts', loader: 'ts' },
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node22',
  outfile: outFile,
  banner: { js: banner },
  legalComments: 'none',
  minify: false,
  metafile: true,
  logLevel: 'warning',
});

const inputs = Object.keys(result.metafile.inputs).map((p) => p.replaceAll('\\', '/'));
const outside = inputs.filter((p) => !p.includes('src/model/') && !p.includes('fflate'));
const size = statSync(outFile).size;
console.log(`Wrote ${relative(process.cwd(), outFile)} (${(size / 1024).toFixed(0)} KB, ${inputs.length} input files).`);
console.log('Inputs outside src/model and fflate:');
for (const p of outside) console.log(`  ${p}`);
mkdirSync(join(here, 'out'), { recursive: true });
writeFileSync(join(here, 'out', 'bundle-inputs.txt'), inputs.join('\n') + '\n');

// The clone may use Windows line endings. Store the bundle with plain ones, so it is the same on every machine.
writeFileSync(outFile, readFileSync(outFile, 'utf8').split(/\r?\n/).join('\n'));
