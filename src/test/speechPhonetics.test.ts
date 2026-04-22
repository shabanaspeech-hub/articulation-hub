import { describe, expect, it } from "vitest";

import {
  getIsolationIpaLabel,
  getIsolationSpeechText,
  getPhoneticRepetitionText,
  getSpokenSequenceText,
} from "@/lib/speech";

describe("speech phonetic mapping", () => {
  it("uses motor-speech-friendly isolation outputs instead of alphabet names", () => {
    expect(getIsolationSpeechText("P")).toBe("p");
    expect(getIsolationSpeechText("H")).toBe("h");
    expect(getIsolationSpeechText("F")).toBe("f");
    expect(getIsolationSpeechText("M")).toBe("m");
  });

  it("keeps repetition output phonetic instead of alphabetic", () => {
    expect(getPhoneticRepetitionText("N", "en, en, en, en")).toBe("n, n, n");
    expect(getPhoneticRepetitionText("S", "es, es, es, es")).toBe("s, s, s");
    expect(getPhoneticRepetitionText("T", "tee, tee, tee")).toBe("t, t, t");
  });

  it("converts sequencing drills to phonetic speech text", () => {
    expect(getSpokenSequenceText("pa ta ka")).toBe("pah tah kah");
  });

  it("provides IPA labels for isolation-level UI", () => {
    expect(getIsolationIpaLabel("P")).toBe("/p/");
    expect(getIsolationIpaLabel("CH")).toBe("/tʃ/");
  });
});