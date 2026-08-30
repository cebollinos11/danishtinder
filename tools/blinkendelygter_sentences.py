#!/usr/bin/env python3
"""Build a third Danish sentence deck (data/blinkendelygter.*.js) from a
multilingual CSV export of dialogue from the film Blinkende Lygter (2000).

Unlike the Tatoeba and hestenettet decks, this source arrives with
translations already attached (Danish plus Spanish, English, Turkish and
Ukrainian columns) - there is no corpus to filter for authenticity, only for
completeness. Many rows in the export only have the Danish line transcribed
and no translation yet, so the only selection rule here is: keep a row iff
every one of the five columns is non-blank. Macedonian has no column in the
source at all, so that translation file is written empty (same as any
partially-translated language, it degrades to blank cards rather than an
error) until someone fills it in by hand.

Usage:  python tools/blinkendelygter_sentences.py <csv-path>
"""
import csv, os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COLUMNS = {"en": "english", "es": "spanish", "tr": "turkish", "uk": "ukrainian"}
LANGS = ["en", "es", "tr", "uk", "mk"]

HEADER = (
    "// {title}\n"
    "//\n"
    "// Danish dialogue from the film Blinkende Lygter (2000), with hand-\n"
    "// translated lines carried over from a multilingual CSV export. Generated\n"
    "// by tools/blinkendelygter_sentences.py - do not hand-edit the Danish\n"
    "// side; regenerate instead. Only rows with a complete translation in\n"
    "// every source language (Spanish, English, Turkish, Ukrainian) are kept.\n"
)


def read_existing(code):
    """da -> translation already written for this language, so a rerun keeps it."""
    path = os.path.join(REPO, "data", f"blinkendelygter.{code}.js")
    if not os.path.exists(path):
        return {}
    raw = open(path, encoding="utf-8").read()
    if "`" not in raw:
        return {}
    body = raw.split("`", 1)[1].rsplit("`", 1)[0]
    out = {}
    for line in body.split("\n"):
        line = line.strip()
        if "|" in line:
            da, _, tr = line.partition("|")
            if tr.strip():
                out[da.strip()] = tr.strip()
    return out


def main():
    csv_path = sys.argv[1]
    with open(csv_path, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    fields = ["danish"] + list(COLUMNS.values())
    complete = [r for r in rows if all((r.get(k) or "").strip() for k in fields)]

    seen = set()
    picked = []
    for r in complete:
        da = r["danish"].strip()
        if da in seen:
            continue
        seen.add(da)
        picked.append(r)
    print(f"rows: {len(rows)}  complete: {len(complete)}  deduped: {len(picked)}")

    with open(os.path.join(REPO, "data", "blinkendelygter.da.js"), "w",
              encoding="utf-8", newline="\n") as f:
        f.write(HEADER.format(title="The Blinkende Lygter sentence spine: one line per row, in film order."))
        f.write("export const DANISH = `\n")
        for r in picked:
            f.write(r["danish"].strip() + "\n")
        f.write("`;\n")

    for code in LANGS:
        existing = read_existing(code)
        column = COLUMNS.get(code)
        path = os.path.join(REPO, "data", f"blinkendelygter.{code}.js")
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(HEADER.format(title=f"{code} translations of the Blinkende Lygter sentence deck."))
            f.write("export const TRANSLATIONS = `\n")
            for r in picked:
                da = r["danish"].strip()
                tr = r[column].strip() if column else existing.get(da, "")
                f.write(f"{da}|{tr}\n")
            f.write("`;\n")
        n = sum(1 for r in picked if (r[column].strip() if column else existing.get(r["danish"].strip())))
        print(f"  {code}: {n}/{len(picked)} translated")


if __name__ == "__main__":
    main()
