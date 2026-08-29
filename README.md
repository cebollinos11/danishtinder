# danishtinder
Learn danish by swiping

On first launch the app asks which language you speak (English, Ukrainian, Turkish, Spanish or Macedonian) and shows every Danish word's translation in that language from then on. You can change it later from the language button in the header.

## Project layout

- `index.html` - page shell
- `css/app.css` - all styles
- `js/app.js` - app logic (state, views, scheduler, speech, drag/swipe)
- `js/i18n/` - UI text, one file per home language (`en.js`, `uk.js`, `tr.js`, `es.js`, `mk.js`) plus `index.js` (the language registry and `t()`)
- `data/words.da.js` - the Danish vocabulary spine, one entry per line, in deck order
- `data/words.<code>.js` - translations for one home language, as `<danish>|<translation>` per line
- `data/words.js` - stitches the spine and the translation files into the word list
- `data/sentences.da.js` / `data/sentences.<code>.js` / `data/sentences.js` - the same three-part
  shape for the sentence deck: real Danish sentences from [Tatoeba](https://tatoeba.org),
  used under CC-BY 2.0 FR. Unlike the word deck these are generated - see
  `tools/tatoeba_sentences.py` - and every run ends on one of them
- `data/parse.js` - the shared `<danish>|<translation>` parser both decks use
- `tools/` - one-off Python scripts for building and checking the sentence deck. They are
  developer tooling, not part of the site; nothing in `tools/` is loaded by the browser

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
4. Optionally add sentences: copy `data/sentences.en.js` to `data/sentences.<code>.js`, translate it, and register it in `data/sentences.js`. Tatoeba only supplies official translations for a few languages, so most of these are written by hand; `tools/fill_translations.py` merges a `<index> <translation>` list into the file without overwriting what is already there, and `tools/check_alignment.py` flags lines whose punctuation no longer matches the Danish, which is the usual sign that an index slipped. Skipping this step leaves sentence cards blank in that language while the word deck still works.

The language picker (which lists each language by its flag and its own name), search, and every UI string pick up the new language automatically - no changes to `js/app.js` are needed. If you register only one of the two halves, the app warns about it in the console at startup.

## Credits

The sentence deck comes from [Tatoeba](https://tatoeba.org), whose sentences are released
under [CC-BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/). English translations
are Tatoeba contributors' work; the other languages were translated for this project.
The Danish word list is our own.

## Deployment

Deployed via GitHub Pages using the GitHub Actions workflow in `.github/workflows/deploy.yml`, which publishes the repository root on every push to `main`. In the repo's Settings → Pages, set the source to "GitHub Actions" once.
