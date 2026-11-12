
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { C, FONT } from "./config";
import wordTimings from "./wordTimings.json";

type WordTiming = {
  text: string;
  start: number;
  end: number;
};

const timings = wordTimings as WordTiming[];
const GROUP_SIZE = 3;

function buildGroups(words: WordTiming[]) {
  const groups: {
    words: WordTiming[];
    start: number;
    end: number;
  }[] = [];

  let current: WordTiming[] = [];

  const finish = () => {
    if (!current.length) return;

    groups.push({
      words: current,
      start: current[0].start,
      end: current[current.length - 1].end,
    });

    current = [];
  };

  for (const word of words) {
    current.push(word);

    const punctuation = /[.!?,;:…]$/.test(word.text);

    if (current.length >= GROUP_SIZE || punctuation) {
      finish();
    }
  }

  finish();
  return groups;
}

const groups = buildGroups(timings);

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const active = groups.find(
    (group) => time >= group.start && time <= group.end + 0.12
  );

  if (!active) return null;

  const progress = spring({
    frame: Math.max(
      0,
      frame - Math.round(active.start * fps)
    ),
    fps,
    config: {
      damping: 18,
      stiffness: 180,
      mass: 0.6,
    },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingLeft: 65,
        paddingRight: 65,
        paddingBottom: 470,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          maxWidth: 950,
          transform: `scale(${interpolate(progress, [0, 1], [0.92, 1])})`,
          opacity: progress,
        }}
      >
        {active.words.map((word, index) => {
          const wordStart = Math.round(word.start * fps);
          const wordEnd = Math.max(
            wordStart + 1,
            Math.round(word.end * fps)
          );

          const wordProgress = interpolate(
            frame,
            [wordStart, wordEnd],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const highlighted = /[.!?,;:…]$/.test(word.text);

          return (
            <span
              key={`${word.start}-${index}`}
              style={{
                fontFamily: FONT,
                fontSize: 76,
                fontWeight: 900,
                color: highlighted ? C.yellow : C.white,
                textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                opacity: 0.65 + wordProgress * 0.35,
                transform: `scale(${1 + wordProgress * 0.06})`,
                display: "inline-block",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
