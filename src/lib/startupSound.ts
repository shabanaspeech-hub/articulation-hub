/**
 * Articulation Hub signature startup sound.
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

  // Playful C6 - E6 - G6 - C7 sparkle motif
  const notes = [
    { freq: 1046.5, at: 0, dur: 0.4, gain: 0.6 },
    { freq: 1318.5, at: 0.1, dur: 0.4, gain: 0.6 },
    { freq: 1568.0, at: 0.2, dur: 0.45, gain: 0.65 },
    { freq: 2093.0, at: 0.32, dur: 0.6, gain: 0.7 },
  ];


  notes.forEach(({ freq, at, dur, gain }) => {
    [1, 2.01].forEach((mult, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = freq * mult;

      const env = ctx.createGain();
      const level = i === 0 ? gain : gain * 0.18;
      const start = now + at;
      env.gain.setValueAtTime(0.0001, start);
      env.gain.exponentialRampToValueAtTime(level, start + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(env);
      env.connect(filter);
      osc.start(start);
      osc.stop(start + dur + 0.05);
    });
  });

  const total = 0.32 + 0.6 + 0.2;
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
