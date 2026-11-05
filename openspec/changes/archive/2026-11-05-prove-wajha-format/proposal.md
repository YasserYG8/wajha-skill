## Why

The whole skill depends on one thing: making a `.wajha` file that opens and looks right in the real Wajha app. We have only read the code and tested nothing, and that reading showed some of our notes are wrong. We must prove this before we write any skill text.

## What Changes

- Add a small proof, in `spike/wajha-format/`. It is not the final skill.
- Bundle Wajha's real model code (`projectFromTemplate`, `validateProject`) into one JS file that runs without the Wajha repo.
- Build sample `.wajha` files from a template and real screenshots, for iPhone, for Android phones, and for both.
- Add a stronger gate: the project data must not change when Wajha's validator checks it.
- Test the files with Wajha's real import code, and open one in the browser dev version.
- Draw the slides as PNGs inside a Wajha clone, in English and Arabic, and review them by eye.
- Open one final file in the browser dev version and run Export there. The user does not want to install the desktop app for now, so the desktop check is left out of this change.
- Write the result in a findings file, with a clear decision for building the skill. If only the browser check passed, the decision is "go, but not tested on desktop", and never a full "go".
- Fix the wrong format notes in `CLAUDE.md`, and record the commands that repeat the proof.

**Not in this change:** `SKILL.md`, the plugin files, template choice, headline writing, screenshot capture, tablets and Mac, the `wajha export` PR, and any change to the Wajha repo.

## Capabilities

### New Capabilities

- `wajha-project-build`: How we turn a template, screenshots, and texts into a `.wajha` file that Wajha accepts without changing it.

### Modified Capabilities

None. `readme-docs` does not change.

## Impact

- New folder: `spike/wajha-format/`, with the build script, the bundle, its license notice, tests, and findings.
- `.gitignore`: ignore the proof's generated output.
- `CLAUDE.md`: correct the format notes, and add the proof commands.
- New tools for developers only: `esbuild` for the bundle, plus a local Wajha clone with its `npm` packages for tests and drawing. Users of the final skill will need none of these.
- The bundle includes MIT code from Wajha and `fflate`, so it must keep their license notices.
