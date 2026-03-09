import { motion } from "framer-motion";
import { useAppMode, AppMode } from "@/contexts/AppModeContext";
import { MessageCircle, Brain } from "lucide-react";

const modes: { key: AppMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: "articulation", label: "Articulation", icon: <MessageCircle className="w-5 h-5" />, desc: "Sound practice" },
  { key: "motor-speech", label: "Motor Speech", icon: <Brain className="w-5 h-5" />, desc: "Apraxia therapy" },
];

const ModeToggle = () => {
  const { mode, setMode } = useAppMode();

  return (
    <div className="flex gap-2 p-1.5 bg-secondary rounded-2xl max-w-md mx-auto">
      {modes.map((m) => (
        <motion.button
          key={m.key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode(m.key)}
          className={`relative flex-1 py-3 px-4 rounded-xl font-nunito font-semibold text-sm transition-all duration-300 flex flex-col items-center gap-1 ${
            mode === m.key
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-secondary-foreground hover:bg-primary/10"
          }`}
        >
          <div className="flex items-center gap-2">
            {m.icon}
            <span>{m.label}</span>
          </div>
          <span className={`text-xs font-normal ${mode === m.key ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {m.desc}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default ModeToggle;
