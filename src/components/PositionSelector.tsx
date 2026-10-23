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
    <div className="flex gap-2 p-1 bg-muted/80 rounded-2xl">
      {positions.map((pos) => (
        <motion.button
          key={pos.key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPositionChange(pos.key)}
          className={`relative flex-1 py-1.5 px-3 rounded-xl font-fredoka font-semibold text-center transition-all duration-300 ${
            selectedPosition === pos.key
              ? "bg-card text-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {selectedPosition === pos.key && (
            <motion.div
              layoutId="positionIndicator"
              className="absolute inset-0 bg-card rounded-xl shadow-md"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-1.5">
            <span className="text-sm">{pos.icon}</span>
            <span className="text-sm md:text-base">{pos.label}</span>
            <span className="text-xs text-muted-foreground hidden lg:inline">· {pos.description}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default PositionSelector;
