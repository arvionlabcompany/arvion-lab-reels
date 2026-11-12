#!/usr/bin/env python3
"""Gera narração em português e registra tempos reais das palavras."""

import argparse
import asyncio
import json
import os
import re
import shutil
import subprocess

import edge_tts

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCRIPT_PATH = os.path.join(ROOT, "src", "script.json")
AUDIO_DIR = os.path.join(ROOT, "public", "audio", "narracao")
TIMINGS_PATH = os.path.join(ROOT, "src", "wordTimings.json")
FLAGS_PATH = os.path.join(ROOT, "src", "flags.json")

os.makedirs(AUDIO_DIR, exist_ok=True)


def clean_text(text):
    return re.sub(r"\*", "", text).replace("...", "… ").strip()


def audio_duration(path):
    if not shutil.which("ffprobe"):
        raise RuntimeError(
            "ffprobe não encontrado. Instale o FFmpeg antes de gerar a narração."
        )

    result = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            path
        ],
        capture_output=True,
        text=True,
        check=True
    )
    return float(result.stdout.strip())


async def generate_audio(text, path, voice, rate, start):
    words = []

    communicate = edge_tts.Communicate(
        text,
        voice,
        rate=f"{rate:+d}%",
        pitch="-4Hz"
    )

    with open(path, "wb") as audio_file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_file.write(chunk["data"])

            elif chunk["type"] == "WordBoundary":
                offset = chunk["offset"] / 10_000_000
                duration = chunk["duration"] / 10_000_000

                words.append({
                    "text": chunk["text"],
                    "start": round(start + offset, 4),
                    "end": round(start + offset + duration, 4)
                })

    return words


async def main(voice):
    with open(SCRIPT_PATH, encoding="utf-8") as file:
        script = json.load(file)

    all_words = []

    for entry in script:
        text = clean_text(entry["text"])

        print("DEBUG - ARQUIVO:", SCRIPT_PATH, flush=True)
        print("DEBUG - TEXTO RECEBIDO:", repr(text), flush=True)

        path = os.path.join(AUDIO_DIR, f"n{entry['id']}.mp3")

        window = entry["end"] - entry["start"]
        rate = 0
        success = False

        for attempt in range(6):
            words = await generate_audio(
                text, path, voice, rate, entry["start"]
            )

            duration = audio_duration(path)

            print(
                f"Fala {entry['id']}: "
                f"{duration:.2f}s / {window:.2f}s "
                f"(velocidade {rate:+d}%)",
                flush=True
            )

            if duration <= window:
                success = True
                all_words.extend(words)
                break

            rate = min(25, rate + 5)

        if not success:
            raise RuntimeError(
                f"A fala {entry['id']} não cabe no intervalo reservado. "
                "Encurte o texto ou aumente o intervalo no script.json."
            )

    with open(TIMINGS_PATH, "w", encoding="utf-8") as file:
        json.dump(all_words, file, ensure_ascii=False, indent=2)

    flags = {}
    if os.path.exists(FLAGS_PATH):
        with open(FLAGS_PATH, encoding="utf-8") as file:
            flags = json.load(file)

    flags["narration"] = True

    with open(FLAGS_PATH, "w", encoding="utf-8") as file:
        json.dump(flags, file, ensure_ascii=False, indent=2)

    print(f"Tempos das palavras salvos em: {TIMINGS_PATH}")
    print("Narração gerada com sucesso!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--voz",
        default="pt-BR-AntonioNeural"
    )
    args = parser.parse_args()

    asyncio.run(main(args.voz))
#!/usr/bin/env python3
"""Gera narração em português e registra tempos reais das palavras."""

import argparse
import asyncio
import json
import os
import re
import shutil
import subprocess

import edge_tts

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCRIPT_PATH = os.path.join(ROOT, "src", "script.json")
AUDIO_DIR = os.path.join(ROOT, "public", "audio", "narracao")
TIMINGS_PATH = os.path.join(ROOT, "src", "wordTimings.json")
FLAGS_PATH = os.path.join(ROOT, "src", "flags.json")

os.makedirs(AUDIO_DIR, exist_ok=True)


def clean_text(text):
    return re.sub(r"\*", "", text).replace("...", "… ").strip()


def audio_duration(path):
    if not shutil.which("ffprobe"):
        raise RuntimeError(
            "ffprobe não encontrado. Instale o FFmpeg antes de gerar a narração."
        )

    result = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            path
        ],
        capture_output=True,
        text=True,
        check=True
    )
    return float(result.stdout.strip())


async def generate_audio(text, path, voice, rate, start):
    words = []

    communicate = edge_tts.Communicate(
        text,
        voice,
        rate=f"{rate:+d}%",
        pitch="-4Hz"
    )

    with open(path, "wb") as audio_file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_file.write(chunk["data"])

            elif chunk["type"] == "WordBoundary":
                offset = chunk["offset"] / 10_000_000
                duration = chunk["duration"] / 10_000_000

                words.append({
                    "text": chunk["text"],
                    "start": round(start + offset, 4),
                    "end": round(start + offset + duration, 4)
                })

    return words


async def main(voice):
    with open(SCRIPT_PATH, encoding="utf-8") as file:
        script = json.load(file)

    all_words = []

    for entry in script:
        text = clean_text(entry["text"])

        print("DEBUG - ARQUIVO:", SCRIPT_PATH, flush=True)
        print("DEBUG - TEXTO RECEBIDO:", repr(text), flush=True)

        path = os.path.join(AUDIO_DIR, f"n{entry['id']}.mp3")

        window = entry["end"] - entry["start"]
        rate = 0
        success = False

        for attempt in range(6):
            words = await generate_audio(
                text, path, voice, rate, entry["start"]
            )

            duration = audio_duration(path)

            print(
                f"Fala {entry['id']}: "
                f"{duration:.2f}s / {window:.2f}s "
                f"(velocidade {rate:+d}%)",
                flush=True
            )

            if duration <= window:
                success = True
                all_words.extend(words)
                break

            rate = min(25, rate + 5)

        if not success:
            raise RuntimeError(
                f"A fala {entry['id']} não cabe no intervalo reservado. "
                "Encurte o texto ou aumente o intervalo no script.json."
            )

    with open(TIMINGS_PATH, "w", encoding="utf-8") as file:
        json.dump(all_words, file, ensure_ascii=False, indent=2)

    flags = {}
    if os.path.exists(FLAGS_PATH):
        with open(FLAGS_PATH, encoding="utf-8") as file:
            flags = json.load(file)

    flags["narration"] = True

    with open(FLAGS_PATH, "w", encoding="utf-8") as file:
        json.dump(flags, file, ensure_ascii=False, indent=2)

    print(f"Tempos das palavras salvos em: {TIMINGS_PATH}")
    print("Narração gerada com sucesso!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--voz",
        default="pt-BR-AntonioNeural"
    )
    args = parser.parse_args()

    asyncio.run(main(args.voz))
