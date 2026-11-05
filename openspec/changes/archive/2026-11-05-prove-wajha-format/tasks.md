## 1. Set up

- [x] 1.1 Clone Wajha outside this repo at commit `2246e6d`, run `npm install` in the clone, and confirm that its existing archive tests pass
- [x] 1.2 Create `spike/wajha-format/` with a `findings.md` file, and add its generated output to `.gitignore`
- [x] 1.3 Read how the device frame handles screenshot ratios, and note it in `findings.md`
- [x] 1.4 Prepare real test screenshots: iPhone ratio, Android phone ratio, and one unusual ratio

## 2. Bundle Wajha's code

- [x] 2.1 Make an `esbuild` script that bundles `projectFromTemplate`, `validateProject`, and `fflate` into one ESM file
- [x] 2.2 Add the pinned commit and the Wajha and `fflate` MIT notices to the bundle's header
- [x] 2.3 Record in `findings.md` what the bundle pulls in from outside `src/model`, and its file size
- [x] 2.4 Convert one built-in template to JSON, and use `lagoon` from the gallery as the second template

## 3. Write the build script

- [x] 3.1 Check screenshots by content, using Wajha's limits, and refuse bad files by name
- [x] 3.2 Map language codes, and refuse unknown ones
- [x] 3.3 Build the project for `iphone`, `android-phone`, or both, and refuse other families
- [x] 3.4 Add texts and screenshots to each slide, and hash the images into asset names
- [x] 3.5 Add the no-change gate, and report the path of each difference
- [x] 3.6 Write the `.wajha` zip only after all checks pass

## 4. Test with Wajha's real code

- [x] 4.1 Add a test for each failure scenario in the spec: fake image, too large, unsupported family, unknown language, and changed data
- [x] 4.2 Build sample files: iPhone only, Android phone only, and both, in English and Arabic, with both templates
- [x] 4.3 Run every sample through `importProjectArchive` in the clone, and confirm that no image, text, or slide is lost
- [x] 4.4 Copy the script and the bundle to an empty folder with no `node_modules`, run them, and confirm that the result is valid
- [x] 4.5 Record any allowed differences in `findings.md`, each with a reason

## 5. Look at the slides

- [x] 5.1 Draw English slides as PNGs for both phone families, and review them by eye
- [x] 5.2 Draw Arabic slides as PNGs in a separate test file, and review them by eye
- [x] 5.3 Test a long headline, and record the longest text that still looks good
- [x] 5.4 Test the unusual screenshot ratio, and record the result
- [x] 5.5 Open one sample in the browser dev version at `http://localhost:1420`, and record the result

## 6. Decide

- [x] 6.1 Open one final sample in the browser dev version at `http://localhost:1420`, click Export, and record the result. This replaces the desktop app check, because the user does not want to install the desktop app for now
- [x] 6.2 Write the go or no-go decision in `findings.md`. If the browser check passes, write "go, but not tested on desktop", and never a full "go"
- [x] 6.3 Correct the format notes in `CLAUDE.md`: layout keys, asset names, slide limits, language codes, the validator's behaviour, and how to open a file
- [x] 6.4 Update `CLAUDE.md`: the status, the "Not checked yet" list, the "First task" section, and the proof commands
- [x] 6.5 Run `openspec validate prove-wajha-format`, and fix any errors
