/**
 * Motor Speech Lab signature startup sound.
 * A short (~0.8s) warm, bell-like ascending three-note motif.
 * Synthesized with the Web Audio API so it adds zero network/load cost.
 * Plays once per app launch. No toggle by design.
 */

let hasPlayed = false;

const playChime = () => {
  const Ctx: typeof AudioContext | undefined =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;

  const ctx = new Ctx();
  const now = ctx.currentTime + 0.02;

  const master = ctx.createGain();
  master.gain.value = 0.0001;
  master.gain.setValueAtTime(0.75, now);
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 6000;
  filter.connect(master);

  // Brand jingle synced to the splash: harp glissando (rainbow), bell chime (logo), plinks (title). No marimba.
  const C = [523.25, 587.33, 659.25, 783.99, 880.0];
  const notes: { freq: number; at: number; dur: number; gain: number }[] = [];
  for (let i = 0; i < 14; i++) notes.push({ freq: C[i % 5] * 2 ** Math.floor(i / 5), at: 1.9 + i * 0.09, dur: 1.4, gain: 0.32 });
  [1046.5, 1318.5, 1568.0, 2093.0].forEach((f, i) => notes.push({ freq: f, at: 4.5 + i * 0.12, dur: 1.6, gain: 0.5 }));
  for (let i = 0; i < 6; i++) notes.push({ freq: [1568, 1760, 2093, 2349, 2637, 3136][i], at: 6.4 + i * 0.15, dur: 0.5, gain: 0.28 });
  [523.25, 659.25, 783.99, 1046.5].forEach((f) => notes.push({ freq: f, at: 7.3, dur: 2.2, gain: 0.3 }));
  const total = 9.8;
  window.setTimeout(() => {
    ctx.close().catch(() => undefined);
  }, total * 1000 + 300);
};

export const playStartupSound = () => {
  if (hasPlayed || typeof window === "undefined") return;
  hasPlayed = true;

  // Never block rendering: run after paint, and swallow any audio errors.
  const run = () => {
    try {
      playChime();
    } catch {
      /* audio unavailable - silently ignore */
    }
  };

  const schedule = () =>
    window.setTimeout(() => {
      const Ctx: typeof AudioContext | undefined =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;

      // If autoplay is blocked, play on the very first user gesture instead.
      const probe = new Ctx();
      if (probe.state === "suspended") {
        probe.close().catch(() => undefined);
        const once = () => {
          document.removeEventListener("pointerdown", once);
          document.removeEventListener("keydown", once);
          run();
        };
        document.addEventListener("pointerdown", once, { once: true });
        document.addEventListener("keydown", once, { once: true });
        return;
      }
      probe.close().catch(() => undefined);
      run();
    }, 120);

  if ("requestIdleCallback" in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(schedule);
  } else {
    schedule();
  }
};
