// Presentation-only IPA notation for each sound id.
export const ipaById: Record<string, string> = {
  p: "[p]", b: "[b]", m: "[m]", h: "[h]", w: "[w]",
  y: "[j]", d: "[d]", n: "[n]", t: "[t]",
  k: "[k]", g: "[ɡ]", f: "[f]", v: "[v]",
  ch: "[tʃ]", j: "[dʒ]", l: "[l]", r: "[ɹ]",
  s: "[s]", z: "[z]", sh: "[ʃ]", th: "[θ]",
  a: "[æ]", e: "[ɛ]", i: "[ɪ]", o: "[ɒ]", u: "[ʌ]",
};

export const getIpa = (id: string) => ipaById[id.toLowerCase()] ?? "";
