import React from "react";
import {AbsoluteFill, Easing, OffthreadVideo, interpolate, random, staticFile, useCurrentFrame} from "remotion";
import {AI_CLIPS, C, MONO} from "./config";

export const CL = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export const Cam: React.FC<{dur: number; from?: number; to?: number; px?: number; py?: number; rot?: number; children: React.ReactNode}> = ({
  dur, from = 1, to = 1.15, px = 0, py = 0, rot = 0, children,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], {...CL, easing: Easing.inOut(Easing.quad)});
  const s = from + (to - from) * p;
  const sx = Math.sin(f * 0.045) * 6;
  const sy = Math.cos(f * 0.037) * 5;
  return (
    <AbsoluteFill style={{transform: `translate(${px * p + sx}px, ${py * p + sy}px) scale(${s}) rotate(${rot * p}deg)`}}>
      {children}
    </AbsoluteFill>
  );
};

export const Particles: React.FC<{n?: number; color?: string; seed?: string; speed?: number}> = ({n = 60, color = C.cyan, seed = "p", speed = 1}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: n}).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const y0 = random(`${seed}y${i}`) * 1920;
        const s = 0.5 + random(`${seed}s${i}`) * 3;
        const y = (((y0 - f * (0.4 + random(`${seed}v${i}`) * 1.6) * speed * 2) % 1920) + 1920) % 1920;
        const o = 0.15 + 0.6 * random(`${seed}o${i}`);
        return <div key={i} style={{position: "absolute", left: x, top: y, width: s * 2, height: s * 2, borderRadius: "50%", background: color, opacity: o, boxShadow: `0 0 ${s * 6}px ${color}`}} />;
      })}
    </AbsoluteFill>
  );
};

export const GridFloor: React.FC<{top?: number; color?: string; speed?: number}> = ({top = 1100, color = C.blue, speed = 2}) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      position: "absolute", left: -600, width: 2280, top, height: 1400,
      backgroundImage: `linear-gradient(${color}66 2px, transparent 2px), linear-gradient(90deg, ${color}66 2px, transparent 2px)`,
      backgroundSize: "120px 120px", backgroundPosition: `0 ${f * speed}px`,
      transform: "perspective(700px) rotateX(68deg)", transformOrigin: "50% 0",
      WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 35%)",
    }} />
  );
};

export const Hud: React.FC<{x: number; y: number; lines: string[]; color?: string; size?: number}> = ({x, y, lines, color = C.cyan, size = 30}) => (
  <div style={{position: "absolute", left: x, top: y, fontFamily: MONO, fontSize: size, color, letterSpacing: 2, lineHeight: 1.5, textShadow: `0 0 14px ${color}`}}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);

export const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  const flick = 0.04 + 0.03 * Math.abs(Math.sin(f * 1.3) * Math.sin(f * 0.21));
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(0,0,0,.88) 100%)"}} />
      <AbsoluteFill style={{backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 4px)", mixBlendMode: "overlay"}} />
      <AbsoluteFill style={{background: `rgba(30,123,255,${flick})`, mixBlendMode: "screen"}} />
    </AbsoluteFill>
  );
};

export const AiClip: React.FC<{name: string}> = ({name}) => {
  const src = AI_CLIPS[name];
  if (!src) return null;
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(src)} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
    </AbsoluteFill>
  );
};

export const Robot: React.FC<{eye?: number; size?: number; tilt?: number; id?: string; color?: string}> = ({eye = 1, size = 600, tilt = 0, id = "r", color = C.cyan}) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 400 500" style={{transform: `rotate(${tilt}deg)`, filter: `drop-shadow(0 0 40px ${color}55)`}}>
    <defs>
      <linearGradient id={`${id}m`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#32456B" /><stop offset=".5" stopColor="#0E1626" /><stop offset="1" stopColor="#1D2D4B" />
      </linearGradient>
      <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={color} stopOpacity=".9" /><stop offset=".25" stopColor={color} stopOpacity="0" />
        <stop offset=".8" stopColor={color} stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".6" />
      </linearGradient>
      <radialGradient id={`${id}e`}>
        <stop offset="0" stopColor="#fff" /><stop offset=".3" stopColor={color} /><stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <path d="M10 500 C20 400 100 360 200 360 C300 360 380 400 390 500Z" fill={`url(#${id}m)`} stroke={color} strokeOpacity=".3" strokeWidth="2" />
    <rect x="165" y="290" width="70" height="90" rx="14" fill="#0A1120" />
    <line x1="200" y1="70" x2="200" y2="30" stroke={color} strokeWidth="4" opacity=".7" />
    <circle cx="200" cy="26" r="8" fill={color} opacity={0.4 + 0.6 * eye} />
    <rect x="80" y="70" width="240" height="240" rx="90" fill={`url(#${id}m)`} />
    <rect x="80" y="70" width="240" height="240" rx="90" fill={`url(#${id}rim)`} opacity=".55" />
    <rect x="108" y="130" width="184" height="104" rx="50" fill="#02050B" stroke={color} strokeOpacity=".45" strokeWidth="2" />
    <g opacity={eye}>
      <circle cx="158" cy="182" r="42" fill={`url(#${id}e)`} /><circle cx="242" cy="182" r="42" fill={`url(#${id}e)`} />
      <circle cx="158" cy="182" r={4 + 8 * eye} fill="#fff" /><circle cx="242" cy="182" r={4 + 8 * eye} fill="#fff" />
    </g>
    <path d="M130 268 H270" stroke={color} strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
