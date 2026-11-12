
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";

import { C, MONO } from "./config";

export const CL = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type RobotProps = {
  eye?: number;
  size?: number;
  tilt?: number;
  id?: string;
  color?: string;
};

export const Robot: React.FC<RobotProps> = ({
  eye = 1,
  size = 600,
  tilt = 0,
  id = "r",
  color = C.cyan,
}) => {
  const uniqueId = React.useId().replace(/:/g, "");
  const gradientId = `${id}-${uniqueId}`;

  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 400 500"
      style={{
        transform: `rotate(${tilt}deg)`,
        filter: `drop-shadow(0 0 40px ${color}55)`,
      }}
    >
      <defs>
        <linearGradient id={`${gradientId}m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#32456B" />
          <stop offset=".5" stopColor="#0E1626" />
          <stop offset="1" stopColor="#1D2D4B" />
        </linearGradient>

        <linearGradient id={`${gradientId}rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} stopOpacity=".9" />
          <stop offset=".25" stopColor={color} stopOpacity="0" />
          <stop offset=".8" stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".6" />
        </linearGradient>

        <radialGradient id={`${gradientId}e`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset=".3" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d="M10 500 C20 400 100 360 200 360 C300 360 380 400 390 500Z"
        fill={`url(#${gradientId}m)`}
        stroke={color}
        strokeOpacity=".3"
        strokeWidth="2"
      />

      <rect x="165" y="290" width="70" height="90" rx="14" fill="#0A1120" />
      <line x1="200" y1="70" x2="200" y2="30" stroke={color} strokeWidth="4" opacity=".7" />
      <circle cx="200" cy="26" r="8" fill={color} opacity={0.4 + 0.6 * eye} />

      <rect x="80" y="70" width="240" height="240" rx="90" fill={`url(#${gradientId}m)`} />
      <rect x="80" y="70" width="240" height="240" rx="90" fill={`url(#${gradientId}rim)`} opacity=".55" />
      <rect x="108" y="130" width="184" height="104" rx="50" fill="#02050B" stroke={color} strokeOpacity=".45" strokeWidth="2" />

      <g opacity={eye}>
        <circle cx="158" cy="182" r="42" fill={`url(#${gradientId}e)`} />
        <circle cx="242" cy="182" r="42" fill={`url(#${gradientId}e)`} />
        <circle cx="158" cy="182" r={4 + 8 * eye} fill="#fff" />
        <circle cx="242" cy="182" r={4 + 8 * eye} fill="#fff" />
      </g>

      <path
        d="M130 268 H270"
        stroke={color}
        strokeOpacity=".35"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

type CamProps = {
  dur: number;
  from?: number;
  to?: number;
  px?: number;
  py?: number;
  children: React.ReactNode;
};

export const Cam: React.FC<CamProps> = ({
  dur,
  from = 1,
  to = 1.15,
  px = 0,
  py = 0,
  children,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, Math.max(1, dur)],
    [from, to],
    CL
  );

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate(${px}px, ${py}px)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

type GridFloorProps = {
  top?: number;
  speed?: number;
  color?: string;
};

export const GridFloor: React.FC<GridFloorProps> = ({
  top = 1180,
  speed = 0.5,
  color = C.cyan,
}) => {
  const frame = useCurrentFrame();
  const offset = (frame * speed * 8) % 70;

  return (
    <div
      style={{
        position: "absolute",
        left: -200,
        top,
        width: 1480,
        height: 900,
        overflow: "hidden",
        perspective: 500,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          transform: "rotateX(62deg)",
          transformOrigin: "top center",
          backgroundImage: `
            linear-gradient(${color}55 1px, transparent 1px),
            linear-gradient(90deg, ${color}55 1px, transparent 1px)
          `,
          backgroundSize: `70px 70px`,
          backgroundPosition: `0 ${offset}px`,
          maskImage: "linear-gradient(to bottom, black, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 90%)",
        }}
      />
    </div>
  );
};

type HudProps = {
  x: number;
  y: number;
  lines: string[];
  size?: number;
  color?: string;
};

export const Hud: React.FC<HudProps> = ({
  x,
  y,
  lines,
  size = 25,
  color = C.cyan,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame % 120,
    [0, 10, 110, 120],
    [0.45, 1, 1, 0.45],
    CL
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 5,
        fontFamily: MONO,
        fontSize: size,
        lineHeight: 1.7,
        letterSpacing: 2,
        color,
        opacity,
        textShadow: `0 0 18px ${color}`,
        pointerEvents: "none",
      }}
    >
      {lines.map((line, index) => (
        <div key={`${index}-${line}`}>{line}</div>
      ))}
    </div>
  );
};

type ParticlesProps = {
  n?: number;
  seed?: string;
  color?: string;
  speed?: number;
};

export const Particles: React.FC<ParticlesProps> = ({
  n = 35,
  seed = "particles",
  color = C.cyan,
  speed = 1,
}) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: n }, (_, index) => {
    const x = random(`${seed}-x-${index}`) * 1080;
    const y = random(`${seed}-y-${index}`) * 1920;
    const size = 2 + random(`${seed}-s-${index}`) * 6;
    const phase = random(`${seed}-p-${index}`) * Math.PI * 2;
    const drift = (frame * speed * (0.5 + random(`${seed}-v-${index}`))) % 200;

    return {
      x,
      y: (y - drift + 1920) % 1920,
      size,
      opacity: 0.25 + 0.5 * Math.abs(Math.sin(frame * 0.035 + phase)),
    };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {particles.map((particle, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            background: color,
            opacity: particle.opacity,
            boxShadow: `0 0 14px ${color}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/*
 * Componente reservado para efeitos específicos de cada cena.
 * Mantido transparente para não alterar as cenas existentes.
 */
export const AiClip: React.FC<{ name: string }> = () => null;

/*
 * Camada global de acabamento cinematográfico.
 */
export const Overlay: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `
          radial-gradient(
            ellipse at center,
            transparent 48%,
            rgba(0,0,0,0.16) 75%,
            rgba(0,0,0,0.48) 100%
          )
        `,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.07,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.16) 4px)",
        }}
      />
    </AbsoluteFill>
  );
};
