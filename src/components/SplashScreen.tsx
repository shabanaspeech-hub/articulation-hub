import { useEffect, useLayoutEffect, useState } from "react";
import brandLogo from "@/assets/spectraspeech-brand.png";

/**
 * SpectraSpeech cinematic opening: rain → full-screen rainbow → rainbow shrinks into the
 * logo → logo bounces, then flies to its header spot → "MOTOR SPEECH LAB" pops in
 * letter by letter on top of the real header title → backdrop dissolves.
 * Targets the header via #app-logo / #app-title; falls back to centre when absent.
 */
const SESSION_KEY = "spectra-splash-played";
const ARCS = ["#e5322d", "#f28a1e", "#f6c81a", "#4cb24a", "#17a7a0", "#2d7fd3", "#7a4fc4"];
const TITLE = "MOTOR SPEECH LAB";

type Rect = { left: number; top: number; width: number; height: number };
type Phase = "rain" | "bow" | "logo" | "fly" | "title" | "out";

const rectOf = (id: string): Rect | null => {
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width ? { left: r.left, top: r.top, width: r.width, height: r.height } : null;
};

const SplashScreen = () => {
  const [visible, setVisible] = useState(() => {
    try { return !sessionStorage.getItem(SESSION_KEY); } catch { return true; }
  });
  const [phase, setPhase] = useState<Phase>("rain");
  const [logoT, setLogoT] = useState<Rect | null>(null);
  const [titleT, setTitleT] = useState<Rect | null>(null);

  useLayoutEffect(() => {
    if (!visible) return;
    const measure = () => { setLogoT(rectOf("app-logo")); setTitleT(rectOf("app-title")); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* ignore */ }
    window.scrollTo(0, 0);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const steps: [Phase, number][] = reduce
      ? [["fly", 0], ["title", 200], ["out", 1400]]
      : [["bow", 1900], ["logo", 4100], ["fly", 5500], ["title", 6400], ["out", 7900]];
    const ids = steps.map(([p, t]) => window.setTimeout(() => {
      setLogoT(rectOf("app-logo")); setTitleT(rectOf("app-title")); setPhase(p);
    }, t));
    ids.push(window.setTimeout(() => setVisible(false), reduce ? 1900 : 8600));
    return () => ids.forEach(window.clearTimeout);
  }, [visible]);

  if (!visible) return null;

  const vw = window.innerWidth, vh = window.innerHeight;
  const big = Math.min(vw * 0.55, vh * 0.5, 300);
  const centre: Rect = { left: (vw - big) / 2, top: (vh - big * 1.2) / 2, width: big, height: big * 1.2 };
  const flown = phase === "fly" || phase === "title" || phase === "out";
  const logoRect = flown && logoT ? logoT : centre;
  const showLogo = phase !== "rain" && phase !== "bow";

  const drops = Array.from({ length: 60 }, (_, i) => ({
    left: (i * 37) % 100, delay: ((i * 7) % 13) * 0.1, dur: 0.6 + ((i * 13) % 5) * 0.1,
  }));

  return (
    <div className="spl fixed inset-0 z-[100] overflow-hidden" aria-hidden="true"
      style={{ pointerEvents: phase === "out" ? "none" : "auto" }}>
      <style>{`
        .spl-bg{position:absolute;inset:0;background:linear-gradient(180deg,#9fb6cc 0%,#cfe2ee 45%,#eafbf9 100%);transition:opacity .7s ease}
        .spl-bg.sun{background:linear-gradient(180deg,#bfe6fb 0%,#e3f6fb 50%,#eafbf9 100%)}
        .spl-cloud{position:absolute;top:4%;width:min(60vw,420px);animation:cloud 2.6s ease-in-out forwards}
        .spl-cloud.c2{top:10%;width:min(45vw,300px);animation-delay:.2s;opacity:.8}
        @keyframes cloud{0%{transform:translateX(-30vw)}55%{transform:translateX(20vw)}100%{transform:translateX(120vw)}}
        .spl-drop{position:absolute;top:-5%;width:3px;height:22px;border-radius:3px;background:#4b8fc4;opacity:0;animation:drop linear infinite}
        @keyframes drop{0%{opacity:0;transform:translateY(0)}10%{opacity:.8}100%{opacity:.2;transform:translateY(110vh)}}
        .spl-rain{transition:opacity .6s}
        .spl-sun{position:absolute;left:50%;top:70%;width:140vmax;height:140vmax;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,236,170,.9),rgba(255,236,170,0) 45%);opacity:0;transition:opacity 1.4s}
        .spl-bow{position:absolute;left:50%;bottom:-2%;width:max(130vw,130vh);transform:translateX(-50%);transform-origin:50% 100%;transition:transform 1.3s cubic-bezier(.7,0,.3,1),opacity 1.1s ease,left 1.3s cubic-bezier(.7,0,.3,1),bottom 1.3s cubic-bezier(.7,0,.3,1)}
        .spl-bow path{fill:none;stroke-width:13;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1}
        .spl-bow.paint path{animation:paint 1.8s cubic-bezier(.4,0,.2,1) forwards}
        .spl-bow.gather{transform:translateX(-50%) scale(.04) rotate(540deg);opacity:0;bottom:45%}
        @keyframes paint{to{stroke-dashoffset:0}}
        .spl-spark{position:absolute;width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:0 0 12px 4px #ffe58a;animation:twinkle 1.2s ease-in-out infinite}
        @keyframes twinkle{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.2)}}
        .spl-logo{position:fixed;object-fit:contain;transition:left 1s cubic-bezier(.6,-.05,.3,1.1),top 1s cubic-bezier(.6,-.05,.3,1.1),width 1s cubic-bezier(.6,-.05,.3,1.1),height 1s cubic-bezier(.6,-.05,.3,1.1);filter:drop-shadow(0 12px 20px rgba(0,0,0,.15))}
        .spl-logo.in{animation:bounce 1.3s cubic-bezier(.3,1.5,.5,1) both}
        @keyframes bounce{0%{opacity:0;transform:scale(.1) rotate(-200deg)}45%{opacity:1;transform:scale(1.12) rotate(8deg)}62%{transform:scale(.92,1.06) translateY(-6%)}78%{transform:scale(1.05,.95)}100%{opacity:1;transform:none}}
        .spl-title{position:fixed;display:flex;align-items:center;white-space:nowrap;font-family:Fredoka,sans-serif;font-weight:700;font-style:italic;color:hsl(var(--welcome-ink, 190 60% 22%));line-height:1}
        .spl-letter{display:inline-block;opacity:0;animation:letter .55s cubic-bezier(.3,1.7,.5,1) forwards}
        @keyframes letter{0%{opacity:0;transform:translateY(-60px) scale(.3) rotate(-25deg)}100%{opacity:1;transform:none}}
        @media (prefers-reduced-motion: reduce){.spl *{animation:none!important;transition:none!important}.spl-letter{opacity:1}}
      `}</style>

      <div className={`spl-bg ${phase !== "rain" ? "sun" : ""}`} style={{ opacity: phase === "out" ? 0 : 1 }} />
      <div className="spl-sun" style={{ opacity: phase === "bow" || phase === "logo" ? 1 : 0 }} />

      {phase === "rain" && (
        <>
          <svg className="spl-cloud" viewBox="0 0 200 90"><path d="M40 80a28 28 0 0 1 4-55 38 38 0 0 1 70-8 30 30 0 0 1 46 22 22 22 0 0 1 4 41z" fill="#5f7896" /></svg>
          <svg className="spl-cloud c2" viewBox="0 0 200 90" style={{ right: 0 }}><path d="M40 80a28 28 0 0 1 4-55 38 38 0 0 1 70-8 30 30 0 0 1 46 22 22 22 0 0 1 4 41z" fill="#7d93ad" /></svg>
        </>
      )}
      <div className="spl-rain absolute inset-0" style={{ opacity: phase === "rain" ? 1 : 0 }}>
        {drops.map((d, i) => (
          <span key={i} className="spl-drop" style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
        ))}
      </div>

      {phase !== "rain" && phase !== "fly" && phase !== "title" && phase !== "out" && (
        <svg className={`spl-bow paint ${phase === "logo" ? "gather" : ""}`} viewBox="0 0 260 135">
          {ARCS.map((c, i) => {
            const r = 125 - i * 13;
            return <path key={c} pathLength={1} d={`M${130 - r} 135 A${r} ${r} 0 0 1 ${130 + r} 135`} stroke={c} style={{ animationDelay: `${i * 0.1}s` }} />;
          })}
        </svg>
      )}
      {(phase === "bow" || phase === "logo") &&
        [[12, 30], [85, 25], [70, 55], [25, 60], [50, 18], [40, 40], [92, 50], [6, 52]].map(([l, t], i) => (
          <span key={i} className="spl-spark" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${i * 0.15}s` }} />
        ))}

      {showLogo && (
        <img src={brandLogo} alt="" className="spl-logo in"
          style={{ left: logoRect.left, top: logoRect.top, width: logoRect.width, height: logoRect.height }} />
      )}

      {phase === "title" && (
        <div className="spl-title" style={titleT
          ? { left: titleT.left, top: titleT.top, height: titleT.height, fontSize: titleT.height * 0.9 }
          : { left: 0, right: 0, justifyContent: "center", top: centre.top + centre.height + 16, fontSize: 36 }}>
          {TITLE.split("").map((ch, i) => (
            <span key={i} className="spl-letter" style={{ animationDelay: `${i * 0.06}s` }}>{ch === " " ? "\u00A0" : ch}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
