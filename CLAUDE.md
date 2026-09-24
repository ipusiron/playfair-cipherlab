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

Load cipher, analysis, exercises, progress, guide, ui, theme, help, i18n and main
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

2. **exercises.js** - `ExerciseManager` class: challenge/practice data and pure answer validation
   - No DOM, localStorage, or i18n access; no progress state or writes
   - Validate the actual matrix before accepting original, prepared, or candidate-stripped answers

2a. **progress.js** - Pure `ProgressCore`: eleven missions, event reducer, locks,
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

4. **theme.js** - Dark mode button and safe theme persistence

5. **help.js** - Help dialog, focus trap, Escape, and focus restoration

6. **i18n.js** - `I18nManager`: Japanese/English dictionaries, including help templates

7. **main.js** - Entry point, initializes i18n then UI

Other files: index.html supplies semantic markup and CSP; css/styles.css holds
the light/dark palette and responsive layout. assets/ contains five Japanese README
screenshots and assets/en/ contains four English screenshots. test/ has nine files.

### Key State

- `UI.cipher` - Current PlayfairCipher instance with active matrix
- `UI.playback.encryption` and `.decryption` - `{ steps, done, playing, timerId }`
- `UI.progress` - Version-2 progress saved in `localStorage['playfair-progress']`
- `UI.matrixSource` - Default, keyword or directly entered matrix; never persisted
- `UI.getSnapshot()` - Live drafts, editor/tab state, loaded exercise, valid results, rulesSeenNow and lastCorrect
- `UI.analysisResult` / `UI.selectedReversed` - Visible analysis and selected reversal, or null;
  snapshot `analysisDraft` is trimmed but never cipher-normalized (keep J and punctuation)
- `I18nManager.currentLang` - Saved in `localStorage['playfair-language']`
- Theme - Saved in `localStorage['theme']`

Validate all saved data and catch getItem/setItem failures. Only progress,
language, and theme are persisted; never save keys or input/output text.

Progress has the shape `{version:2, missions:{}, challenges:{}, rulesSeen:[]}`.
Missions stores only M1–M8; challenge entries store fixed points and hintsUsed.
Keep version 2 and accept existing saves with only M1–M6. Total missions comes
from MISSIONS.length; maximum score remains 60. Analysis missions award no points.
C1/C2/C3 are inferred from mystery-01/02/03 entries and award 10/20/30 points.
The first correct answer is retained. Zero hints earns a star; migrated legacy
entries have hintsUsed:null, so they never gain a retrospective star.
Migration rejects malformed data, unknown keys and invalid ranges.

Record progress only through `UI.recordProgress(event)`: reduce, save, redraw.
Events: matrix-saved, encrypted, step-rendered, decrypted, analyzed,
reversed-selected, challenge-correct.
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
Use standard rules for M2–M6. Only C2 and C3 are locked, by C1 and C2 respectively.
Navigation completion comes from the current snapshot, not saved achievements.

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
| test/exercises.test.js | Six exercises, answer acceptance/rejection, pure fixed-point return |
| test/progress.test.js | Missions, migration, reducer, locks, stars, snapshot steps, blocked storage |
| test/i18n.test.js | Matching dictionaries, translation calls, literal policy, help rules |
| test/html.test.js | CSP, referrer, ARIA, four tabs, labels, buttons, defer order, inline attribute restrictions |
| test/contrast.test.js | All 18 existing light/dark pairs plus analysis highlights meet 4.5:1 |
| test/format.test.js | Maximum line lengths and minimum readable source line counts |
| test/readme.test.js | Recomputed tables, exact hints, YAML metadata, complete tree, image references |

Also check HTTP and file:// with existing browser tooling: four viewport widths
(1280/768/390/320), both languages/themes, keyboard operation, reduced motion,
blocked storage, rejected clipboard writes, and zero console/CSP/network errors.
Do not install new dependencies for these checks.

## GitHub Pages Deployment

`.nojekyll` prevents Jekyll processing. Publish changes through a tested working
branch and pull request, not a direct push to main. Confirm main Test and Pages
deployment success and compare the served bytes with the committed files.

## Educational Context

This is an educational tool for a classical cipher. The Playfair cipher is NOT secure for modern use - ensure this is clear in any UI additions.
