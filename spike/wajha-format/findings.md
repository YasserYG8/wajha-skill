# Findings: prove-wajha-format

Status: done. **Decision: go, but not tested on desktop** (see "Decision" below). The user does not want to install the desktop app for now, so the last check was the browser check with Export. A full "go" needs one desktop check.

## Setup

- Wajha clone: `../wajha-clone` (outside this repo), pinned to commit `2246e6d3c9260497abe250b068e8a12a5e55f75e` (2026-11-03).
- Node on this machine: v22.14.0. Wajha asks for `>=22.18`. `npm install` warns, but it works.
- Wajha's own tests pass in the clone: `npx vitest run src/storage/archive.test.ts src/model/validate.test.ts src/model/instantiate.test.ts` gives 3 files and 108 tests, all passed.
- Output of the proof goes to `spike/wajha-format/out/`. Git ignores it. It also ignores `screenshots/`, because `make-screenshots` makes those files again. Run it before the tests: `node spike/wajha-format/run-in-clone.mjs make-screenshots`.
- The pinned commit `2246e6d` is 3 commits ahead of the `v0.1.0` tag (`8a5a0be`, `ac16c14`, `2246e6d`). Those commits change only `e2e/` and `src-tauri/` (9 files), and nothing under `src/`. I checked this with `git diff --name-only v0.1.0 2246e6d -- src`, which lists no files. So the released app and our bundle use the same format code.

## How the device frame handles screenshot shapes (task 1.3)

Read in `src/engine/render.ts` (`deviceScreenAspect`), `src/engine/devices/screen.ts` (`coverSource`), and `src/engine/devices/geometry.ts`.

- Shape means height divided by width. A phone frame has its own natural shape: `iphone` is 2868/1320 = 2.173, `android-phone` is 2400/1080 = 2.222.
- If the screenshot's shape is within 20% of the frame's shape, the frame takes the screenshot's exact shape. Nothing is cropped.
- If it is not, the frame keeps its own shape. The screenshot is scaled to cover the screen and cropped at the centre. Nothing is stretched. Top and bottom (or left and right) edges are lost.
- A phone screenshot taken sideways (shape near 1/2.173) turns the phone on its side. This only works for phones and tablets.
- Limits: the device shape is clamped to 0.3..4 in the frame code, and to 0.05..20 in `deviceScreenAspect`.
- Other things to remember: a missing screenshot shows a generated mock screen (`missingShots`), and a screenshot that is still decoding shows an empty screen.

What this means for the skill: a screenshot with a wrong shape does not break anything, but it can lose its top and bottom. The skill should warn when a screenshot is more than 20% away from the phone shape. Task 5.4 will check this by eye.

## Test screenshots (task 1.4)

Made by `clone-tests/make-screenshots.test.ts`, with `node spike/wajha-format/run-in-clone.mjs make-screenshots`. Output: `screenshots/`.

Each screenshot carries a large label in the middle ("TEST" and the file's name, such as "IPHONE-1"), a "TOP" tag below the status bar and a "BOTTOM" tag above the home indicator. Reason: Wajha draws a generated mock screen for a missing screenshot, and these screenshots are mock screens too, so without a label a lost image would look fine in a PNG. The label shows that the right image reached the right device, and the tags show what a crop cuts off. `screenshots/` is ignored by git, because the command above makes the files again.

These are not screenshots of a real app. They are Wajha's own generated mock apps, drawn at real phone sizes. I could not capture a real app in this session. The proof tests the file format and the layout, so any real-looking image works. The last check is the browser check with Export (task 6.1). The desktop app is not tested for now.

| File | Size | Shape (h/w) | Purpose |
|---|---|---|---|
| `iphone-1` to `iphone-8` (png) | 1320x2868 | 2.173 | iPhone shape, exact. Each slot of each slide gets its own. 7 and 8 are the Arabic versions in the per-language sample. |
| `android-1` to `android-8` (png, but `android-3` is jpg) | 1080x2400 | 2.222 | Android phone shape, exact. `android-3` is a JPEG, to cover a second image type. |
| `odd-4x3` (png) | 1080x1440 | 1.333 | Unusual shape: 39% from the iPhone shape, so the frame must crop it |

## Bundle (tasks 2.1 to 2.3)

Built by `build-bundle.mjs` (esbuild) into `wajha-model.bundle.mjs`.

- Size: 118,080 bytes (115 KB), 3,338 lines, not minified, so a person can read it. Two builds give the same hash.
- It exports: `projectFromTemplate`, `validateProject`, `validateTemplate`, `LANGUAGES`, `FAMILIES`, `LIMITS`, `isLangCode`, `IMAGE_LIMITS`, `sniffImageExt`, `readImageSize`, `fitsImageLimits`, and from fflate `zipSync`, `unzipSync`, `strToU8`, `strFromU8`.
- It has **one import: `createRequire` from the Node built-in `module`**, which comes from fflate's Node build (it uses it to load worker threads later, if asked). No package from `node_modules` is imported. So it needs Node but no `npm install`. (Task 4.4 will prove this in an empty folder.) An earlier version of this note said "no imports". That was wrong. My first check searched only for `node:`, and the import is written `"module"`. A test now checks that every import is a Node built-in.
- Inputs: 11 files from `src/model` (`adapt`, `catalog`, `clone`, `colorMath`, `defaults`, `geometry`, `ids`, `instantiate`, `resolve`, `rules`, `validate`), one file from fflate, and **one file from outside `src/model`: `src/platform/limits.ts`**. That file has no imports of its own, by Wajha's design. The open risk in the design (`refs.ts` importing `platform/paths`) did not happen, because we do not bundle `src/storage`.
- The build script refuses to run when the clone is not at the pinned commit, or when `src/` has local changes.
- The header holds the pinned commit and the full MIT notices of Wajha and fflate 0.8.3. The line endings of the license files are normalised, and the whole bundle uses `
`.
- Cost: because we do not bundle `src/storage/archive.ts`, our script writes the zip itself. It must follow the same rules as `archive.ts` (entry names, no compression for images). Task 4.3 checks this with Wajha's real importer.

What the importer needs from a project (read in `archive.ts`, `refs.ts`, `templates.ts`):

- Asset name: `<64 hex sha256>.<png|jpg|webp>`. A JPEG file is `jpg`, not `jpeg`. The importer checks that the header type matches the name, that the size is in the limits, and that the hash matches.
- The project must also list each image in `assets` (id, name, width, height, bytes, addedAt). The importer removes registry entries whose file did not arrive, and then validation removes the shots that point to them.
- `shots` is `family -> slot -> language -> assetId`. So a screenshot can differ for each language. The slot is the `slot` key of the device element, usually `main`.
- `thumb.jpg` is optional.

## Templates (task 2.4)

Made by `clone-tests/export-templates.test.ts`, with `node spike/wajha-format/run-in-clone.mjs export-templates`. Output: `templates/`.

| Template | Where from | Slides | Layout keys | Sample languages | Fonts |
|---|---|---|---|---|---|
| `noor` | built-in (`src/templates/builtin/noor.ts`, TypeScript) | 5 | `tall` only | en-US, ar-SA | Cairo, Noto Sans Arabic |
| `lagoon` | gallery (`gallery/templates/lagoon/template.json`, copied) | 4 | `tall` only | en-US, ar-SA | Outfit, Inter |

- Wajha's `validateTemplate` changes nothing in either file (0 differences).
- Neither template has image assets, so neither needs an `assets/` folder.
- We chose `noor` because it was designed Arabic first. It also reads well in English.
- Text keys: every slide uses `headline` and `subtitle`.
- Screenshot slots: each slide has a device with slot `main`. Slide 3 of both templates also has a second device with slot `second`. So a slide can need two screenshots for each phone family.
- Every device element says `frame: "iphone"` in the stored layout. For other families, `adaptLayout` swaps a family-default frame for the family's own (`el.frame = fam.defaultFrame`, `adapt.ts:149`). So an Android slide gets an `android-phone` frame without our help.
- `projectFromTemplate` stores only the primary family's layout when all families share the aspect class `tall`. `android-phone` is derived when it is read. Screenshots for it are stored in `shots['android-phone']`.
- Licence: gallery templates must be "freely licensed for redistribution under the project's licence" (`docs/TEMPLATES.md`, checklist). We only use `lagoon` in this proof, and we do not ship it. Before the skill bundles any gallery template, check its author and licence (still in the "not checked" list).

## Open questions

- **What is the lowest Node version the final script must support? Decided by the user: Node 20.** Wajha asks for `>=22.18`. This machine has 22.14.0. What I tested, in an empty folder with no `node_modules`, using the real `build_wajha.mjs` and the bundle:

  | Node | Build | Importer accepts the file | Node tests (30) |
  |---|---|---|---|
  | 22.14.0 | works | yes | pass |
  | 20.20.2 | works | yes | pass |
  | 18.20.8 | **fails**: `ReferenceError: crypto is not defined` | not tested | not tested |

  Why Node 18 fails: Wajha's `newId()` (in `src/model/ids.ts`) calls the global `crypto.getRandomValues`. Node has that global only from version 19. A two-line fix in `build_wajha.mjs` would make it work (`globalThis.crypto ??= (await import('node:crypto')).webcrypto`). I did not add it, because Node 18 is past its end of life (April 2025), and so is Node 20 (April 2026). **Decision: Node 20 or newer.** `build_wajha.mjs` now checks the version first (`MIN_NODE_MAJOR = 20`, `nodeVersionProblem`), in both `main()` and `buildWajha()`. On an older Node it stops with one clear line and writes no file: `This script needs Node 20 or newer. You have Node 18.20.8. Update Node from https://nodejs.org and run it again.` Checked with the real command on Node 18.20.8 (refuses, exit code 1, no file) and Node 20.20.2 (builds), and by 4 new node tests. All 39 node tests pass on Node 22.14 and on Node 20.20. Not covered: a Node so old (below 16) that it cannot even read the script's syntax. That fails before any check can run, and it is far below what anyone has now.

## Sample files and the real importer (tasks 4.2 and 4.3)

`node make-samples.mjs` builds 13 files through the real command line: 12 from 2 templates (`noor`, `lagoon`) x 3 phone sets (iPhone only, Android only, both) x 2 language orders (`en,ar` and `ar,en`), and 1 with per-language screenshots (`noor-both-per-language`). Every build ended with zero errors and no ignored differences.

`clone-tests/import-samples.test.ts` passes each file through Wajha's own `importProjectArchive` (memory platform, real validators) and checks, for each file:

1. The import succeeds.
2. The imported project equals the `project.json` we wrote, apart from `id`, `name`, `createdAt`, `updatedAt` (the importer sets these). **Result: 0 differences in all 13 files.**
3. Every slide's `shots` entry points to the right asset, for each language. "Right" is worked out from the plan's source images (SHA-256 and type), not from our own `project.json`. No extra entries and no extra languages appear.
4. Every asset can be read back, and its bytes equal the source image.
5. Every slide keeps its texts, in every language.

Result: **16 of 16 tests pass** (13 samples, the count check, and 2 controls).

The controls matter, because a check that cannot fail proves nothing:
- One image is damaged (its bytes no longer match its hash name). The importer still succeeds, and silently drops the image and the shots that point to it. Our check reports it. This confirms what the design said: **the import does not tell you that an image was dropped.**
- The plan claims slide 1 used another image. Our check reports `shot iphone.main.en-US points to ...`.

**Per-slide copy and images (review item 1).** Every slide has its own headline and subtitle, and every screenshot slot has an image of its own (8 images for each phone family; the 6 slots of `noor` use the first 6). A mix-up between two slides now shows up in the check, in the texts and in the assets. Before this, slides 1 and 4 used the same image, so swapping them could not have been seen.

**Per-language screenshots (review item 2).** The plan may give a slot one image for each language: `"main": { "en": "a.png", "ar": "b.png" }`. The base language is then required, because a language without an image falls back to the base one. The sample `noor-both-per-language` uses this in slide 1 (`main`) and slide 3 (`second`), for iPhone and Android. The check confirms that the `en-US` and `ar-SA` images differ, point to the right files, and survive the import. A slot given as one file keeps only the base language entry, and the other language falls back to it, as Wajha's `resolveShot` does. The node tests cover the errors: no base language, an unknown language, a language that is not in the plan, and a fake image for one language.

What this does not prove: that the slides look right. A missing screenshot also shows a generated mock screen, and our test screenshots are mock screens too. That is why every test screenshot has a large label ("TEST IPHONE-1") and TOP and BOTTOM tags (review note 1). The label in a PNG proves that the right image reached the right device, and the tags show cropping. Task group 5 uses them.

## Empty-folder run (task 4.4)

A new folder held only `build_wajha.mjs`, `wajha-model.bundle.mjs`, `noor.json`, `plan.json` and the screenshots. It had no `node_modules` and no `package.json`, and none exists in any parent folder. `node build_wajha.mjs --template noor.json --input plan.json --out result/zad.wajha` gave `0 errors` and a 1818 KB file. I passed that file through Wajha's `importProjectArchive` with the same checks as task 4.3: 4 of 4 tests pass, including the two controls. Result: **the script and the bundle need only Node.** See the open question below for the Node versions.

**Repeated with the final script.** Per-language screenshots were added to `build_wajha.mjs` after the run above, so I ran it again in a new empty folder (no `node_modules`, no `package.json` in it or above it), with the `noor-both-per-language` plan and relative image paths. It built a 6164 KB file with 0 errors on Node 22.14 and on Node 20.20. Wajha's importer accepted both (4 of 4 checks each, with the 2 controls), and the 35 node tests pass on Node 20.

## Allowed differences from the validator (task 4.5)

**The list is empty** (`allowed-differences.json` is `[]`). Across all 13 sample files, Wajha's `validateProject` changed nothing in the project we built. The gate has never needed an exception, so it can see every change.

What this covers, and what it does not:
- Covered: `noor` and `lagoon` (both `tall` only, no image assets), iPhone only, Android only, both, in `en,ar` and `ar,en`, with screenshots stored for the base language.
- Also covered (a 13th sample, `noor-both-per-language`): a different screenshot for each language in two slots, for both phone families. The validator changed nothing there either.
- Not covered: templates with `tablet` or `wide` layouts, templates that carry image assets, and more than two languages. Any of these may produce differences. If one does, the gate fails and names the path, and we add an entry here with a reason.

Behaviours of the validator that we saw while testing the gate (they are why the gate exists):
- It **drops a shot whose asset is not in the `assets` registry**, and then drops the empty family. No error.
- It **cuts a text at 2000 characters** (`LIMITS.text`). No error. A 2500-character headline came back with 2000.
- The importer **drops an image whose bytes do not match its hash name**, and then validation drops the shots that point to it. The import still succeeds.

## PNG review (tasks 5.1 to 5.4)

How the slides were drawn: `clone-tests/render-lib.ts`, with `node spike/wajha-format/run-in-clone.mjs render-review-en` and `render-review-ar`. Each sample goes through Wajha's real `importProjectArchive`, then `loadProject`, then every asset is read back and decoded, then `renderSlide` draws it with the input the app builds (including `mirror` for right-to-left). **I did not use Wajha's `renderProjectSlide`.** It passes `getImage: () => null`, so every device would show a generated mock screen and never our screenshots. A device with no screenshot shows a plain grey screen here, and the test fails if any does. Result: **0 of 70 slides** (7 samples, both phone families) had a missing screenshot. PNGs are in `out/png/<sample>/` (git ignores them). Fonts come from the same packages the app uses. Node and the app can still differ a little, for example in text wrapping.

**5.1 English, both phone families (`noor`, and `lagoon` for iPhone).** Every device shows the image the plan gave it. On `noor` slide 3, which has two devices, the front phone (`main`) shows IPHONE-4 and the one behind it (`second`) shows IPHONE-3, on iPhone and on Android (ANDROID-4 and ANDROID-3). Android slides get Android frames with a punch-hole camera, so the frame swap in `adaptLayout` works. Gold highlights (`*word*`) work. Things that look odd but are the template's own design: on slide 4 the phone runs off the top of the slide, and on slide 3 the second phone is half hidden.

**5.2 Arabic (`ar-SA`), separate test file.** Letters join correctly, the text runs right to left, the final full stop sits at the left end of the line, the diacritics (`مصنّف`, `معًا`) draw, and the highlights fall on the right words. The layout is mirrored, as `mirrorRtl` says: on slide 3 the front phone moves to the right and the one behind it to the left. Screenshots do not mirror and keep reading normally. The Arabic copy was written by me and no native speaker has checked it. This review is about layout and shaping only. In the per-language sample (`noor-both-per-language`), the Arabic slides show the Arabic-only images (IPHONE-7 on slide 1; a different image in the second device of slide 3), and the other slides fall back to the base image. This is the end-to-end proof for review item 2.

**5.3 Long headlines (`noor`, text at the top).** The first test mixed layouts (slide 4 puts text at the bottom), so I repeated slide 1's layout six times. The lengths include the two `*` marks.

| Characters (en / ar) | English | Arabic |
|---|---|---|
| 25 / 29 | 2 lines, large | 2 lines, large |
| 45 / 47 | 2 lines, large | 2 lines, large |
| 71 / 69 | 2 lines, a bit smaller | 3 lines, smaller |
| 92 / 86 | 3 lines, smaller, clear of the star | 3 lines, smaller, clear of the star |
| 106 / 107 | 3 lines, small, clear of the star | 4 lines, the first line touches the gold star |
| 128 / 128 | 4 lines, the first line runs into the star | 4 lines, overlaps the star |

- **Longest that still looks good: 106 characters in English, and about 90 in Arabic.** I would not call 106 comfortable, because the type is small by then. The text shrinks to fit, and the template's decoration (the star) is what finally breaks.
- **For the skill, a safe rule:** headline up to **70 characters** (2 lines, near full size), and a hard maximum of **90** for every language. Subtitles stayed fine in every case (one or two lines).
- This applies to `noor` only. Other templates will break at other lengths, and the skill cannot see the slides in the MVP, so it must use a length rule and not look at the result. Wajha shrinks text to fit (the design noted a 60% floor), so a long headline still "fits" and only a person sees the problem.
- In the first test, 145 characters (5 lines) ran into the star and ended 2% from the top edge.

**5.4 Unusual screenshot shapes.** Each was drawn on iPhone and Android. Device height over width as drawn, from `RenderResult.boxes`:

| Screenshot | Shape (h/w) | iPhone frame | Android frame | What we see |
|---|---|---|---|---|
| normal phone shot | 2.173 / 2.222 | 2.092 | 2.140 | whole screenshot |
| 4:3 (`odd-4x3`) | 1.333 | 2.092 | 2.140 | frame keeps its phone shape. **About 39% of the width is cut (about 19% each side).** The screenshot is not stretched. |
| near (`near-750x1334`, `near-1080x2000`) | 1.779 / 1.852 | **1.725** | **1.795** | within 20%, so the frame becomes a shorter phone. Nothing is cut. TOP and BOTTOM tags both show. |
| sideways (2868 x 1320) | 0.460 | **0.478** | **0.478** | the phone lies on its side and shows the whole screenshot. In `noor` slide 3 it overlaps the other phone, because the layout was not made for it. |

This confirms what the code reading in task 1.3 said. Correction to that note: a wider-than-frame screenshot loses its **sides**, and a taller one would lose top and bottom. The skill should warn when a screenshot is more than 20% away from the phone shape.

## Browser check with Export (tasks 5.5 and 6.1)

The user will not install the desktop app for now, so this is the last check in this change.

**How I opened the file.** `browser-check.mjs`, with `node make-samples.mjs` first, then `node browser-check.mjs <sample> <port>`.
- App: the browser version of Wajha from my clone at `2246e6d`, started with `npx vite --port 5200 --strictPort`. **I did not use port 1420**, as the task says, because another process already served something there (HTTP 200). It was not mine, probably the planning session's, and I did not want to touch it. It is the same app and the same commit, only another port. The e2e config of Wajha says other local tools use 1420.
- Browser: **headless Chromium 149.0.7827.55**, driven by Playwright 1.64.1 from the clone. Playwright 1.64 wants Chromium build 1248, but only build 1228 was installed, so the script finds and uses the installed one. Nothing was installed.
- The file goes in through the real **"Open file..." button** and a file chooser, as a person would do it. The script then reads the project from the app's own store and from IndexedDB.
- It switches family and language with the app's own store actions (`setActiveFamily`, `setActiveLang`), and not by clicking.
- It opens the **Export dialog** with the real button, and runs Export with the dialog's default choices.

**Result: 5 samples, 13 checks each, all passed.** Samples: `noor-both-per-language`, `lagoon-both-en-ar`, `noor-both-ar-en` (Arabic base), `noor-android-ar-en`, `noor-iphone-en-ar`.

| Check | Result |
|---|---|
| The file opens in the editor | yes, all 5 |
| The project held by the app equals our `project.json` (apart from `id`, `name`, `createdAt`, `updatedAt`) | **0 differences** in all 5 |
| Slides, families, languages as planned | yes |
| Every image of the file is stored in the browser | yes (16 images, 6.3 MB for the largest sample) |
| Status bar: "All screenshots added" (no missing screenshots) | yes |
| Every family shows in every language | yes |
| Export gives a download, and the zip holds as many files as the button said | yes: 30, 24, 30, 10 and 20 files, **114 in all** |
| Every exported file is a PNG that decodes to its stated size | **114 of 114** |
| 8-bit RGB with no alpha (the stores reject transparency) | yes |
| No file is blank (at least 40 distinct colours in a 64 x 64 sample; the lowest was 142) | yes |
| No error logged by the page | yes, after one note below |

Export by default writes 3 sizes: iPhone 6.9 inch (1320 x 2868), iPhone 6.3 inch (1206 x 2622), and Google Play phone (1080 x 1920). Folders: `<project>/App Store/<locale>/iPhone 6.9/01.png` and `<project>/Google Play/<locale>/Phone/01.png` (Google Play uses `ar` for Arabic).

**By eye.** I put the 30 files exported for `noor-both-per-language` in one sheet (`out/browser/noor-both-per-language/`, made by hand). They match the Node drawings from 5.1 to 5.4. Every device shows its own labelled image (IPHONE-1 to 6; ANDROID-1 to 6 on Google Play), Arabic slides are mirrored and shaped correctly, and the Arabic slides show the Arabic-only images (IPHONE-7 and ANDROID-7 on slide 1). So per-language screenshots work all the way through the app.

**One logged error, and its cause.** The first run failed one check: `console.error: Failed to load resource ... 404`. The cause is `/favicon.ico`. `index.html` declares no icon, and Chromium asks for one by itself and logs the 404. Wajha's own tests use WebKit, which does not ask. I confirmed it by answering that one request with an empty reply: then the error is gone and nothing else is logged. It has nothing to do with our file. It is a small cosmetic issue in Wajha, and could be mentioned to the owner.

**What this check does NOT prove.**
- **The desktop app (Tauri) was not tested.** It uses another platform layer (files on disk, not IndexedDB) and another web engine on each system. A pass here is not a pass there.
- **WebKit was not tested.** Wajha's own tests use WebKit (the engine of the macOS app). We used Chromium, because that is what was installed.
- It was driven by a script, and not by a person looking at the screen. The file chooser, the buttons and the downloads are the real ones in the browser. Switching family and language used the store, not the UI.
- Fonts and text wrapping are the browser's, which is the same as the app's for the export, but the Node drawings of 5.1 to 5.4 used Node's fonts. Both agree here.

**Rerun:** start the dev server in the clone, then `node make-samples.mjs` and `node browser-check.mjs <sample> <port>`. Output goes to `out/browser/<sample>/`.

## Decision (task 6.2)

# Go, but not tested on desktop

We can build the skill on this format. A `.wajha` file made by our script, from Wajha's own model code, opens in Wajha's browser version with no change to its data, shows every screenshot on the right device, and exports real store-size PNGs. The desktop app was **not** tested (the user does not want to install it for now), so this is not a full "go".

**What the decision rests on** (all at Wajha commit `2246e6d`):
- 39 node tests (Node 22.14 and Node 20.20), including every failure scenario in the spec and the Node 20 check.
- 13 sample files. Wajha's real importer keeps all of their data: 0 differences, and every screenshot points to the right asset in every language (16 of 16 importer tests, with 2 controls that prove the check can fail).
- Wajha's validator changed nothing in any project we built (allowed-differences list: empty).
- The bundle and the script run in an empty folder with only Node, on Node 22 and Node 20.
- 70 slides drawn from the imported files, by eye: English, Arabic (mirrored), both phone families, per-language screenshots, long headlines, odd screenshot shapes. 0 missing screenshots.
- Browser check with Export on 5 samples: the app held the same project, all images were stored, and **114 of 114 exported files** are real, full-size, non-blank, 8-bit RGB PNGs.

**What it does not cover** (a full "go" needs the first one):
1. **The desktop app (Tauri).** When the user installs it: open one sample (suggest `noor-both-per-language`), click Export, and look at the files. Then change this decision to a full "go", or to "no-go" with the reason.
2. WebKit (the engine of the macOS app). Wajha's own tests use it. We used Chromium.
3. Templates with `tablet` or `wide` layouts, or with image assets. We tested two phone-only (`tall`) templates without assets. The gate will name any difference it finds, but we have not seen those cases.
4. Real app screenshots. Ours are Wajha's own generated mock screens, with labels.
5. Arabic copy checked by a native speaker (we checked shaping, direction and layout only).

**What the next change (the skill) must carry over:**
- Keep the no-change gate and the "write the file only after every check" rule. They are the only protection against silent losses (see "Allowed differences": the importer and validator drop data without an error).
- Use `wajha-model.bundle.mjs` and rebuild it when Wajha's format version changes (the owner said a change will bump the version). Keep the pinned commit and both MIT notices in its header.
- Node 20 or newer: the check is already in `build_wajha.mjs`. Keep it, and keep it first.
- Add length rules: headline up to 70 characters (hard maximum 90, every language), because Wajha shrinks text and never complains. Warn when a screenshot is more than 20% away from the phone shape (it is cropped or reshaped).
- Default languages when `--langs` is not given: Arabic and English, with `ar-SA` as the base (see below).
- Check the author and licence of any community template before bundling it.

## Notes for the final skill

Not built in this change.

- **Default languages: Arabic and English, with Arabic (`ar-SA`) as the base language.** (User decision.) When `--langs` is not given, the final skill should use `ar-SA` and `en-US`, in that order, so `ar-SA` is the base. Today the spike script defaults to `["en"]` when a plan has no `languages`, and `CLAUDE.md` shows `--langs en,ar` as the example. Both stay as they are for now. Change them when we build the skill. Remember that the first language is the base language: screenshots are stored for it, and other languages fall back to its texts.
