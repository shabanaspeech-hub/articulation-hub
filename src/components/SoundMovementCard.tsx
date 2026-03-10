import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

interface SoundMovementCardProps {
  sound: string;
  currentIndex: number;
}

interface MovementData {
  cue: string;
  mouthDesc: string;
  repetition: string;
  emoji: string;
  mouthSteps: string[];
  lipCue: string;
}

const soundMovementData: Record<string, MovementData> = {
  M: {
    cue: "Close your lips together and hum",
    mouthDesc: "Lips pressed gently together, voice ON, air goes through nose",
    repetition: "mmm mmm mmm mmm",
    emoji: "👄",
    mouthSteps: [
      "😶 Close lips together gently",
      "👃 Air flows through your nose",
      "🔊 Turn your voice ON — feel the buzz",
      "⏱️ Hold: mmmmmm",
    ],
    lipCue: "Lips together — touch & hum",
  },
  B: {
    cue: "Put lips together, then POP them open!",
    mouthDesc: "Lips pressed together, then burst open with voice ON",
    repetition: "b b b b b",
    emoji: "💥",
    mouthSteps: [
      "😶 Press lips together",
      "💨 Build up air behind lips",
      "🔊 Voice ON — feel throat buzz",
      "💥 POP lips open!",
    ],
    lipCue: "Lips together — POP open",
  },
  P: {
    cue: "Put lips together, then POP with a puff of air!",
    mouthDesc: "Lips pressed together, burst open with air puff, voice OFF",
    repetition: "p p p p p",
    emoji: "💨",
    mouthSteps: [
      "😶 Press lips together tightly",
      "💨 Build up air behind lips",
      "🔇 Voice stays OFF — whisper sound",
      "💨 POP lips — feel the air puff on your hand!",
    ],
    lipCue: "Lips together — puff of air",
  },
  T: {
    cue: "Tap your tongue tip on the bumpy spot!",
    mouthDesc: "Tongue tip taps the ridge behind top teeth, voice OFF",
    repetition: "t t t t t",
    emoji: "👅",
    mouthSteps: [
      "👅 Lift tongue tip UP",
      "📍 Touch the bumpy ridge behind top teeth",
      "🔇 Voice stays OFF",
      "👅 Tap tongue down quickly — t!",
    ],
    lipCue: "Tongue tip UP — tap the bumpy spot",
  },
  D: {
    cue: "Tap your tongue and turn your voice ON!",
    mouthDesc: "Tongue tip taps ridge behind top teeth, voice ON",
    repetition: "d d d d d",
    emoji: "👅",
    mouthSteps: [
      "👅 Lift tongue tip UP",
      "📍 Touch the bumpy ridge behind top teeth",
      "🔊 Voice ON — feel throat buzz",
      "👅 Tap tongue down — d!",
    ],
    lipCue: "Tongue tip UP — voice ON — tap",
  },
  N: {
    cue: "Tongue up, hum through your nose!",
    mouthDesc: "Tongue tip up on ridge, voice ON, air through nose",
    repetition: "nnn nnn nnn nnn",
    emoji: "👃",
    mouthSteps: [
      "👅 Lift tongue tip UP",
      "📍 Press on bumpy ridge behind top teeth",
      "👃 Air flows through your nose",
      "🔊 Voice ON — hold: nnnnn",
    ],
    lipCue: "Tongue up — air through nose — hum",
  },
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
      className="practice-card flex flex-col items-center gap-5 max-w-sm mx-auto"
    >
      {/* Mouth visual area */}
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
      <div className="text-center space-y-1">
        <h2 className="font-fredoka text-xl md:text-2xl font-bold text-foreground">
          {data.cue}
        </h2>
        <p className="font-nunito text-muted-foreground text-xs bg-secondary/50 rounded-full px-3 py-1 inline-block">
          {data.lipCue}
        </p>
      </div>

      {/* Mouth placement steps */}
      <div className="w-full bg-card rounded-2xl border border-border p-4 space-y-2">
        <p className="font-fredoka text-sm font-semibold text-foreground mb-2">👄 Mouth Placement:</p>
        {data.mouthSteps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-start gap-2"
          >
            <span className="font-nunito text-sm text-foreground">{step}</span>
          </motion.div>
        ))}
        <p className="font-nunito text-xs text-muted-foreground mt-2 italic">
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
