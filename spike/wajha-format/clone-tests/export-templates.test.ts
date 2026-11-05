/**
 * Writes the two templates of the proof as plain JSON, into spike/wajha-format/templates/:
 *
 *   noor.json    a built-in template. Built-ins are TypeScript, so this shows we can turn one into JSON.
 *   lagoon.json  a gallery template. It is plain JSON already, so it is copied.
 *
 * It also records, for each template, whether Wajha's validateTemplate changes it. The result goes to
 * templates/_report.json and the findings file.
 *
 *   node spike/wajha-format/run-in-clone.mjs export-templates
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateTemplate } from '../src/model/validate';
import { builtinTemplate } from '../src/templates';

const DIR = process.env.SPIKE_DIR;
const GALLERY = join(import.meta.dirname, '..', 'gallery', 'templates');

/** Paths where two JSON values differ. Key order does not count. */
function diff(a: unknown, b: unknown, path = '$', out: string[] = []): string[] {
  if (Object.is(a, b)) return out;
  if (Array.isArray(a) && Array.isArray(b)) {
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) diff(a[i], b[i], `${path}[${i}]`, out);
  } else if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) diff((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`, out);
  } else out.push(path);
  return out;
}

describe.skipIf(!DIR)('spike: export templates', () => {
  it('writes noor.json (built-in) and lagoon.json (gallery)', () => {
    const out = join(DIR!, 'templates');
    mkdirSync(out, { recursive: true });
    const noor = builtinTemplate('noor');
    expect(noor, 'built-in template noor').toBeDefined();
    // Through JSON and back, so the file holds exactly what a JSON reader sees (no undefined keys).
    const noorJson = JSON.parse(JSON.stringify(noor));
    const lagoonJson = JSON.parse(readFileSync(join(GALLERY, 'lagoon', 'template.json'), 'utf8'));

    const report: Record<string, unknown> = {};
    for (const [id, json] of [['noor', noorJson], ['lagoon', lagoonJson]] as const) {
      writeFileSync(join(out, `${id}.json`), JSON.stringify(json, null, 2) + '\n');
      const validated = JSON.parse(JSON.stringify(validateTemplate(json)));
      const changes = diff(json, validated);
      report[id] = {
        id: json.id,
        format: json.format,
        version: json.version,
        slides: json.slides.length,
        assets: Object.keys(json.assets ?? {}).length,
        layoutKeys: [...new Set(json.slides.flatMap((s: { layouts?: object }) => Object.keys(s.layouts ?? {})))],
        languages: [...new Set(json.slides.flatMap((s: { texts?: object }) => Object.keys(s.texts ?? {})))],
        validateTemplateChanges: changes.length,
        firstChanges: changes.slice(0, 10),
      };
    }
    writeFileSync(join(out, '_report.json'), JSON.stringify(report, null, 2) + '\n');
  });
});
