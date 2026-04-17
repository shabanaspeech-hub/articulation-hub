import { motion } from "framer-motion";
import { Volume2, Zap } from "lucide-react";
import { getSpokenSequenceText, speakPhoneticText } from "@/lib/speech";

interface MotorSequencingCardProps {
  sound: string;
  currentIndex: number;
}

const generateSequences = (sound: string) => {
  const s = sound.toLowerCase();
  const otherSounds = ["pa", "ta", "ka", "ma", "ba", "da", "na"].filter(
    seq => !seq.startsWith(s)
  );

  const sequences = [
    // Basic alternating with one other sound
    { display: `${s}a  ${otherSounds[0]}`, label: "2-sound alternation" },
    { display: `${s}a  ${otherSounds[1]}`, label: "2-sound alternation" },
    // Triple alternation
    { display: `${s}a  ${otherSounds[0]}  ${s}a`, label: "3-sound chain" },
    { display: `${s}a  ${otherSounds[0]}  ${otherSounds[1]}`, label: "3-sound sequence" },
    // Rapid alternation
    { display: `${s}a ${otherSounds[0]} ${s}a ${otherSounds[0]}`, label: "Rapid alternation" },
  ];

  return sequences;
};

const MotorSequencingCard = ({ sound, currentIndex }: MotorSequencingCardProps) => {
  const sequences = generateSequences(sound);
  const current = sequences[currentIndex % sequences.length];

  const speakSequence = () => {
    speakPhoneticText(getSpokenSequenceText(current.display), { rate: 0.4, pitch: 1 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="practice-card flex flex-col items-center gap-6 max-w-sm mx-auto"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={speakSequence}
        className="relative cursor-pointer"
        aria-label="Hear the sequence"
      >
        <div className="w-48 h-48 md:w-60 md:h-60 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/30 flex flex-col items-center justify-center shadow-lg border-4 border-primary/20">
          <Zap className="w-10 h-10 text-primary mb-2" />
          <span className="font-fredoka text-3xl md:text-4xl font-bold text-primary text-center px-4 leading-tight">
            {current.display}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
          <Volume2 className="w-5 h-5" />
        </div>
      </motion.button>

      <div className="text-center">
        <p className="font-nunito text-lg text-muted-foreground">{current.label}</p>
        <p className="font-nunito text-sm text-muted-foreground/70 mt-1">
          Motor Sequencing Drill
        </p>
      </div>

      <div className="flex gap-2">
        {sequences.map((_, idx) => (
          <div
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentIndex % sequences.length ? "bg-primary scale-125" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export { generateSequences };
export default MotorSequencingCard;
