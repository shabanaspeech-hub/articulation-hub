import { useAppMode, AppMode } from "@/contexts/AppModeContext";
import { MessageCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const modes: { key: AppMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: "motor-speech", label: "Motor Speech", icon: <Brain className="w-5 h-5" />, desc: "Apraxia therapy" },
  { key: "articulation", label: "Articulation", icon: <MessageCircle className="w-5 h-5" />, desc: "Sound practice" },
];

const ModeToggle = ({ compact = false }: { compact?: boolean }) => {
  const { mode, setMode } = useAppMode();

  return (
    <div className="flex gap-1 p-1 bg-welcome-tile/80 rounded-2xl max-w-md mx-auto" role="group" aria-label="Practice mode">
      {modes.map((m) => (
        <Button
          key={m.key}
          variant="ghost"
          aria-pressed={mode === m.key}
          onClick={() => setMode(m.key)}
          className={`relative min-w-0 h-auto flex-1 ${compact ? "py-1.5" : "py-2.5"} px-2 rounded-xl font-nunito font-semibold text-sm transition-all duration-300 flex flex-col items-center gap-1 ${
            mode === m.key
              ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
              : "text-welcome-ink hover:bg-primary/10 hover:text-welcome-ink"
          }`}
        >
          <div className="flex items-center gap-2">
            {m.icon}
            <span>{m.label}</span>
          </div>
          {!compact && <span className={`text-xs font-normal ${mode === m.key ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {m.desc}
          </span>}
        </Button>
      ))}
    </div>
  );
};

export default ModeToggle;
