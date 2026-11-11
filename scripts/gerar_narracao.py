#!/usr/bin/env python3
"""Gera a narração em português brasileiro (edge-tts) e ajusta a velocidade para caber em cada janela.
Uso:  pip install edge-tts   &&   python3 scripts/gerar_narracao.py [--voz pt-BR-AntonioNeural]
Vozes boas: pt-BR-AntonioNeural (grave, recomendada), pt-BR-DonatoNeural (se disponível), pt-BR-FranciscaNeural.
"""
import argparse, asyncio, json, os, re, shutil, subprocess
import edge_tts

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "audio", "narracao")
os.makedirs(OUT, exist_ok=True)
script = json.load(open(os.path.join(ROOT, "src", "script.json"), encoding="utf-8"))


def duration(path):
    if shutil.which("ffprobe"):
        r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True)
        try: return float(r.stdout.strip())
        except ValueError: pass
    return os.path.getsize(path) * 8 / 48000  # edge-tts: mp3 48 kbps


async def gen(text, path, voz, rate):
    await edge_tts.Communicate(text, voz, rate=f"{rate:+d}%", pitch="-4Hz").save(path)


async def main(voz):
    for e in script:
        text = re.sub(r"\*", "", e["text"]).replace("...", "… ").strip()
        path = os.path.join(OUT, f"n{e['id']}.mp3")
        window = e["end"] - e["start"]
        rate = 0
        for _ in range(4):
            await gen(text, path, voz, rate)
            d = duration(path)
            print(f"n{e['id']}: {d:.2f}s (janela {window:.2f}s, rate {rate:+d}%)")
            if d <= window or rate >= 35: break
            rate = min(35, rate + int((d / window - 1) * 100) + 3)
    flags_path = os.path.join(ROOT, "src", "flags.json")
    flags = json.load(open(flags_path)); flags["narration"] = True
    json.dump(flags, open(flags_path, "w"))
    print("Narração pronta. flags.json atualizado.")

ap = argparse.ArgumentParser(); ap.add_argument("--voz", default="pt-BR-AntonioNeural")
asyncio.run(main(ap.parse_args().voz))
