import { describe, expect, it } from "vitest";

import {
  getIsolationSpeechText,
  getPhoneticRepetitionText,
  getSpokenSequenceText,
} from "@/lib/speech";

describe("speech phonetic mapping", () => {
  it("uses sustained phonemes for continuant isolation sounds", () => {
    expect(getIsolationSpeechText("H")).toBe("hhh");
    expect(getIsolationSpeechText("F")).toBe("ffff");
    expect(getIsolationSpeechText("L")).toBe("llll");
    expect(getIsolationSpeechText("TH")).toBe("thhh");
  });

  it("keeps motor repetition output phonetic instead of alphabetic", () => {
    expect(getPhoneticRepetitionText("N", "en, en, en, en")).toBe("nnn, nnn, nnn, nnn");
    expect(getPhoneticRepetitionText("S", "es, es, es, es")).toBe("ssss, ssss, ssss, ssss");
  });

  it("converts sequencing drills to phonetic speech text", () => {
    expect(getSpokenSequenceText("pa ta ka")).toBe("pah tah kah");
  });
});