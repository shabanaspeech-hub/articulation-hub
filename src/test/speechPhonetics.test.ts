import { describe, expect, it } from "vitest";

import {
  getIsolationSpeechText,
  getPhoneticRepetitionText,
  getSpokenSequenceText,
} from "@/lib/speech";
import { getSyllablePhonetic } from "@/data/soundsData";

describe("speech phonetic mapping", () => {
  it("uses single phonetic productions for continuant isolation sounds", () => {
    expect(getIsolationSpeechText("H")).toBe("hah");
    expect(getIsolationSpeechText("F")).toBe("fah");
    expect(getIsolationSpeechText("L")).toBe("lah");
    expect(getIsolationSpeechText("M")).toBe("mah");
    expect(getIsolationSpeechText("TH")).toBe("thah");
  });

  it("keeps motor repetition output phonetic instead of alphabetic", () => {
    expect(getPhoneticRepetitionText("N", "en, en, en, en")).toBe("nah, nah, nah, nah");
    expect(getPhoneticRepetitionText("S", "es, es, es, es")).toBe("sah, sah, sah, sah");
  });


  it("converts sequencing drills to phonetic speech text", () => {
    expect(getSpokenSequenceText("pa ta ka")).toBe("pah tah kah");
  });

  it("speaks i-vowel CV targets as joined syllables", () => {
    expect(getSyllablePhonetic("pi")).toBe("pee");
    expect(getSyllablePhonetic("bi")).toBe("bee");
    expect(getSyllablePhonetic("hi")).toBe("he");
    expect(getSyllablePhonetic("ni")).toBe("knee");
    expect(getSyllablePhonetic("li")).toBe("lee");
    expect(getSyllablePhonetic("ri")).toBe("ree");
  });
});