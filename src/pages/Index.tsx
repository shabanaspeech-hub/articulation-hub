import { motion } from "framer-motion";
import { soundsData, earlyMotorSounds } from "@/data/soundsData";
import SoundCard from "@/components/SoundCard";
import ModeToggle from "@/components/ModeToggle";
import { useAppMode } from "@/contexts/AppModeContext";
import { Volume2 } from "lucide-react";
import logo from "@/assets/logo.png";

const Index = () => {
  const { mode } = useAppMode();

  const displayedSounds = mode === "motor-speech"
    ? soundsData.filter(s => earlyMotorSounds.includes(s.id))
    : soundsData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10" />
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-sound-yellow/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-40 h-40 rounded-full bg-sound-teal/20 blur-3xl" />
        
        <div className="container relative py-6 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <img src={logo} alt="Spectra Speech Logo" className="mx-auto mb-3 h-16 w-16 object-contain md:h-20 md:w-20" />
            
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-semibold font-nunito">By Speech Language Therapist Shabana Tariq</span>
            </div>
            
            <h1 className="mb-3 font-fredoka text-4xl font-bold text-foreground md:text-5xl">
              Articulation<span className="text-primary"> Hub</span>
            </h1>
            
            <p className="mx-auto max-w-xl text-base text-muted-foreground font-nunito md:text-lg">
              {mode === "motor-speech" 
                ? "Motor Speech / Apraxia therapy with structured progression and slow pacing."
                : "Tap a sound to open the full practice screen with isolation, syllables, words, and more."}
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 inline-flex items-center gap-3 rounded-2xl bg-card px-5 py-3 shadow-lg"
            >
              <Volume2 className="w-5 h-5 text-primary" />
              <span className="font-nunito text-foreground">
                <strong className="font-fredoka">{displayedSounds.length}</strong> sounds to practice
              </span>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Mode Toggle */}
      <div className="container py-4">
        <ModeToggle />
      </div>

      {/* Sound Grid */}
      <main className="container pb-10 pt-2 md:pb-12">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 md:gap-4 lg:grid-cols-6 xl:grid-cols-7">
          {displayedSounds.map((sound, index) => (
            <SoundCard key={sound.id} sound={sound} index={index} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="container pb-8 pt-2 text-center space-y-2">
        <p className="text-sm text-muted-foreground font-nunito">
          🎯 Tap any sound card to open its therapy screen • Use headphones for best experience
        </p>
        <p className="text-xs text-muted-foreground/70 font-nunito">
          Made by Speech Language Therapist <span className="font-semibold text-primary">Shabana Tariq</span>
        </p>
        <p className="text-xs text-muted-foreground/70 font-nunito">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
