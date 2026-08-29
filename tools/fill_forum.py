#!/usr/bin/env python3
"""Merge hand-written forum translations into data/forum.<code>.js.

Companion to fill_translations.py, which merges by line index. That is the
right shape for a file whose translations arrive one language at a time, but
the forum deck has no corpus translations at all - every language is written
from scratch, so they arrive together, one row per sentence covering all five.

This merges by Danish text instead of by index. A row whose Danish side is not
in the deck is a hard error rather than a silent skip: it means the deck was
regenerated under the translator's feet and the row would otherwise vanish.

Input is TSV: <danish>\t<en>\t<es>\t<tr>\t<uk>\t<mk>
Blank cells are left untranslated rather than written as empty, so a partial
row is safe and a rerun can fill the gaps later.

Usage:  python tools/fill_forum.py <tsv> [--check]
        --check reports coverage without writing.
"""
import os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = ["en", "es", "tr", "uk", "mk"]


def spine():
    raw = open(os.path.join(REPO, "data", "forum.da.js"), encoding="utf-8").read()
    body = raw.split("`", 1)[1].rsplit("`", 1)[0]
    return [l.strip() for l in body.split("\n") if l.strip()]


def existing(code):
    path = os.path.join(REPO, "data", f"forum.{code}.js")
    raw = open(path, encoding="utf-8").read()
    body = raw.split("`", 1)[1].rsplit("`", 1)[0]
    out = {}
    for line in body.split("\n"):
        line = line.strip()
        if "|" in line:
            k, _, v = line.partition("|")
            if v.strip():
                out[k.strip()] = v.strip()
    return out


def main():
    tsv = sys.argv[1]
    check_only = "--check" in sys.argv

    deck = spine()
    known = set(deck)
    have = {c: existing(c) for c in LANGS}

    added, seen = {c: 0 for c in LANGS}, set()
    if tsv != "-":
        for n, line in enumerate(open(tsv, encoding="utf-8"), 1):
            line = line.rstrip("\n")
            if not line.strip():
                continue
            cells = line.split("\t")
            da = cells[0].strip()
            if da not in known:
                raise SystemExit(f"{tsv}:{n}: Danish side not in forum.da.js: {da!r}")
            if da in seen:
                raise SystemExit(f"{tsv}:{n}: duplicate row for {da!r}")
            seen.add(da)
            for i, code in enumerate(LANGS, start=1):
                v = cells[i].strip() if i < len(cells) else ""
                if v and not have[code].get(da):
                    have[code][da] = v
                    added[code] += 1

    for code in LANGS:
        n = sum(1 for da in deck if have[code].get(da))
        print(f"  {code}: +{added[code]}  ->  {n}/{len(deck)}")
        if check_only:
            continue
        path = os.path.join(REPO, "data", f"forum.{code}.js")
        raw = open(path, encoding="utf-8").read()
        head = raw.split("`", 1)[0]
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(head + "`\n")
            f.write("\n".join(f"{da}|{have[code].get(da, '')}" for da in deck) + "\n")
            f.write("`;\n")


if __name__ == "__main__":
    main()
