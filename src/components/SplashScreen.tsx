import { useEffect, useState } from "react";
import logoAsset from "@/assets/spectraspeech-user-logo.png.asset.json";

/**
 * SpectraSpeech launch splash: "From Rain to Rainbow".
 * Rain falls → stops → rainbow paints in → arcs gather into the logo → logo jumps → tagline.
 * Plays once per browser session; reduced-motion users get a short static reveal.
 */
const SESSION_KEY = "spectra-splash-played";
const ARCS = ["#e5322d", "#f28a1e", "#f6c81a", "#4cb24a", "#17a7a0", "#2d7fd3", "#7a4fc4"];

const SplashScreen = () => {
  const [visible, setVisible] = useState(() => {
    try { return !sessionStorage.getItem(SESSION_KEY); } catch { return true; }
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* ignore */ }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const total = reduce ? 1800 : 7200;
    const fade = window.setTimeout(() => setFading(true), total - 500);
    const hide = window.setTimeout(() => setVisible(false), total);
    return () => { window.clearTimeout(fade); window.clearTimeout(hide); };
  }, [visible]);

  if (!visible) return null;

  const drops = Array.from({ length: 22 }, (_, i) => ({
    left: 30 + ((i * 37) % 42),
    delay: (i % 7) * 0.12,
    dur: 0.55 + ((i * 13) % 5) * 0.08,
  }));

  return (
    <div
      className={`spl fixed inset-0 z-[100] overflow-hidden flex items-center justify-center transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
      aria-hidden="true"
    >
      <style>{`
        .spl{background:linear-gradient(180deg,#cfe9f7 0%,#eafbf9 100%);animation:sky 5.6s ease forwards}
        @keyframes sky{0%,30%{background-color:#cfe9f7}100%{filter:brightness(1.04)}}
        .spl-cloud{position:absolute;top:14%;left:50%;width:min(46vw,260px);transform:translateX(-50%);animation:cloud 5.6s ease-in-out forwards}
        @keyframes cloud{0%{opacity:0;transform:translate(-90%,0)}10%{opacity:1;transform:translate(-50%,0)}32%{transform:translate(-50%,0);opacity:1}48%{transform:translate(70%,-10%);opacity:0}100%{opacity:0}}
        .spl-glow{position:absolute;top:10%;left:50%;width:60vmin;height:60vmin;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,228,150,.65),transparent 65%);opacity:0;animation:glow 5.6s ease forwards}
        @keyframes glow{0%,30%{opacity:0}45%{opacity:1}75%{opacity:.4}100%{opacity:.2}}
        .spl-drop{position:absolute;top:28%;width:3px;height:14px;border-radius:3px;background:#5aa5d8;opacity:0;animation-name:drop;animation-timing-function:linear;animation-iteration-count:3}
        @keyframes drop{0%{opacity:0;transform:translateY(0)}15%{opacity:.85}100%{opacity:0;transform:translateY(38vh) scaleY(.6)}}
        .spl-rain{animation:rainout 5.6s linear forwards}
        @keyframes rainout{0%,28%{opacity:1}38%{opacity:0}100%{opacity:0}}
        .spl-bow{position:absolute;top:22%;left:50%;width:min(86vw,520px);transform:translateX(-50%);animation:gather 5.6s cubic-bezier(.6,0,.3,1) forwards}
        .spl-bow path{fill:none;stroke-width:9;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;animation:paint 5.6s ease forwards}
        @keyframes paint{0%,34%{stroke-dashoffset:1}52%{stroke-dashoffset:0}100%{stroke-dashoffset:0}}
        @keyframes gather{0%,58%{opacity:1;transform:translateX(-50%) scale(1) rotate(0)}70%{opacity:0;transform:translateX(-50%) translateY(14vh) scale(.2) rotate(200deg)}100%{opacity:0;transform:translateX(-50%) scale(.2)}}
        .spl-spark{position:absolute;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 8px 2px #ffe58a;opacity:0;animation:spark 5.6s ease forwards}
        @keyframes spark{0%,48%{opacity:0;transform:scale(.3)}54%{opacity:1;transform:scale(1)}62%{opacity:0}82%{opacity:1;transform:scale(1.2)}92%,100%{opacity:0}}
        .spl-logo{width:min(44vw,220px);height:auto;opacity:0;animation:logo 5.6s forwards;filter:drop-shadow(0 10px 18px rgba(0,0,0,.12))}
        @keyframes logo{0%,64%{opacity:0;transform:scale(.2) rotate(-90deg)}72%{opacity:1;transform:scale(1) rotate(0)}76%{transform:translateY(0) scale(1)}81%{transform:translateY(-14%) scale(.96,1.05)}86%{transform:translateY(0) scale(1.08,.92)}89%{transform:translateY(-3%) scale(.98,1.02)}92%,100%{opacity:1;transform:none}}
        .spl-shadow{width:min(30vw,150px);height:12px;margin-top:6px;border-radius:50%;background:rgba(30,60,80,.18);opacity:0;animation:shadow 5.6s forwards}
        @keyframes shadow{0%,72%{opacity:0}81%{opacity:.35;transform:scaleX(.7)}86%{opacity:.8;transform:scaleX(1.05)}100%{opacity:.6;transform:none}}
        .spl-tag{opacity:0;animation:tag 7.2s ease forwards}
        @keyframes tag{0%,62%{opacity:0;transform:translateY(8px)}70%,100%{opacity:1;transform:none}}
        .spl-letter{display:inline-block;opacity:0;animation:letter .6s cubic-bezier(.3,1.6,.5,1) forwards}
        @keyframes letter{0%{opacity:0;transform:translateY(30px) scale(.4) rotate(-15deg)}100%{opacity:1;transform:none}}
        @media (prefers-reduced-motion: reduce){
          .spl,.spl *{animation:none!important}
          .spl-cloud,.spl-rain,.spl-bow,.spl-glow,.spl-spark{display:none}
          .spl-logo,.spl-tag,.spl-shadow,.spl-letter{opacity:1}
        }
      `}</style>

      <div className="spl-glow" />
      <svg className="spl-cloud" viewBox="0 0 200 90">
        <path d="M40 80a28 28 0 0 1 4-55 38 38 0 0 1 70-8 30 30 0 0 1 46 22 22 22 0 0 1 4 41z" fill="#2c4a7a" />
      </svg>
      <div className="spl-rain absolute inset-0">
        {drops.map((d, i) => (
          <span key={i} className="spl-drop" style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
        ))}
      </div>
      <svg className="spl-bow" viewBox="0 0 260 140">
        {ARCS.map((c, i) => {
          const r = 120 - i * 11;
          return (
            <path key={c} pathLength={1} d={`M${130 - r} 135 A${r} ${r} 0 0 1 ${130 + r} 135`} stroke={c} style={{ animationDelay: `${i * 0.08}s` }} />
          );
        })}
      </svg>
      {[[22, 30], [76, 26], [64, 52], [30, 58], [50, 20]].map(([l, t], i) => (
        <span key={i} className="spl-spark" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${i * 0.1}s` }} />
      ))}

      <div className="relative flex flex-col items-center">
        <img src={logoAsset.url} alt="Spectra Speech logo" className="spl-logo rounded-2xl" />
        <div className="spl-shadow" />
        <div className="mt-4 text-center">
          <p className="spl-tag text-2xl sm:text-3xl font-bold text-welcome-ink" style={{ fontFamily: "Fredoka, sans-serif" }}>
            Every Voice. Every Possibility.
          </p>
          <p className="spl-title mt-2 text-3xl sm:text-4xl font-bold italic tracking-wide text-welcome-ink" style={{ fontFamily: "Fredoka, sans-serif" }}>
            {"MOTOR SPEECH LAB".split("").map((ch, i) => (
              <span key={i} className="spl-letter" style={{ animationDelay: `${4.9 + i * 0.05}s` }}>{ch === " " ? "\u00A0" : ch}</span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
