import { soundsData, earlyMotorSounds, soundRows } from "@/data/soundsData";
import SoundCard from "@/components/SoundCard";
import ModeToggle from "@/components/ModeToggle";
import { useAppMode } from "@/contexts/AppModeContext";
import logoAsset from "@/assets/spectraspeech-original.png.asset.json";
import welcomeGarden from "@/assets/welcome-garden.jpg";
import { Link } from "react-router-dom";

const Index = () => {
  const { mode } = useAppMode();

  const displayedSounds = mode === "motor-speech"
    ? soundsData.filter(s => earlyMotorSounds.includes(s.id) || s.kind === "vowel")
    : soundsData;

  return (
    <div className="welcome-page relative isolate min-h-screen flex flex-col">
      <img src={welcomeGarden} alt="" aria-hidden="true" width={1536} height={1024}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-bottom" />
      <header className="mx-auto w-full max-w-6xl px-4 pt-3 pb-3 sm:px-8 sm:pt-4">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <img src={logoAsset.url} alt="Spectra Speech" width={240} height={280} className="h-16 w-14 shrink-0 object-contain sm:h-20 sm:w-[4.5rem]" />
          <div className="min-w-0 text-left">
            <p className="text-[0.65rem] sm:text-xs font-bold text-welcome-ink">By Speech Language Therapist Shabana Tariq</p>
            <h1 className="font-fredoka text-[clamp(1.75rem,6vw,3rem)] font-bold leading-none tracking-tight text-welcome-ink">
              <span className="italic">Motor Speech</span> <span className="bg-gradient-to-r from-welcome-coral to-welcome-amber bg-clip-text text-transparent italic pr-1">Hub</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-welcome-ink/80">Welcome, little communicator!</p>
          </div>
        </div>
        <div className="mt-3"><ModeToggle /></div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 sm:px-8">
        <div className="mb-4 flex items-center justify-between gap-3 text-welcome-ink">
          <h2 className="text-lg sm:text-xl font-fredoka">{mode === "motor-speech" ? "Motor speech sounds" : "Speech sounds"}</h2>
          <span className="text-sm font-semibold">{displayedSounds.length} sounds</span>
        </div>
        <div className="space-y-3 sm:space-y-5">
          {soundRows.map((ids, row) => {
            const rowSounds = ids.map(id => displayedSounds.find(item => item.id === id)).filter(Boolean);
            if (!rowSounds.length) return null;
            return (
              <div key={ids[0]} className="flex justify-center gap-2 sm:gap-4">
                {rowSounds.map((sound, index) => (
                  <div key={sound!.id} className="w-[calc((100%-2rem)/5)] sm:w-[calc((100%-4rem)/5)] max-w-36">
                    <SoundCard sound={sound!} index={index} row={row} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>
      <footer className="px-4 pt-4 pb-6 text-center text-welcome-ink text-xs font-semibold">
        <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
      </footer>
    </div>
  );
};

export default Index;
