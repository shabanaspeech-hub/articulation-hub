import { soundsData, earlyMotorSounds, soundRows } from "@/data/soundsData";
import SoundCard from "@/components/SoundCard";
import ModeToggle from "@/components/ModeToggle";
import { useAppMode } from "@/contexts/AppModeContext";
import brandLogo from "@/assets/spectraspeech-brand.png";
import welcomeGarden from "@/assets/welcome-garden.jpg";
import { Link } from "react-router-dom";

const Index = () => {
  const { mode } = useAppMode();

  const displayedSounds = mode === "motor-speech"
    ? soundsData.filter(s => earlyMotorSounds.includes(s.id) || s.kind === "vowel")
    : soundsData;

  return (
    <div className="welcome-page relative isolate min-h-screen flex flex-col sm:h-[100dvh] sm:min-h-0 sm:overflow-hidden">
      <img src={welcomeGarden} alt="" aria-hidden="true" width={1536} height={1024}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-bottom" />
      <header className="mx-auto w-full max-w-6xl shrink-0 px-4 pt-3 pb-2 sm:px-8 sm:pt-[1.5dvh] sm:pb-[1dvh]">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <img id="app-logo" src={brandLogo} alt="Spectra Speech" width={240} height={280} className="h-16 w-14 shrink-0 object-contain sm:h-[min(5rem,10dvh)] sm:w-[min(4.5rem,9dvh)]" />
          <div className="min-w-0 text-left">
            <p className="text-[0.65rem] sm:text-xs font-bold text-welcome-ink">By Speech Language Therapist Shabana Tariq</p>
            <h1 id="app-title" className="font-fredoka text-[clamp(1.5rem,min(5.2vw,5.5dvh),2.75rem)] font-bold uppercase leading-none tracking-tight text-welcome-ink">
              <span className="italic">Motor Speech</span> <span className="bg-gradient-to-r from-welcome-coral to-welcome-amber bg-clip-text text-transparent italic pr-1">Lab</span>
            </h1>
            <p id="app-tagline" className="mt-1 text-xs sm:text-sm font-bold italic text-welcome-ink/80" style={{ fontFamily: "Fredoka, sans-serif" }}>Research and evidence based app</p>
          </div>
        </div>
        <div className="mt-2 sm:mt-[1dvh]"><ModeToggle /></div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 min-h-0 px-4 pb-4 sm:px-8 sm:pb-[1dvh] flex flex-col">
        <div className="mb-2 sm:mb-[1dvh] flex items-center justify-between gap-3 text-welcome-ink">
          <h2 className="text-lg sm:text-xl font-fredoka">{mode === "motor-speech" ? "Motor speech sounds" : "Speech sounds"}</h2>
          <span className="text-sm font-semibold">{displayedSounds.length} sounds</span>
        </div>
        <div className="flex flex-col gap-3 sm:gap-[1.2dvh] sm:flex-1 sm:min-h-0 sm:justify-center">
          {soundRows.map((ids, row) => {
            const rowSounds = ids.map(id => displayedSounds.find(item => item.id === id)).filter(Boolean);
            if (!rowSounds.length) return null;
            return (
              <div key={ids[0]} className="flex justify-center gap-2 sm:gap-4">
                {rowSounds.map((sound, index) => (
                  <div key={sound!.id} className="w-[calc((100%-2rem)/5)] sm:w-[min(calc((100%-4rem)/5),10.5dvh)] max-w-36">
                    <SoundCard sound={sound!} index={index} row={row} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>
      <footer className="shrink-0 px-4 pt-2 pb-4 sm:pt-0 sm:pb-[1dvh] text-center text-welcome-ink text-xs font-semibold">
        <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
      </footer>
    </div>
  );
};

export default Index;
