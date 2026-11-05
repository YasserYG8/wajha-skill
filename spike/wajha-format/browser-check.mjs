// The browser check (tasks 5.5 and 6.1): opens a sample in Wajha's browser version, then runs Export.
//
//   1. node make-samples.mjs
//   2. In the Wajha clone:  npx vite --port 5200 --strictPort      (any free port; the app is at http://localhost:<port>)
//   3. node browser-check.mjs [sample-name] [port]                   default: noor-both-per-language, 5200
//
// How it works. The Playwright and Chromium that run it come from the Wajha clone, so nothing is installed in this repo.
//   - It opens the home screen and uses the real "Open file..." button, with a file chooser, like a person would.
//   - It reads the project the app holds (from the app's own store and IndexedDB) and compares it with the file we built.
//   - It shows Android and Arabic by calling the app's own store actions (setActiveFamily, setActiveLang), not by clicking.
//   - It opens the Export dialog, runs Export with the default choices, and catches the downloaded zip.
//   - It checks every exported file: PNG header, size, bit depth, a full decode, and that the image is not blank.
// Output: out/browser/ (git ignores it): the page screenshots, the export zip, the exported slides, and report.json.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const clone = resolve(process.env.WAJHA_CLONE ?? join(here, '..', '..', '..', 'wajha-clone'));
const requireFromClone = createRequire(join(clone, 'package.json'));
const { chromium } = requireFromClone('@playwright/test');
const { unzipSync } = requireFromClone('fflate');
const { loadImage, createCanvas } = requireFromClone('@napi-rs/canvas');

const sampleName = process.argv[2] ?? 'noor-both-per-language';
const port = Number(process.argv[3] ?? 5200);
const baseURL = `http://localhost:${port}`;
const sampleFile = join(here, 'out', 'samples', `${sampleName}.wajha`);
const out = join(here, 'out', 'browser', sampleName);
mkdirSync(join(out, 'export'), { recursive: true });

/** The Chromium that Playwright installed. Its version may be older than the one this Playwright wants, so find any. */
function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const wanted = chromium.executablePath();
  if (existsSync(wanted)) return undefined; // the expected one is there: let Playwright use it
  const root = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright');
  const found = existsSync(root) ? readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse() : [];
  for (const dir of found) {
    for (const rel of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe', 'chrome-linux64/chrome', 'chrome-linux/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
      if (existsSync(join(root, dir, rel))) return join(root, dir, rel);
    }
  }
  throw new Error('No Chromium found. Run "npx playwright install chromium" in the Wajha clone, or set CHROMIUM_PATH.');
}

const checks = [];
const check = (name, ok, detail = '') => {
  checks.push({ name, ok: !!ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`);
};

/** Paths where two JSON values differ. Key order does not count. */
function diff(a, b, path = '$', acc = []) {
  if (Object.is(a, b)) return acc;
  const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  if (Array.isArray(a) && Array.isArray(b)) for (let i = 0; i < Math.max(a.length, b.length); i++) diff(a[i], b[i], `${path}[${i}]`, acc);
  else if (isObj(a) && isObj(b)) for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], `${path}.${k}`, acc);
  else acc.push(path);
  return acc;
}

const sampleBytes = readFileSync(sampleFile);
const fileProject = JSON.parse(Buffer.from(unzipSync(new Uint8Array(sampleBytes))['project.json']).toString('utf8'));

const executablePath = findChromium();
const browser = await chromium.launch({ headless: true, executablePath });
const problems = [];
const failedRequests = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, reducedMotion: 'reduce' });
  // Chromium asks for /favicon.ico by itself, and the app declares no icon, so the server answers 404 and Chromium logs
  // "Failed to load resource". (The Wajha tests use WebKit, which does not ask.) We answer that one request with an empty
  // reply, so that a real error cannot hide behind it. It is the only request we answer ourselves.
  await context.route('**/favicon.ico', (route) => route.fulfill({ status: 204, body: '' }));
  const page = await context.newPage();
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && problems.push(`console.error: ${m.text()}`));
  page.on('crash', () => problems.push('the page crashed'));
  // Say which address failed, because the console message alone does not.
  page.on('response', (r) => r.status() >= 400 && failedRequests.push(`${r.status()} ${r.url()}`));
  page.on('requestfailed', (r) => failedRequests.push(`failed ${r.url()} (${r.failure()?.errorText})`));
  console.log(`Browser: Chromium ${browser.version()}${executablePath ? ' (found at ' + executablePath + ')' : ''}`);
  console.log(`App: ${baseURL}   File: ${sampleFile}`);

  // 1. Open the file with the real "Open file..." button.
  await page.goto(baseURL, { timeout: 120_000 });
  await page.getByRole('button', { name: 'Open file…' }).waitFor({ timeout: 120_000 });
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Open file…' }).click();
  await (await chooser).setFiles({ name: `${sampleName}.wajha`, mimeType: 'application/zip', buffer: sampleBytes });
  await page.getByRole('region', { name: 'Slides' }).waitFor({ timeout: 60_000 });
  check('the file opens in the editor (Open file... button)', true);

  // 2. What the app holds, from its own store.
  const state = () =>
    page.evaluate(async () => {
      const { useEditor } = await import(/* @vite-ignore */ '/src/store/index.ts');
      const s = useEditor.getState();
      return s.project ? { project: JSON.parse(JSON.stringify(s.project)), family: s.activeFamily, lang: s.activeLang } : null;
    });
  const opened = await state();
  check('the editor holds a project', opened !== null);
  const strip = (p) => ({ ...p, id: 0, name: 0, createdAt: 0, updatedAt: 0 });
  const diffs = diff(strip(fileProject), strip(opened.project));
  check('the project in the app equals the project.json we wrote', diffs.length === 0, diffs.length ? `differs at ${diffs.slice(0, 5).join(', ')}` : '0 differences (apart from id, name, createdAt, updatedAt)');
  check('slides, families and languages are as planned', opened.project.slides.length === fileProject.slides.length && JSON.stringify(opened.project.families) === JSON.stringify(fileProject.families) && JSON.stringify(opened.project.languages) === JSON.stringify(fileProject.languages), `${opened.project.slides.length} slides, ${opened.project.families.join('+')}, ${opened.project.languages.join('+')}`);

  // Every asset of the file is stored in the browser's library (IndexedDB).
  const assetIds = Object.keys(fileProject.assets);
  const stored = await page.evaluate(async (ids) => {
    const { readAsset } = await import(/* @vite-ignore */ '/src/storage/index.ts');
    const { useEditor } = await import(/* @vite-ignore */ '/src/store/index.ts');
    const id = useEditor.getState().project.id;
    const sizes = [];
    for (const a of ids) sizes.push((await readAsset(id, a))?.byteLength ?? 0);
    return sizes;
  }, assetIds);
  check('every image of the file is stored in the browser', stored.every((n) => n > 0), `${stored.length} images, ${stored.reduce((a, b) => a + b, 0)} bytes`);

  const statusBar = await page.getByRole('contentinfo').innerText();
  check('the status bar shows no missing screenshots', /All screenshots added/.test(statusBar), JSON.stringify(statusBar.replace(/\s+/g, ' ').slice(0, 80)));
  await page.waitForTimeout(1500); // let the stage draw
  await page.screenshot({ path: join(out, `1-iphone-${opened.lang}.png`) });

  // 3. Every family in every language, through the app's store actions.
  const set = (family, lang) =>
    page.evaluate(
      async ([f, l]) => {
        const { useEditor } = await import(/* @vite-ignore */ '/src/store/index.ts');
        const s = useEditor.getState();
        return [s.setActiveFamily(f), s.setActiveLang(l)];
      },
      [family, lang],
    );
  let shown = 0;
  let allShown = true;
  for (const family of fileProject.families) {
    for (const lang of fileProject.languages) {
      const [okFamily, okLang] = await set(family, lang);
      await page.waitForTimeout(1200);
      const now = await state();
      const good = okFamily === true && okLang === true && now.family === family && now.lang === lang;
      allShown &&= good;
      shown += 1;
      await page.screenshot({ path: join(out, `${shown}-${family}-${lang}.png`) });
    }
  }
  check('every family can be shown in every language', allShown, `${shown} views: ${fileProject.families.join(', ')} x ${fileProject.languages.join(', ')}`);

  // 4. Export, with the dialog's default choices.
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Export screenshots' });
  await dialog.waitFor({ timeout: 30_000 });
  const sizesChecked = await dialog.getByRole('region', { name: 'Sizes' }).getByRole('checkbox').evaluateAll((els) => els.filter((e) => e.checked || e.getAttribute('aria-checked') === 'true').map((e) => e.getAttribute('aria-label') ?? e.parentElement?.textContent?.trim().slice(0, 40)));
  const langsChecked = await dialog.getByRole('region', { name: 'Languages' }).getByRole('checkbox').evaluateAll((els) => els.filter((e) => e.checked || e.getAttribute('aria-checked') === 'true').map((e) => e.getAttribute('aria-label') ?? e.parentElement?.textContent?.trim().slice(0, 40)));
  console.log('Export sizes chosen by default:', JSON.stringify(sizesChecked));
  console.log('Export languages chosen by default:', JSON.stringify(langsChecked));
  const run = dialog.getByRole('button', { name: /^Export \d+ files?$/ });
  const label = await run.innerText();
  const download = page.waitForEvent('download', { timeout: 180_000 });
  await run.click();
  const file = await download;
  const zipPath = join(out, 'export.zip');
  await file.saveAs(zipPath);
  check('Export gives a download', !(await file.failure()), `${file.suggestedFilename()}  (button said "${label}")`);
  await dialog.getByRole('heading', { name: /files? exported/ }).waitFor({ timeout: 60_000 });
  await page.screenshot({ path: join(out, '5-export-done.png') });
  await dialog.getByRole('button', { name: 'Done' }).click();

  // 5. The exported files must be real images.
  const entries = Object.entries(unzipSync(new Uint8Array(readFileSync(zipPath)))).filter(([n]) => !n.endsWith('/'));
  const expectedCount = Number(/\d+/.exec(label)[0]);
  check('the zip holds as many files as the button said', entries.length === expectedCount, `${entries.length} files`);
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const rows = [];
  for (const [name, bytes] of entries) {
    const isPng = sig.every((b, i) => bytes[i] === b);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const width = isPng ? view.getUint32(16) : 0;
    const height = isPng ? view.getUint32(20) : 0;
    const bitDepth = isPng ? bytes[24] : 0;
    const colorType = isPng ? bytes[25] : -1;
    let decoded = false;
    let distinctColours = 0;
    try {
      const img = await loadImage(Buffer.from(bytes));
      decoded = img.width === width && img.height === height;
      // Not blank: sample a grid of pixels and count the distinct colours.
      const c = createCanvas(64, 64);
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0, 64, 64);
      const d = g.getImageData(0, 0, 64, 64).data;
      const seen = new Set();
      for (let i = 0; i < d.length; i += 4) seen.add(`${d[i] >> 4},${d[i + 1] >> 4},${d[i + 2] >> 4}`);
      distinctColours = seen.size;
    } catch {
      decoded = false;
    }
    const target = join(out, 'export', name.replace(/[\\/]/g, '__'));
    writeFileSync(target, bytes);
    rows.push({ name, bytes: bytes.byteLength, isPng, width, height, bitDepth, colorType, decoded, distinctColours });
  }
  check('every exported file is a PNG that decodes to its stated size', rows.every((r) => r.isPng && r.decoded && r.width > 0), `${rows.filter((r) => r.isPng && r.decoded).length} of ${rows.length}`);
  check('every exported file is 8-bit RGB with no alpha (the stores reject transparency)', rows.every((r) => r.bitDepth === 8 && r.colorType === 2));
  check('no exported file is blank', rows.every((r) => r.distinctColours > 40), `fewest distinct colours: ${Math.min(...rows.map((r) => r.distinctColours))}`);
  const sizeSet = [...new Set(rows.map((r) => `${r.width}x${r.height}`))];
  console.log('Exported sizes:', sizeSet.join(', '));
  check('no error was logged by the page', problems.length === 0, problems.slice(0, 3).join(' | '));
  if (failedRequests.length) console.log('Requests that failed:', JSON.stringify(failedRequests));

  writeFileSync(join(out, 'report.json'), JSON.stringify({ sample: sampleName, browser: `Chromium ${browser.version()}`, app: baseURL, exportSizes: sizesChecked, exportLanguages: langsChecked, failedRequests, checks, files: rows, problems }, null, 1));
} finally {
  await browser.close();
}
const failed = checks.filter((c) => !c.ok);
console.log(failed.length ? `\n${failed.length} check(s) FAILED` : `\nAll ${checks.length} checks passed.`);
process.exitCode = failed.length ? 1 : 0;
