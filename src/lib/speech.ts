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
  W: "wwoo",
  Y: "yee",
  L: "llll",
  R: "rrrr",
  J: "jjj",
  CH: "ch",
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
  W: "wwoo, wwoo, wwoo, wwoo",
  Y: "yee, yee, yee, yee",
  L: "llll, llll, llll, llll",
  R: "rrrr, rrrr, rrrr, rrrr",
  J: "jjj, jjj, jjj, jjj",
  CH: "ch, ch, ch, ch",
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
  options?: { rate?: number; pitch?: number; lang?: string; volume?: number },
) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options?.lang || "en-US";
  utterance.rate = options?.rate ?? 0.5;
  utterance.pitch = options?.pitch ?? 1;
  utterance.volume = options?.volume ?? 1;

  // Prefer a clear English voice when available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    /en[-_]US/i.test(v.lang) && /(Google US English|Samantha|Microsoft Aria|Microsoft Jenny|Natural)/i.test(v.name)
  ) || voices.find(v => /en[-_]US/i.test(v.lang));
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
};