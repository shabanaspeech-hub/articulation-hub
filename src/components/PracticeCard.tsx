import { motion, AnimatePresence } from "framer-motion";
import { WordItem, PracticeLevel } from "@/data/soundsData";
import { Volume2, Mic } from "lucide-react";

interface PracticeCardProps {
  word: WordItem;
  level: PracticeLevel;
  soundLetter: string;
  position: string;
}

const PracticeCard = ({ word, level, soundLetter, position }: PracticeCardProps) => {
  const getDisplayText = () => {
    switch (level) {
      case "words":
        return word.word;
      case "phrases":
        return word.phrase;
      case "sentences":
        return word.sentence;
    }
  };

  const highlightSound = (text: string) => {
    const lowerText = text.toLowerCase();
    const lowerSound = soundLetter.toLowerCase();
    const index = lowerText.indexOf(lowerSound);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.slice(0, index)}
        <span className="text-primary font-bold">{text.slice(index, index + soundLetter.length)}</span>
        {text.slice(index + soundLetter.length)}
      </>
    );
  };

  const speakSound = () => {
    const utterance = new SpeechSynthesisUtterance(soundLetter.toLowerCase());
    utterance.rate = 0.6;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  };

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(getDisplayText());
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="practice-card flex flex-col items-center gap-6"
    >
      {/* Sound Voice Button - Say the sound first */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={speakSound}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-fredoka text-lg shadow-md hover:shadow-lg transition-shadow"
        aria-label={`Say the ${soundLetter} sound`}
      >
        <Mic className="w-5 h-5" />
        Say "{soundLetter.toUpperCase()}"
      </motion.button>

      {/* Emoji/Image Display - BIGGER */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
        className="relative"
      >
        <div className="w-48 h-48 md:w-60 md:h-60 rounded-3xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center shadow-lg">
          <span className="text-[6rem] md:text-[8rem] leading-none">{word.image}</span>
        </div>
        <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-primary/20 blur-xl" />
      </motion.div>

      {/* Text Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={level}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center"
        >
          <h2 className="font-fredoka text-3xl md:text-5xl font-bold text-foreground leading-tight">
            {highlightSound(getDisplayText())}
          </h2>
          {level !== "words" && (
            <p className="text-lg text-muted-foreground mt-2 font-nunito">
              {word.word}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Audio Button - Hear the word */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={speakWord}
        className="w-14 h-14 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Listen to pronunciation"
      >
        <Volume2 className="w-6 h-6" />
      </motion.button>

      {/* Position indicator */}
      <div className="text-sm text-muted-foreground font-nunito capitalize">
        {position} position
      </div>
    </motion.div>
  );
};

export default PracticeCard;
