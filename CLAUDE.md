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
- **[data/words.da.js](data/words.da.js)**: the Danish vocabulary spine — one entry per line inside a template literal (`DANISH`), in deck order. This file alone decides which entries exist and in what order.
- **[data/words.en.js](data/words.en.js) / [data/words.uk.js](data/words.uk.js)**: one translation file per home language, `<danish>|<translation>` per line inside `TRANSLATIONS`. The Danish side is the lookup key, so order doesn't matter and entries may be missing — a missing entry renders blank for that language rather than shifting anything, which is what makes partial translations safe.
- **[data/words.js](data/words.js)**: the registry — imports the spine plus every translation file, and exports the `WORDS` array (`{da, en, uk, …}` per entry) and `HOME_CODES`. Adding a language means adding an import here, not editing 1180 lines. Warns on the console if a language is missing translations.
- **[js/i18n/index.js](js/i18n/index.js)**: `HOME_LANGUAGES` maps a home-language code to its imported dictionary module; `t(homeCode, key, vars)` looks up and interpolates a string. Counted strings are objects keyed by CLDR plural category and resolved via `Intl.PluralRules` for that language code — there are no hand-written plural functions. A key missing from a language falls back to `DEFAULT_HOME` (and warns once), so a partially translated language degrades to English instead of to blank UI.
- **[js/i18n/en.js](js/i18n/en.js), [js/i18n/uk.js](js/i18n/uk.js)**: one file per home language, each default-exporting `{code, name, nativeName, strings}`.
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

Documented in [README.md](README.md); in short: copy `data/words.en.js` to `data/words.<code>.js` and translate the right-hand side of each line, copy `js/i18n/en.js` to `js/i18n/<code>.js` and translate every value, then register both (`TRANSLATION_SETS` in [data/words.js](data/words.js), `HOME_LANGUAGES` in [js/i18n/index.js](js/i18n/index.js)). No `js/app.js` change is needed — translations are read by language code, never by column position — and `checkLanguages()` at the top of [js/app.js](js/app.js) warns on the console if only one of the two halves is registered.

## Notes for changes

- Keep the app dependency-free (no build step, no npm packages at runtime) — that's a deliberate constraint for simple GitHub Pages hosting, not an oversight.
- The `window.storage` integration is defensive (feature-detected, raced against timeouts, wrapped in try/catch) because it's an optional host-provided API, not a guaranteed browser global — preserve that pattern if touching `save()`/`load()`.
- Every user-facing string in `js/app.js` should go through `tt()`/`t()` from `js/i18n/index.js`, not be hardcoded — that's what keeps the app multi-language. Interpolated `{name}`-style placeholders in the language files are matched literally by `t()`.
- View rendering uses `esc()` for any interpolated word/translated text before it goes into `innerHTML` — keep using it for anything sourced from `WORDS`, `js/i18n/` strings, or user input, to avoid HTML injection.
