## ADDED Requirements

### Requirement: Build a project file from a template
The build script SHALL make a `.wajha` zip from a template, one or more screenshots, and slide texts. The zip MUST contain `project.json` and one `assets/<sha256>.<ext>` entry for each image the project uses. The project MUST be created with Wajha's own `projectFromTemplate` code.

#### Scenario: Valid input
- **WHEN** the script gets a template, real screenshots, and texts
- **THEN** it writes a `.wajha` file with `project.json` and the matching asset files

#### Scenario: Asset names match their content
- **WHEN** a screenshot is added to the file
- **THEN** its entry name is the SHA-256 hash of its bytes plus its real image type

### Requirement: Project data survives validation unchanged
The script MUST run Wajha's `validateProject` on the project and compare the result with its input as data, ignoring key order. Any difference MUST fail the build, unless that exact difference is on the written list in the findings file.

#### Scenario: Clean project
- **WHEN** the validator returns the same data
- **THEN** the build continues and reports zero errors

#### Scenario: Validator drops a value
- **WHEN** the validator removes or changes a value that is not on the list
- **THEN** the build fails and names the path of the difference
- **AND** no `.wajha` file is written

#### Scenario: Validator throws
- **WHEN** the validator throws an error
- **THEN** the build fails and shows the error

### Requirement: Screenshots are checked before the build
The script MUST refuse any screenshot that is not a real PNG, JPEG, or WebP file, or that is over Wajha's image limits. It MUST check the file's content and not its file name.

#### Scenario: Fake image
- **WHEN** a text file named `shot.png` is given as a screenshot
- **THEN** the build fails and names that file

#### Scenario: Too large
- **WHEN** an image is over Wajha's byte or pixel limits
- **THEN** the build fails and names that file

### Requirement: Phone families are supported
The script SHALL support the `iphone` and `android-phone` families, alone or together. When both are used, `iphone` MUST be the primary family. Each family's screenshots MUST be stored under its own family key. Any other family MUST be refused.

#### Scenario: One family
- **WHEN** the input has screenshots for one phone family
- **THEN** the project lists only that family, and it has a layout for that family

#### Scenario: Both families
- **WHEN** the input has iPhone and Android phone screenshots
- **THEN** the project lists `iphone` first and then `android-phone`
- **AND** each slide stores each family's screenshot under that family

#### Scenario: Unsupported family
- **WHEN** the input asks for `ipad`
- **THEN** the build fails with a clear message

### Requirement: A screenshot can differ for each language
The script SHALL let a plan give a slot either one screenshot, or one screenshot for each language. One screenshot MUST be stored for the base language only, and other languages use it through Wajha's fallback. When a slot has one screenshot for each language, the base language MUST be one of them, and every language named MUST be in the plan's languages.

#### Scenario: Different screenshots per language
- **WHEN** a slot gives a screenshot for `en` and another for `ar`
- **THEN** the project stores both asset ids under that slot, for `en-US` and `ar-SA`
- **AND** after Wajha imports the file, each language still points to its own image

#### Scenario: No base language
- **WHEN** a slot gives screenshots for other languages but not for the base language
- **THEN** the build fails and names the slide, family and slot

### Requirement: Language codes are mapped
The script SHALL accept full language codes from Wajha's language list, and the short codes `en` and `ar`, which map to `en-US` and `ar-SA`. The script MUST refuse any other code. The first language MUST be the project's base language.

#### Scenario: Short codes
- **WHEN** the input languages are `en,ar`
- **THEN** the project languages are `en-US` and `ar-SA`, and `en-US` is the base language

#### Scenario: Unknown code
- **WHEN** the input language is `xx`
- **THEN** the build fails with a clear message

### Requirement: The bundle runs without the Wajha repo
The Wajha code MUST ship as one JS file that runs under Node with no Wajha clone and no `npm install`. The file MUST record the Wajha commit it came from, and MUST keep the MIT notices of Wajha and `fflate`.

#### Scenario: Run in an empty folder
- **WHEN** the script and bundle are copied to an empty folder with no `node_modules`, and then run
- **THEN** they build a valid `.wajha` file

#### Scenario: Notices are present
- **WHEN** someone reads the bundle's header
- **THEN** it shows the pinned Wajha commit and both license notices

### Requirement: Old Node versions are refused
The script SHALL need Node 20 or newer. It MUST check the running Node version before it does anything else, and on an older version it MUST stop with one clear message that names the needed and the found version, and MUST NOT write a file.

#### Scenario: Node 18
- **WHEN** the script is run on Node 18
- **THEN** it prints that it needs Node 20 or newer and that Node 18 was found, and exits with a failure
- **AND** no file is written

#### Scenario: Node 20 or newer
- **WHEN** the script is run on Node 20 or newer
- **THEN** it runs as usual

### Requirement: Wajha's real import accepts the file
A proof test MUST pass each sample file through Wajha's `importProjectArchive`, and MUST confirm that every slide keeps its texts, its screenshots, and its layout.

#### Scenario: Import keeps everything
- **WHEN** a sample file is imported
- **THEN** the import succeeds and no image, text, or slide is lost

### Requirement: The proof ends with a recorded decision
The proof MUST end with a findings file that records the Wajha commit, the test results, the list of allowed differences, what the PNG review showed, and the browser check with Export. The file MUST end with a decision for building the skill. When the browser check passed and no desktop check was done, the decision MUST be "go, but not tested on desktop", and MUST NOT be a full "go".

#### Scenario: Slides reviewed by eye
- **WHEN** the proof is complete
- **THEN** the findings cover English and Arabic slides for both phone families, a long headline, and a screenshot with an unusual ratio

#### Scenario: Browser check
- **WHEN** a final sample file is ready
- **THEN** it is opened in the browser dev version, Export is run, and the result is recorded before any go decision

#### Scenario: Only the browser was checked
- **WHEN** the browser check passes and the desktop app was not tested
- **THEN** the decision in the findings file is "go, but not tested on desktop"
- **AND** it is not written as a full "go"
