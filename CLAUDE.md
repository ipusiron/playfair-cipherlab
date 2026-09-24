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

0. **theme-init.js** - Synchronous script immediately after body opens; applies the
   validated saved theme or OS preference before the first paint.

1. **cipher.js** - Pure `PlayfairCore` functions and the `PlayfairCipher` adapter
   - 5×5 matrix management (I/J combined as "I")
   - Keyword-to-matrix generation
   - Standard pair preparation, encryption/decryption, padding candidates
   - Three optional, explicitly nonstandard same-pair variants
   - No DOM, storage, or translation dependency; conditional CommonJS export

2. **exercises.js** - `ExerciseManager` class: challenge/practice data and progress
   - Injected storage adapter; no direct DOM, localStorage, or i18n access
   - Level unlock system (3 levels)
   - Validate the actual matrix before accepting original, prepared, or candidate-stripped answers

3. **ui.js** - `UI` class: main controller
   - Tab management and form handling
   - Independent playback states; render synchronously from the completed pair count
   - Invalidate old output when input, settings, or the matrix changes
   - Challenge flow with hint system

4. **theme.js** - Dark mode button and safe theme persistence

5. **help.js** - Help dialog, focus trap, Escape, and focus restoration

6. **i18n.js** - `I18nManager`: Japanese/English dictionaries, including help templates

7. **main.js** - Entry point, initializes i18n then UI

Other files: index.html supplies semantic markup and CSP; css/styles.css holds
the light/dark palette and responsive layout. assets/ contains three README
screenshots. test/ contains the seven test files listed below.

### Key State

- `UI.cipher` - Current PlayfairCipher instance with active matrix
- `UI.playback.encryption` and `.decryption` - `{ steps, done, playing, timerId }`
- `ExerciseManager.progress` - Saved in `localStorage['playfair-progress']`
- `I18nManager.currentLang` - Saved in `localStorage['playfair-language']`
- Theme - Saved in `localStorage['theme']`

Validate all saved data and catch getItem/setItem failures. Only progress,
language, and theme are persisted; never save keys or input/output text.

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
dictionaries in i18n.js. Other application JS must not contain Japanese literals
(comments are allowed). Update html.lang with the selected language.

The meta CSP allows scripts and styles only from self, without unsafe-inline.
Do not add style attributes, inline handlers, external scripts, fonts, or APIs.
Use textContent and DOM APIs for dynamic content. Only fixed help/footer
dictionary templates may use innerHTML; never interpolate user input there.
Use no-referrer and noopener noreferrer for external links. Do not add
frame-ancestors to a meta CSP because it has no effect there.

## Automated Tests

Run npm test (node --test) with Node.js 22 or newer, without npm install.
The Test workflow in .github/workflows/test.yml runs on push and pull_request.

| File | Responsibility |
|------|----------------|
| test/cipher.test.js | Exact known answers, preparation, variants, candidates, validation, 200 seeded roundtrips |
| test/exercises.test.js | Six exercises, answer acceptance/rejection, points, corrupt or blocked storage |
| test/i18n.test.js | Matching dictionaries, translation calls, literal policy, help rules |
| test/html.test.js | CSP, referrer, ARIA, labels, buttons, inline attribute restrictions |
| test/contrast.test.js | All 18 light/dark text pairs meet 4.5:1 |
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
