import { soundsData, earlyMotorSounds } from "@/data/soundsData";
import SoundCard from "@/components/SoundCard";
import ModeToggle from "@/components/ModeToggle";
import { useAppMode } from "@/contexts/AppModeContext";
import logo from "@/assets/logo.png";
import welcomeGarden from "@/assets/welcome-garden.jpg";
import { Link } from "react-router-dom";

const Index = () => {
  const { mode } = useAppMode();

  const displayedSounds = mode === "motor-speech"
    ? soundsData.filter(s => earlyMotorSounds.includes(s.id))
    : soundsData;

  return (
    <div className="welcome-page relative isolate min-h-screen flex flex-col">
      <img src={welcomeGarden} alt="" aria-hidden="true" width={1536} height={1024}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center" />
      <header className="mx-auto w-full max-w-6xl px-4 pt-8 pb-5 sm:px-8 sm:pt-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <img src={logo} alt="Spectra Speech" width={80} height={80} className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
          <div>
            <p className="mb-2 text-xs sm:text-sm font-bold text-welcome-ink">By Speech Language Therapist Shabana Tariq</p>
            <h1 className="font-fredoka text-4xl sm:text-5xl font-semibold text-welcome-ink">Articulation <span className="text-welcome-coral">Hub</span></h1>
            <p className="mt-2 text-base font-semibold text-welcome-ink">Welcome, little communicator!</p>
          </div>
        </div>
        <div className="mt-5"><ModeToggle /></div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-8 sm:px-8">
        <div className="mb-4 flex items-center justify-between gap-3 text-welcome-ink">
          <h2 className="text-lg sm:text-xl font-fredoka">{mode === "motor-speech" ? "Motor speech sounds" : "Speech sounds"}</h2>
          <span className="text-sm font-semibold">{displayedSounds.length} sounds</span>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-7">
          {displayedSounds.map((sound, index) => <SoundCard key={sound.id} sound={sound} index={index} />)}
        </div>
      </main>
      <footer className="px-4 pt-4 pb-6 text-center text-welcome-ink text-xs font-semibold">
        <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
      </footer>
    </div>
  );
};

export default Index;
