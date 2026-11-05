/**
 * Draws the review samples in Arabic (ar-SA) as PNGs, for the by-eye review (tasks 5.2, 5.3).
 * English is in render-review-en.test.ts. This is a separate file because Wajha's font setup for one process
 * favours one script: here the Arabic subsets of the fonts are registered first, like a browser would pick them.
 *
 *   node spike/wajha-format/run-in-clone.mjs render-review-ar
 *
 * Output: spike/wajha-format/out/png/<sample>/<family>-ar-SA-sheet.png, and out/png/report-ar-SA.json
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { registerFonts } from '../src/templates/testing/render.node';
import { reviewSample, type Row } from './spike-render-lib';

const LANG = 'ar-SA';
const DIR = process.env.SPIKE_DIR;
const MANIFEST = DIR ? join(DIR, 'out', 'review', 'manifest.json') : '';
const entries: { name: string; file: string; langs: string[]; single?: number[] }[] = MANIFEST && existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : [];

registerFonts('arabic');

describe.skipIf(entries.length === 0)(`spike: draw the review samples in ${LANG}`, () => {
  const all: Row[] = [];
  for (const entry of entries.filter((e) => e.langs.includes(LANG))) {
    it(`draws ${entry.name}`, async () => {
      const out = join(DIR!, 'out', 'png');
      mkdirSync(out, { recursive: true });
      const rows = await reviewSample(entry.name, new Uint8Array(readFileSync(entry.file)), LANG, out, { single: entry.single });
      all.push(...rows);
      writeFileSync(join(out, `report-${LANG}.json`), JSON.stringify(all, null, 1));
      expect(rows.flatMap((r) => r.missingShots)).toEqual([]);
      expect(rows.flatMap((r) => r.pendingImages)).toEqual([]);
    });
  }
});
