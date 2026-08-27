# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Dansk is a Danish vocabulary trainer ("learn Danish by swiping"). It's a static site with no build system, package manager, or bundler — plain HTML/CSS/JS loaded directly by the browser via ES modules. Danish is always the language being learned; the app asks the learner which language they already speak (their "home language") on first launch and shows translations in that language from then on.

## Development

There are no install/build/lint commands and no automated test suite. Because [js/app.js](js/app.js) uses `import`/`export`, the app must be served over `http://`, not opened as a `file://` URL:

```
npx serve .
```

then open the printed local URL. To verify UI changes, drive it with Playwright (or similar) and screenshot — there's no other way to check correctness here.

## Deployment

GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which publishes the repo root on every push to `main`. Repo Settings → Pages → Source must be set to "GitHub Actions" (one-time, done in the GitHub UI, not from this repo).

## Architecture

- **[index.html](index.html)**: page shell only — header markup (brand, nav tabs, language button) and a `<main id="dk-view">` mount point. Tab labels and the language button are populated/translated by JS at runtime, not hardcoded here.
- **[css/app.css](css/app.css)**: all styles, including the first-run language picker (`.dk-picker*`).
- **[data/words.js](data/words.js)**: the vocabulary itself, one entry per line as `da|en|uk` inside a template literal (`WORDS_RAW`). `da` is Danish (fixed, always the target language); `en`/`uk` are translations for each supported home language, in the same column order as `HOME_LANGUAGES` in i18n.js and `FIELDS` in app.js — all three must stay in sync when adding a language.
- **[js/i18n.js](js/i18n.js)**: `HOME_LANGUAGES` maps a home-language code to its display names and a full `strings` dictionary for every piece of UI chrome (tab labels, buttons, hints, pluralized counts, etc). `t(homeCode, key, vars)` looks up and interpolates a string; pluralized strings are stored as an array of forms and resolved via each language's `plural(n, forms)` function (English: singular/plural; Ukrainian: the three-form ru/uk counting rule).
- **[js/app.js](js/app.js)**: everything else, as a single IIFE:
  - **App state** (`S`): `{home, stats, step, dir, autoSpeak, totals, runStep, runRight, runWrong, runResults, runWords, missionRun, missionRight, missionWrong, missionsCompleted}`, persisted (see below). `home` is the chosen home-language code, or `null` until the picker has been completed. `view`, `current`, `revealed`, `busy`, `pickerOpen` are transient UI state, not persisted.
  - **Boot gate**: `render()` always shows the language picker (`renderPicker()`) when `!S.home || pickerOpen`, regardless of which tab is selected — this is what enforces "pick a language before the real app launches." The header's language button sets `pickerOpen = true` to reopen the picker later (with a Cancel option, since a language is already set); picking a language on first run has no cancel.
  - **Three views** after a language is picked, switched via `setView()`/`render()`: `study` (swipe-card practice deck), `words` (searchable/filterable browse list), `stats` (progress dashboard with reset). Each `render*()` rebuilds `#dk-view`'s innerHTML from scratch via string concatenation and rewires event handlers — no templating library or virtual DOM.
  - **Runs**: study direction isn't user-picked — the deck runs in fixed 5-card "runs" (`RUN_LEN = 5`) that alternate `da-home`/`home-da` on every run boundary (`S.dir` tracks the current one, `S.runStep`/`runRight`/`runWrong` the in-progress tally; `S.runResults`/`S.runWords` are parallel per-card arrays — boolean knew-it and the Danish word answered — used to list missed words on the run-end panel). `renderStudy()` shows `renderRunEnd()` — a % score panel with a "start next run" button (`startNextRun()`) — once `S.runStep >= RUN_LEN`, instead of the card.
  - **Missions**: `MISSION_LEN = 5` runs (25 cards) make up one mission — the intended core play session. `S.missionRun` counts completed runs in the current mission, `S.missionRight`/`S.missionWrong` are the running mission tally (folded in from each run's totals in `answer()` the instant `S.runStep` hits `RUN_LEN`), and `S.missionsCompleted` is an all-time counter. `renderRunEnd()` reads these to show mission progress (dot track + "Run X of 5"), words missed this run, and correct/runs-left tallies; once `S.missionRun >= MISSION_LEN` it swaps to a "Mission complete" variant. `startNextRun()` rolls the mission counters over (and bumps `missionsCompleted`) whenever it's called with a mission already finished — there's currently no dedicated "mission complete, pick what's next" screen beyond that one panel, and no mission history/stats surfaced anywhere outside the run-end panel (Progress tab is still per-word, not per-mission).
  - **Scheduler**: `pickNext()` draws from the non-retired word pool, weighted so previously-missed words (`MISS_WEIGHT = 3`) come up more often. A word retires (leaves rotation) the moment it's answered "knew it" once; "didn't know" just increments its miss count and keeps it in play. Scheduler logic is keyed only by `w.da` and is language-agnostic.
  - **Persistence**: `save()`/`load()` debounce writes to `window.localStorage` and, if present, an optional external `window.storage` key-value API (`get`/`set`/`delete`, raced against a timeout since it may not exist or may hang). `localStorage` is the fallback of record. `applySaved()` migrates pre-i18n saves (`S.dir` values `"da-en"`/`"en-da"` from when the home language was hardcoded to English) onto the generic `"da-home"`/`"home-da"` values used now.
  - **Card interaction**: `attachDrag()` wires pointer events (not separate touch/mouse handlers) for the swipe gesture — drag to reveal/answer, tap to reveal, with arrow-key equivalents in the top-level `keydown` listener. Swipe distance beyond `SWIPE = 80`px commits an answer.
  - **Speech**: pronunciation is always Danish regardless of home language. `pickVoice()` looks for an installed `da`/`da-*` voice (falls back silently if none exists); `unlockSpeech()` primes the speech engine on the first touch/pointer event because iOS/Android require speech to originate from a real user gesture.

## Adding a home language

Documented in [README.md](README.md); in short: add a column to every line of `data/words.js`, add a matching entry (with a fully-translated `strings` object) to `HOME_LANGUAGES` in `js/i18n.js`, and add the code to `FIELDS` in `js/app.js` in the same position. The picker, search, and every UI string then pick it up automatically — no other code changes needed.

## Notes for changes

- Keep the app dependency-free (no build step, no npm packages at runtime) — that's a deliberate constraint for simple GitHub Pages hosting, not an oversight.
- The `window.storage` integration is defensive (feature-detected, raced against timeouts, wrapped in try/catch) because it's an optional host-provided API, not a guaranteed browser global — preserve that pattern if touching `save()`/`load()`.
- Every user-facing string in `js/app.js` should go through `tt()`/`t()` from `i18n.js`, not be hardcoded — that's what keeps the app multi-language. Interpolated `{name}`-style placeholders in `i18n.js` values are matched literally by `t()`.
- View rendering uses `esc()` for any interpolated word/translated text before it goes into `innerHTML` — keep using it for anything sourced from `WORDS`, `i18n.js` strings, or user input, to avoid HTML injection.
