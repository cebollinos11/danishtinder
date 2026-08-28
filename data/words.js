// Vocabulary registry: stitches the Danish spine (words.da.js) together with
// one translation file per home language (words.<code>.js) into the WORDS
// array the app consumes.
//
// To add a home language:
//   1. Copy words.en.js to words.<code>.js and translate the right-hand side
//      of every line (the Danish left-hand side is the key - leave it alone).
//   2. Import it below and add it to TRANSLATION_SETS under its code.
//   3. Add a matching entry to HOME_LANGUAGES in js/i18n/index.js.
// Nothing else needs to change - js/app.js reads translations by language code,
// never by column position.
import { DANISH } from "./words.da.js";
import { TRANSLATIONS as en } from "./words.en.js";
import { TRANSLATIONS as uk } from "./words.uk.js";
import { TRANSLATIONS as tr } from "./words.tr.js";
import { TRANSLATIONS as es } from "./words.es.js";
import { TRANSLATIONS as hy } from "./words.hy.js";
import { TRANSLATIONS as mk } from "./words.mk.js";

var TRANSLATION_SETS = { en: en, uk: uk, tr: tr, es: es, hy: hy, mk: mk };

// "da|translation" lines -> { danish: translation }. Blank lines are skipped so
// translation files can be grouped into readable sections.
function parseTranslations(raw) {
  var map = {};
  var lines = raw.trim().split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    var sep = line.indexOf("|");
    if (sep < 0) continue;
    map[line.slice(0, sep).trim()] = line.slice(sep + 1).trim();
  }
  return map;
}

export var HOME_CODES = Object.keys(TRANSLATION_SETS);

var MAPS = {};
for (var c = 0; c < HOME_CODES.length; c++)
  MAPS[HOME_CODES[c]] = parseTranslations(TRANSLATION_SETS[HOME_CODES[c]]);

// One object per Danish entry: { da, <code>: translation, ... }. A translation
// missing from a language's file becomes "" rather than an error, so a
// half-finished language still runs.
export var WORDS = DANISH.trim()
  .split("\n")
  .map(function (line) {
    return line.trim();
  })
  .filter(function (da) {
    return !!da;
  })
  .map(function (da) {
    var w = { da: da };
    for (var i = 0; i < HOME_CODES.length; i++)
      w[HOME_CODES[i]] = MAPS[HOME_CODES[i]][da] || "";
    return w;
  });

// Surface incomplete translations in the console instead of letting them show
// up as silent blanks in the UI.
for (var j = 0; j < HOME_CODES.length; j++) {
  var code = HOME_CODES[j];
  var missing = WORDS.filter(function (w) {
    return !w[code];
  }).length;
  if (missing)
    console.warn(
      "[words] " + code + ": " + missing + " of " + WORDS.length + " entries have no translation"
    );
}
