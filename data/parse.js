// Shared parser for the "<danish>|<translation>" translation files. Both the
// word deck (words.js) and the sentence deck (sentences.js) use the same
// format, where the Danish side is the lookup key.

// Blank lines are skipped so translation files can be grouped into readable
// sections, and a line with an empty right-hand side is kept out of the map
// entirely - that way an untranslated entry falls back to "" like a missing
// one, rather than rendering as a stray separator.
export function parseTranslations(raw) {
  var map = {};
  var lines = raw.trim().split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    var sep = line.indexOf("|");
    if (sep < 0) continue;
    var value = line.slice(sep + 1).trim();
    if (value) map[line.slice(0, sep).trim()] = value;
  }
  return map;
}
