# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playfair CipherLab is a visual learning tool for the Playfair cipher, a classical cryptography method. Part of the "100 Security Tools with Generative AI" initiative (Day 027). Deployed as a static site on GitHub Pages.

**Live demo**: https://ipusiron.github.io/playfair-cipherlab/

## Development Commands

```bash
# Serve locally
python -m http.server 8000
# Test with Node.js 22 or newer (no install required)
npm test
```

No build step or dependencies are required. Keep classic scripts, not ES modules,
so opening index.html directly through file:// continues to work.

## Architecture

### Core Modules (in load order)

Load cipher, analysis, recovery, exercises, progress, guide, ui, theme, help, i18n and main
as classic scripts in the head with defer, in exactly that order. Fetches can
run concurrently; execution stays ordered before DOMContentLoaded. Never use
async, modules, bundling or new dependencies. Only theme-init stays synchronous
immediately after body opens so the saved theme applies before the first paint.

0. **theme-init.js** - Synchronous script immediately after body opens; applies the
   validated saved theme or OS preference before the first paint.

1. **cipher.js** - Pure `PlayfairCore` functions and the `PlayfairCipher` adapter
   - 5×5 matrix management (I/J combined as "I")
   - Keyword-to-matrix generation
   - Standard pair preparation, encryption/decryption, padding candidates
   - Three optional, explicitly nonstandard same-pair variants
   - No DOM, storage, or translation dependency; conditional CommonJS export

1a. **analysis.js** - Pure `PlayfairAnalysis`, with a conditional CommonJS export
   - Uppercase A–Z but keep J: even length, no J, no identical-letter pair
   - Empty, impossible or consistent verdict; conditions are necessary, not proof
   - Pair positions, reversals, top-five frequencies, distinct and ignored characters
   - Decrypt a pair and its reversal with the current matrix through PlayfairCore
   - `frequencyAnalyzerUrl(text)` trims the original input and returns an encoded
     Day009 URL, or null for empty input or more than 5,000 characters

1b. **recovery.js** - Pure `PlayfairRecovery`, with a conditional CommonJS export
   - Three known-plaintext puzzles, with 16/8/3 givens and 11/14/27 distinct pairs
   - `problem`, `pairStatus`, `candidates`, `solveByDeduction`, `hint`, `isSolved`
   - Reference deduction reaches all 25 cells in 9/17/22 steps; do not change its order or conditions
   - Hint levels: rules, pair kinds, then the first wrong cell or one correct placement
   - No DOM, storage or translations; derive ciphertexts with PlayfairCore

2. **exercises.js** - `ExerciseManager` class: challenge/practice data and pure answer validation
   - No DOM, localStorage, or i18n access; no progress state or writes
   - Validate the actual matrix before accepting original, prepared, or candidate-stripped answers
   - E1/E2/E3: SHEEP with default / HIDE THE MAP with CIPHER / ATTACK THE HILL with SECRET
   - Derive encryption answers through PlayfairCore, never store ciphertext fields for E1–E3
   - validateEncipher normalizes the answer without requiring the current matrix
   - H1 requires ROYAL NEW ZEALAND NAVY and accepts 109 or normalized ONEOWENINE

2a. **progress.js** - Pure `ProgressCore`: eighteen missions, event reducer, locks,
    stars, summary, strict version-2 storage validation and legacy migration.
    Conditional CommonJS export; no DOM, storage or translation dependency.

2b. **guide.js** - Bottom guide card and navigation using `UI.getSnapshot()`.
    A step is done if its predicate or any later step predicate is true.
    The guide never enters an answer, keyword or plaintext automatically.

3. **ui.js** - `UI` class: main controller
   - Four tabs: key generation, encryption, decryption and analysis
   - Analysis sends from encryption output and decryption input; numbered reversal selection
   - Independent playback states; render synchronously from the completed pair count
   - Invalidate old output when input, settings, or the matrix changes
   - Challenge flow with hint system
   - Recovery cells/palette, keyboard placement, three hint levels, pair status and hidden-message decryption

4. **theme.js** - Dark mode button and safe theme persistence

5. **help.js** - Help dialog, focus trap, Escape, and focus restoration

6. **i18n.js** - `I18nManager`: Japanese/English dictionaries, including help templates

7. **main.js** - Entry point, initializes i18n then UI

Other files: index.html supplies semantic markup and CSP; css/styles.css holds
the light/dark palette and responsive layout. assets/ contains seven Japanese README
screenshots (including the dark English preview); assets/en/ has six English screenshots.
test/ has ten files.

### Key State

- `UI.cipher` - Current PlayfairCipher instance with active matrix
- `UI.playback.encryption` and `.decryption` - `{ steps, done, playing, timerId }`
- `UI.progress` - Version-2 progress saved in `localStorage['playfair-progress']`
- `UI.matrixSource` - Default, keyword or directly entered matrix; never persisted
- `UI.getSnapshot()` - Live drafts, editor/tab state, loaded exercise, valid results, rulesSeenNow and lastCorrect
- `UI.analysisResult` / `UI.selectedReversed` - Visible analysis and selected reversal, or null;
  snapshot `analysisDraft` is trimmed but never cipher-normalized (keep J and punctuation)
- Snapshot `recovery` is `{id, placed}` or null; placed excludes givens.
  `lastRecoverySolved` is the last puzzle solved on this page, not a saved achievement.
  Recovery cells, selections and in-page hint counters are never persisted as editor state.
- `I18nManager.currentLang` - Saved in `localStorage['playfair-language']`
- Theme - Saved in `localStorage['theme']`

Validate all saved data and catch getItem/setItem failures. Only progress,
language, and theme are persisted; never save keys or input/output text.

Progress has the shape `{version:2, missions:{}, challenges:{}, rulesSeen:[]}`.
Missions stores only M1–M8; encryption, decryption, history and recovery entries share challenges,
with fixed points and hintsUsed. Never add a storage key or change version 2.
Keep version 2 and accept existing saves with only M1–M6. Total missions comes
from MISSIONS.length; sum mission points for the maximum score (210). Analysis awards no points.
C1/C2/C3 are inferred from mystery-01/02/03 entries and award 10/20/30 points.
R1/R2/R3 are inferred from recover-01/02/03 entries and also award 10/20/30 points.
E1/E2/E3 use encipher-01/02/03 and award 10/20/30 points; H1 uses history-01 and awards 30.
Insert E1–E3 after M4 and H1 after C3; retain R1–R3 last. Old fourteen-mission saves still load.
Encryption and history hint counts allow 0–4. An encryption check with the same normalized
plaintext and matching matrix after loading adds one hint per problem, even if repeated.
Only a first correct answer with neither hints nor this check earns the encryption star.
Challenge hint counts remain 0–4. Recovery hint counts allow any nonnegative safe integer
because level 3 can repeat. Resetting a puzzle does not reset its in-page hint count.
The first correct answer is retained. Zero hints earns a star; migrated legacy
entries have hintsUsed:null, so they never gain a retrospective star.
Migration rejects malformed data, unknown keys and invalid ranges.

Record progress only through `UI.recordProgress(event)`: reduce, save, redraw.
Events: matrix-saved, encrypted, step-rendered, decrypted, analyzed,
reversed-selected, encipher-correct, challenge-correct, recovery-solved.
Encryption events accept only encryption IDs; challenge-correct includes H1; recovery events accept only recovery IDs.
Count a rule only when a new nonzero playback position is actually rendered;
repainting the same pair for language changes does not count. Skipped pairs do
not count. rulesSeenNow is page-local and separate from saved rulesSeen.
Invalidate results after key/input/settings changes; keep a loaded challenge's
answer field outside the decryption output. Practice must not set its key.

M1 saves PLAYFAIR EXAMPLE; M2 encrypts HELLO with the default matrix; M3 sees all
three encryption rules; M4 encrypts MEET ME TONIGHT with the default matrix;
M5 decrypts KCNVMP with the default matrix; M6 decrypts BNSY with ANIMAL.
M7 requires an analyzed event with verdict impossible; consistent or empty never
completes it. M8 requires selection in the reversed-pair list. Their navigation
targets the analysis tab, sample selector, Analyze button and (M8) reversal list.
Use standard rules for M2–M6. C2/C3 are locked by C1/C2; R2/R3 are locked by R1/R2.
E2/E3 are locked by E1/E2; H1 is locked by C3. Encryption loading never changes the matrix or plaintext input.
E guide steps: load, match the required matrix, answer. Step 2 requires both the loaded
encryption ID and matching matrix so the default E1 square cannot skip loading.
H1 guide steps: set the matrix, load, decrypt the exact normalized message with no-change, answer.
R1–R3 guide steps target the Analysis tab, problem selector and recovery grid:
open Analysis, select the puzzle, place at least one nongiven letter, then solve it.
Navigation completion comes from the current snapshot, not saved achievements.
At <=480px, recovery pairs use two columns with compact rule names and full accessible labels.
Show contradictory pairs in the polite live region directly below the recovery square.

### Historical challenge sources

Retain the PT-109 ciphertext exactly as supplied by secondary sources (Programming Praxis,
https://programmingpraxis.com/2009/07/03/the-playfair-cipher/). Standard decryption rejects TT;
no-change reads it, merging J into I. Do not fix the COCE/COVE discrepancy in the ciphertext.
The attributed original is David Kahn, The Codebreakers (1996, p. 592), not consulted for this tool.
The date and reported plaintext come from https://en.wikipedia.org/wiki/Arthur_Reginald_Evans.
Show the explanation and source limitation only after a correct H1 answer; its keyword is public.

### Encryption Rules

| Position | Transformation |
|----------|---------------|
| Same row | Right shift (wrap) |
| Same column | Down shift (wrap) |
| Rectangle | Diagonal swap |

Standard preparation consumes two letters at a time, splitting only identical
letters in the current pair and padding an odd final letter. Never split a
duplicate across pair boundaries: SEEN stays SE EN. Normalize to uppercase,
merge J into I, and discard nonletters. If padding equals the source letter,
use Q for padding X, otherwise use X. Decryption keeps uppercase padding and
marks candidates without deleting them; genuine final X can also be a candidate.

Same-pair handling options:

- **Padding mode ON**: Standard preparation with X/Q/Z padding
- **Padding mode OFF**: Nonstandard no-change / right-shift / bottom-right variants

Derive all exercise ciphertexts and README table results from PlayfairCore,
never from hand-calculated or independent legacy algorithms. Tests must confirm
every exercise against its original answer and keyword. Do not change expected
values to make failing tests pass.

## Localization and Security

Keep user-facing strings, including validation and hints, in matching ja/en
dictionaries in i18n.js. Initial language: valid ?lang=ja|en, then the saved
choice, then Japanese for navigator.language starting with ja, otherwise English.
A URL override must not be saved automatically. Save only an explicit switch.
Maintain README.en.md alongside README.md, including the same mission/known-answer
tables, challenge hints, complete file tree, and corresponding screenshots.
Other application JS must not contain Japanese literals
(comments are allowed). Update html.lang with the selected language.

The meta CSP allows scripts and styles only from self, without unsafe-inline.
Do not add style attributes, inline handlers, external scripts, fonts, or APIs.
Use textContent and DOM APIs for dynamic content. Only fixed help
dictionary templates may use innerHTML; never interpolate user input there.
Use no-referrer and noopener noreferrer for external links. Do not add
frame-ancestors to a meta CSP because it has no effect there.
Analysis creates a Day009 Frequency Analyzer link without fetching anything.
Ciphertext leaves the tool only when the user clicks that link, in the URL;
preserve case and punctuation, and remove stale href values when input changes.
Day009 counts overlapping digrams within words, not fixed Playfair pairs.

## Automated Tests

Run npm test (node --test) with Node.js 22 or newer, without npm install.
The Test workflow in .github/workflows/test.yml runs on push and pull_request.

| File | Responsibility |
|------|----------------|
| test/cipher.test.js | Exact known answers, preparation, variants, candidates, validation, 200 seeded roundtrips |
| test/analysis.test.js | All eight reference inputs, pair counts, reversal decryptions and 200 seeded reversal cases |
| test/recovery.test.js | Three exact puzzle datasets, 9/17/22 deduction steps, hints and 25 cyclic shifts across all 600 pairs |
| test/exercises.test.js | Ten exercises/challenges, encryption preparation and rules, PT-109 variants, answer validation |
| test/progress.test.js | Missions, migration, reducer, locks, stars, snapshot steps, blocked storage |
| test/i18n.test.js | Matching dictionaries, translation calls, literal policy, help rules |
| test/html.test.js | CSP, referrer, ARIA, four tabs, labels, buttons, defer order, inline attribute restrictions |
| test/contrast.test.js | All 18 existing light/dark pairs plus analysis and recovery pairs meet 4.5:1 |
| test/format.test.js | Maximum line lengths and minimum readable source line counts |
| test/readme.test.js | Recomputed tables, exact hints, YAML metadata, complete tree, image references |

Also check HTTP and file:// with existing browser tooling: five viewport widths
(1280/768/390/360/320), both languages/themes, keyboard operation, reduced motion,
blocked storage, rejected clipboard writes, and zero console/CSP/network errors.
Keep header p word-break:keep-all and verify whole subtitle words with Range at 320/360px.
Complete all eighteen missions through the guide to reach 18/18 and 210/210pt.
Do not install new dependencies for these checks.

## GitHub Pages Deployment

`.nojekyll` prevents Jekyll processing. Publish changes through a tested working
branch and pull request, not a direct push to main. Confirm main Test and Pages
deployment success and compare the served bytes with the committed files.

## Educational Context

This is an educational tool for a classical cipher. The Playfair cipher is NOT secure for modern use - ensure this is clear in any UI additions.
