# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Cross-platform browser extension that replaces GitHub's "Open with GitHub Desktop" clone option with "Open with Fork" on `github.com/*` pages. Supports Chrome (Manifest V3) and Safari (Manifest V2). Single source file (`src/index.ts`), no runtime dependencies.

## Build

```bash
npm install              # Install dev dependencies
npm run build:chrome     # Build Chrome version → dist/
npm run build:safari     # Build Safari version → dist/
```

Build scripts compile TypeScript (`tsc`) then copy the appropriate manifest and icon into `dist/`. Chrome uses `manifest-chrome.json`, Safari uses `manifest-safari.json`.

## Architecture

All logic is in `src/index.ts`. The extension works as a content script:

1. `startObserveMenuCreate()` — attaches a `MutationObserver` to `document.body` watching for DOM changes
2. `handleMutation()` — filters mutations for GitHub's portal root element (`__primerPortalRoot__`)
3. `handleMenuRoot()` — finds the "Open with GitHub Desktop" menu item via `querySelectorAll` + text match, clones and replaces it with "Open with Fork". Uses `data-fork-processed` attribute to prevent repeated processing.
4. `onFork()` — calls `findSshUrl()` to get the clone URL, opens Fork via `x-github-client://openRepo/<ssh-url>` URL scheme with try-catch for Safari compatibility
5. `findSshUrl()` — extracts SSH clone URL by reading `<input>` element values first, falls back to regex scan of page HTML

## Key Details

- Content script injects on `*://github.com/*` (configured in each manifest)
- Relies on GitHub's DOM structure: the portal root `__primerPortalRoot__` and menu item text "Open with GitHub Desktop". GitHub UI changes frequently break this — most historical fixes are DOM selector updates.
- TypeScript strict mode is OFF; target is ES5/CommonJS
