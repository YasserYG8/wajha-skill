// Builds the two extra samples for the by-eye review, and the list of files to draw (out/review/manifest.json).
//   node make-samples.mjs          (first: it builds the 13 samples that this list also uses)
//   node make-review-samples.mjs
//
//   long-headline  noor, both phones, en and ar. Slide 1 to 5 have headlines of about 24, 40, 60, 90 and 140 characters.
//                  Task 5.3: how long can a headline be and still look good?
//   odd-shape      noor, both phones, en and ar. Screenshots of other shapes than the frame's own (task 5.4):
//                  slide 1 is 4:3 (far off), slide 2 is within 20% of the frame, slide 3 is a sideways phone shot.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from './build_wajha.mjs';
import { planFor, shotPath } from './sample-plans.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const samples = join(here, 'out', 'samples');
const out = join(here, 'out', 'review');
mkdirSync(join(out, 'plans'), { recursive: true });

const noorFile = join(here, 'templates', 'noor.json');
const noor = JSON.parse(readFileSync(noorFile, 'utf8'));

// Words to make headlines of any length. They only need to look like real text. No native speaker has checked the Arabic.
const EN = 'Know where every single riyal goes each day with clear simple reports and gentle reminders that help you save more without any effort or stress'.split(' ');
const AR = 'اعرف أين يذهب كل ريال تنفقه في يومك مع تقارير واضحة وبسيطة وتذكيرات لطيفة تساعدك على الادخار أكثر بدون أي جهد أو توتر'.split(' ');

/** The first words of `words` that reach `target` characters, with the third word highlighted. */
function headline(words, target) {
  const picked = [];
  let length = 0;
  for (let i = 0; length < target; i++) {
    const w = words[i % words.length];
    picked.push(w);
    length += w.length + 1;
  }
  if (picked.length > 2) picked[2] = `*${picked[2]}*`;
  return picked.join(' ');
}

const build = (name, plan, templateFile = noorFile) => {
  const planFile = join(out, 'plans', `${name}.json`);
  writeFileSync(planFile, JSON.stringify(plan, null, 2));
  const file = join(out, `${name}.wajha`);
  const code = main(['--template', templateFile, '--input', planFile, '--out', file]);
  if (code !== 0) process.exit(code);
  return file;
};

// Long headlines.
const longPlan = planFor(noor, { name: 'Zad long headline' });
const targets = [24, 40, 60, 90, 140];
const lengths = [];
longPlan.slides.forEach((slide, i) => {
  slide.texts.en.headline = headline(EN, targets[i]);
  slide.texts.ar.headline = headline(AR, targets[i]);
  lengths.push({ slide: i + 1, en: slide.texts.en.headline.length, ar: slide.texts.ar.headline.length });
});
const longFile = build('long-headline', longPlan);
console.log('headline lengths (with the two * marks):', JSON.stringify(lengths));

// Long headlines on one layout. In the first sample above, slide 4 puts its text at the bottom and the others at the top,
// so the lengths are not compared fairly. Here the layout of slide 1 (text at the top) is repeated 6 times.
const sameLayout = { ...noor, id: 'noor-slide1-x6', slides: Array.from({ length: 6 }, () => noor.slides[0]) };
const sameLayoutFile = join(out, 'noor-slide1-x6.json');
writeFileSync(sameLayoutFile, JSON.stringify(sameLayout, null, 2));
const samePlan = planFor(sameLayout, { name: 'Zad long headline top' });
const sameTargets = [24, 44, 64, 84, 104, 124];
const sameLengths = [];
samePlan.slides.forEach((slide, i) => {
  slide.texts.en.headline = headline(EN, sameTargets[i]);
  slide.texts.ar.headline = headline(AR, sameTargets[i]);
  sameLengths.push({ slide: i + 1, en: slide.texts.en.headline.length, ar: slide.texts.ar.headline.length });
});
const sameFile = build('long-headline-top', samePlan, sameLayoutFile);
console.log('same-layout headline lengths:', JSON.stringify(sameLengths));

// Odd screenshot shapes.
const oddPlan = planFor(noor, { name: 'Zad odd shape' });
const set = (slide, family, slot, file) => {
  oddPlan.slides[slide].shots[family][slot] = shotPath(file);
};
set(0, 'iphone', 'main', 'odd-4x3-1080x1440.png');
set(0, 'android-phone', 'main', 'odd-4x3-1080x1440.png');
set(1, 'iphone', 'main', 'near-750x1334-750x1334.png');
set(1, 'android-phone', 'main', 'near-1080x2000-1080x2000.png');
set(2, 'iphone', 'main', 'sideways-2868x1320-2868x1320.png');
set(2, 'android-phone', 'main', 'sideways-2868x1320-2868x1320.png');
const oddFile = build('odd-shape', oddPlan);

const both = ['en-US', 'ar-SA'];
const manifest = [
  { name: 'noor-both-en-ar', file: join(samples, 'noor-both-en-ar.wajha'), langs: both, single: [1, 3] },
  { name: 'lagoon-both-en-ar', file: join(samples, 'lagoon-both-en-ar.wajha'), langs: both, single: [1] },
  { name: 'noor-both-ar-en', file: join(samples, 'noor-both-ar-en.wajha'), langs: both, single: [1] },
  { name: 'noor-both-per-language', file: join(samples, 'noor-both-per-language.wajha'), langs: both, single: [1, 3] },
  { name: 'long-headline', file: longFile, langs: both, single: [4, 5] },
  { name: 'long-headline-top', file: sameFile, langs: both, single: [3, 4, 5, 6] },
  { name: 'odd-shape', file: oddFile, langs: both, single: [1, 2, 3] },
];
writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Wrote ${manifest.length} entries to ${join(out, 'manifest.json')}`);
