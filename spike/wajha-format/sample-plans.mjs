// Plans used by the tests and by make-samples.mjs. Not part of the final skill.
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const SHOTS = join(here, 'screenshots');
export const IPHONE = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `iphone-${n}-1320x2868.png`);
export const ANDROID = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `android-${n}-1080x2400.${n === 3 ? 'jpg' : 'png'}`);
export const shotPath = (file) => join(SHOTS, file);

/**
 * Test copy for a made-up budget app. Every slide has its own headline and subtitle, so that a mix-up
 * between slides can be seen. The Arabic is for layout tests, and no native speaker has checked it.
 * Wajha's text markup: *word* is a highlight.
 */
export const SLIDE_COPY = [
  { en: { headline: 'Know where your *money* goes', subtitle: 'Every riyal sorted, without effort.' }, ar: { headline: 'اعرف أين يذهب *مالك*', subtitle: 'كل ريال مصنّف بدون أي جهد.' } },
  { en: { headline: 'Set a *budget* in seconds', subtitle: 'Pick a limit. We keep watch.' }, ar: { headline: 'حدّد *ميزانيتك* في ثوانٍ', subtitle: 'اختر الحد، ونحن نراقب عنك.' } },
  { en: { headline: 'Plan *together*', subtitle: 'Share goals with family and see the whole picture.' }, ar: { headline: 'خططوا *معًا*', subtitle: 'شارك أهدافك مع العائلة وشاهد الصورة كاملة.' } },
  { en: { headline: 'Alerts that *help*', subtitle: 'A calm nudge before you overspend.' }, ar: { headline: 'تنبيهات *مفيدة*', subtitle: 'تذكير هادئ قبل أن تتجاوز الحد.' } },
  { en: { headline: 'Your month, *at a glance*', subtitle: 'Clear charts. No spreadsheets.' }, ar: { headline: 'شهرك *بنظرة واحدة*', subtitle: 'رسوم واضحة، بلا جداول.' } },
];

/**
 * A plan for a template: every slide, every slot, every family.
 * Each screenshot slot gets the next image of its family, so no two slots share an image
 * (a template has at most 6 slots here). `copy` is a list with one entry per slide.
 */
export function planFor(tpl, { families = ['iphone', 'android-phone'], languages = ['en', 'ar'], name = 'Zad', copy = SLIDE_COPY } = {}) {
  const images = { iphone: IPHONE, 'android-phone': ANDROID };
  const next = { iphone: 0, 'android-phone': 0 };
  return {
    name,
    languages,
    slides: tpl.slides.map((s, i) => {
      const slots = [...new Set(s.layouts.tall.elements.filter((e) => e.kind === 'device').map((e) => e.slot))];
      const shots = {};
      for (const family of families) {
        shots[family] = Object.fromEntries(slots.map((slot) => [slot, shotPath(images[family][next[family]++])]));
      }
      return { texts: Object.fromEntries(languages.map((l) => [l, { ...copy[i % copy.length][l] }])), shots };
    }),
  };
}

/**
 * Like planFor, but two slots have a different screenshot for each language:
 * slide 1 `main` and the second device of slide 3 (`second`, or `main` when the slide has only one device).
 * The first language is the base. It keeps the image planFor gave it, and every other language gets
 * one of the spare images (the 7th and 8th of each family). All other slots keep one image for all languages.
 */
export function perLanguagePlan(tpl, options = {}) {
  const plan = planFor(tpl, options);
  const images = { iphone: IPHONE, 'android-phone': ANDROID };
  const [base, ...others] = plan.languages;
  const changes = [[0, 'main', 6], [2, tpl.slides[2].layouts.tall.elements.some((e) => e.kind === 'device' && e.slot === 'second') ? 'second' : 'main', 7]];
  for (const [slideIndex, slot, spare] of changes) {
    for (const [family, bySlot] of Object.entries(plan.slides[slideIndex].shots)) {
      const own = { [base]: bySlot[slot] };
      for (const code of others) own[code] = shotPath(images[family][spare]);
      bySlot[slot] = own;
    }
  }
  return plan;
}
