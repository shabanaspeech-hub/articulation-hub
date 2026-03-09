import { motion } from "framer-motion";
import { MotorSpeechLevel } from "@/data/soundsData";
import { Lock, CheckCircle2, Circle } from "lucide-react";

interface SpeechMotorPathwayProps {
  currentLevel: MotorSpeechLevel;
  onLevelChange: (level: MotorSpeechLevel) => void;
  completedLevels?: MotorSpeechLevel[];
}

const pathwaySteps: { key: MotorSpeechLevel; label: string; emoji: string }[] = [
  { key: "sound-movement", label: "Sound Movement", emoji: "👄" },
  { key: "cv", label: "CV Syllables", emoji: "🔤" },
  { key: "vc", label: "VC Syllables", emoji: "🔠" },
  { key: "cvcv", label: "CVCV", emoji: "🗣️" },
  { key: "cvc", label: "CVC Words", emoji: "📝" },
  { key: "motor-sequencing", label: "Motor Sequencing", emoji: "⚡" },
  { key: "words", label: "Words", emoji: "📖" },
  { key: "phrases", label: "Phrases", emoji: "💬" },
  { key: "sentences", label: "Sentences", emoji: "📚" },
];

const SpeechMotorPathway = ({ currentLevel, onLevelChange, completedLevels = [] }: SpeechMotorPathwayProps) => {
  const currentIdx = pathwaySteps.findIndex(s => s.key === currentLevel);

  return (
    <div className="relative py-4">
      <h3 className="font-fredoka text-lg font-semibold text-foreground mb-4 text-center">
        🗺️ Speech Motor Pathway
      </h3>
      <div className="flex flex-col items-center gap-1">
        {pathwaySteps.map((step, idx) => {
          const isCompleted = completedLevels.includes(step.key);
          const isCurrent = step.key === currentLevel;
          const isUnlocked = idx <= currentIdx || isCompleted;

          return (
            <div key={step.key} className="flex flex-col items-center">
              <motion.button
                whileHover={isUnlocked ? { scale: 1.08 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => isUnlocked && onLevelChange(step.key)}
                disabled={!isUnlocked}
                className={`relative flex items-center gap-3 w-56 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : isCompleted
                    ? "bg-accent/20 text-accent-foreground"
                    : isUnlocked
                    ? "bg-card text-foreground hover:bg-primary/10"
                    : "bg-muted/50 text-muted-foreground opacity-50"
                }`}
              >
                <span className="text-xl">{step.emoji}</span>
                <span className="font-nunito font-semibold text-sm flex-1 text-left">{step.label}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                ) : isCurrent ? (
                  <Circle className="w-4 h-4 fill-current" />
                ) : !isUnlocked ? (
                  <Lock className="w-4 h-4" />
                ) : null}
              </motion.button>
              {idx < pathwaySteps.length - 1 && (
                <div className={`w-0.5 h-3 ${idx < currentIdx ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpeechMotorPathway;
