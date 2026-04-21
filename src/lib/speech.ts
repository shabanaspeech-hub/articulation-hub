import { getSyllablePhonetic } from "@/data/soundsData";

// Phoneme-level isolation production (NOT letter names).
// Whispered/unvoiced stops use minimal vowel; continuants are sustained.
const isolationSpeechMap: Record<string, string> = {
  P: "p",         // whispered /p/, no added vowel
  B: "ba",        // voiced stop CV
  M: "mmmm",      // continuous nasal
  T: "t",         // soft /t/, no vowel
  D: "da",
  N: "nnnn",      // continuous nasal
  K: "k",
  G: "ga",
  F: "fffff",     // sustained fricative
  V: "vvvvv",
  S: "sssss",
  Z: "zzzzz",
  H: "haa",       // soft breathy haa
  W: "wa",
  Y: "ya",
  L: "llll",
  R: "rrrr",
  J: "ja",
  CH: "ch",
  SH: "shhhh",
  TH: "thhhh",
};

// For repetition practice: repeat the same phoneme model with brief pauses.
const repetitionSpeechMap: Record<string, string> = {
  P: "p, p, p, p",
  B: "ba, ba, ba, ba",
  M: "mmmm, mmmm, mmmm",
  T: "t, t, t, t",
  D: "da, da, da, da",
  N: "nnnn, nnnn, nnnn",
  K: "k, k, k, k",
  G: "ga, ga, ga, ga",
  F: "fffff, fffff, fffff",
  V: "vvvvv, vvvvv, vvvvv",
  S: "sssss, sssss, sssss",
  Z: "zzzzz, zzzzz, zzzzz",
  H: "haa, haa, haa, haa",
  W: "wa, wa, wa, wa",
  Y: "ya, ya, ya, ya",
  L: "llll, llll, llll",
  R: "rrrr, rrrr, rrrr",
  J: "ja, ja, ja, ja",
  CH: "ch, ch, ch, ch",
  SH: "shhhh, shhhh, shhhh",
  TH: "thhhh, thhhh, thhhh",
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