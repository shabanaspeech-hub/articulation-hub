import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

interface SoundMovementCardProps {
  sound: string;
  currentIndex: number;
}

const soundMovementData: Record<string, { cue: string; mouthDesc: string; repetition: string; emoji: string }> = {
  M: { cue: "Close your lips together", mouthDesc: "Lips pressed gently, humming", repetition: "mmm mmm mmm mmm", emoji: "👄" },
  B: { cue: "POP your lips!", mouthDesc: "Lips together, then burst open", repetition: "b b b b b", emoji: "💥" },
  P: { cue: "POP your lips softly", mouthDesc: "Lips together, puff of air", repetition: "p p p p p", emoji: "💨" },
  T: { cue: "Tap your tongue on the bumpy spot", mouthDesc: "Tongue tip taps behind top teeth", repetition: "t t t t t", emoji: "👅" },
  D: { cue: "Tap your tongue and use your voice", mouthDesc: "Tongue tip taps, voice buzzes", repetition: "d d d d d", emoji: "👅" },
  N: { cue: "Tongue up, hum through your nose", mouthDesc: "Tongue tip up, air through nose", repetition: "nnn nnn nnn nnn", emoji: "👃" },
};

const allSounds = ["M", "B", "P", "T", "D", "N"];

const SoundMovementCard = ({ sound, currentIndex }: SoundMovementCardProps) => {
  const upperSound = sound.toUpperCase();
  const data = soundMovementData[upperSound];

  if (!data) {
    return (
      <div className="practice-card flex flex-col items-center gap-4 p-8">
        <p className="font-nunito text-muted-foreground">
          Sound movement practice is available for early motor sounds: M, B, P, T, D, N
        </p>
      </div>
    );
  }

  const phoneticMap: Record<string, string> = {
    'B': 'buh', 'P': 'puh', 'D': 'duh', 'T': 'tuh',
    'M': 'mmmm', 'N': 'nnnn',
  };

  const speakSound = () => {
    const phonetic = phoneticMap[upperSound] || upperSound.toLowerCase();
    const utterance = new SpeechSynthesisUtterance(phonetic);
    utterance.rate = 0.4;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  };

  const speakRepetition = () => {
    const utterance = new SpeechSynthesisUtterance(data.repetition);
    utterance.rate = 0.3;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="practice-card flex flex-col items-center gap-6 max-w-sm mx-auto"
    >
      {/* Mouth animation area */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={speakSound}
        className="relative cursor-pointer"
        aria-label={`Hear the ${sound} sound`}
      >
        <div className="w-48 h-48 md:w-60 md:h-60 rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 flex flex-col items-center justify-center shadow-lg border-4 border-accent/30">
          <span className="text-7xl mb-2">{data.emoji}</span>
          <span className="font-fredoka text-4xl md:text-5xl font-bold text-primary">{upperSound}</span>
        </div>
        <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
          <Volume2 className="w-5 h-5" />
        </div>
      </motion.button>

      {/* Cue text */}
      <div className="text-center space-y-2">
        <h2 className="font-fredoka text-2xl md:text-3xl font-bold text-foreground">
          {data.cue}
        </h2>
        <p className="font-nunito text-muted-foreground text-sm">
          {data.mouthDesc}
        </p>
      </div>

      {/* Repetition drill */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={speakRepetition}
        className="bg-secondary rounded-2xl px-6 py-4 w-full text-center cursor-pointer"
      >
        <p className="font-fredoka text-2xl tracking-[0.3em] text-foreground">
          {data.repetition}
        </p>
        <p className="font-nunito text-xs text-muted-foreground mt-1">
          Tap to hear slow repetition
        </p>
      </motion.button>
    </motion.div>
  );
};

export { allSounds as motorSpeechSounds };
export default SoundMovementCard;
