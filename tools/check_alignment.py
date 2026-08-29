#!/usr/bin/env python3
"""Flag translations that look mis-aligned against the Danish sentence.

Filling translations by line number is fragile: one skipped index silently
shifts every line below it, and the result is plausible-looking nonsense.
A question in Danish should still be a question in translation, and an
exclamation an exclamation, so a mismatch in sentence-final punctuation is a
cheap signal that the file has drifted. Some mismatches are legitimate
rephrasings - this reports candidates, it does not fail a build.

Usage:  python tools/check_alignment.py [code ...]
"""
import os, re, sys

sys.stdout.reconfigure(encoding="utf-8")

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def pairs(path):
    raw = open(path, encoding="utf-8").read()
    body = raw.split("`", 1)[1].rsplit("`", 1)[0]
    return [l.strip().partition("|") for l in body.splitlines() if l.strip()]


def shape(s):
    s = s.strip().rstrip('"')
    return "?" if s.endswith("?") else "!" if s.endswith("!") else "."


def main():
    codes = sys.argv[1:] or ["en", "es", "tr", "uk", "mk"]
    for code in codes:
        path = os.path.join(REPO, "data", f"sentences.{code}.js")
        if not os.path.exists(path):
            continue
        odd = []
        for i, (da, _, tr) in enumerate(pairs(path), 1):
            if not tr:
                continue
            if shape(da) != shape(tr):
                odd.append((i, da, tr))
        print(f"{code}: {len(odd)} punctuation mismatches")
        for i, da, tr in odd[:12]:
            print(f"   {i}: {da}\n      {tr}")


main()
