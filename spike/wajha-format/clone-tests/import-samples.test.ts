/**
 * Passes every sample .wajha file through Wajha's real importer (importProjectArchive) and checks that
 * nothing is lost or changed. It uses no copy of Wajha's import code.
 *
 *   node spike/wajha-format/make-samples.mjs
 *   node spike/wajha-format/run-in-clone.mjs import-samples
 *
 * What it checks for each sample:
 *   1. The import succeeds.
 *   2. The imported project equals the project.json we wrote, apart from id, name, createdAt, updatedAt.
 *   3. Every slide's `shots` entry points to the right asset. "Right" is worked out from the plan's source
 *      image (its SHA-256 and type), and not from our own project.json. No extra entries appear.
 *   4. Every asset can be read back, and its bytes equal the source image.
 *   5. Every slide keeps its texts, in every language.
 * A control test then damages one image and checks that the same code reports the loss.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { unzipSync, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import type { Project } from '../src/model/types';
import { createMemoryPlatform, setPlatform } from '../src/platform';
import { importProjectArchive, loadProject, readAsset } from '../src/storage';

const DIR = process.env.SPIKE_DIR;
const SAMPLES = DIR ? join(DIR, 'out', 'samples') : '';
// SPIKE_MANIFEST points to another list of files to check (task 4.4 uses it). Each entry may name its own "plan" file.
const MANIFEST = process.env.SPIKE_MANIFEST ?? (SAMPLES ? join(SAMPLES, 'manifest.json') : '');

interface Sample {
  name: string;
  file: string;
  templateId: string;
  families: string[];
  languages: string[];
  slides: number;
  /** Plan file with absolute image paths. Default: plans/<name>.json next to the default manifest. */
  plan?: string;
}
interface Plan {
  name: string;
  languages: string[];
  slides: { texts: Record<string, Record<string, string>>; shots: Record<string, Record<string, string | Record<string, string>>> }[];
}

const SHORT: Record<string, string> = { en: 'en-US', ar: 'ar-SA' };
const full = (code: string) => SHORT[code] ?? code;
const sha = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const typeOf = (b: Uint8Array) => (b[0] === 0x89 && b[1] === 0x50 ? 'png' : b[0] === 0xff && b[1] === 0xd8 ? 'jpg' : 'webp');

/** Paths where two JSON values differ. Key order does not count. */
function diff(a: unknown, b: unknown, path = '$', out: string[] = []): string[] {
  if (Object.is(a, b)) return out;
  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) diff(a[i], b[i], `${path}[${i}]`, out);
  } else if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff((a as never)[k], (b as never)[k], `${path}.${k}`, out);
  } else out.push(path);
  return out;
}

/** Imports `bytes` into a fresh memory platform, then returns every problem found. Empty means all is well. */
async function problemsAfterImport(bytes: Uint8Array, plan: Plan): Promise<{ problems: string[]; imported?: Project }> {
  const problems: string[] = [];
  const original = JSON.parse(new TextDecoder().decode(unzipSync(bytes)['project.json'])) as Project;
  setPlatform(createMemoryPlatform());
  const meta = await importProjectArchive(bytes);
  const imported = await loadProject(meta.id);
  const base = full(plan.languages[0]);

  // 2. Whole project, apart from the fields the importer sets itself.
  const strip = (p: Project) => ({ ...p, id: '', name: '', createdAt: 0, updatedAt: 0 });
  for (const path of diff(strip(original), strip(imported))) problems.push(`changed by import: ${path}`);
  if (imported.name !== original.name) problems.push(`name changed: ${original.name} -> ${imported.name}`);

  // 1 and 5. Slides and texts.
  if (imported.slides.length !== plan.slides.length) problems.push(`slides: ${plan.slides.length} planned, ${imported.slides.length} imported`);
  const expectedAssets = new Map<string, Uint8Array>();
  plan.slides.forEach((ps, i) => {
    const slide = imported.slides[i];
    if (!slide) return;
    for (const [code, copy] of Object.entries(ps.texts)) {
      for (const [key, text] of Object.entries(copy)) {
        if (slide.texts[full(code)]?.[key] !== text) problems.push(`slide ${i + 1}: text ${code}.${key} lost or changed`);
      }
    }
    // 3. Shots point to the right asset, for each language, worked out from the source images.
    // A plan value is one file (stored for the base language) or one file for each language.
    const idOf = (file: string) => {
      const src = new Uint8Array(readFileSync(file));
      const id = `${sha(src)}.${typeOf(src)}`;
      expectedAssets.set(id, src);
      return id;
    };
    const expectedShots: Record<string, Record<string, Record<string, string>>> = {};
    for (const [family, bySlot] of Object.entries(ps.shots)) {
      for (const [slot, value] of Object.entries(bySlot)) {
        const byLang = typeof value === 'string' ? { [base]: idOf(value) } : Object.fromEntries(Object.entries(value).map(([code, file]) => [full(code), idOf(file)]));
        (expectedShots[family] ??= {})[slot] = byLang;
      }
    }
    const got = slide.shots as Record<string, Record<string, Record<string, string>>>;
    for (const family of new Set([...Object.keys(expectedShots), ...Object.keys(got)])) {
      for (const slot of new Set([...Object.keys(expectedShots[family] ?? {}), ...Object.keys(got[family] ?? {})])) {
        const want = expectedShots[family]?.[slot];
        const have = got[family]?.[slot];
        if (!want) problems.push(`slide ${i + 1}: extra shot ${family}.${slot}`);
        else if (!have) problems.push(`slide ${i + 1}: shot ${family}.${slot} was lost`);
        else {
          for (const lang of new Set([...Object.keys(want), ...Object.keys(have)])) {
            if (!want[lang]) problems.push(`slide ${i + 1}: shot ${family}.${slot} has an extra language ${lang}`);
            else if (!have[lang]) problems.push(`slide ${i + 1}: shot ${family}.${slot} lost its ${lang} image`);
            else if (have[lang] !== want[lang]) problems.push(`slide ${i + 1}: shot ${family}.${slot}.${lang} points to ${have[lang]}, expected ${want[lang]}`);
          }
        }
      }
    }
  });

  // 4 and 6. Every asset is registered and can be read back with the same bytes.
  const registered = Object.keys(imported.assets).sort();
  const expected = [...expectedAssets.keys()].sort();
  if (JSON.stringify(registered) !== JSON.stringify(expected)) problems.push(`asset registry differs: have ${registered.length}, expected ${expected.length}`);
  for (const [id, src] of expectedAssets) {
    const stored = await readAsset(meta.id, id);
    if (!stored) problems.push(`asset ${id.slice(0, 12)} cannot be read back`);
    else if (sha(stored) !== sha(src)) problems.push(`asset ${id.slice(0, 12)} has different bytes`);
  }
  return { problems, imported };
}

const manifest: Sample[] = MANIFEST && existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : [];
const planOf = (s: Sample): Plan => JSON.parse(readFileSync(s.plan ?? join(SAMPLES, 'plans', `${s.name}.json`), 'utf8'));

describe.skipIf(manifest.length === 0)('spike: Wajha imports our samples without losing anything', () => {
  it('has the 12 samples of the matrix and the per-language sample', () => {
    if (!process.env.SPIKE_MANIFEST) {
      expect(manifest.length).toBe(13);
      expect(manifest.map((m) => m.name)).toContain('noor-both-per-language');
    }
  });

  for (const sample of manifest) {
    it(`imports ${sample.name}`, async () => {
      const { problems, imported } = await problemsAfterImport(new Uint8Array(readFileSync(sample.file)), planOf(sample));
      expect(problems).toEqual([]);
      expect(imported!.families).toEqual(sample.families.length === 2 ? ['iphone', 'android-phone'] : sample.families);
      expect(imported!.languages).toEqual(sample.languages.map(full));
    });
  }

  // The control. If this check could not fail, the tests above would prove nothing.
  it('control: the check reports a damaged image', async () => {
    const sample = manifest.find((s) => s.name === 'noor-both-en-ar');
    if (!sample) return; // a custom manifest may not hold it
    const files = unzipSync(new Uint8Array(readFileSync(sample.file)));
    const victim = Object.keys(files).find((n) => n.startsWith('assets/') && n.endsWith('.png'))!;
    const damaged = new Uint8Array(files[victim]);
    damaged[damaged.length - 20] ^= 0xff; // the bytes no longer match the hash in the name
    const zip = zipSync(Object.fromEntries(Object.entries({ ...files, [victim]: damaged }).map(([n, b]) => [n, [b, { level: 0 }]])));
    const { problems } = await problemsAfterImport(zip, planOf(sample));
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join('\n')).toMatch(/was lost|changed by import|cannot be read back/);
  });

  it('control: the check reports a shot that points to the wrong asset', async () => {
    const sample = manifest.find((s) => s.name === 'noor-iphone-en-ar');
    if (!sample) return;
    const plan = planOf(sample);
    const wrong = structuredClone(plan);
    // Same file we built, but the plan now claims slide 1 used a different image.
    wrong.slides[0].shots.iphone.main = plan.slides[1].shots.iphone.main;
    const { problems } = await problemsAfterImport(new Uint8Array(readFileSync(sample.file)), wrong);
    expect(problems.join('\n')).toMatch(/slide 1: shot iphone\.main\.en-US points to/);
  });
});
