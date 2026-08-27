# Dev environment notes

Tools confirmed available in this container, for future sessions that need to serve or verify the app (see [CLAUDE.md](CLAUDE.md) for why: no build step, and UI changes need a real browser check).

- **Node** v24 / **npm** v11 — `npx serve .` serves the static site (used for local dev per CLAUDE.md).
- **Python** 3.12 (`python3`).
- **git** 2.53, **gh** (GitHub CLI) 2.88 — authenticated, usable for PRs/issues.
- **Playwright** — not preinstalled globally, but `npm install playwright` (in a scratch dir, `--no-save`) picks it up instantly because the Chromium/headless-shell/ffmpeg browser binaries are already cached at `~/.cache/ms-playwright` (`chromium-1234`, `chromium_headless_shell-1234`, `ffmpeg-1011`) — no download needed. Drive it with a small Node script (`chromium.launch({ args: ['--no-sandbox'] })`); no need to pass `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD`, it's already satisfied by the cache.
- **`chromium-cli`** (the REPL-style driver some skills reference) is *not* installed — fall back to a plain Playwright Node script instead.

## Recipe: screenshot the app after a UI change

```bash
npx serve . -l 5566 &        # or any free port
cd /path/to/scratchpad
npm install playwright --no-save --silent
node verify.js                # launches chromium, navigates, screenshots
```

`verify.js` pattern: `require('playwright').chromium.launch({ args: ['--no-sandbox'] })`, `newPage`, `goto('http://localhost:5566/')`, interact (`click`/`fill`), `page.screenshot({ path: ... })`, then read the PNG back with the Read tool to actually look at it.
