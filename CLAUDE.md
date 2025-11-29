# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playfair CipherLab is a visual learning tool for the Playfair cipher, a classical cryptography method. Part of the "100 Security Tools with Generative AI" initiative (Day 027). Deployed as a static site on GitHub Pages.

**Live demo**: https://ipusiron.github.io/playfair-cipherlab/

## Development Commands

```bash
# Serve locally
python -m http.server 8000
# or
npx http-server
```

No build step required - vanilla HTML/CSS/JavaScript.

## Architecture

### Core Modules (in load order)

1. **cipher.js** - `PlayfairCipher` class: core encryption/decryption algorithm
   - 5×5 matrix management (I/J combined as "I")
   - Keyword-to-matrix generation
   - Pair-based encryption/decryption with three same-pair rules

2. **exercises.js** - `ExerciseManager` class: challenge/practice data and progress
   - LocalStorage-based progress persistence
   - Level unlock system (3 levels)
   - Answer validation with flexible matching

3. **ui.js** - `UI` class (1600+ lines): main controller
   - Tab management and form handling
   - Animation step control for encryption/decryption visualization
   - Challenge flow with hint system

4. **animations.js** - `AnimationManager`: fade/highlight effects

5. **theme.js** - Dark mode toggle with localStorage persistence

6. **help.js** - Help modal control

7. **i18n.js** - `I18nManager` (730+ lines): full Japanese/English localization

8. **main.js** - Entry point, initializes i18n then UI

### Key State

- `UI.cipher` - Current PlayfairCipher instance with active matrix
- `ExerciseManager.progress` - Saved in `localStorage['playfair-progress']`
- `I18nManager.currentLang` - Saved in `localStorage['playfair-lang']`

### Encryption Rules

| Position | Transformation |
|----------|---------------|
| Same row | Right shift (wrap) |
| Same column | Down shift (wrap) |
| Rectangle | Diagonal swap |

Same-pair handling options:
- **Padding mode ON**: Insert X/Q/Z between same letters
- **Padding mode OFF**: No-change / Right-shift / Bottom-right rules

## GitHub Pages Deployment

`.nojekyll` file prevents Jekyll processing. Push to main branch and enable Pages from repository settings.

## Educational Context

This is an educational tool for a classical cipher. The Playfair cipher is NOT secure for modern use - ensure this is clear in any UI additions.
