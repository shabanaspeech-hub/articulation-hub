import { motion } from "framer-motion";
import { PracticeLevel } from "@/data/soundsData";
import { MessageCircle, FileText, BookOpen, Music, Music2, Gamepad2, Mic, Scale } from "lucide-react";

interface LevelSelectorProps {
  selectedLevel: PracticeLevel;
  onLevelChange: (level: PracticeLevel) => void;
}

const levels: { key: PracticeLevel; label: string; icon: React.ReactNode }[] = [
  { key: "sound-movement", label: "Sound", icon: <Mic className="w-5 h-5" /> },
  { key: "cv", label: "CV", icon: <Music className="w-5 h-5" /> },
  { key: "cvcv", label: "CVCV", icon: <Music2 className="w-5 h-5" /> },
  { key: "words", label: "Words", icon: <FileText className="w-5 h-5" /> },
  { key: "phrases", label: "Phrases", icon: <MessageCircle className="w-5 h-5" /> },
  { key: "sentences", label: "Sentences", icon: <BookOpen className="w-5 h-5" /> },
  { key: "minimal-pairs", label: "Pairs", icon: <Scale className="w-5 h-5" /> },
  { key: "games", label: "Games", icon: <Gamepad2 className="w-5 h-5" /> },
];

const LevelSelector = ({ selectedLevel, onLevelChange }: LevelSelectorProps) => {
  return (
    <div className="flex gap-1.5 p-1.5 bg-secondary/90 rounded-2xl overflow-x-auto [scrollbar-width:none]">
      {levels.map((level) => (
        <motion.button
          key={level.key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onLevelChange(level.key)}
          className={`relative flex-1 shrink-0 min-w-[2.75rem] py-2 px-2.5 [&>svg]:shrink-0 rounded-xl font-nunito font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            selectedLevel === level.key
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-secondary-foreground hover:bg-primary/10"
          }`}
        >
          {level.icon}
          <span className="hidden sm:inline">{level.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default LevelSelector;
