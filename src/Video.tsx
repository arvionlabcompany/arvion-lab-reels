import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {C, FONT, FPS} from "./config";
import flags from "./flags.json";
import script from "./script.json";
import {Captions} from "./Captions";
import {AiClip, CL, Overlay} from "./fx";
import {SceneClose, SceneCity, SceneHolo, SceneHuman, SceneLab, SceneOutro, SceneWork} from "./scenes";

const OVERLAP = 12; // frames de sobreposição (transição)
const SC = [
  {id: "lab", from: 0, Comp: SceneLab},
  {id: "holo", from: 5, Comp: SceneHolo},
  {id: "city", from: 15, Comp: SceneCity},
  {id: "work", from: 21, Comp: SceneWork},
  {id: "human", from: 29, Comp: SceneHuman},
  {id: "close", from: 42, Comp: SceneClose},
  {id: "outro", from: 52, Comp: SceneOutro},
];
const END = 60;


const SFX: {t: number; f: string; v?: number}[] = [
  {t: 0.2, f: "boom", v: 0.10},
  {t: 1.5, f: "blip", v: 0.08},
  {t: 4.8, f: "whoosh", v: 0.10},
  {t: 14.8, f: "whoosh", v: 0.10},
  {t: 20.8, f: "whoosh", v: 0.10},
  {t: 28.8, f: "whoosh", v: 0.10},
  {t: 41.8, f: "whoosh", v: 0.10},
  {t: 40.0, f: "riser", v: 0.12},
  {t: 42.3, f: "glitch", v: 0.08},
  {t: 43.2, f: "glitch", v: 0.08},
  {t: 44.6, f: "glitch", v: 0.08},
  {t: 46.0, f: "heartbeat", v: 0.12},
  {t: 52.0, f: "hit", v: 0.10},
  {t: 55.8, f: "blip", v: 0.08},
];


const Wrap: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [0, OVERLAP], [0, 1], CL)}}>
      {children}
      <AbsoluteFill style={{background: `rgba(120,190,255,${interpolate(f, [0, 8], [0.5, 0], CL)})`, mixBlendMode: "screen"}} />
    </AbsoluteFill>
  );
};

const Watermark: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 15, 70, 100], [0, 0.7, 0.7, 0], CL);
  return (
    <div style={{position: "absolute", top: 150, width: "100%", textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 14, color: C.white}}>
      ARVION <span style={{color: C.cyan}}>LAB</span>
    </div>
  );
};

const Music: React.FC = () => {
  const vol = (f: number) => {
    const t = f / FPS;
    const d = Math.min(...(script as {start: number; end: number}[]).map((e) => (t < e.start ? e.start - t : t > e.end ? t - e.end : 0)));
    const base = flags.narration ? interpolate(d, [0, 0.5], [0.28, 0.65], CL) : 0.7;
    return base * interpolate(t, [0, 1, 58, 60], [0, 1, 1, 0], CL);
  };
  return <Audio src={staticFile("audio/trilha.wav")} volume={vol} />;
};

export const ArvionReel: React.FC = () => (
  <AbsoluteFill style={{background: C.black}}>
    {SC.map((s, i) => {
      const next = SC[i + 1];
      const from = Math.round(s.from * FPS);
      const dur = Math.round(((next ? next.from : END) - s.from) * FPS) + (next ? OVERLAP : 0);
      return (
        <Sequence key={s.id} from={from} durationInFrames={dur}>
          <Wrap><s.Comp dur={dur} /><AiClip name={s.id} /></Wrap>
        </Sequence>
      );
    })}
    <Overlay />
    <Watermark />
    <Captions />
    {flags.music && <Music />}
    {flags.sfx && SFX.map((x, i) => (
      <Sequence key={i} from={Math.round(x.t * FPS)}><Audio src={staticFile(`audio/sfx/${x.f}.wav`)} volume={x.v ?? 0.8} /></Sequence>
    ))}
    {flags.narration && (script as {id: number; start: number}[]).map((e) => (
      <Sequence key={e.id} from={Math.round(e.start * FPS)}><Audio src={staticFile(`audio/narracao/n${e.id}.mp3`)} volume={1} /></Sequence>
    ))}
  </AbsoluteFill>
);
