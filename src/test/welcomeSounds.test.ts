import { describe, expect, it } from "vitest";
import { soundsData, soundRows, getSoundById } from "@/data/soundsData";
import { getIsolationSpeechText } from "@/lib/speech";

describe("welcome sound targets", () => {
  it("preserves the consonant sequence and appends five vowels after th", () => {
    expect(soundsData.map(s => s.id)).toEqual(['p','b','m','h','w','y','d','n','t','k','g','f','v','ch','j','l','r','s','z','sh','th','a','e','i','o','u']);
    expect(soundRows.flat()).toEqual(soundsData.map(s => s.id));
  });
  it.each([['a','ah'],['e','eh'],['i','ih'],['o','oh'],['u','uh']])("maps vowel %s to phonetic playback", (id, spoken) => {
    expect(getIsolationSpeechText(id)).toBe(spoken);
    expect(getSoundById(id)?.kind).toBe('vowel');
  });
  it("preserves the original p practice content", () => {
    expect(getSoundById('p')?.words.initial).toHaveLength(10);
    expect(getSoundById('p')?.sound).toBe('P');
  });
});