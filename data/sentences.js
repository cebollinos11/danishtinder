// Sentence registry: stitches the Danish sentence spine (sentences.da.js)
// together with one translation file per home language into the SENTENCES
// array the app consumes. Same shape as WORDS, plus a `src` marker naming
// where the sentence came from.
//
// Unlike the word deck, this file is generated - see
// tools/tatoeba_sentences.py. The sentences are real Danish from Tatoeba
// (tatoeba.org), used under CC-BY 2.0 FR.
import { DANISH } from "./sentences.da.js";
import { parseTranslations } from "./parse.js";
import { TRANSLATIONS as en } from "./sentences.en.js";
import { TRANSLATIONS as uk } from "./sentences.uk.js";
import { TRANSLATIONS as tr } from "./sentences.tr.js";
import { TRANSLATIONS as es } from "./sentences.es.js";
import { TRANSLATIONS as mk } from "./sentences.mk.js";

var TRANSLATION_SETS = { en: en, uk: uk, tr: tr, es: es, mk: mk };

export var SENTENCE_CODES = Object.keys(TRANSLATION_SETS);

var MAPS = {};
for (var c = 0; c < SENTENCE_CODES.length; c++)
  MAPS[SENTENCE_CODES[c]] = parseTranslations(TRANSLATION_SETS[SENTENCE_CODES[c]]);

// One object per sentence: { da, src, <code>: translation, ... }. A missing
// translation becomes "" rather than an error, exactly as in the word deck,
// so a half-translated language still runs.
export var SENTENCES = DANISH.trim()
  .split("\n")
  .map(function (line) {
    return line.trim();
  })
  .filter(function (da) {
    return !!da;
  })
  .map(function (da) {
    var s = { da: da, src: "tatoeba" };
    for (var i = 0; i < SENTENCE_CODES.length; i++)
      s[SENTENCE_CODES[i]] = MAPS[SENTENCE_CODES[i]][da] || "";
    return s;
  });

for (var j = 0; j < SENTENCE_CODES.length; j++) {
  var code = SENTENCE_CODES[j];
  var missing = SENTENCES.filter(function (s) {
    return !s[code];
  }).length;
  if (missing)
    console.warn(
      "[sentences] " + code + ": " + missing + " of " + SENTENCES.length + " have no translation"
    );
}
