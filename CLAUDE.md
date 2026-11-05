# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# /wajha agent skill

An agent skill, modelled on the brag skill. A developer runs `/wajha` inside their app folder and gets a `.wajha` project for the Wajha app: a chosen template, their screenshots, and written and translated headlines.

## Status

The skill is not built yet. The repo has this plan, a README, an MIT license, and the OpenSpec files. The plan below was agreed in an earlier session.

## Working together

More than one person builds this repo, and `main` on GitHub is shared. Do not rewrite pushed commits.

`skill-creator` is a local tool and is not in the repo. `skills-lock.json` records its source. To install it: `npx skills add https://github.com/anthropics/skills --skill skill-creator`.

## Commands

None yet. There is no build, lint, or test setup. Add the real commands here when they exist.

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

## Wajha format (from its docs, not yet checked in code)

- A `.wajha` file is a zip with `project.json`, `assets/<assetId>`, and optional `thumb.jpg` and fonts.
- A `.wajha-template` file is a zip with `template.json`, `assets/`, and optional `preview.jpg`.
- Images are named by SHA-256 hash.
- The app validates files on import: it drops unknown keys, clamps numbers, and re-hashes images. So a file can open and still look wrong.
- `Template` in `src/model/types.ts` is the authoritative type. Format is `wajha.template`, version `1`.
- Slides: 1 to 10. Each has `texts` keyed by language, and `layouts` keyed by `tall` (required), `tablet`, `wide`.
- Element kinds: `device`, `text`, `shape`, `image`. Copy supports `*word*` highlights and `\n`.
- `x` and `y` are fractions of the canvas. Lengths are fractions of the shorter side.
- Drawing code is in `src/engine` and runs in Node via `@napi-rs/canvas` in tests. Export uses `planExport` and `runExport`.
- `npm run dev` serves the UI at http://localhost:1420. This is a developer option. There is no hosted web version.

## Not checked yet

- The real `project.json` rules. The docs read so far cover the template format.
- Whether the browser dev version can open `.wajha` files.
- License terms for community templates in `gallery/`. The repo is MIT, but check before bundling any.

## First task

Prove the riskiest part before writing any skill text:

1. Clone Wajha outside this repo, and read `src/model/types.ts` and the import validation code.
2. Write a small script that makes one `.wajha` file from a template and a sample image.
3. Test it with Wajha's own import check, then try the browser dev version.
4. Ask the user to open the final file once in the real desktop app. This is the final check.

If the file works, build the skill. If not, fix the format first.

## Hard parts to watch

The code is small. Quality is the real work:
- Layouts can break with long headlines, odd screenshot sizes, or Arabic text.
- Headlines must be specific to the app, not generic AI text.
- In the MVP, the AI can't see the final slides.
- Test on many kinds of apps.
