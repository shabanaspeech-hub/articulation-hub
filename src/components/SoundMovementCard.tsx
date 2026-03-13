import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import MouthDiagram from "./MouthDiagram";

interface SoundMovementCardProps {
  sound: string;
  currentIndex: number;
}

interface MovementData {
  cue: string;
  mouthDesc: string;
  repetition: string;
  mouthSteps: string[];
  lipCue: string;
  mouthType: "bilabial" | "alveolar";
  voicing: "voiced" | "voiceless" | "nasal";
}

const soundMovementData: Record<string, MovementData> = {
  M: {
    cue: "Close your lips tight and hum mmm",
    mouthDesc: "Lips pressed together with gentle pressure, voice ON, air through nose",
    repetition: "mmm, mmm, mmm, mmm",
    mouthSteps: [
      "😶 Press lips together gently but firmly",
      "💨 Feel pressure building behind lips",
      "👃 Air flows through your nose",
      "🔊 Turn voice ON and hum: mmmmmm",
    ],
    lipCue: "Lips closed tight — hum mmm",
    mouthType: "bilabial",
    voicing: "nasal",
  },
  B: {
    cue: "Put lips together, then POP them open!",
    mouthDesc: "Lips pressed together, then burst open with voice ON",
    repetition: "buh, buh, buh, buh",
    mouthSteps: [
      "😶 Press lips together",
      "💨 Build up air behind lips",
      "🔊 Voice ON — feel throat buzz",
      "💥 POP lips open!",
    ],
    lipCue: "Lips together — POP open",
    mouthType: "bilabial",
    voicing: "voiced",
  },
  P: {
    cue: "Lips together, then pop open for pa",
    mouthDesc: "Lips pressed together, burst open with air puff, voice OFF",
    repetition: "pa, pa, pa, pa",
    mouthSteps: [
      "😶 Press lips together tightly",
      "💨 Build up air pressure behind lips",
      "🔇 Voice stays OFF — whisper sound",
      "💨 POP lips open and say: pa pa pa",
    ],
    lipCue: "Lips together — pop for pa",
    mouthType: "bilabial",
    voicing: "voiceless",
  },
  T: {
    cue: "Tap your tongue tip on the bumpy spot!",
    mouthDesc: "Tongue tip taps the ridge behind top teeth, voice OFF",
    repetition: "tuh, tuh, tuh, tuh",
    mouthSteps: [
      "👅 Lift tongue tip UP",
      "📍 Touch the bumpy ridge behind top teeth",
      "🔇 Voice stays OFF",
      "👅 Tap tongue down quickly — t!",
    ],
    lipCue: "Tongue tip UP — tap the bumpy spot",
    mouthType: "alveolar",
    voicing: "voiceless",
  },
  D: {
    cue: "Tap your tongue and turn your voice ON!",
    mouthDesc: "Tongue tip taps ridge behind top teeth, voice ON",
    repetition: "duh, duh, duh, duh",
    mouthSteps: [
      "👅 Lift tongue tip UP",
      "📍 Touch the bumpy ridge behind top teeth",
      "🔊 Voice ON — feel throat buzz",
      "👅 Tap tongue down — d!",
    ],
    lipCue: "Tongue tip UP — voice ON — tap",
    mouthType: "alveolar",
    voicing: "voiced",
  },
  N: {
    cue: "Tongue up, hum through your nose!",
    mouthDesc: "Tongue tip up on ridge, voice ON, air through nose",
    repetition: "en, en, en, en",
    mouthSteps: [
      "👅 Lift tongue tip UP",
      "📍 Press on bumpy ridge behind top teeth",
      "👃 Air flows through your nose",
      "🔊 Voice ON — hold: nnnnn",
    ],
    lipCue: "Tongue up — air through nose — hum",
    mouthType: "alveolar",
    voicing: "nasal",
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

  const speakSound = () => {
    const utterance = new SpeechSynthesisUtterance(data.repetition.split(",")[0].trim());
    utterance.rate = 0.4;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  };

  const speakRepetition = () => {
    const utterance = new SpeechSynthesisUtterance(data.repetition);
    utterance.rate = 0.35;
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
      {/* Animated Mouth Diagram */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={speakSound}
        className="relative cursor-pointer"
        aria-label={`Hear the ${sound} sound`}
      >
        <div className="rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 p-4 shadow-lg border-4 border-accent/30">
          <MouthDiagram type={data.mouthType} voicing={data.voicing} />
        </div>
        <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
          <Volume2 className="w-5 h-5" />
        </div>
        <div className="absolute top-2 left-2 font-fredoka text-3xl font-bold text-primary bg-background/80 rounded-xl px-3 py-1">
          {upperSound}
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
