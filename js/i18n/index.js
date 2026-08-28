// UI chrome translations (not the vocabulary data - that's in data/words.js).
//
// The app is always teaching Danish. "Home language" is the language the
// learner already speaks, i.e. which translation file of data/ is shown on the
// cards, and which dictionary in this directory drives the UI text.
//
// To add a new home language:
//   1. Copy en.js to <code>.js and translate every value. Counted strings are
//      objects keyed by Intl.PluralRules category - use the categories that
//      language actually has; no plural function needs writing.
//   2. Import it below and add it to HOME_LANGUAGES.
//   3. Add data/words.<code>.js and register it in data/words.js.
// The picker, search placeholder, direction labels and so on pick it up
// automatically. A language may ship with keys missing - those fall back to
// DEFAULT_HOME rather than rendering blank.
import en from "./en.js";
import uk from "./uk.js";
import tr from "./tr.js";
import es from "./es.js";

export var HOME_LANGUAGES = { en: en, uk: uk, tr: tr, es: es };

export var DEFAULT_HOME = "en";

// Intl.PluralRules replaces the hand-written per-language counting rules: it
// maps a number onto a CLDR category ("one"/"few"/"many"/"other"), which is
// how counted strings in the language files are keyed.
var pluralRules = {};
function selectPlural(code, n) {
  if (!pluralRules[code]) {
    try {
      pluralRules[code] = new Intl.PluralRules(code);
    } catch (e) {
      pluralRules[code] = new Intl.PluralRules(DEFAULT_HOME);
    }
  }
  return pluralRules[code].select(n);
}

// A counted string only has to cover the categories its language uses, so fall
// back through the plausible ones rather than assuming "other" is present.
function resolvePlural(forms, code, n) {
  var cat = selectPlural(code, n);
  if (forms[cat] != null) return forms[cat];
  var order = ["other", "many", "few", "one"];
  for (var i = 0; i < order.length; i++)
    if (forms[order[i]] != null) return forms[order[i]];
  return "";
}

var warned = {};
// Missing keys fall back to DEFAULT_HOME (and warn once) so a partially
// translated language degrades to English instead of to blank UI.
function lookup(code, key) {
  var lang = HOME_LANGUAGES[code] || HOME_LANGUAGES[DEFAULT_HOME];
  var raw = lang.strings[key];
  if (raw != null) return { raw: raw, code: lang.code };
  var warnKey = lang.code + ":" + key;
  if (!warned[warnKey]) {
    warned[warnKey] = true;
    console.warn("[i18n] " + lang.code + " has no string for \"" + key + "\"");
  }
  var fallback = HOME_LANGUAGES[DEFAULT_HOME].strings[key];
  if (fallback == null) return null;
  return { raw: fallback, code: DEFAULT_HOME };
}

export function t(homeCode, key, vars) {
  var hit = lookup(homeCode, key);
  if (!hit) return "";
  var str;
  if (hit.raw && typeof hit.raw === "object") {
    var n = vars && typeof vars.n === "number" ? vars.n : 0;
    str = resolvePlural(hit.raw, hit.code, n);
  } else {
    str = hit.raw;
  }
  if (vars) {
    for (var k in vars) {
      if (!Object.prototype.hasOwnProperty.call(vars, k)) continue;
      str = str.split("{" + k + "}").join(vars[k]);
    }
  }
  return str;
}
