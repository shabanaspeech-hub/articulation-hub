import { describe, expect, it } from "vitest";

import {
  getIsolationSpeechText,
  getPhoneticRepetitionText,
  getSpokenSequenceText,
} from "@/lib/speech";

describe("speech phonetic mapping", () => {
  it("uses motor-speech-friendly isolation outputs instead of alphabet names", () => {
    expect(getIsolationSpeechText("P")).toBe("p");
    expect(getIsolationSpeechText("H")).toBe("haa");
    expect(getIsolationSpeechText("F")).toBe("fffff");
    expect(getIsolationSpeechText("M")).toBe("mmmm");
  });

  it("keeps repetition output phonetic instead of alphabetic", () => {
    expect(getPhoneticRepetitionText("N", "en, en, en, en")).toBe("nnnn, nnnn, nnnn");
    expect(getPhoneticRepetitionText("S", "es, es, es, es")).toBe("sssss, sssss, sssss");
    expect(getPhoneticRepetitionText("T", "tee, tee, tee")).toBe("t, t, t, t");
  });

  it("converts sequencing drills to phonetic speech text", () => {
    expect(getSpokenSequenceText("pa ta ka")).toBe("pah tah kah");
  });
});