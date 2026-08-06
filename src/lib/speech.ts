import { getSyllablePhonetic } from "@/data/soundsData";

const isolationSpeechMap: Record<string, string> = {
  P: "pah",
  B: "bah",
  M: "mah",
  T: "tah",
  D: "dah",
  N: "nah",
  K: "kah",
  G: "gah",
  F: "fah",
  V: "vah",
  S: "sah",
  Z: "zah",
  H: "hah",
  W: "wuh",
  Y: "yuh",
  L: "lah",
  R: "rah",
  J: "juh",
  CH: "chah",
  SH: "shah",
  TH: "thah",
};

const repetitionSpeechMap: Record<string, string> = {
  P: "pah, pah, pah, pah",
  B: "bah, bah, bah, bah",
  M: "hmmm, hmmm, hmmm, hmmm",
  T: "tah, tah, tah, tah",
  D: "dah, dah, dah, dah",
  N: "nnnnn, nnnnn, nnnnn, nnnnn",
  K: "kah, kah, kah, kah",
  G: "gah, gah, gah, gah",
  F: "fffff, fffff, fffff, fffff",
  V: "vvvvv, vvvvv, vvvvv, vvvvv",
  S: "sssss, sssss, sssss, sssss",
  Z: "zzzzz, zzzzz, zzzzz, zzzzz",
  H: "hhhhh, hhhhh, hhhhh, hhhhh",
  W: "wuh, wuh, wuh, wuh",
  Y: "yuh, yuh, yuh, yuh",
  L: "lllll, lllll, lllll, lllll",
  R: "rrrrr, rrrrr, rrrrr, rrrrr",
  J: "juh, juh, juh, juh",
  CH: "chuh, chuh, chuh, chuh",
  SH: "shhhh, shhhh, shhhh, shhhh",
  TH: "thhhh, thhhh, thhhh, thhhh",
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
  options?: {
    rate?: number;
    pitch?: number;
    lang?: string;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
  },
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

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
};