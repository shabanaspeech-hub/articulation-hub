import { getSyllablePhonetic } from "@/data/soundsData";

const isolationSpeechMap: Record<string, string> = {
  P: "pa",
  B: "ba",
  M: "mmm",
  T: "ta",
  D: "da",
  N: "nnn",
  K: "ka",
  G: "ga",
  F: "ffff",
  V: "vvvv",
  S: "ssss",
  Z: "zzzz",
  H: "hhh",
  W: "wuh",
  Y: "yuh",
  L: "llll",
  R: "rrrr",
  J: "juh",
  CH: "cha",
  SH: "shhh",
  TH: "thhh",
};

const repetitionSpeechMap: Record<string, string> = {
  P: "pa, pa, pa, pa",
  B: "ba, ba, ba, ba",
  M: "mmm, mmm, mmm, mmm",
  T: "ta, ta, ta, ta",
  D: "da, da, da, da",
  N: "nnn, nnn, nnn, nnn",
  K: "ka, ka, ka, ka",
  G: "ga, ga, ga, ga",
  F: "ffff, ffff, ffff, ffff",
  V: "vvvv, vvvv, vvvv, vvvv",
  S: "ssss, ssss, ssss, ssss",
  Z: "zzzz, zzzz, zzzz, zzzz",
  H: "hhh, hhh, hhh, hhh",
  W: "wuh, wuh, wuh, wuh",
  Y: "yuh, yuh, yuh, yuh",
  L: "llll, llll, llll, llll",
  R: "rrrr, rrrr, rrrr, rrrr",
  J: "juh, juh, juh, juh",
  CH: "cha, cha, cha, cha",
  SH: "shhh, shhh, shhh, shhh",
  TH: "thhh, thhh, thhh, thhh",
};

export const getIsolationSpeechText = (sound: string) => {
  return isolationSpeechMap[sound.toUpperCase()] || sound.toLowerCase();
};

export const getPhoneticRepetitionText = (sound: string, fallback: string) => {
  return repetitionSpeechMap[sound.toUpperCase()] || getSpokenSequenceText(fallback);
};

export const getSpokenSequenceText = (text: string) => {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const cleanToken = token.replace(/[^a-z]/gi, "");

      if (!cleanToken) {
        return token;
      }

      const syllablePhonetic = getSyllablePhonetic(cleanToken.toLowerCase());
      if (syllablePhonetic !== cleanToken.toLowerCase()) {
        return syllablePhonetic;
      }

      return getIsolationSpeechText(cleanToken);
    })
    .join(" ");
};

export const speakPhoneticText = (
  text: string,
  options?: { rate?: number; pitch?: number; lang?: string },
) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options?.lang || "en-US";
  utterance.rate = options?.rate ?? 0.5;
  utterance.pitch = options?.pitch ?? 1;

  window.speechSynthesis.speak(utterance);
};