import type { MouthType } from "@/components/MouthDiagram";

export interface PhonemeArticulation {
  mouthType: MouthType;
  voicing: "voiced" | "voiceless" | "nasal";
}

const MAP: Record<string, PhonemeArticulation> = {
  P:  { mouthType: "bilabial",     voicing: "voiceless" },
  B:  { mouthType: "bilabial",     voicing: "voiced" },
  M:  { mouthType: "bilabial",     voicing: "nasal" },
  T:  { mouthType: "alveolar",     voicing: "voiceless" },
  D:  { mouthType: "alveolar",     voicing: "voiced" },
  N:  { mouthType: "alveolar",     voicing: "nasal" },
  K:  { mouthType: "velar",        voicing: "voiceless" },
  G:  { mouthType: "velar",        voicing: "voiced" },
  F:  { mouthType: "labiodental",  voicing: "voiceless" },
  V:  { mouthType: "labiodental",  voicing: "voiced" },
  S:  { mouthType: "alveolar",     voicing: "voiceless" },
  Z:  { mouthType: "alveolar",     voicing: "voiced" },
  H:  { mouthType: "glottal",      voicing: "voiceless" },
  W:  { mouthType: "bilabial",     voicing: "voiced" },
  Y:  { mouthType: "palatal",      voicing: "voiced" },
  L:  { mouthType: "lateral",      voicing: "voiced" },
  R:  { mouthType: "retroflex",    voicing: "voiced" },
  J:  { mouthType: "postalveolar", voicing: "voiced" },
  CH: { mouthType: "postalveolar", voicing: "voiceless" },
  SH: { mouthType: "postalveolar", voicing: "voiceless" },
  TH: { mouthType: "dental",       voicing: "voiceless" },
};

export const getPhonemeArticulation = (sound: string): PhonemeArticulation => {
  return MAP[sound.trim().toUpperCase()] || { mouthType: "alveolar", voicing: "voiceless" };
};
