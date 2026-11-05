# readme-docs Specification

## Purpose

Defines what the repo's README must say, and how it stays honest about what exists today.

## Requirements

### Requirement: README explains the project
The repo SHALL have a `README.md` at its root. Its opening lines MUST say that `/wajha` is an agent skill, that a developer runs it inside their app folder, and that it produces a `.wajha` project for the Wajha app.

#### Scenario: New visitor reads the opening
- **WHEN** a visitor reads the first paragraph of `README.md`
- **THEN** they learn what `/wajha` is, who it is for, and what it produces

### Requirement: README states the current status
The README MUST state, before any description of the flow, that the skill is not built yet and cannot be installed or used today.

#### Scenario: Visitor wants to try the skill
- **WHEN** a visitor looks for a way to run the skill
- **THEN** the README tells them it is not available yet

#### Scenario: No working install steps are implied
- **WHEN** the README is read from top to bottom
- **THEN** it contains no install command and no usage step written as if it works today

### Requirement: README links back to Wajha
The README MUST link to `https://github.com/M-Alkassem/Wajha` and MUST say that this skill is a separate project from the Wajha app.

#### Scenario: Visitor wants to find the app
- **WHEN** a visitor wants to learn about the Wajha app
- **THEN** the README gives them a working link to the Wajha repo

### Requirement: README marks planned work as planned
Any description of the flow, the MVP scope, or the command flags MUST sit under a heading or wording that marks it as planned. The MVP limits MUST be included: the developer gives the screenshots, and the developer opens the file in the Wajha app and clicks Export.

#### Scenario: Visitor reads the planned flow
- **WHEN** a visitor reads the description of how the skill will work
- **THEN** it is clear that this is a plan and not a current feature
- **AND** it is clear that the developer provides the screenshots and exports the images in the Wajha app

### Requirement: README makes only verified claims
The README MUST NOT state a license while the repo has no `LICENSE` file. It MUST NOT quote or speak for the Wajha owner unless the wording has been checked against issue 3.

#### Scenario: Repo has no license file
- **WHEN** the repo has no `LICENSE` file
- **THEN** the README does not name a license

#### Scenario: Owner's answers are mentioned
- **WHEN** the README refers to the owner's answers
- **THEN** it links to issue 3, and any statement matches the issue's real text
