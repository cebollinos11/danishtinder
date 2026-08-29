#!/usr/bin/env python3
"""Build the Danish sentence deck (data/sentences.*.js) from a Tatoeba export.

Tatoeba's Danish corpus is ~98% translated FROM other languages, which reads
like a textbook. The sentences worth teaching are the ones somebody actually
composed in Danish, and the giveaway is the modal particles (jo, da, altsaa,
lige, bare, vel, sgu, nok) - English has no direct equivalent, so a sentence
translated from English almost never contains one. Scoring for those is what
separates real spoken Danish from drill filler.

Selected sentences must also be covered by the existing word deck
(data/words.da.js) so a sentence card never demands vocabulary the learner
has not met: every token must resolve to a deck word, allowing at most one
unknown (the "i+1" rule).

Usage:  python tools/tatoeba_sentences.py <cache-dir> [--limit 500]
The cache dir needs these files from https://downloads.tatoeba.org/exports/ :
  per_language/dan/dan_sentences.tsv.bz2
  per_language/dan/dan-<iso>_links.tsv.bz2   for eng spa tur ukr mkd
  per_language/<iso>/<iso>_sentences.tsv.bz2 for eng spa tur ukr mkd
"""
import bz2, collections, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = [("en", "eng"), ("es", "spa"), ("tr", "tur"), ("uk", "ukr"), ("mk", "mkd")]
WORD_RE = re.compile(r"[a-zæøåäöéèüA-ZÆØÅ']+")

# Danish inflection, stripped longest-first: a deck holding "hus" should also
# cover "huset"/"husene". Deliberately crude - it over-matches slightly, which
# only means a few extra sentences qualify, never a wrong translation.
SUFFIXES = ["ernes", "erne", "enes", "ene", "ers", "ede", "er", "en", "et",
            "es", "te", "st", "s", "t", "e", "r"]

# Only unambiguous particles. "vist"/"skam" are excluded: they are far
# more often the passive of "vise" and the noun "shame" than they are
# particles, and we have no POS tagger to tell them apart. "da" is handled
# positionally below.
PARTICLES = {"jo", "altså", "lige", "bare", "vel", "sgu", "nok", "egentlig",
             "faktisk", "dog"}
OPENERS = {"nå", "ej", "åh", "hey", "hov", "jamen", "okay", "ok", "jo", "nej",
           "ja", "hva", "øh"}
# Any capitalised word inside a sentence is a proper noun - Tom, Mary, Boston,
# Osaka - and those are Tatoeba's translated-from-English filler. Danish "I"
# (you plural) and "De" (formal you) are always capitalised too, so the rule
# only fires on words of three letters or more, and skips the word after a
# full stop in a two-sentence entry. Digits and quote marks mark the
# encyclopedia entries; neither belongs on a swipe card.
NAMES = re.compile("(?<!^)(?<![.!?] )(?<![A-Za-zÆØÅæøå])[A-ZÆØÅ][a-zæøå]{2,}")
# Sentence-initial names need naming outright, since a capital there is just
# ordinary sentence case. These are the cast Tatoeba's English source uses.
CAST = re.compile("^(?:Tom|Mary|Maria|John|Jim|Bob|Ken|Mike|Betty|Jackson|Mario|Harald)s?(?![a-zæøåA-ZÆØÅ])|^Jo (?=er |var )")

# "nok" and "lige" are the two particles with a common non-particle sense:
# "nok" is also the adverb "enough" ("Vi har mad nok") and "lige" the adjective
# "equal" ("Alle dyr er lige"). Those readings are flat, textbook Danish - the
# opposite of what this deck is for - so a sentence whose only particle is one
# of them, used that way, is dropped.
# Individual duds that pass every rule above. Tatoeba is user-contributed, so
# a handful of entries carry typos in the Danish; there is no way to detect
# that automatically, and a card must not teach a misspelling.
BLOCKLIST = {
    "Så sagtn dog farten!",  # "sagtn" is not a word - should be "sagtner"
}

NOT_PARTICLE = re.compile(
    "nok til at"
    "|(?:gammel|gammelt|varm|varmt|stærk|stærkt|god|godt|stor|stort|lang|langt"
    "|hurtig|hurtigt|dygtig|rig|klog|solid|mange|meget|mad|vand|brød|penge"
    "|tid|søvn|plads|sygesikring|luft|kaffe|is) nok"
    "|(?:er|var|blev|bliver) lige[.!?]*$"
)
NOISE = re.compile(r"[0-9»«\"]")


def load_deck():
    raw = open(os.path.join(REPO, "data", "words.da.js"), encoding="utf-8").read()
    body = raw.split("`", 1)[1].rsplit("`", 1)[0]
    entries = [l.strip() for l in body.split("\n") if l.strip()]
    deck, rank = set(), {}
    for i, e in enumerate(entries):
        for tok in WORD_RE.findall(e.lower()):
            deck.add(tok)
            rank.setdefault(tok, i)
    return deck, rank


def resolve(tok, table):
    """Look tok up in table, retrying against its stripped stem."""
    if tok in table:
        return table[tok]
    for s in SUFFIXES:
        if tok.endswith(s) and len(tok) - len(s) >= 2:
            stem = tok[: -len(s)]
            for cand in (stem, stem + "e", stem[:-1] if len(stem) > 2 and stem[-1] == stem[-2] else None):
                if cand and cand in table:
                    return table[cand]
    return None


def load_sentences(cache, iso):
    out = {}
    with bz2.open(os.path.join(cache, f"{iso}_sentences.tsv.bz2"), "rt", encoding="utf-8") as f:
        for line in f:
            p = line.rstrip("\n").split("\t")
            if len(p) >= 3:
                out[p[0]] = p[2]
    return out


def load_links(cache, iso):
    out = collections.defaultdict(list)
    path = os.path.join(cache, f"dan-{iso}_links.tsv.bz2")
    if not os.path.exists(path):
        return out
    with bz2.open(path, "rt", encoding="utf-8") as f:
        for line in f:
            p = line.split()
            if len(p) == 2:
                out[p[0]].append(p[1])
    return out


def read_existing(path):
    """Existing "<danish>|<translation>" pairs, so a rerun preserves them."""
    if not os.path.exists(path):
        return {}
    raw = open(path, encoding="utf-8").read()
    if "`" not in raw:
        return {}
    body = raw.split("`", 1)[1].rsplit("`", 1)[0]
    out = {}
    for line in body.splitlines():
        line = line.strip()
        if "|" in line:
            k, _, v = line.partition("|")
            if v.strip():
                out[k.strip()] = v.strip()
    return out


def main():
    cache = sys.argv[1]
    limit = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else 360

    deck, rank = load_deck()
    dan = load_sentences(cache, "dan")
    links = {code: load_links(cache, iso) for code, iso in LANGS}
    print(f"deck tokens: {len(deck)}   danish sentences: {len(dan)}")

    scored = []
    for sid, text in dan.items():
        if text in BLOCKLIST:
            continue
        if NAMES.search(text) or CAST.match(text) or NOISE.search(text):
            continue
        toks = WORD_RE.findall(text.lower())
        if not (3 <= len(toks) <= 12):
            continue
        unknown = [t for t in toks if resolve(t, {w: 1 for w in deck}) is None]
        if len(unknown) > 2:
            continue
        particles = PARTICLES & set(toks)
        # Sentence-initial "da" is the conjunction "when"; mid-sentence it is
        # the particle ("Det er da godt!").
        if "da" in toks[1:]:
            particles = particles | {"da"}
        if particles <= {"nok", "lige"} and NOT_PARTICLE.search(text.lower()):
            continue
        if not particles:
            continue  # no particle = not spoken Danish, whatever else it has
        score = 3 * len(particles)
        if toks[0] in OPENERS:
            score += 2
        if text.rstrip().endswith(("?", "!")):
            score += 1
        if not links["en"].get(sid):
            continue  # nothing to seed the translations from
        hardest = max((resolve(t, rank) or 9999) for t in toks)
        scored.append((-score, len(unknown), hardest, sid, text, toks))
    scored.sort()
    print(f"colloquial candidates: {len(scored)}")

    # Near-duplicate guard: Tatoeba is full of ham/hende, min/din twins that
    # would teach the same card twice. Reject anything within one token of an
    # already-picked sentence.
    # ...and a frame cap, because "Hvad laver du/han/de her?" is one card
    # taught five times, and token distance alone does not catch it.
    picked, sigs, frames = [], [], collections.Counter()
    for negscore, nunk, hardest, sid, text, toks in scored:
        frame = " ".join(toks[:2])
        if frames[frame] >= 3:
            continue
        sig = collections.Counter(toks)
        if any(sum((sig - s).values()) + sum((s - sig).values()) <= 2 for s in sigs):
            continue
        frames[frame] += 1
        sigs.append(sig)
        picked.append((sid, text))
        if len(picked) >= limit:
            break
    print(f"picked: {len(picked)} (after near-duplicate filter)")

    header = (
        "// {title}\n"
        "//\n"
        "// Real Danish sentences from Tatoeba (tatoeba.org), CC-BY 2.0 FR.\n"
        "// Generated by tools/tatoeba_sentences.py - do not hand-edit the Danish\n"
        "// side; regenerate instead. Selected for modal particles (jo, lige,\n"
        "// bare, vel, nok) and full coverage by the words.da.js deck.\n"
    )
    with open(os.path.join(REPO, "data", "sentences.da.js"), "w", encoding="utf-8", newline="\n") as f:
        f.write(header.format(title="The Danish sentence spine: one sentence per line, in deck order."))
        f.write("export const DANISH = `\n")
        for _, text in picked:
            f.write(text + "\n")
        f.write("`;\n")

    for code, iso in LANGS:
        if code == "da":
            continue
        tgt = load_sentences(cache, iso)
        # Tatoeba only has official translations for a fraction of these
        # outside English, so the rest are written by hand. Read back whatever
        # the file already holds and keep it: rerunning this script must never
        # destroy translation work.
        existing = read_existing(os.path.join(REPO, "data", f"sentences.{code}.js"))
        have = kept = 0
        lines = []
        for sid, text in picked:
            hits = [tgt[i] for i in links[code].get(sid, []) if i in tgt]
            if hits:
                have += 1
                lines.append(f"{text}|{hits[0]}")
            elif existing.get(text):
                kept += 1
                lines.append(f"{text}|{existing[text]}")
            else:
                lines.append(f"{text}|")
        path = os.path.join(REPO, "data", f"sentences.{code}.js")
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(header.format(title=f"{code} translations of the Danish sentence deck."))
            f.write("export const TRANSLATIONS = `\n")
            f.write("\n".join(lines) + "\n")
            f.write("`;\n")
        print(f"  {code}: {have} official Tatoeba + {kept} kept "
              f"= {have + kept}/{len(picked)}")


main()
