#!/usr/bin/env python3
"""Fill blank translations in data/sentences.<code>.js from a TSV.

Tatoeba has official translations for only a fraction of this deck outside
English, so the rest are written by hand. This merges them in by line number
against sentences.da.js, and refuses to overwrite a translation that is
already there - the official ones win, and re-running is safe.

Usage:  python tools/fill_translations.py <code> <tsv>
where <tsv> is "<1-based index> <translation>" per line.
"""
import os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def spine():
    raw = open(os.path.join(REPO, "data", "sentences.da.js"), encoding="utf-8").read()
    body = raw.split("`", 1)[1].rsplit("`", 1)[0]
    return [l.strip() for l in body.splitlines() if l.strip()]


def main():
    code, tsv = sys.argv[1], sys.argv[2]
    danish = spine()

    incoming = {}
    for line in open(tsv, encoding="utf-8"):
        line = line.rstrip("\n")
        if not line.strip():
            continue
        parts = line.split(None, 1)
        if len(parts) != 2:
            continue
        n = int(parts[0])
        # A repeated or skipped index means the whole block below it is off by
        # one against the Danish, which is silent and very hard to spot by eye.
        if n in incoming:
            sys.exit(f"duplicate index {n} in {tsv}")
        incoming[n] = parts[1].strip()

    lo, hi = min(incoming), max(incoming)
    gaps = [n for n in range(lo, hi + 1) if n not in incoming]
    if gaps:
        sys.exit(f"missing indices {gaps} between {lo} and {hi} in {tsv}")
    if hi > len(danish):
        sys.exit(f"index {hi} is past the end of the deck ({len(danish)})")

    path = os.path.join(REPO, "data", f"sentences.{code}.js")
    raw = open(path, encoding="utf-8").read()
    head, _, rest = raw.partition("`")
    body, _, tail = rest.rpartition("`")

    have = {}
    for line in body.splitlines():
        if "|" in line:
            k, _, v = line.partition("|")
            if v.strip():
                have[k.strip()] = v.strip()

    out, filled, skipped = [], 0, 0
    for i, da in enumerate(danish, 1):
        if da in have:
            out.append(f"{da}|{have[da]}")
            if i in incoming:
                skipped += 1
        elif i in incoming and incoming[i]:
            out.append(f"{da}|{incoming[i]}")
            filled += 1
        else:
            out.append(f"{da}|")

    open(path, "w", encoding="utf-8", newline="\n").write(
        head + "`\n" + "\n".join(out) + "\n" + "`" + tail
    )
    blank = sum(1 for l in out if l.endswith("|"))
    print(f"{code}: filled {filled}, kept {len(have)} existing "
          f"({skipped} incoming ignored), {blank} still blank")


main()
