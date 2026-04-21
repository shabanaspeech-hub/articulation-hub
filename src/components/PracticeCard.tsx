import { motion, AnimatePresence } from "framer-motion";
import { WordItem, PracticeLevel, SyllableItem, CVCItem, getSyllablePhonetic } from "@/data/soundsData";
import { Volume2, Mic } from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";
import { getIsolationSpeechText, speakPhoneticText } from "@/lib/speech";

interface PracticeCardProps {
  word?: WordItem;
  syllable?: SyllableItem;
  cvcItem?: CVCItem;
  level: PracticeLevel;
  activeLevel?: string;
  soundLetter: string;
  position: string;
}

const PracticeCard = ({ word, syllable, cvcItem, level, activeLevel, soundLetter, position }: PracticeCardProps) => {
  const isSyllableLevel = level === "cv" || level === "cvcv" || level === "vc";

  const getDisplayText = () => {
    if (isSyllableLevel && syllable) return syllable.display;
    if (cvcItem) return cvcItem.display;
    if (!word) return "";
    switch (level) {
      case "words":
        return word.word;
      case "phrases":
        return word.phrase;
      case "sentences":
        return word.sentence;
      default:
        return "";
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
    speakPhoneticText(getIsolationSpeechText(soundLetter), { rate: 0.45, pitch: 1 });
  };

  const speakWord = () => {
    const text = getDisplayText();
    let speakText = text;
    
    if (isSyllableLevel && syllable) {
      const display = syllable.display.toLowerCase();
      const phonetic = getSyllablePhonetic(display);
      if (phonetic !== display) {
        speakText = phonetic;
      } else if (activeLevel === "cvcv" || level === "cvcv") {
        // For CVCV, split into halves and get phonetics
        const half = Math.floor(display.length / 2);
        const p1 = getSyllablePhonetic(display.slice(0, half));
        const p2 = getSyllablePhonetic(display.slice(half));
        speakText = `${p1} ${p2}`;
      }
    }
    
    speakPhoneticText(speakText, { rate: isSyllableLevel ? 0.6 : 0.8, pitch: 1.1 });
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
      {/* Syllable mode: big text bubble instead of image */}
      {isSyllableLevel && syllable ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={speakWord}
          className="relative cursor-pointer"
          aria-label={`Tap to hear ${syllable.display}`}
        >
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/30 flex flex-col items-center justify-center shadow-lg border-4 border-primary/20">
            {syllable.image && (
              <span className="text-5xl md:text-6xl mb-2">{syllable.image}</span>
            )}
            <span className="font-fredoka text-4xl md:text-6xl font-bold text-primary">
              {syllable.display}
            </span>
          </div>
          <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Volume2 className="w-5 h-5" />
          </div>
        </motion.button>
      ) : cvcItem ? (
        /* CVC word mode */
        <motion.button
          whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
          whileTap={{ scale: 0.9 }}
          onClick={speakWord}
          className="relative cursor-pointer"
          aria-label={`Tap to hear ${cvcItem.display}`}
        >
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 flex flex-col items-center justify-center shadow-lg border-4 border-primary/20">
            <span className="text-[5rem] md:text-[6rem] leading-none">{cvcItem.image}</span>
            <span className="font-fredoka text-2xl font-bold text-primary mt-2">{cvcItem.display}</span>
          </div>
          <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Volume2 className="w-5 h-5" />
          </div>
        </motion.button>
      ) : word ? (
        /* Word/Phrase/Sentence mode: image with tap-to-hear */
        <motion.button
          whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
          whileTap={{ scale: 0.9 }}
          onClick={speakWord}
          className="relative cursor-pointer"
          aria-label={`Tap to hear ${getDisplayText()}`}
        >
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-3xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center shadow-lg">
            <span className="text-[6rem] md:text-[8rem] leading-none">{word.image}</span>
          </div>
          <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-primary/20 blur-xl" />
        </motion.button>
      ) : null}

      {/* Text Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={level}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center"
        >
          {isSyllableLevel ? (
            <p className="font-nunito text-lg text-muted-foreground">
              {level === "cv" ? "Consonant-Vowel" : "Consonant-Vowel-Consonant-Vowel"}
            </p>
          ) : (
            <>
              <h2 className="font-fredoka text-3xl md:text-5xl font-bold text-foreground leading-tight">
                {highlightSound(getDisplayText())}
              </h2>
              {level !== "words" && word && (
                <p className="text-lg text-muted-foreground mt-2 font-nunito">
                  {word.word}
                </p>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Say Sound Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={speakSound}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-fredoka text-lg shadow-md hover:shadow-lg transition-shadow"
        aria-label={`Play the ${soundLetter.toUpperCase()} sound`}
      >
        <Mic className="w-5 h-5" />
        Play sound
      </motion.button>

      {/* Voice Recorder */}
      <VoiceRecorder label="🎙️ Now you try! Record yourself:" />

      {/* Position indicator - only for word levels */}
      {!isSyllableLevel && (
        <div className="text-sm text-muted-foreground font-nunito capitalize">
          {position} position
        </div>
      )}
    </motion.div>
  );
};

export default PracticeCard;