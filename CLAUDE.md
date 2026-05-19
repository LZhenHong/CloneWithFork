# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chrome extension (Manifest V3) that replaces GitHub's "Open with GitHub Desktop" clone option with "Open with Fork" on `github.com/*` pages. Single source file (`src/index.ts`), no runtime dependencies.

## Build

```bash
tsc            # Compile src/index.ts → dist/index.js
npm install    # Install dev dependencies (@types/chrome)
```

No build scripts in package.json — run `tsc` directly. Output goes to `dist/`.

## Architecture

All logic is in `src/index.ts`. The extension works as a content script:

1. `startObserveMenuCreate()` — attaches a `MutationObserver` to `document.body` watching for DOM changes
2. `handleMutation()` — filters mutations for GitHub's portal root element (`__primerPortalRoot__`)
3. `handleMenuRoot()` — finds the "Open with GitHub Desktop" menu item, clones and replaces it with "Open with Fork"
4. `onFork()` — extracts the SSH clone URL from page HTML via regex, opens Fork via `x-github-client://openRepo/<ssh-url>` URL scheme

## Key Details

- Content script injects on `*://github.com/*` (configured in `manifest.json`)
- Relies on GitHub's DOM structure: the portal root `__primerPortalRoot__` and menu item text "Open with GitHub Desktop". GitHub UI changes frequently break this — most historical fixes are DOM selector updates.
- The SSH URL is extracted by scraping the entire page HTML with regex, not from a specific DOM element
- TypeScript strict mode is OFF; target is ES5/CommonJS
