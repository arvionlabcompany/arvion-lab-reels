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
  const zoom = interpolate(f, [0, 120, 195, dur - 30, dur], [1, 1.45, 1.5, 1.7, 2.2], CL);
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

  const fade = interpolate(f, [0, 12, 225, 240], [0, 1, 1, 0], CL);

  const question = spring({
    frame: f - 8,
    fps,
    config: {damping: 14, stiffness: 150},
  });

  const options = spring({
    frame: f - 55,
    fps,
    config: {damping: 13, stiffness: 170},
  });

  const cta = spring({
    frame: f - 120,
    fps,
    config: {damping: 14, stiffness: 150},
  });

  const logo = spring({
    frame: f - 180,
    fps,
    config: {damping: 14},
  });

  const pulse = 1 + Math.sin(f * 0.12) * 0.035;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 45%, #102D60 0%, ${C.deep} 48%, ${C.black} 100%)`,
        opacity: fade,
        overflow: "hidden",
      }}
    >
      <GridFloor top={1350} speed={0.4} />
      <Particles n={45} seed="outro-v2" speed={0.4} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 65,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 27,
            color: C.cyan,
            letterSpacing: 8,
            marginBottom: 35,
            opacity: question,
          }}
        >
          // DECISÃO FINAL
        </div>

        <div
          style={{
            fontFamily: FONT,
            fontSize: 91,
            lineHeight: 1.05,
            fontWeight: 900,
            color: C.white,
            textAlign: "center",
            transform: `translateY(${(1 - question) * 45}px)`,
            opacity: question,
            textShadow: `0 0 45px ${C.blue}88`,
          }}
        >
          VOCÊ
          <br />
          CONFIARIA?
        </div>

        <div
          style={{
            marginTop: 35,
            fontFamily: FONT,
            fontSize: 37,
            color: C.white,
            textAlign: "center",
            lineHeight: 1.35,
            opacity: question,
            maxWidth: 850,
          }}
        >
          Sua vida nas mãos de uma inteligência artificial?
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            gap: 25,
            marginTop: 75,
            opacity: options,
            transform: `scale(${0.85 + options * 0.15})`,
          }}
        >
          {["SIM", "NÃO"].map((label, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: "35px 10px",
                borderRadius: 18,
                textAlign: "center",
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 57,
                color: C.white,
                background: i === 0 ? "#123F75" : "#303B50",
                border: `3px solid ${i === 0 ? C.cyan : C.yellow}`,
                boxShadow: `0 0 ${35 * pulse}px ${i === 0 ? C.blue : C.yellow}66`,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 55,
            textAlign: "center",
            opacity: cta,
            transform: `translateY(${(1 - cta) * 25}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 43,
              fontWeight: 900,
              color: C.yellow,
              letterSpacing: 2,
            }}
          >
            COMENTE SUA RESPOSTA!
          </div>

          <div
            style={{
              fontFamily: MONO,
              fontSize: 27,
              color: C.white,
              marginTop: 20,
            }}
          >
            A CONTINUAÇÃO VEM AÍ...
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 105,
            textAlign: "center",
            opacity: logo,
            transform: `scale(${0.9 + logo * 0.1})`,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 70,
              letterSpacing: 14,
              color: C.white,
            }}
          >
            ARVION <span style={{color: C.cyan}}>LAB</span>
          </div>

          <div
            style={{
              fontFamily: MONO,
              fontSize: 23,
              color: "#9CB3D6",
              letterSpacing: 5,
              marginTop: 12,
            }}
          >
            {SIGNATURE.handle}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
/* =====================================================
   REEL 03 — CENAS NOVAS: A IA VAI SUBSTITUIR HUMANOS?
   ===================================================== */

const ReelGlow: React.FC<{x: number; y: number; size: number; color?: string}> = ({
  x, y, size, color = C.cyan
}) => (
  <div style={{
    position: "absolute",
    left: x,
    top: y,
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color}66 0%, ${color}18 35%, transparent 72%)`,
    filter: "blur(18px)",
  }} />
);

const ReelFigure: React.FC<{x: number; y: number; scale?: number; color?: string}> = ({
  x, y, scale = 1, color = C.cyan
}) => (
  <svg
    width={300 * scale}
    height={620 * scale}
    viewBox="0 0 300 620"
    style={{position: "absolute", left: x, top: y}}
  >
    <defs>
      <linearGradient id="reel-person" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={color} stopOpacity=".65" />
        <stop offset="1" stopColor="#02050B" />
      </linearGradient>
    </defs>
    <circle cx="150" cy="105" r="66" fill="#030711" stroke={color} strokeWidth="4" />
    <path d="M75 190 Q150 155 225 190 L285 590 L15 590Z"
      fill="url(#reel-person)" stroke={color} strokeOpacity=".65" strokeWidth="4" />
    <path d="M85 240 L150 330 L215 240" fill="none" stroke={color} strokeOpacity=".5" strokeWidth="3" />
  </svg>
);

/* 1 — A pessoa encontra uma IA ativa no escritório */
export const SceneFuture: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, dur], [1, 1.18], CL);
  const screen = interpolate(f, [5, 22, 38], [0, 1, 0.65], CL);

  return (
    <AbsoluteFill style={{background: "linear-gradient(160deg,#02050B,#071A38 55%,#02050B)", overflow: "hidden"}}>
      <ReelGlow x={260} y={220} size={700} />
      <div style={{position:"absolute", left:80, top:260, width:920, height:900,
        border:"3px solid #35D9FF66", background:"#07152B",
        boxShadow:"0 0 100px #087DFF44", transform:`scale(${zoom})`}}>
        <div style={{height:55, background:"#10294B", borderBottom:"2px solid #35D9FF66",
          color:C.cyan, fontFamily:MONO, fontSize:23, padding:15}}>
          ARVION // SISTEMA AUTÔNOMO
        </div>
        <div style={{padding:40, opacity:screen}}>
          <div style={{fontFamily:MONO, fontSize:34, color:C.cyan}}>BOM DIA.</div>
          <div style={{fontFamily:FONT, fontSize:58, fontWeight:900, color:C.white, marginTop:25}}>
            ESTOU PRONTA
            <br/>PARA TRABALHAR.
          </div>
          {[0,1,2,3].map(i=><div key={i} style={{height:12, width:`${85-i*13}%`, marginTop:35,
            background:C.cyan, opacity:.5-i*.08, boxShadow:"0 0 20px #35D9FF"}} />)}
        </div>
      </div>
      <ReelFigure x={390} y={1110} scale={1.25}/>
      <Hud x={65} y={150} lines={["NOVO EXPEDIENTE", "SISTEMA ONLINE"]}/>
      <Particles n={35} seed="reel-future"/>
    </AbsoluteFill>
  );
};

/* 2 — Robô e processamento em alta velocidade */
export const SceneMachine: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f*.13)*.04;
  return (
    <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 45%,#123B70,#02050B 70%)", overflow:"hidden"}}>
      <ReelGlow x={180} y={300} size={720}/>
      <svg width="1080" height="1920" style={{position:"absolute",inset:0}}>
        {[0,1,2,3,4].map(i=><circle key={i} cx="540" cy="800" r={180+i*100}
          fill="none" stroke={i%2?C.blue:C.cyan} strokeWidth="3"
          strokeDasharray="30 22" opacity=".6"
          transform={`rotate(${f*(i%2?-.8:1)} 540 800)`}/>)}
      </svg>
      <div style={{position:"absolute",left:250,top:430,width:580,height:760,
        border:"4px solid #35D9FF88",borderRadius:100,
        background:"linear-gradient(145deg,#17345B,#02050B)",
        boxShadow:"0 0 100px #168CFF66",transform:`scale(${pulse})`}}>
        <div style={{position:"absolute",left:85,top:180,width:410,height:170,
          borderRadius:60,background:"#020711",border:"3px solid #35D9FF88",
          display:"flex",justifyContent:"space-evenly",alignItems:"center"}}>
          {[0,1].map(i=><div key={i} style={{width:90,height:48,borderRadius:30,
            background:C.cyan,boxShadow:"0 0 45px #35D9FF"}}/>)}
        </div>
        <div style={{position:"absolute",left:130,top:430,width:320,height:12,background:C.cyan,
          boxShadow:"0 0 35px #35D9FF"}}/>
      </div>
      <Hud x={65} y={160} lines={["PROCESSAMENTO", `${Math.floor(98+Math.sin(f*.1)*2)}% // ATIVO`]}/>
      <Particles n={55} seed="reel-machine" speed={1.2}/>
    </AbsoluteFill>
  );
};

/* 3 — Empresa automatizada, braços robóticos e painéis */
export const SceneAutomation: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const angle = Math.sin(f*.045)*18;
  return (
    <AbsoluteFill style={{background:"linear-gradient(180deg,#02050B,#0A1C3C 60%,#02050B)",overflow:"hidden"}}>
      <ReelGlow x={340} y={500} size={600}/>
      {[0,1,2].map(i=><div key={i} style={{
        position:"absolute",left:70+i*320,top:390+i*100,width:270,height:600,
        border:"2px solid #35D9FF77",background:"linear-gradient(145deg,#102B50,#030813)",
        boxShadow:"0 0 45px #087DFF33",padding:20
      }}>
        <div style={{fontFamily:MONO,color:C.cyan,fontSize:23}}>ROBO.{i+1}</div>
        <div style={{height:5,background:C.cyan,marginTop:25,width:`${60+i*10}%`}}/>
        <div style={{height:180,marginTop:45,border:"2px solid #35D9FF55",
          background:`repeating-linear-gradient(0deg,transparent 0 18px,#168CFF22 19px 21px)`}}/>
        <div style={{fontFamily:MONO,color:C.white,fontSize:20,marginTop:25}}>AUTOMAÇÃO</div>
      </div>)}
      <svg width="1080" height="1920" style={{position:"absolute",inset:0}}>
        <path d="M120 1300 L350 1100 L550 1250 L790 950 L1000 1120"
          fill="none" stroke={C.cyan} strokeWidth="12" strokeLinecap="round"
          transform={`rotate(${angle/8} 540 1100)`}/>
      </svg>
      <Hud x={65} y={160} lines={["OPERAÇÃO EMPRESARIAL","FLUXO AUTOMATIZADO"]}/>
      <Particles n={28} seed="reel-auto"/>
    </AbsoluteFill>
  );
};

/* 4 — Confronto visual entre humano e inteligência artificial */
export const SceneHumanVsAI: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const split = interpolate(f,[0,dur],[0,35],CL);
  return (
    <AbsoluteFill style={{background:"#02050B",overflow:"hidden"}}>
      <div style={{position:"absolute",left:0,top:0,width:"50%",height:"100%",
        background:"radial-gradient(ellipse at 50% 45%,#16416C,#02050B)"}}/>
      <div style={{position:"absolute",right:0,top:0,width:"50%",height:"100%",
        background:"radial-gradient(ellipse at 50% 45%,#073E60,#02050B)"}}/>
      <ReelFigure x={80} y={800} scale={1.2} color="#8CB8FF"/>
      <div style={{position:"absolute",right:110,top:690,width:360,height:500,
        borderRadius:"45%",border:"5px solid #35D9FF",
        background:"radial-gradient(circle,#1C75B5,#02050B 70%)",
        boxShadow:"0 0 100px #168CFF77",transform:`translateY(${Math.sin(f*.08)*split}px)`}}>
        <div style={{position:"absolute",left:65,top:160,width:70,height:25,
          background:C.cyan,boxShadow:"0 0 30px #35D9FF"}}/>
        <div style={{position:"absolute",right:65,top:160,width:70,height:25,
          background:C.cyan,boxShadow:"0 0 30px #35D9FF"}}/>
      </div>
      <div style={{position:"absolute",left:0,right:0,top:1330,textAlign:"center",
        fontFamily:MONO,fontSize:30,color:C.white,letterSpacing:8}}>
        HUMANO <span style={{color:C.cyan}}> VS </span> IA
      </div>
      <Hud x={65} y={160} lines={["O FUTURO DO TRABALHO","QUEM SERÁ NECESSÁRIO?"]}/>
    </AbsoluteFill>
  );
};

/* 5 — Profissões diferentes em transformação */
export const SceneJobs: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const jobs = ["MEDICINA","ENGENHARIA","DESIGN","EDUCAÇÃO"];
  return (
    <AbsoluteFill style={{background:"linear-gradient(145deg,#06152E,#02050B 65%)",overflow:"hidden"}}>
      <ReelGlow x={250} y={400} size={650}/>
      {jobs.map((job,i)=>{
        const x=65+(i%2)*500;
        const y=420+Math.floor(i/2)*570;
        const scale=interpolate(f,[i*5,i*5+18],[.8,1],{...CL});
        return <div key={job} style={{position:"absolute",left:x,top:y,width:450,height:470,
          border:"2px solid #35D9FF88",background:"linear-gradient(145deg,#12335A,#030813)",
          boxShadow:"0 0 40px #087DFF33",transform:`scale(${scale})`,padding:28,boxSizing:"border-box"}}>
          <div style={{fontFamily:MONO,fontSize:25,color:C.cyan}}>SETOR 0{i+1}</div>
          <div style={{fontFamily:FONT,fontSize:43,fontWeight:900,color:C.white,marginTop:30}}>{job}</div>
          <div style={{marginTop:45,height:115,display:"flex",alignItems:"end",gap:12}}>
            {[35,70,48,90,60,100].map((v,j)=><div key={j} style={{flex:1,height:`${v}%`,
              background:j===3?C.yellow:C.cyan,boxShadow:"0 0 15px #35D9FF"}}/>)}
          </div>
          <div style={{fontFamily:MONO,fontSize:20,color:C.white,marginTop:35}}>EM TRANSFORMAÇÃO</div>
        </div>;
      })}
      <Hud x={65} y={150} lines={["PROFISSÕES DO FUTURO","NOVAS POSSIBILIDADES"]}/>
    </AbsoluteFill>
  );
};

/* 6 — Humano e robô trabalhando juntos */
export const SceneCollab: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const glow = .5+.5*Math.sin(f*.12);
  return (
    <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 60%,#123D70,#02050B 72%)",overflow:"hidden"}}>
      <ReelGlow x={280} y={720} size={650}/>
      <ReelFigure x={40} y={850} scale={1.05} color="#A8C9FF"/>
      <div style={{position:"absolute",right:90,top:870,width:360,height:540,
        borderRadius:80,border:"4px solid #35D9FF",
        background:"linear-gradient(145deg,#1C4C79,#02050B)",
        boxShadow:`0 0 ${50+glow*50}px #168CFF99`}}>
        <div style={{position:"absolute",left:75,top:120,width:210,height:100,
          borderRadius:50,border:"3px solid #35D9FF",background:"#06152E"}}/>
        <div style={{position:"absolute",left:110,top:155,width:35,height:18,background:C.cyan}}/>
        <div style={{position:"absolute",right:110,top:155,width:35,height:18,background:C.cyan}}/>
      </div>
      <svg width="1080" height="1920" style={{position:"absolute",inset:0}}>
        <path d="M300 1160 Q540 950 780 1160" fill="none" stroke={C.cyan}
          strokeWidth="5" strokeDasharray="14 12" strokeDashoffset={-f*2}/>
        <circle cx="540" cy="1050" r={90+glow*20} fill="none" stroke={C.yellow} strokeWidth="4" opacity=".8"/>
      </svg>
      <Hud x={65} y={150} lines={["HUMANO + INTELIGÊNCIA ARTIFICIAL","COLABORAÇÃO ATIVA"]}/>
      <Particles n={40} seed="reel-collab"/>
    </AbsoluteFill>
  );
};

/* 7 — Close emocional no olhar humano */
export const SceneHumanity: React.FC<P> = ({dur}) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f,[0,dur],[1,1.28],CL);
  return (
    <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 45%,#183B64,#02050B 70%)",overflow:"hidden"}}>
      <div style={{position:"absolute",left:90,top:500,width:900,height:700,
        borderRadius:"50%",border:"3px solid #35D9FF66",
        background:"linear-gradient(145deg,#29415F,#030711)",
        transform:`scale(${zoom})`,boxShadow:"0 0 100px #087DFF55"}}>
        <div style={{position:"absolute",left:130,top:250,width:640,height:180,
          borderRadius:"50%",border:"5px solid #8CB8FF",
          background:"radial-gradient(ellipse,#02050B 20%,#1C6A9D 40%,#02050B 72%)",
          boxShadow:"0 0 60px #35D9FF88"}}>
          <div style={{position:"absolute",left:280,top:45,width:80,height:80,
            borderRadius:"50%",background:"#02050B",boxShadow:"0 0 25px #35D9FF"}}/>
        </div>
        <div style={{position:"absolute",left:300,top:500,width:300,height:5,background:C.cyan,opacity:.5}}/>
      </div>
      <Hud x={65} y={160} lines={["ESSÊNCIA HUMANA","CRIATIVIDADE // EMPATIA // ÉTICA"]}/>
      <Particles n={25} seed="reel-humanity" speed={.3}/>
    </AbsoluteFill>
  );
};

/* 8 — Pergunta final e identidade Arvion Lab */
export const SceneOutroAI: React.FC<P> = () => {
  const f = useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame:f-5,fps,config:{damping:14,stiffness:120}});
  const logo=spring({frame:f-75,fps,config:{damping:15}});
  const pulse=1+Math.sin(f*.15)*.025;
  return (
    <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 45%,#12366B,#02050B 72%)",
      alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <ReelGlow x={220} y={400} size={650}/>
      <Particles n={45} seed="reel-outro"/>
      <div style={{fontFamily:MONO,fontSize:26,color:C.cyan,letterSpacing:7,opacity:enter}}>
        // O FUTURO É AGORA
      </div>
      <div style={{fontFamily:FONT,fontSize:78,fontWeight:900,color:C.white,
        textAlign:"center",lineHeight:1.12,marginTop:45,opacity:enter,
        transform:`scale(${.8+enter*.2})`,textShadow:"0 0 45px #168CFF88"}}>
        A IA VAI
        <br/>SUBSTITUIR
        <br/>OS HUMANOS?
      </div>
      <div style={{fontFamily:FONT,fontSize:37,fontWeight:900,color:C.yellow,
        marginTop:55,opacity:enter,textAlign:"center"}}>
        COMENTE: SIM OU NÃO
      </div>
      <div style={{position:"absolute",bottom:150,textAlign:"center",
        opacity:logo,transform:`scale(${pulse})`}}>
        <div style={{fontFamily:FONT,fontWeight:900,fontSize:66,letterSpacing:12,color:C.white}}>
          ARVION <span style={{color:C.cyan}}>LAB</span>
        </div>
        <div style={{fontFamily:MONO,fontSize:22,color:"#9CB3D6",letterSpacing:5,marginTop:12}}>
          {SIGNATURE.handle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
