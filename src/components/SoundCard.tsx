import { type MouseEvent } from "react";
import { motion } from "framer-motion";
import { SoundData } from "@/data/soundsData";
import { useNavigate } from "react-router-dom";
import { Volume2 } from "lucide-react";
import { getIsolationIpaLabel, playIsolationSound } from "@/lib/speech";

interface SoundCardProps {
  sound: SoundData;
  index: number;
}

const colorClasses = {
  blue: "from-sound-blue to-blue-400",
  green: "from-sound-green to-emerald-400",
  orange: "from-sound-orange to-amber-400",
  pink: "from-sound-pink to-rose-400",
  yellow: "from-sound-yellow to-yellow-300",
  teal: "from-sound-teal to-cyan-400",
};

const SoundCard = ({ sound, index }: SoundCardProps) => {
  const navigate = useNavigate();

  const playSound = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    playIsolationSound(sound.sound);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <button
        onClick={() => navigate(`/sound/${sound.id}`)}
        className="sound-card group relative w-full cursor-pointer border border-border bg-card px-3 py-5 text-center"
        aria-label={`Open ${sound.displayName}`}
      >
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClasses[sound.color]} opacity-10 group-hover:opacity-20 transition-opacity`}
        />

        <div className="relative z-10 flex min-h-28 flex-col items-center justify-center gap-2">
          <h3 className="font-fredoka text-4xl font-bold text-foreground md:text-5xl">
            {sound.sound}
          </h3>
          <p className="text-base font-nunito font-semibold text-primary">{getIsolationIpaLabel(sound.sound)}</p>
          <p className="text-xs font-nunito text-muted-foreground">Tap to open</p>
        </div>

        <div
          className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${colorClasses[sound.color]} opacity-30 blur-xl group-hover:opacity-50 transition-opacity`}
        />
      </button>

      <button
        onClick={playSound}
        className="absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
        aria-label={`Play ${sound.sound} sound`}
      >
        <Volume2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default SoundCard;
