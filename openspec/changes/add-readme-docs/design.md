## Context

The repo holds only the plan (`CLAUDE.md`) and OpenSpec files. No skill code exists yet, and the `.wajha` format has not been proven. The repo is public-facing at `github.com/YasserYG8/wajha-skill`. Brag's README is the model for this project, but brag is a shipped product and this skill is not.

## Goals / Non-Goals

**Goals:**
- A visitor understands what `/wajha` is within the first few lines.
- A visitor can tell that the skill does not work yet.
- The README links back to the Wajha repo.

**Non-Goals:**
- Install or usage instructions that cannot work today.
- Marketing assets, such as a hero image or a launch site.
- Copying the plan's internal details, such as the format notes and gates. They stay in `CLAUDE.md`.
- Any change to `CLAUDE.md` or to the skill plan.

## Decisions

**Say "not built yet" near the top.** The status line goes right after the intro. The other option was a roadmap note at the bottom, but a reader could then try to install the skill before they see it.

**Write the flow in the future tense, under a "Planned" heading.** This keeps the idea clear without claiming it works. The example command `/wajha --langs en,ar --tone "playful"` may appear only if it is marked as planned, because the flags may change.

**Leave out the install section.** Brag's install commands would be easy to copy with the names changed, but there is no plugin to install. An empty section adds nothing, so the status line says that install steps come later.

**Keep only verified facts about Wajha.** The owner's answers in `CLAUDE.md` were read through a summary tool, so the README must not quote or speak for the owner until issue 3 is re-read word by word. Linking to the issue is safe.

**Keep the README short.** About one screen. It can grow when there is something real to show.

## Risks / Trade-offs

- The README goes out of date when the skill ships → The proposal's Impact section records that the status and install parts must change at that time.
- A plain README attracts less interest than brag's → This is fine for now, because there is nothing to try yet.
- No license is stated, since the repo has no `LICENSE` file → The README must not claim one. See the open question.

## Open Questions

- Which license will this repo use? Wajha is MIT, but this is the repo owner's choice. Until then, the README does not have a license section.
