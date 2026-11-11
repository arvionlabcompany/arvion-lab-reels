import React from "react";
import {AbsoluteFill, Easing, interpolate, interpolateColors, random, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {C, FONT, MONO, SIGNATURE} from "./config";
import {CL, Cam, GridFloor, Hud, Particles, Robot} from "./fx";

type P = {dur: number};

/* ---------- 1. LABORATÓRIO: robô despertando ---------- */
const Shaft: React.FC<{left: number; rot: number}> = ({left, rot}) => (
  <div style={{position: "absolute", left, top: -200, width: 260, height: 1800, background: `linear-gradient(180deg, ${C.cyan}48, transparent)`, transform: `rotate(${rot}deg)`, filter: "blur(30px)"}} />
);
export const SceneLab: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const eye = interpolate(f, [40, 46, 52, 60, 66, 100], [0, 0.9, 0.1, 0.8, 0.3, 1], CL);
  const rise = interpolate(f, [0, 150], [50, 0], {...CL, easing: Easing.out(Easing.cubic)});
  const prog = Math.round(interpolate(f, [10, 110], [0, 100], CL));
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, #0C2550 0%, ${C.black} 68%)`}}>
      <Cam dur={dur} from={1.02} to={1.3} py={-40}>
        <GridFloor top={1180} speed={0.6} />
        <Shaft left={120} rot={-12} />
        <Shaft left={700} rot={12} />
        <div style={{position: "absolute", left: 240, top: 260, width: 600, height: 1200, borderRadius: 300, border: `3px solid ${C.cyan}55`, background: `linear-gradient(180deg, ${C.cyan}22, transparent 40%, ${C.blue}22)`, boxShadow: `0 0 120px ${C.blue}66, inset 0 0 120px ${C.blue}44`}} />
        <div style={{position: "absolute", left: 240, top: 380 + rise}}>
          <Robot size={600} eye={eye} id="lab" />
        </div>
      </Cam>
      <Particles n={50} seed="lab" />
      <Hud x={70} y={230} lines={[`NÚCLEO IA // BOOT ${prog}%`, "VERIFICANDO SISTEMAS..."]} />
    </AbsoluteFill>
  );
};

/* ---------- 2. HOLOGRAMAS ---------- */
const CODE = [
  "def decidir(mundo):", "  dados = coletar(mundo.sensores)", "  padroes = aprender(dados)", "  if padroes.confianca > 0.97:",
  "      executar(padroes.acao)", "modelo.treinar(epocas=9999)", "fluxo = analisar(milhoes)", "otimizar(cidade, trafego)",
  "prever(demanda, 24h)", "autonomia = nivel(5)", "sincronizar(todos_os_nos)", "while True: aprender()",
];
const CodePanel: React.FC<{f: number; off: number}> = ({f, off}) => {
  const lines = [...CODE, ...CODE, ...CODE];
  return (
    <div style={{overflow: "hidden", height: "100%"}}>
      <div style={{transform: `translateY(${-((f * 2.2 + off) % (CODE.length * 44))}px)`}}>
        {lines.map((l, i) => (
          <div key={i} style={{height: 44, fontSize: 26, color: i % 4 === 3 ? C.yellow : C.cyan, whiteSpace: "pre", fontFamily: MONO}}>{l}</div>
        ))}
      </div>
    </div>
  );
};
const Panel: React.FC<{x: number; y: number; w: number; h: number; z: number; title: string; f: number; delay: number; children: React.ReactNode}> = ({x, y, w, h, z, title, f, delay, children}) => {
  const o = interpolate(f, [delay, delay + 12], [0, 1], CL);
  const s = interpolate(f, [delay, delay + 18], [0.85, 1], {...CL, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, transform: `translateZ(${z}px) scale(${s})`, opacity: o, border: `2px solid ${C.cyan}88`, background: `linear-gradient(135deg, ${C.blue}2E, ${C.black}99)`, boxShadow: `0 0 50px ${C.blue}55, inset 0 0 40px ${C.blue}22`, padding: 22, boxSizing: "border-box", borderRadius: 14}}>
      <div style={{fontFamily: MONO, fontSize: 24, color: C.white, opacity: 0.8, marginBottom: 12}}>{title}</div>
      <div style={{height: h - 90}}>{children}</div>
    </div>
  );
};
export const SceneHolo: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const orbit = interpolate(f, [0, dur], [-14, 14]);
  const count = Math.floor(interpolate(f, [0, dur], [0, 2480000000], CL));
  const nodes = Array.from({length: 18}, (_, i) => ({x: 30 + random("nx" + i) * 620, y: 20 + random("ny" + i) * 340}));
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, #0A1E45 0%, ${C.black} 70%)`}}>
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: 0.55}}>
        {[420, 330, 240].map((r, i) => (
          <circle key={i} cx={540} cy={960} r={r} fill="none" stroke={i === 1 ? C.yellow : C.cyan} strokeWidth={3} strokeDasharray={`${40 + i * 30} ${30 + i * 20}`}
            transform={`rotate(${f * (i % 2 ? -1.2 : 1.6)} 540 960)`} opacity={0.7} />
        ))}
      </svg>
      <div style={{position: "absolute", inset: 0, perspective: 1400, perspectiveOrigin: "50% 50%"}}>
        <div style={{position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${orbit}deg) rotateX(4deg)`}}>
          <Panel x={70} y={300} w={460} h={560} z={0} title="NEURAL//CORE" f={f} delay={4}><CodePanel f={f} off={0} /></Panel>
          <Panel x={570} y={240} w={440} h={420} z={140} title="PADRÕES DETECTADOS" f={f} delay={14}>
            <div style={{display: "flex", alignItems: "flex-end", gap: 10, height: "100%"}}>
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} style={{flex: 1, height: `${30 + 70 * Math.abs(Math.sin(f * 0.06 + i * 0.7))}%`, background: i % 5 === 2 ? C.yellow : C.cyan, boxShadow: `0 0 16px ${C.cyan}`}} />
              ))}
            </div>
          </Panel>
          <Panel x={190} y={960} w={700} h={430} z={-90} title="REDE GLOBAL" f={f} delay={24}>
            <svg width={650} height={360}>
              {nodes.map((n, i) => {
                const m = nodes[(i * 7 + 3) % nodes.length];
                return <line key={"l" + i} x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke={C.cyan} strokeOpacity={0.4} strokeWidth={2} strokeDasharray="8 8" strokeDashoffset={-f * 2} />;
              })}
              {nodes.map((n, i) => <circle key={i} cx={n.x} cy={n.y} r={5 + 3 * Math.sin(f * 0.15 + i)} fill={i % 6 === 0 ? C.yellow : C.cyan} />)}
            </svg>
          </Panel>
          <Panel x={620} y={760} w={380} h={520} z={210} title="EXECUÇÃO" f={f} delay={34}><CodePanel f={f} off={200} /></Panel>
        </div>
      </div>
      <Hud x={70} y={170} lines={["DADOS ANALISADOS", count.toLocaleString("pt-BR")]} size={34} />
      <Particles n={40} seed="holo" color={C.blue} />
    </AbsoluteFill>
  );
};

/* ---------- 3. CIDADE FUTURISTA ---------- */
const Layer: React.FC<{seed: string; f: number; speed: number; base: number; minH: number; maxH: number; color: string; win: number}> = ({seed, f, speed, base, minH, maxH, color, win}) => {
  const items: {x: number; w: number; h: number}[] = [];
  let x = 0;
  for (let i = 0; i < 22; i++) {
    const w = 90 + random(seed + "w" + i) * 90;
    const h = minH + random(seed + "h" + i) * (maxH - minH);
    items.push({x, w, h});
    x += w + 6;
  }
  const total = x;
  const off = (f * speed) % total;
  return (
    <>
      {[0, total].map((shift) => items.map((b, i) => (
        <div key={shift + "-" + i} style={{
          position: "absolute", left: b.x - off + shift, top: base - b.h, width: b.w, height: b.h,
          backgroundImage: `radial-gradient(circle, rgba(160,215,255,${win}) 0 3px, transparent 4px), linear-gradient(180deg, ${color}, #02050B)`,
          backgroundSize: "26px 34px, 100% 100%",
        }} />
      )))}
    </>
  );
};
export const SceneCity: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const cars = Array.from({length: 9}).map((_, i) => {
    const dir = i % 2 ? 1 : -1;
    const sp = (3 + random("c" + i) * 5) * dir;
    const x = ((((random("cx" + i) * 1400 + f * sp) % 1500) + 1500) % 1500) - 200;
    return {i, dir, x, y: 420 + i * 120};
  });
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.black} 0%, #0A2455 62%, #123E86 74%, ${C.black} 100%)`}}>
      <Cam dur={dur} from={1.0} to={1.18} px={-40}>
        <div style={{position: "absolute", left: 0, top: 960, width: 1080, height: 400, background: `radial-gradient(ellipse at 50% 100%, ${C.cyan}66, transparent 70%)`}} />
        <Layer seed="a" f={f} speed={0.6} base={1250} minH={300} maxH={760} color="#0E2A5C" win={0.18} />
        <Layer seed="b" f={f} speed={1.4} base={1400} minH={400} maxH={1000} color="#0A1B3E" win={0.35} />
        <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
          <polyline points="0,520 180,470 380,560 560,430 760,540 1080,450" fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="14 10" strokeDashoffset={-f * 3} opacity={0.8} />
        </svg>
        {cars.map((c) => (
          <div key={c.i}>
            <div style={{position: "absolute", left: c.dir > 0 ? c.x - 220 : c.x + 90, top: c.y + 4, width: 220, height: 8, background: `linear-gradient(${c.dir > 0 ? "90deg" : "270deg"}, transparent, ${C.cyan}cc)`, filter: "blur(2px)"}} />
            <div style={{position: "absolute", left: c.x, top: c.y, width: 90, height: 16, borderRadius: 8, background: C.white, boxShadow: `0 0 24px ${C.cyan}`}} />
            {c.i % 3 === 1 && (
              <div style={{position: "absolute", left: c.x - 24, top: c.y - 40, width: 140, height: 90, border: `2px solid ${C.yellow}`}}>
                <span style={{position: "absolute", top: -30, left: 0, fontFamily: MONO, fontSize: 20, color: C.yellow, whiteSpace: "nowrap"}}>AUTÔNOMO #{4800 + c.i * 7}</span>
              </div>
            )}
          </div>
        ))}
        <Layer seed="c" f={f} speed={3.2} base={1920} minH={500} maxH={900} color="#050C1E" win={0.5} />
      </Cam>
      <Particles n={30} seed="city" speed={0.5} />
      <Hud x={70} y={230} lines={["CIDADE INTELIGENTE", "TRÁFEGO OTIMIZADO: 99,8%"]} />
    </AbsoluteFill>
  );
};

/* ---------- 4. ROBÔS NA EMPRESA ---------- */
export const SceneWork: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const rows = [{y: 760, s: 0.55, n: 4}, {y: 1060, s: 0.8, n: 3}, {y: 1440, s: 1.15, n: 2}];
  const count = Math.floor(interpolate(f, [0, dur], [3200, 12480], CL));
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.black}, #08183A 50%, ${C.black})`}}>
      <Cam dur={dur} from={1.0} to={1.22} px={-90}>
        {[140, 230, 320].map((y, i) => (
          <div key={i} style={{position: "absolute", left: 100 + i * 60, top: y, width: 880 - i * 120, height: 14, background: C.white, opacity: 0.85 - i * 0.2, boxShadow: `0 0 60px ${C.cyan}`}} />
        ))}
        <GridFloor top={600} speed={0.4} color={C.blue} />
        {rows.map((r, ri) => (
          <React.Fragment key={ri}>
            {Array.from({length: r.n}).map((_, i) => {
              const gap = 1080 / r.n;
              const cx = gap * i + gap / 2;
              const size = 380 * r.s;
              const bob = Math.sin(f * 0.08 + i + ri) * 5;
              const task = 60 + Math.floor(39 * Math.abs(Math.sin(f * 0.03 + i * 2 + ri)));
              return (
                <div key={i}>
                  <div style={{position: "absolute", left: cx - size / 2, top: r.y - size * 1.25 + bob}}>
                    <Robot size={size} eye={0.9} id={`w${ri}${i}`} color={ri === 1 ? C.cyan : C.blue} />
                  </div>
                  <div style={{position: "absolute", left: cx - size * 0.6, top: r.y - size * 0.28, width: size * 1.2, height: size * 0.4, background: `linear-gradient(180deg, #14213D, ${C.black})`, borderTop: `3px solid ${C.cyan}`, boxShadow: `0 -10px 50px ${C.blue}66`}} />
                  <div style={{position: "absolute", left: cx - size * 0.5, top: r.y - size * 1.4 + bob, width: size, textAlign: "center", fontFamily: MONO, fontSize: 24 * r.s + 6, color: C.yellow}}>TAREFA {task}%</div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </Cam>
      <Particles n={30} seed="work" speed={0.3} />
      <Hud x={70} y={190} lines={["ROBÔS ATIVOS", count.toLocaleString("pt-BR")]} size={34} />
    </AbsoluteFill>
  );
};

/* ---------- 5. HUMANO OBSERVA A IA ---------- */
export const SceneHuman: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.04 * Math.sin(f * 0.12);
  const marks = Array.from({length: 7}, (_, i) => ({x: 120 + random("qx" + i) * 840, o: random("qo" + i), s: 80 + random("qs" + i) * 120}));
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, #0C2A63 0%, ${C.black} 70%)`}}>
      <Cam dur={dur} from={1.0} to={1.3} py={-80}>
        <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
          <defs>
            <radialGradient id="core"><stop offset="0" stopColor="#fff" /><stop offset=".25" stopColor={C.cyan} /><stop offset="1" stopColor={C.cyan} stopOpacity="0" /></radialGradient>
          </defs>
          <circle cx={540} cy={700} r={300 * pulse} fill="url(#core)" opacity={0.8} />
          {[120, 190, 260, 340, 420].map((r, i) => (
            <circle key={i} cx={540} cy={700} r={r} fill="none" stroke={i === 4 ? C.yellow : C.cyan} strokeWidth={i === 2 ? 6 : 3}
              strokeDasharray={`${20 + i * 14} ${16 + i * 8}`} transform={`rotate(${f * (i % 2 ? -0.9 : 1.2)} 540 700)`} opacity={0.75 - i * 0.08} />
          ))}
          <ellipse cx={400} cy={1380} rx={260} ry={160} fill={C.cyan} opacity={0.08} />
        </svg>
        {marks.map((m, i) => (
          <div key={i} style={{position: "absolute", left: m.x, top: (((1700 - f * (1 + m.o * 1.5) * 2 - m.o * 900) % 1700) + 1700) % 1700, fontFamily: FONT, fontWeight: 900, fontSize: m.s, color: C.white, opacity: 0.08 + 0.1 * m.o}}>?</div>
        ))}
        <svg width={520} height={780} viewBox="0 0 400 600" style={{position: "absolute", left: 140, top: 1140}}>
          <defs><linearGradient id="hrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.cyan} /><stop offset=".5" stopColor={C.cyan} stopOpacity=".1" /></linearGradient></defs>
          <path d="M0 600 C0 400 80 300 200 290 C320 300 400 400 400 600Z" fill="#02040A" stroke="url(#hrim)" strokeWidth={4} />
          <rect x={170} y={210} width={60} height={90} rx={20} fill="#02040A" />
          <circle cx={200} cy={150} r={72} fill="#02040A" stroke="url(#hrim)" strokeWidth={4} />
        </svg>
      </Cam>
      <Particles n={45} seed="human" />
      <Hud x={70} y={230} lines={["OBSERVANDO...", "ENTENDIMENTO: PARCIAL"]} />
    </AbsoluteFill>
  );
};

/* ---------- 6. CLOSE DO ROBÔ ---------- */
export const SceneClose: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const look = interpolate(f, [10, 30, 50, 72], [-110, -110, 25, 0], {...CL, easing: Easing.inOut(Easing.cubic)});
  const lookY = interpolate(f, [10, 72], [-40, 0], CL);
  const p = (f - 120) % 45;
  const pulse = f >= 120 && f < 195 ? Math.exp(-p / 5) + (p > 12 ? 0.6 * Math.exp(-(p - 12) / 5) : 0) : 0;
  const col = interpolateColors(f, [195, 230], [C.cyan, C.yellow]);
  const zoom = interpolate(f, [0, 120, 195, dur - 30, dur], [1, 1.45, 1.5, 1.7, 4.2], CL);
  const g = [8, 9, 31, 32, 33, 96, 97].includes(f);
  const dark = interpolate(f, [120, 135, 185, 200], [0, 0.4, 0.4, 0], CL);
  return (
    <AbsoluteFill style={{background: C.black}}>
      <div style={{position: "absolute", inset: 0, transform: `scale(${zoom * (1 + 0.025 * pulse)}) translateX(${g ? 24 : 0}px)`, filter: g ? "hue-rotate(40deg) saturate(1.8)" : "none"}}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <defs>
            <linearGradient id="hm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3A4F7A" /><stop offset=".5" stopColor="#0C1424" /><stop offset="1" stopColor="#22365C" /></linearGradient>
            <radialGradient id="iris"><stop offset="0" stopColor="#02050B" /><stop offset=".45" stopColor={col} stopOpacity=".95" /><stop offset="1" stopColor="#02050B" /></radialGradient>
          </defs>
          <circle cx={540} cy={860} r={440} fill="url(#hm)" stroke={col} strokeOpacity={0.4} strokeWidth={4} />
          <circle cx={540} cy={860} r={365} fill="#02050B" stroke={col} strokeOpacity={0.5} strokeWidth={3} />
          <circle cx={540} cy={860} r={330} fill="none" stroke={col} strokeWidth={4} strokeDasharray="60 24" transform={`rotate(${f * 0.8} 540 860)`} opacity={0.6} />
          <g transform={`translate(${look} ${lookY})`}>
            <circle cx={540} cy={860} r={230} fill="url(#iris)" />
            {Array.from({length: 36}).map((_, i) => (
              <line key={i} x1={540} y1={860 - 110} x2={540} y2={860 - 215} stroke={col} strokeWidth={2} opacity={0.55} transform={`rotate(${i * 10 + f * 0.3} 540 860)`} />
            ))}
            <circle cx={540} cy={860} r={100 - 8 * pulse} fill="#000" />
            <circle cx={500} cy={810} r={20} fill="#fff" opacity={0.9} />
            <circle cx={585} cy={915} r={8} fill="#fff" opacity={0.6} />
          </g>
          <path d="M200 700 A380 380 0 0 1 540 480" fill="none" stroke="#fff" strokeOpacity={0.15} strokeWidth={10} strokeLinecap="round" />
        </svg>
      </div>
      <AbsoluteFill style={{background: `rgba(0,0,0,${dark})`}} />
      <Hud x={70} y={230} lines={["CONTATO VISUAL", f > 72 ? "ALVO: HUMANO" : "PROCURANDO..."]} color={col} />
    </AbsoluteFill>
  );
};

/* ---------- 7. ENCERRAMENTO ARVION LAB ---------- */
export const SceneOutro: React.FC<P> = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = SIGNATURE.line1.split(" ");
  const sweep = interpolate(f, [160, 200], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const logoIn = spring({frame: f - 165, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 55%, #0A2150 0%, ${C.black} 70%)`}}>
      <GridFloor top={1250} speed={0.5} />
      <Particles n={50} seed="out" speed={0.6} />
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
        <div style={{display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center", maxWidth: 940, marginTop: -160}}>
          {words.map((w, i) => {
            const s = spring({frame: f - 110 - i * 8, fps, config: {damping: 13, stiffness: 180}});
            return (
              <span key={i} style={{fontFamily: FONT, fontWeight: 900, fontSize: 112, color: w.startsWith("FUTURO") ? C.yellow : C.white, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, textShadow: `0 0 50px ${C.blue}`}}>{w}</span>
            );
          })}
        </div>
        <div style={{width: 700 * sweep, height: 3, background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, margin: "50px 0", boxShadow: `0 0 20px ${C.cyan}`}} />
        <div style={{opacity: logoIn, transform: `scale(${0.9 + 0.1 * logoIn})`, textAlign: "center"}}>
          <svg width={110} height={110} viewBox="0 0 100 100" style={{marginBottom: 14}}>
            <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill="none" stroke={C.cyan} strokeWidth={4} />
            <polyline points="28,70 50,28 72,70" fill="none" stroke={C.white} strokeWidth={6} strokeLinejoin="round" />
            <line x1={38} y1={56} x2={62} y2={56} stroke={C.yellow} strokeWidth={5} />
          </svg>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 82, letterSpacing: 22, color: C.white, paddingLeft: 22}}>
            {SIGNATURE.brand[0]} <span style={{color: C.cyan}}>{SIGNATURE.brand[1]}</span>
          </div>
          <div style={{fontFamily: MONO, fontSize: 30, color: "#9CB3D6", letterSpacing: 4, marginTop: 18}}>{SIGNATURE.handle}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
