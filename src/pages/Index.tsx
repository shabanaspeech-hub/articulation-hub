import { motion } from "framer-motion";
import { soundsData } from "@/data/soundsData";
import SoundCard from "@/components/SoundCard";
import { Sparkles, Volume2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10" />
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-sound-yellow/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-40 h-40 rounded-full bg-sound-teal/20 blur-3xl" />
        
        <div className="container relative py-10 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold font-nunito">By Speech Language Therapist Shabana Tariq</span>
            </div>
            
            <h1 className="font-fredoka text-4xl md:text-6xl font-bold text-foreground mb-4">
              Articulation<span className="text-primary"> Station</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-nunito">
              Practice speech sounds with pictures, words, phrases, and sentences. 
              Tap a sound to get started!
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-3 bg-card px-6 py-3 rounded-2xl shadow-lg"
            >
              <Volume2 className="w-5 h-5 text-primary" />
              <span className="font-nunito text-foreground">
                <strong className="font-fredoka">{soundsData.length}</strong> sounds to practice
              </span>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Sound Grid */}
      <main className="container py-8 md:py-12">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
          {soundsData.map((sound, index) => (
            <SoundCard key={sound.id} sound={sound} index={index} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-8 text-center space-y-2">
        <p className="text-sm text-muted-foreground font-nunito">
          🎯 Tap any sound card to start practicing • Use headphones for best experience
        </p>
        <p className="text-xs text-muted-foreground/70 font-nunito">
          Made by Speech Language Therapist <span className="font-semibold text-primary">Shabana Tariq</span>
        </p>
      </footer>
    </div>
  );
};

export default Index;
