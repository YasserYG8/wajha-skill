## Context

We read Wajha at commit `2246e6d` (2026-11-03). What we learned:

- A `.wajha` file is a zip: `project.json`, `assets/<sha256>.<ext>`, optional `thumb.jpg`, and optional `fonts/`.
- Templates use the layout keys `tall`, `tablet`, and `wide`. Projects use device names, such as `iphone`. `projectFromTemplate()` converts between them.
- `validateProject()` throws an error only for serious problems. It fixes or drops smaller ones without telling anyone.
- The import reads only the image header to check size and type. A broken image can pass the import.
- The importer and the data model run outside a browser, through `createMemoryPlatform`. Wajha's tests draw slides in Node with `renderProjectSlide()`.

The Wajha owner said in issue 3 that the v1 project and template format is stable, and that a change will bump the version.

## Goals / Non-Goals

**Goals:**
- Prove that we can make a `.wajha` file that Wajha imports without changing the data.
- Prove that the bundle runs with no Wajha repo.
- See real slides, in English and Arabic, on iPhone and Android phone layouts.
- Finish with a clear go or no-go decision.

**Non-Goals:**
- A finished skill or polished code. The final skill comes in a later change.
- AI template choice and headline writing. The proof uses fixed test data.
- Tablets, Mac, and other devices.
- Changes to the Wajha repo.

## Decisions

**Bundle Wajha's code, and do not write our own.** The build script calls the same `projectFromTemplate` and `validateProject` as the app, so the logic cannot drift from it. Writing our own would mean copying the layout adaptation code, about 900 lines in `adapt.ts`. The cost is a larger file, and we must rebuild when Wajha changes.

**Use `esbuild` to make one ESM file.** It needs little setup and handles TypeScript. Users never run it, because the built file is what ships. One risk is still open: `src/storage/refs.ts` imports from `platform/paths`, outside the model folder. We bundle only what we need, and we record what the bundle pulls in.

**Pin the Wajha commit.** The bundle's header records the commit it came from, plus Wajha's MIT notice and the `fflate` notice. MIT requires these notices. The pin also makes the proof repeatable for both contributors.

**Make the no-change gate the main check.** The script builds the project, runs `validateProject` on it, and compares the two as data, so key order does not matter. Any difference fails the build. We may find normal differences, such as default values that the validator adds. Those go on a short written list in the findings file, with a reason for each. The list must stay small, because each entry is a place where the gate cannot see a problem.

**The script checks images itself.** It refuses a file that is not a real PNG, JPEG, or WebP. It also checks the limits in `platform/limits.ts`. The import would only drop a bad image and leave an empty device frame on the slide.

**Test against the real importer inside a Wajha clone.** The clone stays outside this repo. Our test file is copied into its `scripts/` folder, where Wajha's own Vitest setup can run it, like `scripts/gallery-previews.test.ts`. This uses `importProjectArchive` with no copy of its logic. The same setup draws the PNGs, using Wajha's test helper. That helper is for tests only, so the final skill cannot use it for users.

**Pick the device from the input.** The proof covers three cases: `iphone` only, `android-phone` only, and both. With both, `iphone` comes first, so `android-phone` follows it through Wajha's adaptation. Each device has its own screenshots.

**Map short language codes.** Wajha's list uses codes such as `en-US` and `ar-SA`. The script accepts `en` and `ar` and converts them. An unknown code is an error, and the script does not guess.

**Test with two templates.** `lagoon` from the gallery is plain JSON with no images. One built-in template proves that we can convert TypeScript templates to JSON. The built-in templates are the larger set, with 20 against 4 in the gallery.

**Keep the proof in `spike/wajha-format/`.** Its name says it is temporary. The next change moves what we keep into `skills/wajha/`. Generated files stay out of git.

## Risks / Trade-offs

- The bundle pulls in browser or platform code → Bundle from `src/model` only, and copy the small helpers we need. If this needs more than a small copy, record it in the findings.
- The no-change gate fails on normal differences → Use the written list in the findings file, with a reason for each entry.
- Node drawing can differ from the app, for example in fonts → The PNGs are a first check only. The browser check with Export is the last check in this change. The browser version uses its own platform code, so a pass there does not prove the desktop app works. That is why a pass gives only "go, but not tested on desktop".
- Wajha's test helper loads one font script per test file → Draw English and Arabic in separate test files.
- Long headlines shrink to 60% and still "fit" → Look at them by eye, and record the longest text that still looks good.
- Odd screenshot sizes may break the device frame → We have not read this code yet. Test one unusual ratio, and record what happens.
- `npm install` in the clone runs third-party install scripts → Run it only in the clone, outside this repo.

## Open Questions

- What does the validator change in a correct project? The first run will show this.
- How much code does the bundle need beyond `src/model`?
- How does the app handle a screenshot with an unusual ratio?
- Does a family's own text or layout break when `android-phone` follows `iphone`?
