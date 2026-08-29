// Sentence registry: stitches each Danish sentence spine together with one
// translation file per home language into the SENTENCES array the app
// consumes. Same shape as WORDS, plus a `src` marker naming where the
// sentence came from.
//
// There are two spines, because no single free corpus gives both natural
// Danish and volume:
//   tatoeba     - tatoeba.org, CC-BY 2.0 FR. Curated but ~98% translated from
//                 English, so only ~325 sentences read as native Danish.
//   hestenettet - the hest section of Danish Gigaword (hestenettet.dk, a
//                 Danish debate forum), CC0. Natively Danish throughout, which
//                 is where the volume comes from.
//
// Both are generated - see tools/tatoeba_sentences.py and
// tools/dagw_sentences.py. Adding a third source means adding an entry to
// DECKS below, nothing else.
import { parseTranslations } from "./parse.js";
import { DANISH as TATOEBA } from "./sentences.da.js";
import { TRANSLATIONS as t_en } from "./sentences.en.js";
import { TRANSLATIONS as t_uk } from "./sentences.uk.js";
import { TRANSLATIONS as t_tr } from "./sentences.tr.js";
import { TRANSLATIONS as t_es } from "./sentences.es.js";
import { TRANSLATIONS as t_mk } from "./sentences.mk.js";
import { DANISH as FORUM } from "./forum.da.js";
import { TRANSLATIONS as f_en } from "./forum.en.js";
import { TRANSLATIONS as f_uk } from "./forum.uk.js";
import { TRANSLATIONS as f_tr } from "./forum.tr.js";
import { TRANSLATIONS as f_es } from "./forum.es.js";
import { TRANSLATIONS as f_mk } from "./forum.mk.js";

var DECKS = [
  {
    src: "tatoeba",
    danish: TATOEBA,
    sets: { en: t_en, uk: t_uk, tr: t_tr, es: t_es, mk: t_mk },
  },
  {
    src: "hestenettet",
    danish: FORUM,
    sets: { en: f_en, uk: f_uk, tr: f_tr, es: f_es, mk: f_mk },
  },
];

export var SENTENCE_CODES = Object.keys(DECKS[0].sets);

// One object per sentence: { da, src, <code>: translation, ... }. A missing
// translation becomes "" rather than an error, exactly as in the word deck,
// so a half-translated language still runs.
export var SENTENCES = [];
for (var d = 0; d < DECKS.length; d++) {
  var deck = DECKS[d];
  var maps = {};
  for (var c = 0; c < SENTENCE_CODES.length; c++)
    maps[SENTENCE_CODES[c]] = parseTranslations(deck.sets[SENTENCE_CODES[c]]);

  var lines = deck.danish
    .trim()
    .split("\n")
    .map(function (line) {
      return line.trim();
    })
    .filter(function (da) {
      return !!da;
    });

  for (var i = 0; i < lines.length; i++) {
    var s = { da: lines[i], src: deck.src };
    for (var j = 0; j < SENTENCE_CODES.length; j++)
      s[SENTENCE_CODES[j]] = maps[SENTENCE_CODES[j]][lines[i]] || "";
    SENTENCES.push(s);
  }
}

for (var k = 0; k < SENTENCE_CODES.length; k++) {
  var code = SENTENCE_CODES[k];
  var missing = SENTENCES.filter(function (s) {
    return !s[code];
  }).length;
  if (missing)
    console.warn(
      "[sentences] " + code + ": " + missing + " of " + SENTENCES.length + " have no translation"
    );
}
