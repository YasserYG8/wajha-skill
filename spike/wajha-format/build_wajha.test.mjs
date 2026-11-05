// Tests for build_wajha.mjs. They need only Node:  node --test spike/wajha-format/
// Each scenario here comes from openspec/specs/wajha-project-build/spec.md.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { BuildError, MIN_NODE_MAJOR, buildWajha, inspectImage, main, nodeVersionProblem } from './build_wajha.mjs';
import { ANDROID, IPHONE, SLIDE_COPY, perLanguagePlan, planFor, shotPath } from './sample-plans.mjs';
import * as W from './wajha-model.bundle.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const TMP = join(here, 'out', 'test-tmp');
const template = (id) => JSON.parse(readFileSync(join(here, 'templates', `${id}.json`), 'utf8'));
const build = (plan, extra = {}, tplId = 'noor') => buildWajha({ template: template(tplId), plan, baseDir: here, ...extra });
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

function errorsOf(fn) {
  try {
    fn();
  } catch (e) {
    assert.ok(e instanceof BuildError, `expected a BuildError, got ${e}`);
    return e.errors;
  }
  assert.fail('expected the build to fail');
}

before(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
});

describe('Build a project file from a template', () => {
  it('writes project.json and one asset for each image used', () => {
    const { zip, project } = build(planFor(template('noor')));
    const files = W.unzipSync(zip);
    assert.ok(files['project.json']);
    const ids = Object.keys(project.assets);
    assert.equal(ids.length, 12); // 6 iPhone + 6 Android: every screenshot slot has an image of its own
    assert.deepEqual(Object.keys(files).filter((n) => n.startsWith('assets/')).sort(), ids.map((id) => `assets/${id}`).sort());
    assert.deepEqual(JSON.parse(W.strFromU8(files['project.json'])), JSON.parse(JSON.stringify(project)));
  });

  it('names each asset by the SHA-256 of its bytes and its real image type', () => {
    const { zip } = build(planFor(template('noor')));
    const files = W.unzipSync(zip);
    const names = Object.keys(files).filter((n) => n.startsWith('assets/'));
    for (const n of names) {
      const id = n.slice('assets/'.length);
      assert.equal(id.slice(0, 64), sha(files[n]), `${id} hash`);
    }
    assert.ok(names.some((n) => n.endsWith('.jpg')), 'the JPEG screenshot keeps the jpg type');
    assert.ok(names.some((n) => n.endsWith('.png')));
  });

  it('gives every slide its own headline and every screenshot slot its own image', () => {
    const { project } = build(planFor(template('noor')));
    const headlines = project.slides.map((s) => s.texts['en-US'].headline);
    assert.equal(new Set(headlines).size, headlines.length);
    for (const family of ['iphone', 'android-phone']) {
      const ids = project.slides.flatMap((s) => Object.values(s.shots[family]).map((byLang) => byLang['en-US']));
      assert.equal(ids.length, 6); // 5 slides, one of them with two devices
      assert.equal(new Set(ids).size, ids.length, `${family}: no image is used twice`);
    }
  });

  it('works with the gallery template too', () => {
    const { project } = build(planFor(template('lagoon')), {}, 'lagoon');
    assert.equal(project.slides.length, 4);
    assert.equal(project.templateId, 'lagoon');
  });

  it('keeps only the slides the plan asks for', () => {
    const tpl = template('noor');
    const plan = planFor(tpl);
    plan.slides = plan.slides.slice(0, 3);
    assert.equal(build(plan).project.slides.length, 3);
  });
});

describe('Screenshots are checked before the build', () => {
  const planWith = (file) => {
    const plan = planFor(template('noor'), { families: ['iphone'] });
    plan.slides[0].shots.iphone.main = file;
    return plan;
  };

  it('refuses a text file named shot.png, and names it', () => {
    const fake = join(TMP, 'shot.png');
    writeFileSync(fake, 'this is not an image, it only has the right name');
    const errors = errorsOf(() => build(planWith(fake)));
    assert.equal(errors.length, 1);
    assert.match(errors[0], /shot\.png/);
    assert.match(errors[0], /not a PNG, JPEG or WebP/);
  });

  it('refuses an image over the pixel limits, and names it', () => {
    // A real PNG header that declares 20000 x 20000. The limit is 16384 on a side.
    const png = Buffer.alloc(64);
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(png, 0);
    png.writeUInt32BE(13, 8);
    png.write('IHDR', 12, 'ascii');
    png.writeUInt32BE(20000, 16);
    png.writeUInt32BE(20000, 20);
    const big = join(TMP, 'huge.png');
    writeFileSync(big, png);
    const errors = errorsOf(() => build(planWith(big)));
    assert.equal(errors.length, 1);
    assert.match(errors[0], /huge\.png/);
    assert.match(errors[0], /too large \(20000 x 20000 px\)/);
  });

  it('refuses an image over the byte limit', () => {
    const png = Buffer.alloc(W.IMAGE_LIMITS.maxBytes + 1);
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(png, 0);
    png.writeUInt32BE(13, 8);
    png.write('IHDR', 12, 'ascii');
    png.writeUInt32BE(1000, 16);
    png.writeUInt32BE(1000, 20);
    const result = inspectImage('big-bytes.png', png);
    assert.match(result.error, /^big-bytes\.png: too large \(100\.0 MB\)/);
  });

  it('refuses a missing file, and names it', () => {
    const errors = errorsOf(() => build(planWith(join(TMP, 'nope.png'))));
    assert.match(errors[0], /nope\.png: file not found/);
  });

  it('reads the type from the content, not the name', () => {
    // A real PNG called .jpg is still stored as png.
    const copy = join(TMP, 'really-a-png.jpg');
    writeFileSync(copy, readFileSync(shotPath(IPHONE[0])));
    const { project } = build(planWith(copy));
    const id = project.slides[0].shots.iphone.main['en-US'];
    assert.ok(id.endsWith('.png'), id);
  });
});

describe('Phone families are supported', () => {
  it('builds iPhone only', () => {
    const { project } = build(planFor(template('noor'), { families: ['iphone'] }));
    assert.deepEqual(project.families, ['iphone']);
    for (const s of project.slides) {
      assert.ok(s.layouts.iphone, 'has an iPhone layout');
      assert.deepEqual(Object.keys(s.shots), ['iphone']);
    }
  });

  it('builds Android phone only', () => {
    const { project } = build(planFor(template('noor'), { families: ['android-phone'] }));
    assert.deepEqual(project.families, ['android-phone']);
    for (const s of project.slides) {
      assert.ok(s.layouts['android-phone'], 'has an Android layout');
      assert.deepEqual(Object.keys(s.shots), ['android-phone']);
    }
  });

  it('puts iphone first when both are used, and keeps each family`s screenshots under it', () => {
    const plan = planFor(template('noor'), { families: ['android-phone', 'iphone'] }); // listed Android first on purpose
    const { project } = build(plan);
    assert.deepEqual(project.families, ['iphone', 'android-phone']);
    for (const s of project.slides) {
      assert.deepEqual(Object.keys(s.shots).sort(), ['android-phone', 'iphone']);
      assert.ok(s.layouts.iphone);
    }
    const ext = (id) => id.split('.')[1];
    const androidTypes = new Set(project.slides.flatMap((s) => Object.values(s.shots['android-phone']).map((byLang) => ext(byLang['en-US']))));
    assert.deepEqual([...androidTypes].sort(), ['jpg', 'png']);
    assert.equal(Object.keys(project.assets).length, 12);
  });

  it('refuses ipad, with a clear message', () => {
    const plan = planFor(template('noor'), { families: ['iphone'] });
    plan.slides[0].shots.ipad = { main: shotPath(IPHONE[0]) };
    const errors = errorsOf(() => build(plan));
    assert.match(errors[0], /unsupported device family "ipad"/);
    assert.match(errors[0], /Supported: iphone, android-phone/);
  });

  it('refuses a slide that lacks a family the others have', () => {
    const plan = planFor(template('noor'));
    delete plan.slides[1].shots['android-phone'];
    assert.match(errorsOf(() => build(plan)).join('\n'), /Slide 2: no screenshots for "android-phone"/);
  });

  it('refuses a missing or unknown screenshot slot', () => {
    const plan = planFor(template('noor'), { families: ['iphone'] });
    delete plan.slides[2].shots.iphone.second;
    plan.slides[0].shots.iphone.third = shotPath(IPHONE[0]);
    const text = errorsOf(() => build(plan)).join('\n');
    assert.match(text, /Slide 3, iphone: missing a screenshot for slot "second"/);
    assert.match(text, /Slide 1, iphone: this template has no screenshot slot "third"/);
  });
});

describe('Language codes are mapped', () => {
  it('maps en,ar to en-US and ar-SA, and the first is the base language', () => {
    const { project } = build(planFor(template('noor'), { languages: ['en', 'ar'] }));
    assert.deepEqual(project.languages, ['en-US', 'ar-SA']);
    const s = project.slides[0];
    assert.ok(s.texts['en-US'].headline.includes('money'));
    assert.ok(s.texts['ar-SA'].headline.includes('مالك'));
    assert.ok(project.slides[1].texts['en-US'].headline.includes('budget'), 'slide 2 has its own headline');
    // Screenshots are stored for the base language. Other languages fall back to them.
    assert.deepEqual(Object.keys(s.shots.iphone.main), ['en-US']);
  });

  it('uses the first language as the base, even when it is Arabic', () => {
    const { project } = build(planFor(template('noor'), { languages: ['ar', 'en'] }));
    assert.deepEqual(project.languages, ['ar-SA', 'en-US']);
    assert.deepEqual(Object.keys(project.slides[0].shots.iphone.main), ['ar-SA']);
  });

  it('accepts a full code from Wajha`s list', () => {
    const copy = SLIDE_COPY.map((c) => ({ ...c, 'fr-FR': { headline: 'Sachez où va votre *argent*', subtitle: 'Chaque dépense classée.' } }));
    const { project } = build(planFor(template('noor'), { languages: ['en', 'fr-FR'], copy }));
    assert.deepEqual(project.languages, ['en-US', 'fr-FR']);
  });

  it('refuses an unknown code, with a clear message', () => {
    const plan = planFor(template('noor'), { languages: ['en'] });
    plan.languages = ['en', 'xx'];
    const errors = errorsOf(() => build(plan));
    assert.match(errors[0], /Unknown language "xx"/);
    assert.match(errors[0], /Use "en", "ar"/);
  });

  it('refuses texts that are missing for a language or a key', () => {
    const plan = planFor(template('noor'));
    delete plan.slides[0].texts.ar;
    delete plan.slides[1].texts.en.subtitle;
    plan.slides[2].texts.en.heading = 'typo';
    const text = errorsOf(() => build(plan)).join('\n');
    assert.match(text, /Slide 1: no texts for "ar-SA"/);
    assert.match(text, /Slide 2: "en-US" has no text for "subtitle"/);
    assert.match(text, /Slide 3, en: unknown text key "heading"/);
  });
});

describe('A screenshot can differ for each language', () => {
  const noor = () => template('noor');

  it('stores one asset for each language where the plan gives one', () => {
    const { project } = build(perLanguagePlan(noor()));
    const first = project.slides[0].shots.iphone.main;
    assert.deepEqual(Object.keys(first).sort(), ['ar-SA', 'en-US']);
    assert.notEqual(first['en-US'], first['ar-SA']);
    // A slot given as one file is stored for the base language only, and the other language falls back to it.
    assert.deepEqual(Object.keys(project.slides[1].shots.iphone.main), ['en-US']);
    // The same holds for each family.
    assert.deepEqual(Object.keys(project.slides[0].shots['android-phone'].main).sort(), ['ar-SA', 'en-US']);
  });

  it('refuses a per-language slot without the base language', () => {
    const plan = planFor(noor(), { families: ['iphone'] });
    plan.slides[0].shots.iphone.main = { ar: shotPath(IPHONE[0]) }; // the base language is en
    assert.match(errorsOf(() => build(plan)).join('\n'), /Slide 1, iphone, main: needs a screenshot for the base language "en-US"/);
  });

  it('refuses an unknown language, and a language that is not in the plan', () => {
    const plan = planFor(noor(), { families: ['iphone'], languages: ['en'] });
    plan.slides[0].shots.iphone.main = { en: shotPath(IPHONE[0]), xx: shotPath(IPHONE[1]), ar: shotPath(IPHONE[2]) };
    const text = errorsOf(() => build(plan)).join('\n');
    assert.match(text, /unknown language "xx" in the screenshots/);
    assert.match(text, /a screenshot for "ar", which is not in the plan's languages/);
  });

  it('checks each language`s image too, and names the file', () => {
    const fake = join(TMP, 'ar-shot.png');
    writeFileSync(fake, 'not an image');
    const plan = perLanguagePlan(noor(), { families: ['iphone'] });
    plan.slides[0].shots.iphone.main.ar = fake;
    const errors = errorsOf(() => build(plan));
    assert.equal(errors.length, 1);
    assert.match(errors[0], /ar-shot\.png/);
  });
});

describe('Project data survives validation unchanged', () => {
  const longPlan = () => {
    const plan = planFor(template('noor'), { families: ['iphone'], languages: ['en'] });
    plan.slides[0].texts.en.headline = 'x'.repeat(2500); // Wajha cuts text at 2000 characters
    return plan;
  };

  it('passes a clean project with no differences', () => {
    const { ignored } = build(planFor(template('noor')));
    assert.equal(ignored.length, 0);
  });

  it('fails when the real validator changes a value, and names the path', () => {
    const errors = errorsOf(() => build(longPlan()));
    assert.equal(errors.length, 1);
    assert.match(errors[0], /Wajha's validator changed \$\.slides\[0\]\.texts\.en-US\.headline/);
  });

  it('writes no .wajha file when the gate fails', () => {
    const planFile = join(TMP, 'long-plan.json');
    const out = join(TMP, 'gate-fail', 'long.wajha');
    writeFileSync(planFile, JSON.stringify(longPlan()));
    const quiet = console.error;
    console.error = () => {};
    let code;
    try {
      code = main(['--template', join(here, 'templates', 'noor.json'), '--input', planFile, '--out', out]);
    } finally {
      console.error = quiet;
    }
    assert.equal(code, 1);
    assert.equal(existsSync(out), false);
    assert.equal(existsSync(dirname(out)), false, 'not even the folder is made');
  });

  it('fails when the validator drops a value', () => {
    const dropping = (json) => {
      const v = structuredClone(json);
      delete v.slides[0].shots;
      return v;
    };
    const errors = errorsOf(() => build(planFor(template('noor')), { validate: dropping }));
    assert.match(errors[0], /Wajha's validator changed \$\.slides\[0\]\.shots/);
  });

  it('fails when the validator throws, and shows the error', () => {
    const throwing = () => {
      throw new Error('name: must be text');
    };
    const errors = errorsOf(() => build(planFor(template('noor')), { validate: throwing }));
    assert.deepEqual(errors, ["Wajha's validator refused the project: name: must be text"]);
  });

  it('ignores a difference that is on the allowed list, and reports it with its reason', () => {
    const allowed = [{ path: '$.slides[*].texts.en-US.headline', reason: 'test: cut at 2000 characters' }];
    const { ignored, zip } = build(longPlan(), { allowed });
    assert.equal(ignored.length, 1);
    assert.equal(ignored[0].path, '$.slides[0].texts.en-US.headline');
    assert.equal(ignored[0].reason, 'test: cut at 2000 characters');
    assert.ok(zip.byteLength > 0);
  });

  it('does not let an allowed path hide a different path', () => {
    const allowed = [{ path: '$.slides[*].texts.en-US.subtitle', reason: 'wrong path' }];
    assert.equal(errorsOf(() => build(longPlan(), { allowed })).length, 1);
  });
});

describe('Old Node versions are refused with a clear message', () => {
  it('needs Node 20 or newer', () => {
    assert.equal(MIN_NODE_MAJOR, 20);
    for (const ok of ['20.0.0', '20.20.2', '22.14.0', '24.1.0']) assert.equal(nodeVersionProblem(ok), null, ok);
    for (const old of ['18.20.8', '19.9.0', '16.20.2', '14.0.0']) assert.match(nodeVersionProblem(old), new RegExp(`needs Node 20 or newer. You have Node ${old.replace(/[.]/g, '[.]')}`), old);
  });

  it('refuses to build on an old Node, and says what to do', () => {
    const errors = errorsOf(() => build(planFor(template('noor')), { nodeVersion: '18.20.8' }));
    assert.equal(errors.length, 1);
    assert.match(errors[0], /Update Node from https:\/\/nodejs\.org/);
  });

  it('the command line stops at once on an old Node and writes no file', () => {
    const planFile = join(TMP, 'old-node-plan.json');
    const out = join(TMP, 'old-node', 'x.wajha');
    writeFileSync(planFile, JSON.stringify(planFor(template('noor'))));
    const messages = [];
    const quiet = console.error;
    console.error = (m) => messages.push(m);
    let code;
    try {
      code = main(['--template', join(here, 'templates', 'noor.json'), '--input', planFile, '--out', out], '18.20.8');
    } finally {
      console.error = quiet;
    }
    assert.equal(code, 1);
    assert.match(messages.join(' '), /needs Node 20 or newer/);
    assert.equal(existsSync(dirname(out)), false);
  });

  it('the running Node is accepted (this is the check the real build does)', () => {
    assert.equal(nodeVersionProblem(), null, `Node ${process.versions.node} is below ${MIN_NODE_MAJOR}`);
  });
});

describe('The bundle runs without the Wajha repo', () => {
  const bundle = readFileSync(join(here, 'wajha-model.bundle.mjs'), 'utf8');

  it('records the pinned Wajha commit and both license notices in its header', () => {
    const header = bundle.slice(0, bundle.indexOf('*/'));
    assert.match(header, /2246e6d3c9260497abe250b068e8a12a5e55f75e/);
    assert.match(header, /Copyright \(c\) 2026 Wajha contributors/);
    assert.match(header, /Copyright \(c\) 2026 Arjun Barrett/);
    assert.match(header, /fflate 0\.8\.3/);
  });

  it('imports only Node built-in modules, never a package from node_modules', () => {
    const specifiers = [...bundle.matchAll(/^import\s[^;]*?from\s*["']([^"']+)["']/gm)].map((m) => m[1]);
    const builtins = new Set(builtinModules);
    assert.ok(specifiers.length > 0, 'the check finds the imports it should');
    for (const spec of specifiers) assert.ok(builtins.has(spec.replace(/^node:/, '')), `"${spec}" is not a Node built-in`);
    assert.doesNotMatch(bundle, /\brequire\(["'][^"']*["']\)/);
  });
});

// Paths used above must exist, so a missing screenshot fails loudly here and not as a confusing error later.
describe('Test inputs exist', () => {
  it('has the screenshots and templates', () => {
    for (const f of [...IPHONE, ...ANDROID]) assert.ok(existsSync(shotPath(f)), f);
    for (const t of ['noor', 'lagoon']) assert.ok(existsSync(resolve(here, 'templates', `${t}.json`)), t);
  });
});
