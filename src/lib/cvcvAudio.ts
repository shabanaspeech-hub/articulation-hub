// Fixed, phoneme-synthesized clips for CVCV targets (long open vowels: "paa, paa")
// and standard isolated vowels (/a/ = [æ], /e/ = [ɛ], /i/ = [ɪ], /o/ = [ɒ], /u/ = [ʌ]).
const modules = import.meta.glob<{ url: string }>("@/assets/cvcv/*.mp3.asset.json", { eager: true, import: "default" });

export const cvcvAudioSources: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, asset]) => [path.split("/").pop()!.replace(".mp3.asset.json", ""), asset.url]),
);

let active: HTMLAudioElement | undefined;

export function stopClip() {
  if (!active) return;
  active.pause();
  active = undefined;
}

export async function playClip(key: string, onEnd?: () => void): Promise<boolean> {
  const src = cvcvAudioSources[key.toLowerCase()];
  if (!src) return false;
  stopClip();
  window.speechSynthesis?.cancel();
  const audio = new Audio(src);
  active = audio;
  audio.onended = () => { if (active === audio) active = undefined; onEnd?.(); };
  audio.onerror = () => onEnd?.();
  try { await audio.play(); } catch (e) { onEnd?.(); if (!(e instanceof DOMException && e.name === "AbortError")) throw e; }
  return true;
}
