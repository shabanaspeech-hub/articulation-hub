import { getSyllablePhonetic } from "@/data/soundsData";

const isolationSpeechMap: Record<string, string> = {
  P: "p",
  B: "b",
  M: "m",
  T: "t",
  D: "d",
  N: "n",
  K: "k",
  G: "g",
  F: "f",
  V: "v",
  S: "s",
  Z: "z",
  H: "h",
  W: "w",
  Y: "y",
  L: "l",
  R: "r",
  J: "j",
  CH: "ch",
  SH: "sh",
  TH: "th",
};

const isolationIpaMap: Record<string, string> = {
  P: "/p/",
  B: "/b/",
  M: "/m/",
  T: "/t/",
  D: "/d/",
  N: "/n/",
  K: "/k/",
  G: "/g/",
  F: "/f/",
  V: "/v/",
  S: "/s/",
  Z: "/z/",
  H: "/h/",
  W: "/w/",
  Y: "/j/",
  L: "/l/",
  R: "/r/",
  J: "/dʒ/",
  CH: "/tʃ/",
  SH: "/ʃ/",
  TH: "/θ/",
};

const repetitionSpeechMap: Record<string, string> = {
  P: "p, p, p",
  B: "b, b, b",
  M: "m, m, m",
  T: "t, t, t",
  D: "d, d, d",
  N: "n, n, n",
  K: "k, k, k",
  G: "g, g, g",
  F: "f, f, f",
  V: "v, v, v",
  S: "s, s, s",
  Z: "z, z, z",
  H: "h, h, h",
  W: "w, w, w",
  Y: "y, y, y",
  L: "l, l, l",
  R: "r, r, r",
  J: "j, j, j",
  CH: "ch, ch, ch",
  SH: "sh, sh, sh",
  TH: "th, th, th",
};

type IsolationPhoneme = keyof typeof isolationSpeechMap;
type AudioContextWithWebkit = Window & {
  webkitAudioContext?: typeof AudioContext;
};

type PhonemeConfig = {
  mode: "stop" | "fricative" | "nasal" | "approximant" | "affricate";
  noiseFrequency?: number;
  toneFrequency?: number;
  toneFrequencyEnd?: number;
  duration?: number;
  voiced?: boolean;
};

const phonemeConfigs: Record<IsolationPhoneme, PhonemeConfig> = {
  P: { mode: "stop", noiseFrequency: 850, duration: 0.08 },
  B: { mode: "stop", noiseFrequency: 700, toneFrequency: 140, duration: 0.1, voiced: true },
  M: { mode: "nasal", toneFrequency: 180, duration: 0.45, voiced: true },
  T: { mode: "stop", noiseFrequency: 3400, duration: 0.06 },
  D: { mode: "stop", noiseFrequency: 2600, toneFrequency: 150, duration: 0.08, voiced: true },
  N: { mode: "nasal", toneFrequency: 210, duration: 0.42, voiced: true },
  K: { mode: "stop", noiseFrequency: 1500, duration: 0.07 },
  G: { mode: "stop", noiseFrequency: 1200, toneFrequency: 135, duration: 0.09, voiced: true },
  F: { mode: "fricative", noiseFrequency: 5200, duration: 0.55 },
  V: { mode: "fricative", noiseFrequency: 4200, toneFrequency: 165, duration: 0.5, voiced: true },
  S: { mode: "fricative", noiseFrequency: 6800, duration: 0.58 },
  Z: { mode: "fricative", noiseFrequency: 6000, toneFrequency: 170, duration: 0.55, voiced: true },
  H: { mode: "fricative", noiseFrequency: 1600, duration: 0.42 },
  W: { mode: "approximant", toneFrequency: 240, toneFrequencyEnd: 320, duration: 0.3, voiced: true },
  Y: { mode: "approximant", toneFrequency: 320, toneFrequencyEnd: 430, duration: 0.28, voiced: true },
  L: { mode: "approximant", toneFrequency: 260, toneFrequencyEnd: 300, duration: 0.34, voiced: true },
  R: { mode: "approximant", toneFrequency: 190, toneFrequencyEnd: 170, duration: 0.34, voiced: true },
  J: { mode: "affricate", noiseFrequency: 2600, toneFrequency: 190, duration: 0.34, voiced: true },
  CH: { mode: "affricate", noiseFrequency: 3000, duration: 0.33 },
  SH: { mode: "fricative", noiseFrequency: 2400, duration: 0.58 },
  TH: { mode: "fricative", noiseFrequency: 4200, duration: 0.52 },
};

let sharedAudioContext: AudioContext | null = null;
let sharedNoiseBuffer: AudioBuffer | null = null;

const getAudioContext = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const Context = window.AudioContext || (window as AudioContextWithWebkit).webkitAudioContext;
  if (!Context) {
    return null;
  }

  if (!sharedAudioContext) {
    sharedAudioContext = new Context();
  }

  return sharedAudioContext;
};

const getNoiseBuffer = (context: AudioContext) => {
  if (sharedNoiseBuffer && sharedNoiseBuffer.sampleRate === context.sampleRate) {
    return sharedNoiseBuffer;
  }

  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = Math.random() * 2 - 1;
  }

  sharedNoiseBuffer = buffer;
  return buffer;
};

const createEnvelopeGain = (context: AudioContext, start: number, peak: number, duration: number) => {
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  return gain;
};

const addNoise = (context: AudioContext, start: number, duration: number, peak: number, centerFrequency: number) => {
  const source = context.createBufferSource();
  source.buffer = getNoiseBuffer(context);

  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(centerFrequency, start);
  filter.Q.setValueAtTime(0.8, start);

  const gain = createEnvelopeGain(context, start, peak, duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  source.start(start);
  source.stop(start + duration + 0.02);
};

const addTone = (
  context: AudioContext,
  start: number,
  duration: number,
  peak: number,
  frequency: number,
  endFrequency?: number,
) => {
  const oscillator = context.createOscillator();
  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(frequency, start);
  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(endFrequency, 1), start + duration);
  }

  const lowpass = context.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(900, start);
  lowpass.Q.setValueAtTime(0.7, start);

  const gain = createEnvelopeGain(context, start, peak, duration);

  oscillator.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(context.destination);

  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
};

const scheduleIsolationPhoneme = (context: AudioContext, sound: IsolationPhoneme, when: number) => {
  const config = phonemeConfigs[sound];
  const duration = config.duration ?? 0.35;

  switch (config.mode) {
    case "stop": {
      addNoise(context, when, duration, 0.18, config.noiseFrequency ?? 1200);
      if (config.voiced && config.toneFrequency) {
        addTone(context, when + 0.015, duration * 0.75, 0.06, config.toneFrequency);
      }
      break;
    }
    case "fricative": {
      addNoise(context, when, duration, sound === "H" ? 0.07 : 0.12, config.noiseFrequency ?? 3000);
      if (config.voiced && config.toneFrequency) {
        addTone(context, when + 0.02, duration * 0.9, 0.04, config.toneFrequency);
      }
      break;
    }
    case "nasal": {
      addTone(context, when, duration, 0.09, config.toneFrequency ?? 180, config.toneFrequencyEnd);
      addNoise(context, when, duration * 0.6, 0.02, 450);
      break;
    }
    case "approximant": {
      addTone(context, when, duration, 0.08, config.toneFrequency ?? 220, config.toneFrequencyEnd);
      addNoise(context, when, duration * 0.35, 0.015, 1200);
      break;
    }
    case "affricate": {
      addNoise(context, when, duration * 0.35, 0.12, 1800);
      addNoise(context, when + duration * 0.2, duration * 0.7, 0.1, config.noiseFrequency ?? 2600);
      if (config.voiced && config.toneFrequency) {
        addTone(context, when + duration * 0.15, duration * 0.8, 0.045, config.toneFrequency);
      }
      break;
    }
  }

  return duration;
};

export const getIsolationSpeechText = (sound: string) => {
  return isolationSpeechMap[sound.toUpperCase()] || sound.toLowerCase();
};

export const getIsolationIpaLabel = (sound: string) => {
  return isolationIpaMap[sound.toUpperCase()] || `/${sound.toLowerCase()}/`;
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

export const playIsolationSound = (sound: string, repetitions = 1) => {
  const upperSound = sound.toUpperCase() as IsolationPhoneme;
  if (!(upperSound in phonemeConfigs)) {
    return;
  }

  const context = getAudioContext();
  if (!context) {
    return;
  }

  const startPlayback = () => {
    const startTime = context.currentTime + 0.02;
    let cursor = startTime;

    for (let index = 0; index < Math.max(1, repetitions); index += 1) {
      const duration = scheduleIsolationPhoneme(context, upperSound, cursor);
      cursor += duration + 0.18;
    }
  };

  if (context.state === "suspended") {
    void context.resume().then(startPlayback);
    return;
  }

  startPlayback();
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
