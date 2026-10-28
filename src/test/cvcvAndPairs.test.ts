import { describe, expect, it } from "vitest";
import { cvcvAudioSources } from "@/lib/cvcvAudio";
import { generateCVCVTargets, soundsData } from "@/data/soundsData";
import { getMinimalPairs, minimalPairSets } from "@/data/minimalPairs";

describe("CVCV fixed clips", () => {
  it("every consonant's CVCV target has a long-vowel clip", () => {
    for (const s of soundsData.filter(s => s.kind !== "vowel")) {
      for (const t of generateCVCVTargets(s.sound)) expect(cvcvAudioSources[t.syllable], t.syllable).toBeTruthy();
    }
  });
  it("each vowel has a standard isolated clip", () => {
    for (const v of ["a", "e", "i", "o", "u"]) expect(cvcvAudioSources[`vowel-${v}`]).toBeTruthy();
  });
});

describe("minimal pairs", () => {
  it("covers the requested contrast sets", () => {
    expect(minimalPairSets.map(s => s.sounds.join("/"))).toEqual(["p/b", "m/n", "l/r", "r/v", "k/t", "g/d", "sh/s"]);
  });
  it("r appears in both l/r and r/v", () => {
    expect(new Set(getMinimalPairs("r").map(p => p.sounds.join("/")))).toEqual(new Set(["l/r", "r/v"]));
  });
});
