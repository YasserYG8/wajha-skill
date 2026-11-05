// Copies our proof tests into the Wajha clone and runs them with Wajha's own Vitest.
// The clone lives outside this repo. Set WAJHA_CLONE to change where it is.
//
//   node spike/wajha-format/run-in-clone.mjs                 run every test in clone-tests/
//   node spike/wajha-format/run-in-clone.mjs make-screenshots   run one (name without .test.ts)
//
// Our files are copied as <clone>/scripts/spike-<name>.test.ts. They get these env vars:
//   SPIKE_DIR  this folder (spike/wajha-format)
//   SPIKE_OUT  spike/wajha-format/out (git ignores it)
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const clone = resolve(process.env.WAJHA_CLONE ?? join(here, '..', '..', '..', 'wajha-clone'));
if (!existsSync(join(clone, 'package.json'))) {
  console.error(`No Wajha clone at ${clone}. Set WAJHA_CLONE, or clone it there.`);
  process.exit(1);
}

const testsDir = join(here, 'clone-tests');
const wanted = process.argv.slice(2);
const files = readdirSync(testsDir)
  .filter((f) => f.endsWith('.test.ts'))
  .filter((f) => wanted.length === 0 || wanted.includes(f.replace(/\.test\.ts$/, '')));
if (files.length === 0) {
  console.error('No matching tests in clone-tests/.');
  process.exit(1);
}

// Helper files (anything .ts that is not a test) are copied too, so that tests can import them as './spike-<name>'.
for (const f of readdirSync(testsDir).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))) {
  copyFileSync(join(testsDir, f), join(clone, `scripts/spike-${f}`));
}

const copied = files.map((f) => {
  const to = `scripts/spike-${f}`;
  copyFileSync(join(testsDir, f), join(clone, to));
  return to;
});

const out = join(here, 'out');
mkdirSync(out, { recursive: true });
const run = spawnSync('npx', ['vitest', 'run', ...copied], {
  cwd: clone,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, SPIKE_DIR: here, SPIKE_OUT: process.env.SPIKE_OUT ?? out },
});
process.exit(run.status ?? 1);
