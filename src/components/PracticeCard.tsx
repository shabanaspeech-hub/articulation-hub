import { motion, AnimatePresence } from "framer-motion";
import { WordItem, PracticeLevel } from "@/data/soundsData";
import { Volume2 } from "lucide-react";

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
      {/* Emoji/Image Display */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        className="relative"
      >
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center shadow-lg">
          <span className="text-7xl md:text-8xl">{word.image}</span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary/20 blur-lg" />
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
          <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {highlightSound(getDisplayText())}
          </h2>
          {level !== "words" && (
            <p className="text-lg text-muted-foreground mt-2 font-nunito">
              {word.word}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Audio Button */}
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
