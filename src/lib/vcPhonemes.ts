// Explicit eSpeak phonemes, not text spellings: one vowel plus one coda.
// Keep this inventory separate from CV/CVCV and other clinical levels.
export const vcVowelPhonemes: Record<string, string> = {
  a: 'a', i: 'I', oo: 'u:', e: 'E', o: '0', u: 'V',
};

export const vcConsonantPhonemes: Record<string, string> = {
  p: 'p', b: 'b', m: 'm', t: 't', d: 'd', n: 'n',
  k: 'k', g: 'g', f: 'f', v: 'v', s: 's', z: 'z',
  l: 'l', r: 'r', ch: 'tS', j: 'dZ', sh: 'S', th: 'T',
  // Retain existing open-vowel /h/ and offglide /w/, /y/ targets.
  h: '', w: 'w', y: 'j',
};

export function getVCPhonemes(target: string): string | undefined {
  const match = /^(oo|a|i|e|o|u)(ch|sh|th|[pbmtdnkgfvszlrjhwy])$/.exec(target.toLowerCase());
  if (!match) return undefined;
  const vowel = vcVowelPhonemes[match[1]];
  const consonant = vcConsonantPhonemes[match[2]];
  if (vowel === undefined || consonant === undefined) return undefined;
  return `${vowel}${consonant}`;
}