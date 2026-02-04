import { motion } from "framer-motion";
import { Position } from "@/data/soundsData";

interface PositionSelectorProps {
  selectedPosition: Position;
  onPositionChange: (position: Position) => void;
}

const positions: { key: Position; label: string; description: string; icon: string }[] = [
  { key: "initial", label: "Initial", description: "Beginning", icon: "🔵" },
  { key: "medial", label: "Medial", description: "Middle", icon: "🟢" },
  { key: "final", label: "Final", description: "End", icon: "🟠" },
];

const PositionSelector = ({ selectedPosition, onPositionChange }: PositionSelectorProps) => {
  return (
    <div className="flex gap-3 p-2 bg-muted rounded-3xl">
      {positions.map((pos) => (
        <motion.button
          key={pos.key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPositionChange(pos.key)}
          className={`relative flex-1 py-3 px-4 rounded-2xl font-fredoka font-semibold text-center transition-all duration-300 ${
            selectedPosition === pos.key
              ? "bg-card text-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {selectedPosition === pos.key && (
            <motion.div
              layoutId="positionIndicator"
              className="absolute inset-0 bg-card rounded-2xl shadow-md"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className="relative z-10 flex flex-col items-center gap-1">
            <span className="text-lg">{pos.icon}</span>
            <span className="text-sm md:text-base">{pos.label}</span>
            <span className="text-xs text-muted-foreground hidden md:block">{pos.description}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default PositionSelector;
