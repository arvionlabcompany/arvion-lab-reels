
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

import { C, FONT, FPS } from "./config";
import flags from "./flags.json";
import script from "./script.json";

import { Captions } from "./Captions";
import { AiClip, CL, Overlay } from "./fx";

import {
  SceneClose,
  SceneCity,
  SceneHolo,
  SceneHuman,
  SceneLab,
  SceneOutro,
  SceneWork,
} from "./scenes";

const OVERLAP = 12;
const END = 60;

const SC = [
  { id: "lab", from: 0, Comp: SceneLab },
  { id: "holo", from: 7, Comp: SceneHolo },
  { id: "city", from: 18, Comp: SceneCity },
  { id: "human", from: 24, Comp: SceneHuman },
  { id: "work", from: 32, Comp: SceneWork },
  { id: "close", from: 40, Comp: SceneClose },
  { id: "outro", from: 50, Comp: SceneOutro },
];

type ScriptEntry = {
  id: number;
  start: number;
  end: number;
  text: string;
};

const narrationEntries = script as ScriptEntry[];

const SFX: {
  t: number;
  f: string;
  v: number;
}[] = [
  { t: 0.2, f: "boom", v: 0.08 },
  { t: 0.5, f: "heartbeat", v: 0.07 },
  { t: 6.8, f: "whoosh", v: 0.08 },
  { t: 17.8, f: "whoosh", v: 0.08 },
  { t: 23.7, f: "glitch", v: 0.07 },
  { t: 24.0, f: "heartbeat", v: 0.08 },
  { t: 31.8, f: "hit", v: 0.08 },
  { t: 39.8, f: "whoosh", v: 0.08 },
  { t: 40.0, f: "riser", v: 0.10 },
  { t: 49.8, f: "boom", v: 0.08 },
  { t: 54.9, f: "hit", v: 0.08 },
  { t: 57.8, f: "blip", v: 0.06 },
];

const Wrap: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const f = useCurrentFrame();

  const opacity = interpolate(
    f,
    [0, OVERLAP],
    [0, 1],
    CL
  );

  const flash = interpolate(
    f,
    [0, 8],
    [0.5, 0],
    CL
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}

      <AbsoluteFill
        style={{
          background: `rgba(120,190,255,${flash})`,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

const Watermark: React.FC = () => {
  const f = useCurrentFrame();

  const opacity = interpolate(
    f,
    [0, 15, 70, 100],
    [0, 0.7, 0.7, 0],
    CL
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        width: "100%",
        textAlign: "center",
        opacity,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 30,
        letterSpacing: 14,
        color: C.white,
      }}
    >
      ARVION <span style={{ color: C.cyan }}>LAB</span>
    </div>
  );
};

const Music: React.FC = () => {
  const volume = (frame: number) => {
    const time = frame / FPS;

    const distance = Math.min(
      ...narrationEntries.map((entry) =>
        time < entry.start
          ? entry.start - time
          : time > entry.end
            ? time - entry.end
            : 0
      )
    );

    const baseVolume = flags.narration
      ? interpolate(
          distance,
          [0, 0.35],
          [0.07, 0.13],
          CL
        )
      : 0.16;

    const fade = interpolate(
      time,
      [0, 1, 58, 60],
      [0, 1, 1, 0],
      CL
    );

    return baseVolume * fade;
  };

  return (
    <Audio
      src={staticFile("audio/trilha.wav")}
      volume={volume}
    />
  );
};

export const ArvionReel: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: C.black,
      }}
    >
      {SC.map((scene, index) => {
        const next = SC[index + 1];

        const from = Math.round(scene.from * FPS);

        const duration =
          Math.round(
            ((next ? next.from : END) - scene.from) * FPS
          ) + (next ? OVERLAP : 0);

        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={duration}
          >
            <Wrap>
              <scene.Comp dur={duration} />
              <AiClip name={scene.id} />
            </Wrap>
          </Sequence>
        );
      })}

      <Overlay />
      <Watermark />
      <Captions />

      {flags.music && <Music />}

      {flags.sfx &&
        SFX.map((effect, index) => (
          <Sequence
            key={index}
            from={Math.round(effect.t * FPS)}
          >
            <Audio
              src={staticFile(
                `audio/sfx/${effect.f}.wav`
              )}
              volume={effect.v}
            />
          </Sequence>
        ))}

      {flags.narration &&
        narrationEntries.map((entry) => (
          <Sequence
            key={entry.id}
            from={Math.round(entry.start * FPS)}
            durationInFrames={Math.ceil(
              (entry.end - entry.start) * FPS
            )}
          >
            <Audio
              src={staticFile(
                `audio/narracao/n${entry.id}.mp3`
              )}
              volume={0.95}
            />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
