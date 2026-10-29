import { playRobustClip, stopActiveClip } from "./clipPlayer";
// Fixed, phoneme-synthesized clips for CVCV targets (long open vowels: "paa, paa")
// and standard isolated vowels (/a/ = [æ], /e/ = [ɛ], /i/ = [ɪ], /o/ = [ɒ], /u/ = [ʌ]).
const modules = import.meta.glob<{ url: string }>("@/assets/cvcv/*.mp3.asset.json", { eager: true, import: "default" });

export const cvcvAudioSources: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, asset]) => [path.split("/").pop()!.replace(".mp3.asset.json", ""), asset.url]),
);

// Clinical lists spell /u/ as "u" (pupu); clips are keyed with "oo" (poopoo).
export const cvcvClipKey = (target: string) => {
  const t = target.toLowerCase();
  return cvcvAudioSources[t] ? t : t.replace(/(?<!o)u/g, "oo");
};

export function stopClip() {
  stopActiveClip();
}

/** Returns true when a fixed clip played; false when missing or unplayable (caller falls back). */
export async function playClip(key: string, onEnd?: () => void): Promise<boolean> {
  const src = cvcvAudioSources[cvcvClipKey(key)];
  if (!src) return false;
  const ok = await playRobustClip(src, onEnd);
  if (!ok) onEnd?.();
  return ok;
}
