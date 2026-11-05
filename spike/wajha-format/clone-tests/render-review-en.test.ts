/**
 * Draws the review samples in English (en-US) as PNGs, for the by-eye review (tasks 5.1, 5.3, 5.4).
 * Arabic is in render-review-ar.test.ts, because one process can only draw one script faithfully.
 *
 *   node spike/wajha-format/make-samples.mjs
 *   node spike/wajha-format/make-review-samples.mjs
 *   node spike/wajha-format/run-in-clone.mjs render-review-en
 *
 * Output: spike/wajha-format/out/png/<sample>/<family>-en-US-sheet.png, and out/png/report-en-US.json
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { registerFonts } from '../src/templates/testing/render.node';
import { reviewSample, type Row } from './spike-render-lib';

const LANG = 'en-US';
const DIR = process.env.SPIKE_DIR;
const MANIFEST = DIR ? join(DIR, 'out', 'review', 'manifest.json') : '';
const entries: { name: string; file: string; langs: string[]; single?: number[] }[] = MANIFEST && existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : [];

registerFonts('latin');

describe.skipIf(entries.length === 0)(`spike: draw the review samples in ${LANG}`, () => {
  const all: Row[] = [];
  for (const entry of entries.filter((e) => e.langs.includes(LANG))) {
    it(`draws ${entry.name}`, async () => {
      const out = join(DIR!, 'out', 'png');
      mkdirSync(out, { recursive: true });
      const rows = await reviewSample(entry.name, new Uint8Array(readFileSync(entry.file)), LANG, out, { single: entry.single });
      all.push(...rows);
      writeFileSync(join(out, `report-${LANG}.json`), JSON.stringify(all, null, 1));
      // Every device must show one of our screenshots. A missing one would show a plain grey screen.
      expect(rows.flatMap((r) => r.missingShots)).toEqual([]);
      expect(rows.flatMap((r) => r.pendingImages)).toEqual([]);
    });
  }
});
