import { soundsData, earlyMotorSounds, soundRows } from "@/data/soundsData";
import SoundCard from "@/components/SoundCard";
import ModeToggle from "@/components/ModeToggle";
import { useAppMode } from "@/contexts/AppModeContext";
import brandLogo from "@/assets/rainbow-logo.png";
import welcomeGarden from "@/assets/welcome-garden.jpg";
import { Link } from "react-router-dom";

const Index = () => {
  const { mode } = useAppMode();

  const displayedSounds = (mode === "motor-speech"
    ? soundsData.filter(s => earlyMotorSounds.includes(s.id))
    : soundsData).filter(s => s.kind !== "vowel");
  const orderedSounds = soundRows.flat().flatMap(id => {
    const sound = displayedSounds.find(item => item.id === id);
    return sound ? [sound] : [];
  });

  return (
    <div className="welcome-page relative isolate h-[100dvh] min-h-0 flex flex-col overflow-hidden">
      <img src={welcomeGarden} alt="" aria-hidden="true" width={1536} height={1024}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-bottom" />
      <header className="mx-auto w-full max-w-6xl shrink-0 px-3 pt-2 pb-2 sm:px-6">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <img id="app-logo" src={brandLogo} alt="Motor Speech Lab rainbow logo" width={1024} height={1024} className="h-14 w-16 shrink-0 object-contain sm:h-16 sm:w-20" />
          <div className="min-w-0 text-left">
            <p className="text-[0.65rem] sm:text-xs font-bold text-welcome-ink">By Speech Language Therapist Shabana Tariq</p>
            <h1 id="app-title" className="font-fredoka text-xl min-[400px]:text-2xl sm:text-3xl lg:text-4xl font-bold uppercase leading-none text-welcome-ink">
              <span className="italic">Motor Speech</span> <span className="bg-gradient-to-r from-welcome-coral to-welcome-amber bg-clip-text text-transparent italic pr-1">Lab</span>
            </h1>
            <p id="app-tagline" className="mt-1 text-xs sm:text-sm font-fredoka font-bold italic text-welcome-ink/80">Research and evidence based app</p>
          </div>
        </div>
        <div className="mt-2"><ModeToggle compact /></div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 min-h-0 px-3 pb-2 sm:px-6 flex flex-col">
        <div className="mb-2 sm:mb-[1dvh] flex items-center justify-between gap-3 text-welcome-ink">
          <h2 className="text-lg sm:text-xl font-fredoka">{mode === "motor-speech" ? "Motor speech sounds" : "Speech sounds"}</h2>
          <span className="text-sm font-semibold">{displayedSounds.length} sounds</span>
        </div>
        <div className="welcome-sound-board flex-1 min-h-0 flex items-center justify-center">
          <div className="welcome-sound-grid grid grid-cols-5 grid-rows-5">
            {orderedSounds.map((sound, index) => (
              <div key={sound.id} className={`welcome-sound-cell min-h-0 min-w-0 flex items-center justify-center ${index === orderedSounds.length - 1 && orderedSounds.length % 5 === 1 ? "col-start-3" : ""}`}>
                <SoundCard sound={sound} index={index} row={Math.floor(index / 5)} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="shrink-0 px-4 pt-1 pb-2 text-center text-welcome-ink text-xs font-semibold">
        <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
      </footer>
    </div>
  );
};

export default Index;
