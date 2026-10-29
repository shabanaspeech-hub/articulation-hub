import { soundsData, earlyMotorSounds, soundRows } from "@/data/soundsData";
import SoundCard from "@/components/SoundCard";
import ModeToggle from "@/components/ModeToggle";
import { useAppMode } from "@/contexts/AppModeContext";
import brandLogo from "@/assets/rainbow-logo.png";
import welcomeGarden from "@/assets/welcome-garden.jpg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const { mode } = useAppMode();
  const [phone, setPhone] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 499px)").matches);
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 500px) and (orientation: landscape)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 500px) and (orientation: landscape)");
    const mobileMq = window.matchMedia("(max-width: 499px)");
    const on = () => setWide(mq.matches);
    const onMobile = () => setPhone(mobileMq.matches);
    mq.addEventListener("change", on);
    mobileMq.addEventListener("change", onMobile);
    return () => { mq.removeEventListener("change", on); mobileMq.removeEventListener("change", onMobile); };
  }, []);

  const displayedSounds = (mode === "motor-speech"
    ? soundsData.filter(s => earlyMotorSounds.includes(s.id))
    : soundsData).filter(s => s.kind !== "vowel");
  const orderedSounds = soundRows.flat().flatMap(id => {
    const sound = displayedSounds.find(item => item.id === id);
    return sound ? [sound] : [];
  });
  const n = orderedSounds.length;
  // Tablet/desktop: 6 columns, branding takes the first 2 cells (Articulation Station style).
  const wideRows = Math.ceil((n + 2) / 6);
  const phoneRows = Math.ceil(n / 5);

  const credit = "By Speech Language Therapist Shabana Tariq";
  const Title = ({ className = "" }: { className?: string }) => (
    <h1 id="app-title" className={`font-fredoka font-bold uppercase leading-none text-welcome-ink ${className}`}>
      <span className="italic">Motor Speech</span> <span className="bg-gradient-to-r from-welcome-coral to-welcome-amber bg-clip-text text-transparent italic pr-1">Lab</span>
    </h1>
  );

  return (
    <div className="welcome-page relative isolate h-[100dvh] min-h-0 flex flex-col overflow-hidden">
      <img src={welcomeGarden} alt="" aria-hidden="true" width={1536} height={1024}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-bottom" />

      {/* Phone header (branding sits inside the grid on larger screens) */}
      {!wide && <header className="mx-auto w-full shrink-0 px-3 pt-2 pb-1">
        <div className="flex items-center justify-center gap-3">
          <img id="app-logo" src={brandLogo} alt="Motor Speech Lab rainbow logo" width={1024} height={1024} className="h-12 w-14 shrink-0 object-contain" />
          <div className="min-w-0 text-left">
            <p className="text-[0.65rem] font-bold text-welcome-ink">{credit}</p>
            <Title className="text-xl min-[400px]:text-2xl" />
            <p id="app-tagline" className="mt-0.5 text-xs font-fredoka font-bold italic text-welcome-ink/80">Research and evidence based app</p>
          </div>
        </div>
        <div className="mt-2"><ModeToggle compact={!phone} /></div>
      </header>}

      <main className="w-full flex-1 min-h-0 px-2 py-2 sm:px-4 sm:py-3 flex flex-col">
        {phone && <div className="welcome-mobile-heading flex items-center justify-between text-welcome-ink">
          <h2 className="text-base font-bold">{mode === "motor-speech" ? "Motor speech sounds" : "Speech sounds"}</h2>
          <span className="text-sm">{n} sounds</span>
        </div>}
        {phone ? <div className="welcome-mobile-board">
          {soundRows.map((ids, row) => {
            const sounds = ids.flatMap(id => {
              const sound = displayedSounds.find(item => item.id === id);
              return sound ? [sound] : [];
            });
            return sounds.length ? <div className="welcome-mobile-row" key={row}>
              {sounds.map((sound, index) => <div className="welcome-sound-cell welcome-mobile-cell" key={sound.id}>
                <SoundCard sound={sound} index={index} row={row} />
              </div>)}
            </div> : null;
          })}
        </div> : <div className="welcome-sound-board flex-1 min-h-0 flex items-center justify-center">
          <div
            className="welcome-sound-grid grid"
            style={{ ["--rows-wide" as string]: wideRows, ["--rows-phone" as string]: phoneRows }}
          >
            {wide && <div className="welcome-brand-cell flex col-span-2 flex-col items-center justify-center gap-[3cqh] px-[2cqw]">
              <div className="flex items-center gap-[3cqw] w-full justify-center">
                <img id="app-logo" src={brandLogo} alt="Motor Speech Lab rainbow logo" width={1024} height={1024} className="w-[22cqw] shrink-0 object-contain" />
                <div className="min-w-0 text-left">
                  <p className="welcome-brand-credit font-bold text-welcome-ink">{credit}</p>
                  <h1 id="app-title" className="welcome-brand-title font-fredoka font-bold uppercase leading-none text-welcome-ink">
                    <span className="italic">Motor Speech</span> <span className="bg-gradient-to-r from-welcome-coral to-welcome-amber bg-clip-text text-transparent italic pr-1">Lab</span>
                  </h1>
                  <p id="app-tagline" className="welcome-brand-tagline font-fredoka font-bold italic text-welcome-ink/80">Research and evidence based app</p>
                </div>
              </div>
              <div className="w-full"><ModeToggle compact /></div>
            </div>}
            {orderedSounds.map((sound, index) => (
              <div key={sound.id} className={`welcome-sound-cell min-h-0 min-w-0 flex items-center justify-center ${!wide && index === n - 1 && n % 5 === 1 ? "col-start-3" : ""}`}>
                <SoundCard sound={sound} index={index} row={Math.floor(index / 5)} />
              </div>
            ))}
          </div>
        </div>}
      </main>
      <footer className="shrink-0 px-4 pb-1 text-center text-welcome-ink text-xs font-semibold">
        <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
      </footer>
    </div>
  );
};

export default Index;
