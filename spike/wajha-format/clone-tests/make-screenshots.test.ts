/**
 * Makes the test screenshots for the format proof. It runs inside the Wajha
 * clone, because it needs Wajha's node canvas helper and its mock apps.
 *
 * These are not screenshots of a real app. They are Wajha's generated mock
 * apps, drawn at real phone sizes. We use them because the proof tests the
 * file format and the layout, not any one app.
 *
 *   node spike/wajha-format/run-in-clone.mjs make-screenshots   (writes to spike/wajha-format/screenshots/)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { FamilyId } from '../src/model/types';
import { paintMockScreen } from '../src/engine/mock';
import { registerPrimaryFonts, testCanvas } from '../src/engine/testing/canvas.node';

const OUT = process.env.SPIKE_DIR ? join(process.env.SPIKE_DIR, 'screenshots') : undefined;

registerPrimaryFonts();

interface Shot {
  name: string;
  width: number;
  height: number;
  family: FamilyId;
  seed: number;
  dark: boolean;
  palette: string[];
  format?: 'png' | 'jpeg' | 'webp';
}

// iPhone ratio is 2868 / 1320 = 2.173. Android phone ratio is 2400 / 1080 = 2.222.
// The unusual one is 4:3 (1.333): far from both phones, so the frame must crop it.
//
// Eight screenshots for each phone family. Six are enough for any template here, so that every screenshot slot of every slide gets an image of its own
// (the biggest template has 6 slots: 5 slides, one with two devices). If two slides shared an image, a mix-up
// between them could not be seen.
const PALETTES: [string, string, boolean][] = [
  ['#1f6feb', '#f5f7fb', false],
  ['#e5484d', '#fff5f5', false],
  ['#30a46c', '#0f1512', true],
  ['#f76b15', '#fff8f1', false],
  ['#8e4ec6', '#14101a', true],
  ['#12a594', '#f2fbf9', false],
];
// Slots 7 and 8 are the Arabic versions in the per-language sample.
const COUNT = 8;
const SHOTS: Shot[] = [
  ...Array.from({ length: COUNT }, (_, i): Shot => ({
    name: `iphone-${i + 1}`, width: 1320, height: 2868, family: 'iphone', seed: i, dark: PALETTES[i % 6][2], palette: [PALETTES[i % 6][0], PALETTES[i % 6][1]],
  })),
  ...Array.from({ length: COUNT }, (_, i): Shot => ({
    name: `android-${i + 1}`, width: 1080, height: 2400, family: 'android-phone', seed: i + 3, dark: PALETTES[(i + 3) % 6][2], palette: [PALETTES[(i + 3) % 6][0], PALETTES[(i + 3) % 6][1]],
    // android-3 is a JPEG, so the proof also covers a second image type.
    ...(i === 2 ? { format: 'jpeg' as const } : {}),
  })),
  { name: 'odd-4x3', width: 1080, height: 1440, family: 'iphone', seed: 6, dark: false, palette: ['#3e63dd', '#f6f8ff'] },
  // Shapes for task 5.4. Wajha takes a screenshot's own shape when it is within 20% of the frame's shape.
  // iPhone frame 2.173: 750 x 1334 is 1.779, 18% off, so the frame should take that shape and crop nothing.
  { name: 'near-750x1334', width: 750, height: 1334, family: 'iphone', seed: 7, dark: false, palette: ['#e5484d', '#fff5f5'] },
  // Android frame 2.222: 1080 x 2000 is 1.852, 17% off.
  { name: 'near-1080x2000', width: 1080, height: 2000, family: 'android-phone', seed: 8, dark: false, palette: ['#f76b15', '#fff8f1'] },
  // A phone screenshot taken sideways: the phone should turn on its side.
  { name: 'sideways-2868x1320', width: 2868, height: 1320, family: 'iphone', seed: 9, dark: false, palette: ['#30a46c', '#f2fbf5'] },
];

/**
 * A large label in the middle ("TEST IPHONE-1"), and TOP and BOTTOM tags at the edges.
 * Wajha shows a generated mock screen when a screenshot is missing, and these screenshots are mock
 * screens too. Without a label, a lost image would look like a good one in the PNG review.
 * The TOP and BOTTOM tags show when a screenshot of a wrong shape is cropped.
 */
function paintLabel(ctx: ReturnType<typeof testCanvas>['ctx'], width: number, height: number, name: string): void {
  const FONT = '"Inter Variable", sans-serif';
  const pill = (text: string, cy: number, size: number, fill: string) => {
    ctx.font = `800 ${size}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const w = Math.min(width * 0.94, ctx.measureText(text).width + size * 1.2);
    const h = size * 1.5;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(width / 2 - w / 2, cy - h / 2, w, h, h / 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, width / 2, cy + size * 0.04);
  };
  ctx.save();
  const side = Math.min(width, height);
  pill('TEST', height * 0.44, side * 0.17, '#d6001c');
  pill(name.toUpperCase(), height * 0.44 + side * 0.28, side * 0.17, '#111111');
  // Edge tags. The top one sits below the status bar, the bottom one above the home indicator.
  pill('TOP', height * 0.075, side * 0.06, '#d6001c');
  pill('BOTTOM', height * 0.945, side * 0.06, '#d6001c');
  ctx.restore();
}

describe.skipIf(!OUT)('spike: make screenshots', () => {
  for (const s of SHOTS) {
    const format = s.format ?? 'png';
    it(`draws ${s.name}`, () => {
      const { canvas, ctx } = testCanvas(s.width, s.height);
      paintMockScreen(ctx, s.width, s.height, { seed: s.seed, palette: s.palette, dark: s.dark, family: s.family, chrome: 'device' });
      paintLabel(ctx, s.width, s.height, s.name);
      const buf = format === 'jpeg' ? canvas.toBuffer('image/jpeg') : canvas.toBuffer('image/png');
      mkdirSync(OUT!, { recursive: true });
      const ext = format === 'jpeg' ? 'jpg' : 'png';
      writeFileSync(join(OUT!, `${s.name}-${s.width}x${s.height}.${ext}`), buf);
      expect(buf.byteLength).toBeGreaterThan(5000);
    });
  }
});
