
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
import { CL, Overlay } from "./fx";

import {
  SceneFuture,
  SceneMachine,
  SceneAutomation,
  SceneHumanVsAI,
  SceneJobs,
  SceneCollab,
  SceneHumanity,
  SceneOutroAI,
} from "./scenes";

import {
  R4Comment,
  R4City,
  R4Office,
  R4Jobs,
  R4Skills,
  R4Together,
  R4Future,
  R4Outro,
} from "./Reel4Scenes";


const OVERLAP = 12;
const END = 60;


const SC = [
  { id: "comment", from: 0, Comp: R4Comment },
  { id: "city", from: 7, Comp: R4City },
  { id: "office", from: 15, Comp: R4Office },
  { id: "jobs", from: 22, Comp: R4Jobs },
  { id: "skills", from: 29, Comp: R4Skills },
  { id: "together", from: 37, Comp: R4Together },
  { id: "future", from: 45, Comp: R4Future },
  { id: "outro", from: 53, Comp: R4Outro },
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
  { t: 0.2, f: "boom", v: 0.09 },
  { t: 6.5, f: "whoosh", v: 0.08 },
  { t: 14.5, f: "glitch", v: 0.07 },
  { t: 21.5, f: "heartbeat", v: 0.08 },
  { t: 28.5, f: "hit", v: 0.08 },
  { t: 36.5, f: "whoosh", v: 0.08 },
  { t: 44.5, f: "riser", v: 0.10 },
  { t: 52.5, f: "boom", v: 0.08 },
  { t: 57.0, f: "blip", v: 0.06 },
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
    [0.35, 0],
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
