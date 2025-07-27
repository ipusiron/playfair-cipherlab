# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playfair CipherLab is a visual learning tool for the Playfair cipher, a classical cryptography method. The project is part of the "100 Security Tools with Generative AI" initiative (Day 027).

## Project Status

This is currently a greenfield project with specifications documented in README.md but no implementation yet. The project is intended to be deployed as a static site on GitHub Pages.

## Key Implementation Requirements

### Technology Stack
- Frontend: HTML/CSS/JavaScript (vanilla or lightweight framework)
- Deployment: GitHub Pages (static site)
- No backend required - all processing client-side

### Core Features to Implement

1. **Key Generation Tab**
   - 5×5 matrix editor (A-Z excluding J)
   - Text-based editing with validation
   - I/J combination handling

2. **Encryption Tab**
   - Plaintext input with preprocessing
   - Visual pair-based encryption with animations
   - Configurable padding character (x/q/z)

3. **Decryption Tab**
   - Ciphertext processing
   - Step-by-step visual decryption
   - Result display with I/J ambiguity notice

### Development Commands

Since this is a static site project, consider these common setups:

**If using vanilla HTML/CSS/JS:**
```bash
# Serve locally (if python is available)
python -m http.server 8000

# Or using Node.js http-server (if installed)
npx http-server
```

**If setting up with a build system:**
```bash
# Initialize npm project
npm init -y

# Common development setup
npm install --save-dev vite
npm run dev  # If using Vite

# Build for production
npm run build
```

## Architecture Guidelines

### File Structure (Recommended)
```
/
├── index.html          # Main entry point
├── css/
│   └── styles.css      # Main styles
├── js/
│   ├── cipher.js       # Core cipher logic
│   ├── ui.js           # UI interactions
│   └── animations.js   # Visual animations
└── assets/             # Any images/icons
```

### Key Implementation Notes

1. **Matrix Representation**: Use a 2D array or flat array with index calculations for the 5×5 matrix
2. **Character Handling**: Normalize all input to uppercase, handle I/J substitution consistently
3. **Animation System**: Implement a queue-based animation system for sequential pair processing
4. **State Management**: Keep cipher key matrix in a central state accessible to all tabs

### GitHub Pages Deployment

The project includes a `.nojekyll` file to prevent Jekyll processing. Deploy by:
1. Pushing to main branch
2. Enabling GitHub Pages in repository settings
3. Selecting source as root (`/`) on main branch

### Security Considerations

This is an educational tool for a classical cipher. Make it clear in the UI that Playfair cipher is NOT secure for modern cryptographic use and is for educational purposes only.

## Testing Approach

Consider implementing:
- Unit tests for cipher logic (encryption/decryption functions)
- Visual regression tests for UI components
- Manual testing checklist for animations and interactions

## Common Development Tasks

When implementing features:
1. Start with the cipher logic module - pure functions for encryption/decryption
2. Build the UI layer on top of the logic
3. Add animations last to avoid complexity during initial development
4. Test with known Playfair cipher examples from cryptography resources