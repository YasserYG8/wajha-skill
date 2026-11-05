## Why

The repo has no README, so a visitor on GitHub cannot tell what `/wajha` is or how it relates to the Wajha app. The Wajha owner also asked that this skill live in a separate repo that links back to Wajha (issue 3), and a README is the natural place for that link.

## What Changes

- Add a `README.md` at the repo root.
- Explain what `/wajha` is, who it is for, and what it produces.
- Link to the Wajha repo and say that this skill is a separate project.
- State clearly that the skill is not built yet, so nobody tries to install it and fails.
- Describe the planned flow and the MVP limits, and mark them as planned.

## Capabilities

### New Capabilities

- `readme-docs`: What the repo's README must say, and how it must stay honest about what exists today.

### Modified Capabilities

None. `openspec/specs/` is empty.

## Impact

- New file: `README.md`.
- No code, APIs, or dependencies change.
- The README's status section will need an update when the skill ships, and install steps must be added at that time.
