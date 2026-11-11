
import {loadFont} from "@remotion/google-fonts/Montserrat";

// ===== CONFIGURAÇÃO DO VÍDEO =====
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 60 * FPS;

// ===== IDENTIDADE VISUAL ARVION LAB =====
export const C = {
  black: "#03060D",
  deep: "#071226",
  blue: "#1E7BFF",
  cyan: "#36C6FF",
  white: "#F4F8FF",
  yellow: "#FFD60A",
};

// ===== TIPOGRAFIA =====
export const FONT = loadFont("normal", {
  weights: ["800", "900"],
  subsets: ["latin"],
}).fontFamily;

export const MONO = "ui-monospace, Menlo, Consolas, monospace";

// ===== ASSINATURA DA MARCA =====
export const SIGNATURE = {
  line1: "O FUTURO JÁ COMEÇOU.",
  brand: ["ARVION", "LAB"],
  handle: "@arvioncompany",
};

// ===== VÍDEOS EXTERNOS / IA =====
// Os arquivos devem ficar em public/clips.
// Exemplo: lab: "clips/lab.mp4"

export const AI_CLIPS: Record<string, string | null> = {
  lab: null,
  holo: null,
  city: null,
  work: null,
  human: null,
  close: null,
  outro: null,
};
