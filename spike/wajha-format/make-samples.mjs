// Builds the sample .wajha files of the proof into out/samples/, through the same command line the skill will use.
//   node make-samples.mjs
// Matrix: 2 templates x 3 phone sets x 2 language orders = 12 files, plus 1 file where two slots have a different
// screenshot for each language. Also writes out/samples/manifest.json.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from './build_wajha.mjs';
import { perLanguagePlan, planFor } from './sample-plans.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out', 'samples');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'plans'), { recursive: true });

const TEMPLATES = ['noor', 'lagoon'];
const FAMILY_SETS = { iphone: ['iphone'], android: ['android-phone'], both: ['iphone', 'android-phone'] };
const LANGUAGE_SETS = { 'en-ar': ['en', 'ar'], 'ar-en': ['ar', 'en'] };

const manifest = [];
let failed = 0;
for (const templateId of TEMPLATES) {
  const templateFile = join(here, 'templates', `${templateId}.json`);
  const template = JSON.parse(readFileSync(templateFile, 'utf8'));
  for (const [familyName, families] of Object.entries(FAMILY_SETS)) {
    for (const [langName, languages] of Object.entries(LANGUAGE_SETS)) {
      const name = `${templateId}-${familyName}-${langName}`;
      const planFile = join(out, 'plans', `${name}.json`);
      writeFileSync(planFile, JSON.stringify(planFor(template, { families, languages, name: `Zad ${name}` }), null, 2));
      const file = join(out, `${name}.wajha`);
      const code = main(['--template', templateFile, '--input', planFile, '--out', file]);
      if (code !== 0) failed++;
      manifest.push({ name, file, templateId, families, languages, slides: template.slides.length });
    }
  }
}
// One more file: a different screenshot for each language in two slots, with both phone families.
{
  const name = 'noor-both-per-language';
  const templateFile = join(here, 'templates', 'noor.json');
  const template = JSON.parse(readFileSync(templateFile, 'utf8'));
  const planFile = join(out, 'plans', `${name}.json`);
  writeFileSync(planFile, JSON.stringify(perLanguagePlan(template, { name: `Zad ${name}` }), null, 2));
  const file = join(out, `${name}.wajha`);
  if (main(['--template', templateFile, '--input', planFile, '--out', file]) !== 0) failed++;
  manifest.push({ name, file, templateId: 'noor', families: ['iphone', 'android-phone'], languages: ['en', 'ar'], slides: template.slides.length });
}
writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(failed ? `${failed} sample(s) FAILED` : `Built ${manifest.length} samples in ${out}`);
process.exitCode = failed ? 1 : 0;
