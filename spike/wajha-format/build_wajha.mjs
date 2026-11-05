// Builds a .wajha project file from a template, screenshots and slide texts.
//
//   node build_wajha.mjs --template templates/noor.json --input plan.json --out out/app.wajha
//
// plan.json (paths are relative to the plan file):
//   {
//     "name": "Aqua",
//     "languages": ["en", "ar"],                 first one is the base language
//     "slides": [
//       {
//         "texts": { "en": { "headline": "...", "subtitle": "..." }, "ar": { ... } },
//         "shots": { "iphone": { "main": "a.png" }, "android-phone": { "main": "b.png" } }
//         A slot may also give one image for each language: "main": { "en": "a-en.png", "ar": "a-ar.png" }
//         The base language is required then. A language without its own image uses the base one.
//       }
//     ]
//   }
//
// It uses Wajha's own code (wajha-model.bundle.mjs) to make and check the project, and it
// writes the file only after every check has passed. It needs only Node. No Wajha clone.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as W from './wajha-model.bundle.mjs';

const here = dirname(fileURLToPath(import.meta.url));

/** Phone families this script supports. The first one listed is the primary family when both are used. */
export const SUPPORTED_FAMILIES = ['iphone', 'android-phone'];
/** Short language codes we accept, and what they mean in Wajha's language list. */
export const SHORT_LANGUAGES = { en: 'en-US', ar: 'ar-SA' };

/** One error that holds every problem found, so a person can fix them all in one go. */
export class BuildError extends Error {
  constructor(errors) {
    super(errors.join('\n'));
    this.name = 'BuildError';
    this.errors = errors;
  }
}

/* Node version ------------------------------------------------------- */

/**
 * The oldest Node we support. Tested: 20.20 and 22.14 work. Node 18 fails, because Wajha's `newId`
 * uses the global `crypto`, which Node has only from version 19.
 */
export const MIN_NODE_MAJOR = 20;

/** The message for a Node that is too old, or null when the version is fine. */
export function nodeVersionProblem(version = process.versions.node) {
  const major = Number.parseInt(String(version).split('.')[0], 10);
  if (Number.isInteger(major) && major >= MIN_NODE_MAJOR) return null;
  return `This script needs Node ${MIN_NODE_MAJOR} or newer. You have Node ${version}. Update Node from https://nodejs.org and run it again.`;
}

/* Languages ---------------------------------------------------------- */

export function mapLanguage(code) {
  if (typeof code === 'string') {
    if (Object.hasOwn(SHORT_LANGUAGES, code)) return SHORT_LANGUAGES[code];
    if (W.LANGUAGES.some((l) => l.code === code)) return code;
  }
  return null;
}

const languageHelp = `Use "en", "ar", or a full code from Wajha's list, such as "fr-FR".`;

/* Images ------------------------------------------------------------- */

/**
 * Checks an image by its content, not by its name. Returns what we need to add it,
 * or a message that starts with the file name.
 */
export function inspectImage(label, bytes) {
  const ext = W.sniffImageExt(bytes);
  if (!ext) return { error: `${label}: this is not a PNG, JPEG or WebP image. (We checked the file content, not the name.)` };
  const size = W.readImageSize(bytes, ext);
  if (!size) return { error: `${label}: the ${ext.toUpperCase()} header is damaged, so the size cannot be read.` };
  const limits = W.IMAGE_LIMITS;
  if (bytes.byteLength > limits.maxBytes) {
    return { error: `${label}: too large (${(bytes.byteLength / 1048576).toFixed(1)} MB). Wajha accepts at most ${limits.maxBytes / 1048576} MB per image.` };
  }
  if (!W.fitsImageLimits(size, limits)) {
    return { error: `${label}: too large (${size.width} x ${size.height} px). Wajha accepts at most ${limits.maxSide} px on a side and ${limits.maxPixels} px in total.` };
  }
  const hash = createHash('sha256').update(bytes).digest('hex');
  return { ext, width: size.width, height: size.height, assetId: `${hash}.${ext}` };
}

/* Comparing data ----------------------------------------------------- */

/** Every place where two JSON values differ. Key order does not count. */
export function diffData(a, b, path = '$', out = []) {
  if (Object.is(a, b)) return out;
  const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) diffData(a[i], b[i], `${path}[${i}]`, out);
  } else if (isObj(a) && isObj(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffData(a[k], b[k], `${path}.${k}`, out);
  } else {
    out.push({ path, before: a, after: b });
  }
  return out;
}

/** Does a path match an allowed pattern? "[*]" in a pattern stands for any array index. */
function pathMatches(pattern, path) {
  const re = new RegExp('^' + pattern.split('[*]').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\[\\d+\\]') + '$');
  return re.test(path);
}

const show = (v) => {
  const s = v === undefined ? 'undefined' : JSON.stringify(v);
  return s.length > 60 ? s.slice(0, 57) + '...' : s;
};

/* The build ---------------------------------------------------------- */

/**
 * @param {object} args
 * @param {object} args.template  parsed template.json
 * @param {object} args.plan      parsed plan
 * @param {string} args.baseDir   folder that the plan's image paths are relative to
 * @param {{path: string, reason: string}[]} [args.allowed]  differences the gate may ignore
 * @param {(json: unknown) => object} [args.validate]  Wajha's validator. Tests replace it; the real build never does.
 * @param {string} [args.nodeVersion]  The Node version to check. Tests replace it; the real build uses the running one.
 * @returns {{ zip: Uint8Array, project: object, families: string[], languages: string[], ignored: object[] }}
 */
export function buildWajha({ template: rawTemplate, plan, baseDir, allowed = [], validate = W.validateProject, nodeVersion = process.versions.node }) {
  const tooOld = nodeVersionProblem(nodeVersion);
  if (tooOld) throw new BuildError([tooOld]);
  const errors = [];

  let template;
  try {
    template = W.validateTemplate(rawTemplate);
  } catch (e) {
    throw new BuildError([`The template is not valid: ${e.message}`]);
  }

  if (!plan || typeof plan !== 'object') throw new BuildError(['The plan must be a JSON object.']);
  const name = typeof plan.name === 'string' ? plan.name.trim() : '';
  if (!name) errors.push('The plan needs a "name".');

  // Languages. The first one is the base language.
  const languages = [];
  const langInput = Array.isArray(plan.languages) && plan.languages.length ? plan.languages : ['en'];
  for (const code of langInput) {
    const mapped = mapLanguage(code);
    if (!mapped) errors.push(`Unknown language "${code}". ${languageHelp}`);
    else if (languages.includes(mapped)) errors.push(`Language "${code}" is listed twice.`);
    else languages.push(mapped);
  }
  const baseLang = languages[0];

  // Slides.
  const slidesIn = Array.isArray(plan.slides) ? plan.slides : [];
  const maxSlides = Math.min(10, template.slides.length);
  if (slidesIn.length < 1 || slidesIn.length > maxSlides) {
    errors.push(`The plan has ${slidesIn.length} slides. This template allows 1 to ${maxSlides}.`);
  }

  // Families: the ones used in the plan. iPhone comes first when both are used.
  const used = new Set();
  slidesIn.forEach((s, i) => {
    for (const family of Object.keys(s?.shots ?? {})) {
      if (!SUPPORTED_FAMILIES.includes(family)) {
        errors.push(`Slide ${i + 1}: unsupported device family "${family}". Supported: ${SUPPORTED_FAMILIES.join(', ')}.`);
      } else used.add(family);
    }
  });
  const families = SUPPORTED_FAMILIES.filter((f) => used.has(f));
  if (families.length === 0 && errors.length === 0) errors.push('The plan has no screenshots. Add "shots" to each slide.');

  // Per slide: texts and screenshots.
  const images = new Map(); // absolute path -> inspected image (or null after an error)
  const assets = new Map(); // assetId -> { bytes, info }
  const loadImage = (where, file) => {
    if (typeof file !== 'string' || !file) {
      errors.push(`${where}: the screenshot path must be a text.`);
      return null;
    }
    const abs = resolve(baseDir, file);
    if (images.has(abs)) return images.get(abs);
    let result = null;
    if (!existsSync(abs) || !statSync(abs).isFile()) {
      errors.push(`${file}: file not found (${where}).`);
    } else {
      const bytes = new Uint8Array(readFileSync(abs));
      const checked = inspectImage(file, bytes);
      if (checked.error) errors.push(checked.error);
      else {
        result = checked;
        assets.set(checked.assetId, {
          bytes,
          info: { id: checked.assetId, name: basename(file), width: checked.width, height: checked.height, bytes: bytes.byteLength },
        });
      }
    }
    images.set(abs, result);
    return result;
  };

  const built = []; // per slide: { texts, shots }
  slidesIn.slice(0, maxSlides).forEach((s, i) => {
    const n = i + 1;
    const ts = template.slides[i];
    const elements = ts.layouts.tall.elements;
    const slots = [...new Set(elements.filter((e) => e.kind === 'device').map((e) => e.slot))];
    const textKeys = [...new Set(elements.filter((e) => e.kind === 'text').map((e) => e.key))];

    // Texts: every language, every key the template draws, and nothing else.
    const texts = {};
    const textsIn = s?.texts && typeof s.texts === 'object' ? s.texts : {};
    const seen = new Set();
    for (const [code, copy] of Object.entries(textsIn)) {
      const lang = mapLanguage(code);
      if (!lang) errors.push(`Slide ${n}: unknown language "${code}" in texts. ${languageHelp}`);
      else if (!languages.includes(lang)) errors.push(`Slide ${n}: texts for "${code}", which is not in the plan's languages.`);
      else if (seen.has(lang)) errors.push(`Slide ${n}: texts for "${code}" appear twice.`);
      else {
        seen.add(lang);
        texts[lang] = {};
        for (const [key, value] of Object.entries(copy ?? {})) {
          if (typeof value !== 'string') errors.push(`Slide ${n}, ${code}, "${key}": the text must be a string.`);
          else if (!textKeys.includes(key)) errors.push(`Slide ${n}, ${code}: unknown text key "${key}". This slide uses: ${textKeys.join(', ')}.`);
          else texts[lang][key] = value;
        }
      }
    }
    for (const lang of languages) {
      if (!texts[lang]) errors.push(`Slide ${n}: no texts for "${lang}".`);
      else for (const key of textKeys) if (!(key in texts[lang]) || texts[lang][key].trim() === '') errors.push(`Slide ${n}: "${lang}" has no text for "${key}".`);
    }

    // Screenshots: every family, every slot.
    const shots = {};
    for (const family of families) {
      const bySlot = s?.shots?.[family];
      if (!bySlot) {
        errors.push(`Slide ${n}: no screenshots for "${family}". Every slide needs the same families.`);
        continue;
      }
      for (const slot of Object.keys(bySlot)) {
        if (!slots.includes(slot)) errors.push(`Slide ${n}, ${family}: this template has no screenshot slot "${slot}". It has: ${slots.join(', ')}.`);
      }
      for (const slot of slots) {
        if (!(slot in bySlot)) {
          errors.push(`Slide ${n}, ${family}: missing a screenshot for slot "${slot}".`);
          continue;
        }
        const value = bySlot[slot];
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          // One image for each language: { "en": "a.png", "ar": "b.png" }. The base language is required,
          // because every other language without its own image falls back to it.
          const where = `Slide ${n}, ${family}, ${slot}`;
          const byLang = {};
          for (const [code, file] of Object.entries(value)) {
            const lang = mapLanguage(code);
            if (!lang) errors.push(`${where}: unknown language "${code}" in the screenshots. ${languageHelp}`);
            else if (!languages.includes(lang)) errors.push(`${where}: a screenshot for "${code}", which is not in the plan's languages.`);
            else if (lang in byLang) errors.push(`${where}: a screenshot for "${code}" appears twice.`);
            else {
              const image = loadImage(`${where}, ${code}`, file);
              if (image) byLang[lang] = image.assetId;
            }
          }
          if (!Object.keys(value).some((code) => mapLanguage(code) === baseLang)) {
            errors.push(`${where}: needs a screenshot for the base language "${baseLang}". Other languages fall back to it.`);
          }
          if (Object.keys(byLang).length) (shots[family] ??= {})[slot] = byLang;
        } else {
          const image = loadImage(`slide ${n}, ${family}, ${slot}`, value);
          if (image) (shots[family] ??= {})[slot] = { [baseLang]: image.assetId };
        }
      }
    }
    built.push({ texts, shots });
  });

  if (errors.length) throw new BuildError(errors);

  // Make the project with Wajha's own code, then add what the plan gives.
  const project = W.projectFromTemplate(template, { name, families, languages });
  project.slides = project.slides.slice(0, built.length);
  const addedAt = Date.now();
  built.forEach((b, i) => {
    project.slides[i].texts = b.texts;
    project.slides[i].shots = b.shots;
  });
  for (const [assetId, { info }] of assets) project.assets[assetId] = { ...info, addedAt };

  // The gate: Wajha's validator must not change the project.
  const asData = JSON.parse(JSON.stringify(project));
  let validated;
  try {
    validated = JSON.parse(JSON.stringify(validate(asData)));
  } catch (e) {
    throw new BuildError([`Wajha's validator refused the project: ${e.message}`]);
  }
  const differences = diffData(asData, validated);
  const ignored = [];
  const blocking = [];
  for (const d of differences) {
    const rule = allowed.find((a) => pathMatches(a.path, d.path));
    (rule ? ignored : blocking).push(rule ? { ...d, reason: rule.reason } : d);
  }
  if (blocking.length) {
    throw new BuildError(blocking.map((d) => `Wajha's validator changed ${d.path}: ${show(d.before)} -> ${show(d.after)}`));
  }

  // Write the zip in memory. The caller saves it, so nothing is written before this point.
  const files = { 'project.json': [W.strToU8(JSON.stringify(project)), { level: 6 }] };
  for (const [assetId, { bytes }] of assets) files[`assets/${assetId}`] = [bytes, { level: 0 }];
  return { zip: W.zipSync(files), project, families, languages, ignored };
}

/* Command line ------------------------------------------------------- */

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) throw new BuildError([`Unexpected argument "${a}".`]);
    const value = argv[++i];
    if (value === undefined) throw new BuildError([`${a} needs a value.`]);
    args[a.slice(2)] = value;
  }
  return args;
}

function readJson(file, what) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    throw new BuildError([`Cannot read ${what} "${file}": ${e.message}`]);
  }
}

export function main(argv, nodeVersion = process.versions.node) {
  // First of all: on a Node that is too old the build would crash with an unclear error.
  const tooOld = nodeVersionProblem(nodeVersion);
  if (tooOld) {
    console.error(tooOld);
    return 1;
  }
  try {
    const args = parseArgs(argv);
    for (const key of ['template', 'input', 'out']) {
      if (!args[key]) throw new BuildError([`Missing --${key}. Usage: node build_wajha.mjs --template <file> --input <plan.json> --out <file.wajha>`]);
    }
    const allowedFile = args.allow ?? resolve(here, 'allowed-differences.json');
    const allowed = existsSync(allowedFile) ? readJson(allowedFile, 'the allowed differences') : [];
    const planPath = resolve(args.input);
    const result = buildWajha({
      template: readJson(resolve(args.template), 'the template'),
      plan: readJson(planPath, 'the plan'),
      baseDir: dirname(planPath),
      allowed,
    });
    const out = resolve(args.out);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, result.zip);
    console.log(`0 errors. Wrote ${out} (${(result.zip.byteLength / 1024).toFixed(0)} KB).`);
    console.log(`Slides: ${result.project.slides.length}. Families: ${result.families.join(', ')}. Languages: ${result.languages.join(', ')}.`);
    if (result.ignored.length) {
      console.log(`Allowed differences ignored: ${result.ignored.length}`);
      for (const d of result.ignored) console.log(`  ${d.path} (${d.reason})`);
    }
    return 0;
  } catch (e) {
    if (!(e instanceof BuildError)) throw e;
    console.error(`Build failed with ${e.errors.length} error${e.errors.length === 1 ? '' : 's'}. No file was written.`);
    for (const line of e.errors) console.error(`  - ${line}`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
