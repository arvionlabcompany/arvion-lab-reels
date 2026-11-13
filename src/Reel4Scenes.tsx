
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type SceneProps = { dur?: number };

const BLUE = "#25A9FF";
const WHITE = "#F4F8FF";
const MUTED = "#91A9C2";
const BG = "#050B14";

const base: React.CSSProperties = {
  background: `radial-gradient(ellipse at 50% 40%, #102B46 0%, ${BG} 72%)`,
  color: WHITE,
  fontFamily: "Arial, sans-serif",
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
  padding: 54,
};

const label: React.CSSProperties = {
  color: BLUE,
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: 5,
  textTransform: "uppercase",
  textAlign: "center",
};

const heading: React.CSSProperties = {
  color: WHITE,
  fontSize: 57,
  fontWeight: 900,
  lineHeight: 1.08,
  textAlign: "center",
  textShadow: "0 0 28px #168BFF55",
  maxWidth: 900,
};

const subheading: React.CSSProperties = {
  color: MUTED,
  fontSize: 27,
  lineHeight: 1.35,
  textAlign: "center",
  maxWidth: 820,
};

const glow: React.CSSProperties = {
  position: "absolute",
  width: 430,
  height: 430,
  borderRadius: "50%",
  background: "#087DFF",
  filter: "blur(130px)",
  opacity: 0.2,
};

const panel: React.CSSProperties = {
  border: "1px solid #2A9DFF88",
  background: "linear-gradient(145deg, #102943DD, #07111DEE)",
  boxShadow: "0 0 35px #168BFF22",
  borderRadius: 22,
  padding: 28,
};

const SceneShell: React.FC<{
  children: React.ReactNode;
  dur?: number;
}> = ({ children, dur = 180 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 12, dur - 12, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, dur], [0.96, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        ...base,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div style={glow} />
      {children}
      <div
        style={{
          position: "absolute",
          bottom: 35,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#5D7894",
          fontSize: 15,
          letterSpacing: 7,
        }}
      >
        ARVION LAB · O FUTURO ESTÁ EM MOVIMENTO
      </div>
    </AbsoluteFill>
  );
};

// CENA 1 — O COMENTÁRIO DA AUDIÊNCIA
export const R4Comment: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 25], [80, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell dur={dur}>
      <div style={{ ...panel, width: "88%", transform: `translateY(${x}px)` }}>
        <div style={label}>VOCÊS RESPONDERAM</div>
        <div
          style={{
            fontSize: 34,
            color: MUTED,
            textAlign: "center",
            marginTop: 30,
          }}
        >
          Se a IA assumisse os trabalhos...
        </div>
        <div
          style={{
            ...heading,
            maxWidth: "100%",
            marginTop: 35,
            color: BLUE,
            fontSize: 64,
          }}
        >
          “IA SE REINVENTAR TUDO”
        </div>
        <div
          style={{
            textAlign: "center",
            color: WHITE,
            fontSize: 20,
            marginTop: 30,
          }}
        >
          UM COMENTÁRIO. UMA GRANDE REFLEXÃO.
        </div>
      </div>
    </SceneShell>
  );
};

// CENA 2 — CIDADE AUTOMATIZADA
export const R4City: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell dur={dur}>
      <div style={label}>UM NOVO CENÁRIO</div>
      <div
        style={{
          display: "flex",
          alignItems: "end",
          gap: 13,
          height: 330,
          marginTop: 45,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const h = 110 + ((i * 47) % 170);
          return (
            <div
              key={i}
              style={{
                width: 65,
                height: h,
                border: "2px solid #168BFF88",
                background: `linear-gradient(180deg, #1B6CA8, #091727)`,
                boxShadow: "0 0 22px #168BFF33",
                position: "relative",
                transform: `translateY(${Math.sin(frame / 15 + i) * 5}px)`,
              }}
            >
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  style={{
                    height: 7,
                    margin: "15px 9px",
                    background: "#5CC2FF",
                    opacity: 0.65,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ ...heading, marginTop: 35 }}>
        CIDADES. EMPRESAS. MÁQUINAS.
      </div>
      <div style={subheading}>A transformação já começou.</div>
    </SceneShell>
  );
};

// CENA 3 — ESCRITÓRIO EM TRANSFORMAÇÃO
export const R4Office: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 45], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell dur={dur}>
      <div style={label}>O TRABALHO ESTÁ MUDANDO</div>
      <div style={{ display: "flex", gap: 24, marginTop: 55, width: "100%" }}>
        <div style={{ ...panel, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 70 }}>▤</div>
          <div style={{ ...heading, fontSize: 31 }}>ANTES</div>
          <div style={subheading}>Processos manuais</div>
        </div>
        <div
          style={{
            color: BLUE,
            fontSize: 55,
            alignSelf: "center",
            opacity: progress,
          }}
        >
          →
        </div>
        <div style={{ ...panel, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 70, color: BLUE }}>⌘</div>
          <div style={{ ...heading, fontSize: 31 }}>AGORA</div>
          <div style={subheading}>Inteligência artificial</div>
        </div>
      </div>
      <div style={{ ...heading, fontSize: 38, marginTop: 45 }}>
        NOVAS FORMAS DE FAZER.
      </div>
    </SceneShell>
  );
};

// CENA 4 — PROFISSÕES EM MUDANÇA
export const R4Jobs: React.FC<SceneProps> = ({ dur }) => {
  const jobs = ["MEDICINA", "ENGENHARIA", "DESIGN", "EDUCAÇÃO"];
  const frame = useCurrentFrame();

  return (
    <SceneShell dur={dur}>
      <div style={label}>NENHUMA ÁREA FICA PARADA</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          width: "100%",
          marginTop: 50,
        }}
      >
        {jobs.map((job, i) => (
          <div
            key={job}
            style={{
              ...panel,
              textAlign: "center",
              padding: 35,
              transform: `translateY(${Math.sin(frame / 12 + i) * 8}px)`,
            }}
          >
            <div style={{ color: BLUE, fontSize: 22, marginBottom: 15 }}>
              0{i + 1}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{job}</div>
          </div>
        ))}
      </div>
      <div style={{ ...subheading, marginTop: 38 }}>
        Profissões se adaptam. Habilidades evoluem.
      </div>
    </SceneShell>
  );
};

// CENA 5 — NOVAS HABILIDADES
export const R4Skills: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const skills = ["CRIATIVIDADE", "ANÁLISE", "ADAPTAÇÃO", "COLABORAÇÃO"];

  return (
    <SceneShell dur={dur}>
      <div style={label}>O QUE VAI VALER MAIS?</div>
      <div style={{ width: "100%", marginTop: 42 }}>
        {skills.map((skill, i) => {
          const width = interpolate(frame, [i * 8, i * 8 + 35], [5, 100], {
            extrapolateRight: "clamp",
          });
          return (
            <div key={skill} style={{ marginBottom: 25 }}>
              <div
                style={{
                  color: WHITE,
                  fontSize: 23,
                  fontWeight: 800,
                  marginBottom: 9,
                }}
              >
                {skill}
              </div>
              <div
                style={{
                  height: 13,
                  background: "#1A3045",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${width}%`,
                    background: `linear-gradient(90deg, #087DFF, #64D5FF)`,
                    boxShadow: "0 0 18px #168BFF",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

// CENA 6 — HUMANO E IA COLABORANDO
export const R4Together: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const move = Math.sin(frame / 18) * 12;

  return (
    <SceneShell dur={dur}>
      <div style={label}>NÃO É APENAS SUBSTITUIÇÃO</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 38,
          marginTop: 50,
        }}
      >
        <div style={{ textAlign: "center", transform: `translateY(${move}px)` }}>
          <div style={{ fontSize: 115 }}>👤</div>
          <div style={{ color: WHITE, fontSize: 25, fontWeight: 800 }}>
            HUMANO
          </div>
        </div>
        <div style={{ color: BLUE, fontSize: 55, fontWeight: 900 }}>+</div>
        <div style={{ textAlign: "center", transform: `translateY(${-move}px)` }}>
          <div style={{ fontSize: 115 }}>🤖</div>
          <div style={{ color: BLUE, fontSize: 25, fontWeight: 800 }}>
            IA
          </div>
        </div>
      </div>
      <div style={{ ...heading, marginTop: 48, fontSize: 43 }}>
        JUNTOS, NOVAS POSSIBILIDADES.
      </div>
      <div style={subheading}>A colaboração pode ser a maior vantagem.</div>
    </SceneShell>
  );
};

// CENA 7 — QUEM SE REINVENTA
export const R4Future: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pulse = 0.75 + Math.sin(frame / 10) * 0.12;

  return (
    <SceneShell dur={dur}>
      <div style={label}>O FUTURO NÃO ESTÁ PRONTO</div>
      <div
        style={{
          width: 270,
          height: 270,
          borderRadius: "50%",
          border: "3px solid #25A9FF",
          boxShadow: `0 0 ${45 * pulse}px #168BFF88`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 45,
          background: "radial-gradient(circle, #174D77, #07111D 70%)",
        }}
      >
        <div style={{ fontSize: 115 }}>◉</div>
      </div>
      <div style={{ ...heading, marginTop: 45 }}>
        REINVENTAR É ESCOLHER EVOLUIR.
      </div>
      <div style={subheading}>A tecnologia muda. Nossa capacidade de aprender também.</div>
    </SceneShell>
  );
};

// CENA 8 — ENCERRAMENTO
export const R4Outro: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell dur={dur}>
      <div style={{ ...label, opacity }}>ARVION LAB APRESENTA</div>
      <div
        style={{
          ...heading,
          fontSize: 76,
          marginTop: 35,
          opacity,
          color: BLUE,
        }}
      >
        REINVENTE-SE.
      </div>
      <div style={{ ...heading, fontSize: 43, marginTop: 22 }}>
        O FUTURO SERÁ DE QUEM EVOLUI.
      </div>
      <div
        style={{
          ...panel,
          marginTop: 48,
          padding: "22px 38px",
          color: WHITE,
          fontSize: 25,
          fontWeight: 800,
          letterSpacing: 3,
        }}
      >
        O QUE VOCÊ REINVENTARIA PRIMEIRO?
      </div>
      <div style={{ ...label, marginTop: 35 }}>ARVION LAB</div>
    </SceneShell>
  );
};
