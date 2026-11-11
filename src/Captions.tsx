import React from "react";
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {C, FONT} from "./config";
import script from "./script.json";

type Wd = {txt: string; hl: boolean; s: number; e: number};
type Chunk = {s: number; e: number; words: Wd[]};

const build = (): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const en of script as {start: number; end: number; text: string}[]) {
    let hl = false;
    const raw = en.text.split(/\s+/).filter(Boolean).map((r) => {
      const stars = (r.match(/\*/g) || []).length;
      const clean = r.replace(/\*/g, "");
      let mark = hl || stars === 2;
      if (stars === 1) {
        if (r.startsWith("*")) { hl = true; mark = true; } else { mark = true; hl = false; }
      }
      return {txt: clean, hl: mark, w: clean.length + 2};
    });
    const total = raw.reduce((a, b) => a + b.w, 0);
    let acc = en.start;
    const span = en.end - en.start;
    const words: Wd[] = raw.map((r) => {
      const s = acc;
      acc += (r.w / total) * span;
      return {txt: r.txt, hl: r.hl, s, e: acc};
    });
    let cur: Wd[] = [];
    const flush = () => {
      if (cur.length) { chunks.push({s: cur[0].s, e: cur[cur.length - 1].e, words: cur}); cur = []; }
    };
    words.forEach((w) => {
      cur.push(w);
      if (cur.length >= 3 || /[.,?!…:]$/.test(w.txt)) flush();
    });
    flush();
  }
  chunks.forEach((c, i) => {
    const n = chunks[i + 1];
    c.e = n && n.s - c.e < 0.8 ? n.s : c.e + 0.3;
  });
  return chunks;
};
const CHUNKS = build();

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const ch = CHUNKS.find((c) => t >= c.s && t < c.e);
  if (!ch) return null;
  const local = (t - ch.s) * fps;
  const pop = spring({frame: local, fps, config: {damping: 12, stiffness: 220}, durationInFrames: 14});
  return (
    <AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: 470}}>
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 26px", maxWidth: 980,
        transform: `scale(${0.86 + 0.14 * pop})`, opacity: Math.min(1, local / 4),
        fontFamily: FONT, fontWeight: 900, fontSize: 92, lineHeight: 1.1, textTransform: "uppercase", textAlign: "center",
      }}>
        {ch.words.map((w, i) => {
          const active = t >= w.s && t < w.e;
          return (
            <span key={i} style={{
              color: w.hl ? C.yellow : C.white, display: "inline-block",
              transform: `scale(${active ? 1.1 : 1})`,
              textShadow: "0 6px 0 rgba(0,0,0,.7), 0 0 46px rgba(0,0,0,.95)",
              WebkitTextStroke: "2px rgba(0,0,0,.6)", paintOrder: "stroke fill",
            }}>{w.txt}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
