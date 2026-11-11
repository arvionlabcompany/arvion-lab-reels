#!/usr/bin/env python3
"""Gera legendas .srt a partir de src/script.json (mesma lógica de blocos do vídeo)."""
import json, os, re
ROOT = os.path.join(os.path.dirname(__file__), "..")
script = json.load(open(os.path.join(ROOT, "src", "script.json"), encoding="utf-8"))

def ts(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"

chunks = []
for e in script:
    toks = [t.replace("*", "") for t in e["text"].split()]
    total = sum(len(t) + 2 for t in toks); acc = e["start"]; span = e["end"] - e["start"]; cur = []
    def flush():
        global cur
        if cur: chunks.append((cur[0][1], cur[-1][2], " ".join(w[0] for w in cur).upper())); cur = []
    for t in toks:
        s = acc; acc += (len(t) + 2) / total * span
        cur.append((t, s, acc))
        if len(cur) >= 3 or re.search(r"[.,?!…:]$", t): flush()
    flush()
    os.makedirs(os.path.join(ROOT, "docs"), exist_ok=True)
with open(os.path.join(ROOT, "docs", "legendas.srt"), "w", encoding="utf-8") as f:
    for i, (s, e, txt) in enumerate(chunks, 1):
        f.write(f"{i}\n{ts(s)} --> {ts(e)}\n{txt}\n\n")
print(f"{len(chunks)} blocos de legenda em docs/legendas.srt")
