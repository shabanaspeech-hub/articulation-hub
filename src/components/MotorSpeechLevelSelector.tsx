import { motion } from "framer-motion";
import { MotorSpeechLevel } from "@/data/soundsData";
import { Vibrate, Music, ArrowDownUp, Music2, FileText, Zap, MessageCircle, BookOpen } from "lucide-react";

interface MotorSpeechLevelSelectorProps {
  selectedLevel: MotorSpeechLevel;
  onLevelChange: (level: MotorSpeechLevel) => void;
}

const levels: { key: MotorSpeechLevel; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { key: "sound-movement", label: "Movement", shortLabel: "👄", icon: <Vibrate className="w-4 h-4" /> },
  { key: "cv", label: "CV", shortLabel: "CV", icon: <Music className="w-4 h-4" /> },
  { key: "vc", label: "VC", shortLabel: "VC", icon: <ArrowDownUp className="w-4 h-4" /> },
  { key: "cvcv", label: "CVCV", shortLabel: "CVCV", icon: <Music2 className="w-4 h-4" /> },
  { key: "cvc", label: "CVC", shortLabel: "CVC", icon: <FileText className="w-4 h-4" /> },
  { key: "motor-sequencing", label: "Sequencing", shortLabel: "⚡", icon: <Zap className="w-4 h-4" /> },
  { key: "words", label: "Words", shortLabel: "📖", icon: <FileText className="w-4 h-4" /> },
  { key: "phrases", label: "Phrases", shortLabel: "💬", icon: <MessageCircle className="w-4 h-4" /> },
  { key: "sentences", label: "Sentences", shortLabel: "📚", icon: <BookOpen className="w-4 h-4" /> },
];

const MotorSpeechLevelSelector = ({ selectedLevel, onLevelChange }: MotorSpeechLevelSelectorProps) => {
  return (
    <div className="flex gap-1.5 p-1.5 bg-secondary rounded-2xl overflow-x-auto">
      {levels.map((level) => (
        <motion.button
          key={level.key}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLevelChange(level.key)}
          className={`relative flex-shrink-0 py-2 px-2.5 rounded-xl font-nunito font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1 ${
            selectedLevel === level.key
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-secondary-foreground hover:bg-primary/10"
          }`}
        >
          {level.icon}
          <span className="hidden sm:inline">{level.label}</span>
          <span className="sm:hidden">{level.shortLabel}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default MotorSpeechLevelSelector;
