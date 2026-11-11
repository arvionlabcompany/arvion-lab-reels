#!/usr/bin/env python3
"""Gera trilha sonora (60 s) e efeitos sonoros originais em public/audio. Só precisa de numpy."""
import os, wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(os.path.join(OUT, "sfx"), exist_ok=True)
rng = np.random.default_rng(7)


def save(path, x, gain=0.9):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def tt(d):
    return np.arange(int(d * SR)) / SR


def onepole(x, a):
    y = np.zeros_like(x); s = 0.0
    arr = not np.isscalar(a)
    for i in range(len(x)):
        s += (a[i] if arr else a) * (x[i] - s)
        y[i] = s
    return y


def boom(d=2.2):
    t = tt(d)
    f = 30 + 70 * np.exp(-t * 6)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    n = onepole(rng.standard_normal(len(t)), 0.08) * np.exp(-t * 5) * 0.8
    return s + n


def whoosh(d=1.6):
    t = tt(d)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    a = 0.02 + 0.5 * (t / d) ** 2
    return onepole(rng.standard_normal(len(t)), a) * env


def hit(d=2.5):
    t = tt(d)
    s = np.sin(2 * np.pi * np.cumsum(40 + 120 * np.exp(-t * 14)) / SR) * np.exp(-t * 1.6)
    n = rng.standard_normal(len(t)) * np.exp(-t * 9) * 0.5
    return s + n


def blip(d=0.25):
    t = tt(d)
    return (np.sin(2 * np.pi * 1400 * t) + 0.5 * np.sin(2 * np.pi * 2100 * t)) * np.exp(-t * 18)


def heartbeat(d=2.6):
    t = tt(d); out = np.zeros_like(t)
    for start in [0.0, 0.18, 0.95, 1.13, 1.9, 2.08]:
        i = int(start * SR); k = np.arange(len(t) - i) / SR
        amp = 1.0 if int(round(start * 100)) % 95 < 5 or start in (0.0, 0.95, 1.9) else 0.6
        out[i:] += amp * np.sin(2 * np.pi * 52 * k) * np.exp(-k * 14)
    return out


def riser(d=6.0):
    t = tt(d); p = t / d
    f = 300 + 2100 * p ** 2
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4
    n = onepole(rng.standard_normal(len(t)), 0.02 + 0.45 * p ** 2) * 1.2
    return (s + n) * p ** 1.8


def glitch(d=0.35):
    t = tt(d); out = np.zeros_like(t)
    for _ in range(9):
        i = rng.integers(0, len(t) - 2000); l = rng.integers(300, 1800)
        f = rng.choice([120, 340, 900, 2400])
        out[i:i + l] += np.sign(np.sin(2 * np.pi * f * np.arange(l) / SR)) * 0.5
    return out * np.exp(-t * 4)


for name, fn in [("boom", boom), ("whoosh", whoosh), ("hit", hit), ("blip", blip), ("heartbeat", heartbeat), ("riser", riser), ("glitch", glitch)]:
    save(os.path.join(OUT, "sfx", name + ".wav"), fn(), 0.9)


def music():
    n = 60 * SR; t = np.arange(n) / SR
    env = np.interp(t, [0, 5, 25, 46, 46.3, 48.5, 52, 52.6, 60], [.25, .4, .7, 1, .15, .15, .8, 1, 0])
    # drone
    drone = np.zeros(n)
    for f0, a in [(55, 1.0), (82.41, 0.6), (110, 0.35)]:
        for k in range(1, 6):
            drone += a * np.sin(2 * np.pi * f0 * k * (1 + 0.0015 * np.sin(2 * np.pi * 0.1 * t)) * t) / k ** 1.4
    out = drone * 0.12 * env
    # arpejo (lá menor pentatônico)
    scale = [220, 261.63, 329.63, 392, 440, 523.25, 659.25]
    step = 0.15
    k = 0; tm = 5.0
    while tm < 60:
        dense = tm > 25
        if (46 <= tm < 52) or tm > 56:
            tm += step; k += 1; continue
        if dense or k % 2 == 0:
            f = scale[int(rng.integers(0, len(scale)))] * (0.5 if tm < 12 else 1)
            L = int(0.5 * SR); i = int(tm * SR); tl = np.arange(min(L, n - i)) / SR
            note = (np.sin(2 * np.pi * f * tl) + 0.5 * np.sin(2 * np.pi * 2 * f * tl)) * np.exp(-tl * 9)
            amp = 0.10 * (0.6 + 0.4 * (tm - 5) / 41) if tm < 46 else 0.07
            out[i:i + len(tl)] += amp * note * env[i]
        tm += step; k += 1
    # kick de tensão
    tm = 25.0
    while tm < 46:
        i = int(tm * SR); tl = np.arange(int(0.35 * SR)) / SR
        out[i:i + len(tl)] += 0.35 * np.sin(2 * np.pi * np.cumsum(45 + 70 * np.exp(-tl * 30)) / SR) * np.exp(-tl * 9) * env[i]
        tm += 0.6
    # chimbal
    tm = 36.0
    while tm < 46:
        i = int(tm * SR); L = int(0.04 * SR)
        out[i:i + L] += 0.04 * rng.standard_normal(L) * np.linspace(1, 0, L)
        tm += 0.15
    # clímax: acorde Am(add9) + impacto
    i = int(52 * SR); tl = np.arange(n - i) / SR
    pad = np.zeros(len(tl))
    for f in [110, 164.81, 220, 261.63, 329.63, 246.94]:
        pad += np.sin(2 * np.pi * f * tl) + 0.4 * np.sin(2 * np.pi * 2 * f * tl)
    out[i:] += 0.05 * pad * np.exp(-tl * 0.18) * np.minimum(1, tl * 3)
    b = boom(2.2); out[i:i + len(b)] += 0.5 * b / np.max(np.abs(b))
    out *= np.interp(t, [0, 1, 56, 60], [0, 1, 1, 0])
    stereo = np.stack([out, np.roll(out, 90)], 1)  # leve largura estéreo
    save(os.path.join(OUT, "trilha.wav"), stereo, 0.85)


music()
print("OK: trilha e efeitos gerados em public/audio")
