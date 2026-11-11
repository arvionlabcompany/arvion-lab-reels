import {loadFont} from "@remotion/google-fonts/Montserrat";

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 60 * FPS;

// ===== IDENTIDADE ARVION LAB (reutilize em todos os vídeos) =====
export const C = {
  black: "#03060D",
  deep: "#071226",
  blue: "#1E7BFF",
  cyan: "#36C6FF",
  white: "#F4F8FF",
  yellow: "#FFD60A",
};
export const FONT = loadFont("normal", {weights: ["800", "900"], subsets: ["latin"]}).fontFamily;
export const MONO = "ui-monospace, Menlo, Consolas, monospace";
export const SIGNATURE = {line1: "O FUTURO JÁ COMEÇOU.", brand: ["ARVION", "LAB"], handle: "@arvioncompany"};

// Para usar clipes gerados por IA (Veo, Runway, Kling...), salve em public/clips e informe o caminho.
// Ex.: lab: "clips/lab.mp4". Se for null, a cena procedural (código) é usada.
export const AI_CLIPS: Record<string, string | null> = {
  lab: null, holo: null, city: null, work: null, human: null, close: null, outro: null,
};
