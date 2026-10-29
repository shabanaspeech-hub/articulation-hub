// Robust clip playback: direct play → re-fetch as blob → report failure (caller falls back to speech).
let active: HTMLAudioElement | undefined;

export function stopActiveClip() {
  if (!active) return;
  active.pause();
  active = undefined;
}

const tryPlay = async (src: string, onEnd?: () => void) => {
  const audio = new Audio(src);
  audio.preload = "auto";
  active = audio;
  audio.onended = () => { if (active === audio) active = undefined; onEnd?.(); };
  await audio.play();
};

/** Returns true if a clip played; false if every attempt failed. Never throws. */
export async function playRobustClip(src: string, onEnd?: () => void): Promise<boolean> {
  stopActiveClip();
  window.speechSynthesis?.cancel();
  try { await tryPlay(src, onEnd); return true; } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return true;
  }
  try {
    const res = await fetch(src, { cache: "reload" });
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !type.startsWith("audio")) throw new Error("bad audio");
    const url = URL.createObjectURL(await res.blob());
    await tryPlay(url, onEnd);
    return true;
  } catch {
    active = undefined;
    return false;
  }
}
