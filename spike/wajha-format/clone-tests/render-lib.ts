/**
 * Draws the slides of a .wajha file as PNGs, for the by-eye review (task group 5). Runs inside the Wajha clone.
 *
 * Why not Wajha's own `renderProjectSlide`? It passes `getImage: () => null`, so every device shows a generated
 * mock screen and never our screenshots. A lost screenshot would look fine. This helper does what the app does:
 *   1. It imports the file with the real `importProjectArchive` and loads the project with `loadProject`.
 *   2. It reads every asset back and decodes it.
 *   3. It draws with `renderSlide`, with the same input the app builds (`mirror` for right-to-left, language typography).
 *   4. A device with no screenshot shows a plain grey screen ("empty"), not a mock, and it is counted as missing.
 * Fonts: one process can only draw one script faithfully, so the English and Arabic tests are separate files.
 */
import { loadImage } from '@napi-rs/canvas';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderSlide } from '../src/engine';
import { nodeEnv, testCanvas } from '../src/engine/testing/canvas.node';
import type { ImageLike } from '../src/engine/types';
import { FAMILIES, isRtl } from '../src/model/catalog';
import { mirrorsLayout } from '../src/model/mirror';
import { resolveLayout } from '../src/model/resolve';
import { languageTypography } from '../src/model/typography';
import type { FamilyId, LangCode, Project } from '../src/model/types';
import { createMemoryPlatform, setPlatform } from '../src/platform';
import { importProjectArchive, loadProject, readAsset } from '../src/storage';
import { contactSheet, type RenderedSlide } from '../src/templates/testing/render.node';

export interface Loaded {
  project: Project;
  images: Map<string, ImageLike>;
}

/** The real import, then every asset decoded. */
export async function importAndLoad(bytes: Uint8Array): Promise<Loaded> {
  setPlatform(createMemoryPlatform());
  const meta = await importProjectArchive(bytes);
  const project = await loadProject(meta.id);
  const images = new Map<string, ImageLike>();
  for (const assetId of Object.keys(project.assets)) {
    const data = await readAsset(meta.id, assetId);
    if (!data) throw new Error(`asset ${assetId} cannot be read back`);
    images.set(assetId, (await loadImage(Buffer.from(data))) as unknown as ImageLike);
  }
  return { project, images };
}

const aspectOf = (img: ImageLike | undefined) => (img && img.width > 0 ? img.height / img.width : null);

/** Slide `index` of the project for `family` and `lang`, drawn at `width` px. */
export function drawSlide({ project, images }: Loaded, index: number, family: FamilyId, lang: LangCode, width: number): RenderedSlide {
  const design = FAMILIES[family].design;
  const height = Math.round((width * design.height) / design.width);
  const { canvas, ctx } = testCanvas(width, height);
  const slide = project.slides[index];
  const result = renderSlide(ctx, {
    width,
    height,
    family,
    slide,
    layout: resolveLayout(project, slide, family),
    theme: project.theme,
    lang,
    baseLang: project.languages[0] ?? lang,
    rtl: isRtl(lang),
    mirror: mirrorsLayout(project, lang),
    typography: languageTypography(project, lang),
    slideIndex: index,
    slideCount: project.slides.length,
    getImage: (id) => images.get(id) ?? null,
    getAssetAspect: (id) => aspectOf(images.get(id)),
    placeholder: 'empty',
    env: nodeEnv,
  });
  return { canvas, ctx, result, width, height };
}

export interface Row {
  sample: string;
  family: FamilyId;
  lang: LangCode;
  slide: number;
  missingShots: string[];
  pendingImages: string[];
  /** Height / width of each device frame as drawn, in the order of the layout. */
  deviceShapes: number[];
}

/**
 * Draws every slide of every family of one sample, in one language, and writes one contact sheet for each family
 * (and the slides one by one when `single` is set). Returns a row for each slide.
 */
export async function reviewSample(name: string, bytes: Uint8Array, lang: LangCode, outDir: string, opts: { sheetWidth?: number; single?: number[] } = {}): Promise<Row[]> {
  const loaded = await importAndLoad(bytes);
  const rows: Row[] = [];
  const dir = join(outDir, name);
  mkdirSync(dir, { recursive: true });
  for (const family of loaded.project.families) {
    const cells: { image: RenderedSlide; label: string }[] = [];
    loaded.project.slides.forEach((_, i) => {
      const image = drawSlide(loaded, i, family, lang, opts.sheetWidth ?? 440);
      cells.push({ image, label: `${family} ${lang} slide ${i + 1}` });
      const deviceIds = new Set(resolveLayout(loaded.project, loaded.project.slides[i], family).elements.filter((e) => e.kind === 'device').map((e) => e.id));
      rows.push({
        sample: name,
        family,
        lang,
        slide: i + 1,
        missingShots: [...image.result.missingShots],
        pendingImages: [...image.result.pendingImages],
        deviceShapes: image.result.boxes.filter((b) => deviceIds.has(b.id)).map((b) => +(b.h / b.w).toFixed(3)),
      });
      if (opts.single?.includes(i + 1)) {
        const big = drawSlide(loaded, i, family, lang, 720);
        writeFileSync(join(dir, `${family}-${lang}-slide${i + 1}.png`), big.canvas.toBuffer('image/png'));
      }
    });
    const sheet = contactSheet(cells, cells.length, 16, 30);
    writeFileSync(join(dir, `${family}-${lang}-sheet.png`), sheet.toBuffer('image/png'));
  }
  return rows;
}
