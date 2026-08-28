# danishtinder
Learn danish by swiping

On first launch the app asks which language you speak (English, Ukrainian, Turkish, Spanish or Armenian) and shows every Danish word's translation in that language from then on. You can change it later from the language button in the header.

## Project layout

- `index.html` - page shell
- `css/app.css` - all styles
- `js/app.js` - app logic (state, views, scheduler, speech, drag/swipe)
- `js/i18n/` - UI text, one file per home language (`en.js`, `uk.js`, `tr.js`, `es.js`, `hy.js`) plus `index.js` (the language registry and `t()`)
- `data/words.da.js` - the Danish vocabulary spine, one entry per line, in deck order
- `data/words.<code>.js` - translations for one home language, as `<danish>|<translation>` per line
- `data/words.js` - stitches the spine and the translation files into the word list

No build step - it's plain ES modules loaded directly by the browser.

## Running locally

Because the app uses ES modules (`import`/`export`), it needs to be served over `http://`, not opened directly as a `file://` URL. Any static file server works, e.g.:

```
npx serve .
```

then open the printed local URL.

## Adding a home language

1. Copy `data/words.en.js` to `data/words.<code>.js` and translate the right-hand side of every line. The Danish left-hand side is the key - leave it alone. Lines may be missing or out of order; anything absent just renders blank for that language, so a partial translation is safe to ship.
2. Copy `js/i18n/en.js` to `js/i18n/<code>.js` and translate every value, including `name`, `nativeName`, and `flag` (an inline SVG, so flags need no image files or icon font). Counted strings are objects keyed by `Intl.PluralRules` category - use the categories your language actually has (`one`/`other` for English, `one`/`few`/`many` for Ukrainian). You do not write a plural function; the category is derived from the language code. Keys you leave out fall back to English and warn in the console.
3. Register both halves: import the words file in `data/words.js` (add it to `TRANSLATION_SETS`) and the strings file in `js/i18n/index.js` (add it to `HOME_LANGUAGES`).

The language picker (which lists each language by its flag and its own name), search, and every UI string pick up the new language automatically - no changes to `js/app.js` are needed. If you register only one of the two halves, the app warns about it in the console at startup.

## Deployment

Deployed via GitHub Pages using the GitHub Actions workflow in `.github/workflows/deploy.yml`, which publishes the repository root on every push to `main`. In the repo's Settings → Pages, set the source to "GitHub Actions" once.
