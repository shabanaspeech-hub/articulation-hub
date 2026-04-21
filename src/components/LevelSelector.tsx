import { motion } from "framer-motion";
import { PracticeLevel } from "@/data/soundsData";
import { MessageCircle, FileText, BookOpen, Music, Music2, Gamepad2, Volume2 } from "lucide-react";

interface LevelSelectorProps {
  selectedLevel: PracticeLevel;
  onLevelChange: (level: PracticeLevel) => void;
}

const levels: { key: PracticeLevel; label: string; icon: React.ReactNode }[] = [
  { key: "sound", label: "Sound", icon: <Volume2 className="w-5 h-5" /> },
  { key: "cv", label: "CV", icon: <Music className="w-5 h-5" /> },
  { key: "cvcv", label: "CVCV", icon: <Music2 className="w-5 h-5" /> },
  { key: "words", label: "Words", icon: <FileText className="w-5 h-5" /> },
  { key: "phrases", label: "Phrases", icon: <MessageCircle className="w-5 h-5" /> },
  { key: "sentences", label: "Sentences", icon: <BookOpen className="w-5 h-5" /> },
  { key: "games", label: "Games", icon: <Gamepad2 className="w-5 h-5" /> },
];

const LevelSelector = ({ selectedLevel, onLevelChange }: LevelSelectorProps) => {
  return (
    <div className="grid w-full grid-cols-3 gap-2 rounded-2xl bg-secondary p-1.5 sm:grid-cols-4 md:grid-cols-7">
      {levels.map((level) => (
        <motion.button
          key={level.key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onLevelChange(level.key)}
          className={`relative min-h-12 rounded-xl px-3 py-2.5 font-nunito text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            selectedLevel === level.key
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-secondary-foreground hover:bg-primary/10"
          }`}
        >
          {level.icon}
          <span>{level.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default LevelSelector;
