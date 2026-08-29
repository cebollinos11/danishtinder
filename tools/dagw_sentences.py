#!/usr/bin/env python3
"""Build a second Danish sentence deck (data/forum.*.js) from Danish Gigaword.

Why a second source at all: Tatoeba's Danish is ~98% translated from English,
so tools/tatoeba_sentences.py has to hunt for the few sentences somebody
actually composed in Danish - and there are only ~325 of them in the whole
corpus. The hest section of Danish Gigaword (hestenettet.dk, a Danish
debate forum, CC0) is natively Danish end to end, so authenticity is not
something we have to filter for here: every sentence in it was written by a
Dane talking to other Danes.

That changes the selection rule. In the Tatoeba script a modal particle (jo,
lige, bare, vel, nok...) is a hard gate, because it is the only reliable
signal that a sentence was not translated. Here it is just a flavour knob:
particle sentences are the liveliest, but a deck made only of them reads like
a parody, so --particle-share fixes what fraction of the deck carries one and
the rest are picked purely for vocabulary fit.

What does need filtering here is mess, which Tatoeba (curated, one sentence
per row) did not have: forum text arrives as whole threads and carries
typos, shouting, ellipses, emoticons, URLs and site chatter.

Usage:  python tools/dagw_sentences.py <cache-dir> [--limit 1000]
                                       [--particle-share 0.4]
The cache dir holds hest.jsonl, downloaded on first run from the Hugging Face
datasets server (~1.2GB of text, so the first run is slow; later runs reuse it).
"""
import collections, json, os, re, sys, time, urllib.error, urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# The deck loader, Danish stemmer, particle tables and proper-noun regexes are
# identical to the Tatoeba build - reuse them so the two decks cannot drift
# apart on what counts as a known word or a particle.
from tatoeba_sentences import (
    CAST, NAMES, NOT_PARTICLE, PARTICLES, WORD_RE,
    load_deck, read_existing, resolve,
)

LANGS = ["en", "es", "tr", "uk", "mk"]
ROWS_URL = ("https://datasets-server.huggingface.co/rows?dataset="
            "danish-foundation-models%2Fdanish-gigaword&config=hest&split=train")
TOTAL_ROWS = 14391

# A thread is one row; sentences end at .!? or a line break.
SPLIT = re.compile(r"(?<=[.!?])[\s\n]+|\n+")
# Anything web-shaped or address-shaped: never a sentence worth teaching, and
# ".dk"/"@" are also the main way a real person gets named in forum text.
URLISH = re.compile(r"https?://|www\.|@|\.dk\b|\.com\b", re.I)
EMOTE = re.compile(r"[:;=]-?[\)\(pPdDoO/]|<3|\*[a-zæøå]+\*")
# Site chatter: real Danish, but it teaches the forum rather than the language.
META = re.compile(r"\b(hn|hestenettet|indlæg|tråd|forum|brugernavn|profil|"
                  r"admin|moderator|spam|linket|links|googl\w*|herinde|opslag|"
                  r"redigeret)\b", re.I)
# Digits and quote marks mark quoted/pasted material; brackets and the rest are
# forum markup. Ellipses and doubled !!/?? are shouting, not sentence-final
# punctuation, and both leave a card that reads as unfinished.
NOISE = re.compile(
    "[" + re.escape("0123456789" + chr(187) + chr(171) + chr(34) + "[]<>|*_#~^"
                    + chr(92) + chr(96) + "$") + "]|"
    + re.escape("..") + "|--|[!?]{2}")
# A word in caps mid-sentence is emphasis, which a flashcard cannot render.
SHOUT = re.compile(r"\b[A-ZÆØÅ]{2,}\b")
# A capital *inside* a word ("NEj", "HVem") is a slipped shift key, not
# emphasis, so SHOUT's all-caps run never sees it.
TYPO = re.compile(r"\b[A-ZÆØÅ][a-zæøå]*[A-ZÆØÅ]")
# "Nej nej nej og atter nej" - real, but it teaches one word three times.
TRIPLE = re.compile(r"\b(\w+)\b[ ,]+\b\1\b[ ,]+\b\1\b", re.I)
# Fewer than five tokens is where the fragments live: "Nej elsker mad!",
# "Nej var der ikke!" - grammatical shrapnel off a longer turn, with no
# subject and nothing for a learner to generalise from.
MIN_TOKENS = 5
# Finite verbs the deck carries as irregulars; the rest are recovered from its
# "at <verb>" infinitive entries. A clause with no verb in it is not a
# sentence, whatever its punctuation says.
IRREGULAR = {
    "er", "var", "været", "har", "havde", "haft", "kan", "kunne", "vil",
    "ville", "skal", "skulle", "må", "måtte", "gør", "gjorde", "gjort",
    "ved", "vidste", "får", "fik", "fået", "bliver", "blev", "blevet",
    "synes", "syntes", "tror", "troede", "siger", "sagde", "sagt",
    "kommer", "kom", "kommet", "går", "gik", "gået", "ser", "så", "set",
    "tager", "tog", "taget", "gi'r", "giver", "gav", "givet",
}


def verb_tokens(path):
    """Verb tokens from the word deck: every "at <verb>" entry, plus irregulars."""
    raw = open(path, encoding="utf-8").read()
    body = raw.split("`", 1)[1].rsplit("`", 1)[0]
    out = set(IRREGULAR)
    for line in body.split("\n"):
        line = line.strip()
        if line.startswith("at "):
            out.update(WORD_RE.findall(line[3:].lower()))
    return out


def fetch(cache):
    """Download hest.jsonl once into cache. Resumes if interrupted."""
    path = os.path.join(cache, "hest.jsonl")
    have = sum(1 for _ in open(path, encoding="utf-8")) if os.path.exists(path) else 0
    if have >= TOTAL_ROWS:
        return path
    os.makedirs(cache, exist_ok=True)
    print(f"fetching hest rows {have}..{TOTAL_ROWS}")
    with open(path, "a", encoding="utf-8") as out:
        while have < TOTAL_ROWS:
            data = None
            # The datasets server rate-limits and occasionally 502s; both are
            # transient, so back off rather than losing the partial download.
            for attempt in range(8):
                try:
                    with urllib.request.urlopen(
                        f"{ROWS_URL}&offset={have}&length=100", timeout=90
                    ) as r:
                        data = json.loads(r.read().decode())
                    break
                except urllib.error.HTTPError as e:
                    if attempt == 7 or (e.code != 429 and e.code < 500):
                        raise
                    time.sleep(min(60, 5 * 2 ** attempt))
                except Exception:
                    if attempt == 7:
                        raise
                    time.sleep(5)
            rows = data.get("rows", [])
            if not rows:
                break
            for r in rows:
                out.write(json.dumps({"text": r["row"]["text"]}, ensure_ascii=False) + "\n")
            out.flush()
            have += len(rows)
            if have % 2000 == 0:
                print(f"  {have}", flush=True)
            time.sleep(1.5)
    return path


def candidates(path, deck, rank, verbs):
    """Every clean, deck-covered sentence in the corpus, scored."""
    decktbl = {w: 1 for w in deck}
    stage, seen, out = collections.Counter(), set(), []
    for line in open(path, encoding="utf-8"):
        for raw in SPLIT.split(json.loads(line)["text"]):
            s = raw.strip()
            if not s or s in seen:
                continue
            seen.add(s)
            stage["unique"] += 1
            # Sentence case in, sentence punctuation out - anything else is a
            # fragment the splitter cut mid-clause.
            if not s.endswith((".", "!", "?")) or not s[0].isupper():
                continue
            if NOISE.search(s) or URLISH.search(s) or EMOTE.search(s) or META.search(s):
                continue
            if SHOUT.search(s) or TYPO.search(s) or NAMES.search(s) or CAST.match(s):
                continue
            if s.count("(") or s.count(")") or "/" in s or TRIPLE.search(s):
                continue
            # A doubled space, or a space before the final mark, is where
            # something was edited out upstream: the sentence arrives with a
            # hole in it ("Ja hvorfor er der altid ?") and reads as truncated.
            if "  " in s or re.search(r"\s[.!?,;:]", s):
                continue
            stage["clean"] += 1
            toks = WORD_RE.findall(s.lower())
            if not (MIN_TOKENS <= len(toks) <= 12):
                continue
            if not any(resolve(t, {v: 1 for v in verbs}) for t in toks):
                continue
            # Tighter than Tatoeba's two unknowns: this text is unproofed, so
            # a token that will not resolve is more often a typo than a word
            # the learner has yet to meet, and a card must not teach a
            # misspelling.
            if sum(1 for t in toks if resolve(t, decktbl) is None) > 1:
                continue
            stage["covered"] += 1
            particles = PARTICLES & set(toks)
            if "da" in toks[1:]:          # sentence-initial "da" is "when"
                particles |= {"da"}
            if particles <= {"nok", "lige"} and NOT_PARTICLE.search(s.lower()):
                particles = set()          # the adverb readings, not particles
            # Capped at two: score is unbounded in the Tatoeba build because
            # particles are scarce there, but on this corpus that ranks
            # "altså jo bare godt nok" soup to the top of the deck.
            score = 3 * min(len(particles), 2)
            # No opener bonus here, unlike the Tatoeba build. There an opener
            # is a scarce sign of spoken register; on a forum every other reply
            # starts with one, so rewarding it just ranks "Nej, ellers tak!"
            # above every sentence with actual content in it.
            if s.endswith(("?", "!")):
                score += 1
            hardest = max((resolve(t, rank) or 9999) for t in toks)
            out.append((bool(particles), -score, hardest, s, toks))
            stage["kept"] += 1
    return out, stage


def take(pool, limit, sigs, frames, openers, opener_cap):
    """Pick up to limit sentences, skipping near-duplicates and repeated frames.

    Shared state with the other pool so a particle sentence and a plain one
    cannot be near-twins of each other.

    The two-token frame cap alone is not enough on this corpus. Forum replies
    overwhelmingly open with ja/jo/nej, and "ja hvad", "ja hvor" and "ja er"
    are three different frames, so each claims its own quota and the deck ends
    up 62% agreement noises. opener_cap bounds how much of the deck may start
    with any one word, which the frame cap cannot express.
    """
    picked = []
    for _, _, _, s, toks in pool:
        if openers[toks[0]] >= opener_cap:
            continue
        frame = " ".join(toks[:2])
        if frames[frame] >= 3:
            continue
        sig = collections.Counter(toks)
        if any(sum((sig - x).values()) + sum((x - sig).values()) <= 2 for x in sigs):
            continue
        frames[frame] += 1
        openers[toks[0]] += 1
        sigs.append(sig)
        picked.append(s)
        if len(picked) >= limit:
            break
    return picked


def main():
    cache = sys.argv[1]
    limit = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else 1000
    share = (float(sys.argv[sys.argv.index("--particle-share") + 1])
             if "--particle-share" in sys.argv else 0.4)
    # Fraction of the deck allowed to open with any single word.
    opener_share = (float(sys.argv[sys.argv.index("--opener-cap") + 1])
                    if "--opener-cap" in sys.argv else 0.06)

    deck, rank = load_deck()
    path = fetch(cache)
    print(f"deck tokens: {len(deck)}")
    verbs = verb_tokens(os.path.join(REPO, "data", "words.da.js"))
    print(f"verb tokens: {len(verbs)}")
    cands, stage = candidates(path, deck, rank, verbs)
    for k in ("unique", "clean", "covered", "kept"):
        print(f"  {k:<9} {stage[k]:>9}")

    # Rank each pool by score, then by how early its hardest word sits in the
    # word deck, so the sentences that come first lean on vocabulary the
    # learner meets first.
    withp = sorted((c for c in cands if c[0]), key=lambda c: (c[1], c[2]))
    without = sorted((c for c in cands if not c[0]), key=lambda c: (c[1], c[2]))
    print(f"with particle: {len(withp)}   without: {len(without)}")

    sigs, frames, openers = [], collections.Counter(), collections.Counter()
    cap = max(1, int(limit * opener_share))
    want = int(limit * share)
    picked = take(withp, want, sigs, frames, openers, cap)
    picked += take(without, limit - len(picked), sigs, frames, openers, cap)
    # Interleave so the deck alternates in flavour instead of running the
    # particle sentences first and the plain ones after.
    a, b = picked[: len(picked) - (limit - want)], picked[len(picked) - (limit - want):]
    mixed, i, j = [], 0, 0
    while i < len(a) or j < len(b):
        if j < len(b):
            mixed.append(b[j]); j += 1
        if i < len(a):
            mixed.append(a[i]); i += 1
    picked = mixed
    print(f"picked: {len(picked)} ({len(a)} with particle, {len(b)} without)")

    header = (
        "// {title}\n"
        "//\n"
        "// Real Danish sentences from the hest section of Danish Gigaword\n"
        "// (hestenettet.dk, a Danish debate forum), released under CC0 1.0.\n"
        "// Generated by tools/dagw_sentences.py - do not hand-edit the Danish\n"
        "// side; regenerate instead. Unlike the Tatoeba deck these are natively\n"
        "// Danish, so a modal particle is a flavour knob, not a filter.\n"
    )
    with open(os.path.join(REPO, "data", "forum.da.js"), "w",
              encoding="utf-8", newline="\n") as f:
        f.write(header.format(title="The forum sentence spine: one sentence per line, in deck order."))
        f.write("export const DANISH = `\n")
        for s in picked:
            f.write(s + "\n")
        f.write("`;\n")

    # There are no ready-made translations for this corpus at all, so every
    # translation here is hand-written. Read back whatever each file already
    # holds and keep it: rerunning must never destroy that work.
    for code in LANGS:
        p = os.path.join(REPO, "data", f"forum.{code}.js")
        existing = read_existing(p)
        kept = sum(1 for s in picked if existing.get(s))
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(header.format(title=f"{code} translations of the forum sentence deck."))
            f.write("export const TRANSLATIONS = `\n")
            f.write("\n".join(f"{s}|{existing.get(s, '')}" for s in picked) + "\n")
            f.write("`;\n")
        print(f"  {code}: {kept}/{len(picked)} translated")


if __name__ == "__main__":
    main()
