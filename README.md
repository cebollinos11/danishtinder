# danishtinder
Learn danish by swiping

On first launch the app asks which language you speak (English or Ukrainian) and shows every Danish word's translation in that language from then on. You can change it later from the language button in the header.

## Project layout

- `index.html` - page shell
- `css/app.css` - all styles
- `js/app.js` - app logic (state, views, scheduler, speech, drag/swipe)
- `js/i18n.js` - UI text per home language, plus the language picker's language list
- `data/words.js` - the Danish vocabulary, one entry per line as `da|en|uk`

No build step - it's plain ES modules loaded directly by the browser.

## Running locally

Because the app uses ES modules (`import`/`export`), it needs to be served over `http://`, not opened directly as a `file://` URL. Any static file server works, e.g.:

```
npx serve .
```

then open the printed local URL.

## Adding a home language

1. Add a new column to every line in `data/words.js` (`da|en|uk|<code>`), keeping the existing columns unchanged.
2. In `js/i18n.js`, add an entry to `HOME_LANGUAGES` with that language's code, its name (in English) and native name, and a full `strings` object translating every key (copy the `en` block as a starting point).
3. In `js/app.js`, add the new code to the `FIELDS` array in the same position as the column you added.

The language picker, search, and every UI string pick up the new language automatically.

## Deployment

Deployed via GitHub Pages using the GitHub Actions workflow in `.github/workflows/deploy.yml`, which publishes the repository root on every push to `main`. In the repo's Settings → Pages, set the source to "GitHub Actions" once.
