# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# /wajha agent skill

An agent skill, modelled on the brag skill. A developer runs `/wajha` inside their app folder and gets a `.wajha` project for the Wajha app: a chosen template, their screenshots, and written and translated headlines.

## Status

The skill is not built yet. The repo has this plan, a README, an MIT license, the OpenSpec files, and the format proof in `spike/wajha-format/`.

The format proof is done (change `prove-wajha-format`). Decision: **go, but not tested on desktop**. A `.wajha` file made by our script opens in Wajha's browser version without changes and exports real PNGs. The desktop app was not tested. Read `spike/wajha-format/findings.md` before building the skill: it has the results, the limits, and what the skill must carry over.

## Working together

More than one person builds this repo, and `main` on GitHub is shared. Do not rewrite pushed commits.

`skill-creator` is a local tool and is not in the repo. `skills-lock.json` records its source. To install it: `npx skills add https://github.com/anthropics/skills --skill skill-creator`.

## Commands

There is no build or lint setup for the skill yet. The format proof in `spike/wajha-format/` has these commands. Run them from that folder (`npm install` once, for `esbuild`). Some need a Wajha clone at commit `2246e6d` next to this repo (`../wajha-clone`, or set `WAJHA_CLONE`) with `npm install` run in it.

```sh
node --test build_wajha.test.mjs             # 39 tests for the build script. Needs only Node, and the screenshots (next line).
node run-in-clone.mjs make-screenshots       # makes screenshots/ (git ignores it). Run this first on a fresh checkout.
node make-samples.mjs                        # builds the 13 sample .wajha files in out/samples/
node run-in-clone.mjs import-samples         # Wajha's real importer on every sample, 16 checks (needs the clone)
node make-review-samples.mjs && node run-in-clone.mjs render-review-en    # draws slides as PNGs in out/png/ (render-review-ar for Arabic)
node build-bundle.mjs                        # rebuilds wajha-model.bundle.mjs from the clone (refuses any other commit)
node browser-check.mjs <sample> <port>       # opens a sample in a running Wajha dev server, runs Export, checks the PNGs
node build_wajha.mjs --template templates/noor.json --input plans/zad-both.json --out out/x.wajha   # the build script itself
```

Run one test file in the clone with `node run-in-clone.mjs <name>` (the name of a file in `clone-tests/`, without `.test.ts`). `run-in-clone.mjs` copies our tests into the clone as `scripts/spike-*.test.ts` and runs Wajha's own Vitest there. The browser check needs `npx vite --port <port> --strictPort` running in the clone, and a Chromium that Playwright installed.

## OpenSpec workflow

The folder uses OpenSpec (`openspec/config.yaml`, schema `spec-driven`). The config has no project context yet.

- Slash commands: `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:update`, `/opsx:sync`, `/opsx:archive`.
- Matching skills are in `.claude/skills/openspec-*`. The command files are in `.claude/commands/opsx/`.
- Plan a change with `/opsx:propose` before writing code. Use `/opsx:apply` to do its tasks.

## Links

- This repo: https://github.com/YasserYG8/wajha-skill
- Wajha repo: https://github.com/M-Alkassem/Wajha (Tauri + React + TypeScript, MIT)
- Our issue, with the owner's answers: https://github.com/M-Alkassem/Wajha/issues/3
- Brag repo: https://github.com/latent-spaces/brag
- Brag local copy, if the plugin is installed: `~/.claude/plugins/cache/brag/brag/0.5.0/`

## What the Wajha owner said (issue 3)

- `/wajha` is approved as the command name.
- The skill lives in a separate repo that links back to Wajha.
- A PR for a `wajha export` CLI is welcome, and the owner will review it.
- The v1 project and template format is stable. A change will bump the version.
- GitHub Discussions is now enabled.
- The owner agreed to start: "Start on the repo, and open the `wajha export` PR whenever you're ready, I'll review it."

Checked word by word against the issue on 2026-11-05.

## What we promised in issue 3

- Everything stays MIT.
- We credit Wajha clearly.
- We build and maintain the skill.
- We send the PR for the `wajha export` CLI.
- The skill works with Claude Code, Codex, or any Agent Skills-compatible agent.

## MVP scope (agreed)

In:
- The developer gives the screenshots in a folder.
- The AI reads the code, picks a template, and writes headlines and translations.
- A small script checks the data, hashes the images, and makes the `.wajha` zip.
- The developer opens the file in the Wajha app and clicks Export.

Out, for later:
1. Playwright capture for web apps.
2. Android capture (`adb`), then iOS capture (`xcrun simctl`, needs a Mac).
3. The `wajha export` PR to the Wajha repo. After it, the AI can make the PNGs and check its own work.

Users must not need the Wajha repo at run time. We use the repo only while building and testing.

## Proposed structure

Copied from brag's design: a short `SKILL.md`, details in `references/`, and scripts for exact work.

```
wajha-skill/
├── .claude-plugin/        plugin.json, marketplace.json
└── skills/wajha/
    ├── SKILL.md
    ├── references/
    │   ├── step-1-inspect.md    understand the app
    │   ├── step-2-capture.md    get the screenshots
    │   ├── step-3-plan.md       choose the story and write headlines
    │   ├── step-4-build.md      make the Wajha project
    │   └── tones.md
    ├── assets/                  a few bundled templates
    └── scripts/
        └── build_wajha.mjs      check the data, hash the images, zip
```

Output goes to `wajha-output/`: `plan.md`, `copy.csv`, and `<app>.wajha`.

## Steps and gates

Each step must pass its gate before the next step starts.

| Step | What the AI does | Gate |
|---|---|---|
| 1. Inspect | Reads the code: name, screens, colours, main value | It can answer a fixed list of questions |
| 2. Capture | Takes the developer's screenshots | Every planned slide has an image |
| 3. Plan | Picks a template and writes `plan.md` with headlines | 1 to 10 slides, and headlines are short |
| 4. Build | Writes the JSON and runs the script | The script reports zero errors |
| 5. Deliver | Writes `wajha-output/` | The `.wajha` file exists |

Example command: `/wajha --langs en,ar --tone "playful"`

## Wajha format (checked in code and by test, at Wajha commit `2246e6d`)

Details and evidence: `spike/wajha-format/findings.md`.

- A `.wajha` file is a zip with `project.json`, `assets/<assetId>`, and optional `thumb.jpg` and `fonts/`. A `.wajha-template` file has `template.json`, `assets/`, and optional `preview.jpg`.
- **Asset names:** `<64 hex SHA-256 of the bytes>.<png|jpg|webp>`. A JPEG is `jpg`, not `jpeg`. The type comes from the file content, not the file name. The importer checks the name, the type, the size limits, and the hash.
- **Templates and projects use different layout keys.** A template slide has `layouts` keyed by aspect class: `tall` (required, the iPhone canvas), `tablet`, `wide`. A project slide has `layouts` keyed by device family (`iphone`, `android-phone`, ...). `projectFromTemplate` converts. It stores only the primary family's layout (plus the template's own layout for another aspect class). Other families are derived by `adaptLayout` when read, and a family-default device frame becomes the family's own (`iphone` becomes `android-phone`).
- **Screenshots:** `slide.shots` is `family -> slot -> language -> assetId`. The slot is the `slot` of a device element (`main`, `second`). A language without its own image falls back to the base language (the first one). A shot only survives if its asset is in the project's `assets` registry (`id`, `name`, `width`, `height`, `bytes`, `addedAt`).
- **Limits:** a template has 1 to 10 slides (a project may hold up to 100). An image is at most 100 MB, 16384 px on a side, and 8192 x 8192 px in area. A text is at most 2000 characters. A `.wajha` is at most 500 MB and 2000 entries.
- **Language codes:** Wajha's list has 51 full codes, such as `en-US`, `ar-SA`, `fr-FR`. Our script also accepts `en` (`en-US`) and `ar` (`ar-SA`). The first language is the base language.
- **The validator does not complain.** `validateProject` throws only for serious problems. It silently drops a shot whose asset is not registered, cuts a text at 2000 characters, and clamps numbers. The importer silently drops an image whose bytes do not match its name, and then the shots that point to it, and still reports success. A file can import and look wrong. So our build script runs `validateProject` and fails on any difference between its input and its output (the "no-change gate").
- **Screenshot shape:** a phone frame keeps its own shape. A screenshot within 20% of it makes the frame take the screenshot's shape. A screenshot further off is cropped from the centre (a 4:3 shot loses about 39% of its width). A sideways phone screenshot turns the phone on its side.
- Format is `wajha.template` or `wajha.project`, version `1`. `src/model/types.ts` is the authoritative type. Element kinds: `device`, `text`, `shape`, `image`. Copy supports `*word*` highlights and `\n`. `x` and `y` are fractions of the canvas, and lengths are fractions of the shorter side.
- **Drawing:** the code is in `src/engine`. `renderSlide` runs in Node with `@napi-rs/canvas`. Wajha's test helper `renderProjectSlide` draws mock screens and never our screenshots (`getImage` returns `null`), so use `spike/wajha-format/clone-tests/render-lib.ts`. Export uses `planExport` and `runExport`.
- **Opening a file:** the browser dev version opens a `.wajha` with the "Open file…" button, and exports PNGs (tested in Chromium). `npm run dev` serves the UI at http://localhost:1420, or use `npx vite --port <port>`. This is a developer option. There is no hosted web version.
- **Bundle:** `spike/wajha-format/wajha-model.bundle.mjs` holds Wajha's model code and `fflate` in one file (115 KB), with the pinned commit and both MIT notices in its header. It needs only Node, no `node_modules`. Rebuild it with `build-bundle.mjs` when Wajha's format version changes.
- **Node:** the bundle and script were tested on Node 22.14 and Node 20.20, and fail on Node 18 (`crypto is not defined`, because Wajha's `newId` uses the global `crypto`). **The skill needs Node 20 or newer** (decided). `build_wajha.mjs` checks this first and stops with a clear message on an older Node.

## Not checked yet

- **The Wajha desktop app (Tauri).** The user does not want to install it for now. When they do: open `noor-both-per-language.wajha` (made by `make-samples.mjs`), click Export, look at the files, and then update the decision in `findings.md` to a full "go" (or "no-go").
- WebKit (the engine of the macOS app). We tested in Chromium only.
- Templates with `tablet` or `wide` layouts, or with image assets. We tested two phone-only templates without assets (`noor`, `lagoon`).
- Real app screenshots. Our test screenshots are Wajha's own generated mock screens, with labels. Arabic copy has not been read by a native speaker.
- License terms for community templates in `gallery/`. The repo is MIT, and the checklist asks for freely licensed images, but check the author and licence before bundling any.

## Format proof (done)

The first task was to prove the riskiest part before writing any skill text. It is done: change `prove-wajha-format` (archived in `openspec/changes/archive/2026-11-05-prove-wajha-format/`, and its spec is now `openspec/specs/wajha-project-build/spec.md`), code and results in `spike/wajha-format/`. The decision is **go, but not tested on desktop** (see Status). The next change builds the skill. It must carry over: the no-change gate, the bundle, a headline length limit (about 70 characters, 90 at most), and a warning for screenshots more than 20% off the phone shape. The Node 20 check is already in `build_wajha.mjs`.

Decided for the skill, not built yet: when `--langs` is not given, use Arabic and English, with `ar-SA` first as the base language.

## Hard parts to watch

The code is small. Quality is the real work:
- Layouts can break with long headlines, odd screenshot sizes, or Arabic text.
- Headlines must be specific to the app, not generic AI text.
- In the MVP, the AI can't see the final slides.
- Test on many kinds of apps.
