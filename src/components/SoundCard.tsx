import { motion } from "framer-motion";
import { SoundData } from "@/data/soundsData";
import { useNavigate } from "react-router-dom";
import { Volume2 } from "lucide-react";
import { getIsolationSpeechText, speakPhoneticText } from "@/lib/speech";

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

  const playSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakPhoneticText(getIsolationSpeechText(sound.sound), { rate: 0.45, pitch: 1 });
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/sound/${sound.id}`)}
      className="sound-card group cursor-pointer text-left relative"
    >
      <button
        onClick={playSound}
        className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        aria-label={`Play ${sound.sound} sound`}
      >
        <Volume2 className="w-4 h-4" />
      </button>
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClasses[sound.color]} opacity-10 group-hover:opacity-20 transition-opacity`}
      />
      
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div
          className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${colorClasses[sound.color]} flex items-center justify-center shadow-lg`}
        >
          <span className="text-3xl md:text-4xl">{sound.icon}</span>
        </div>
        
        <div className="text-center">
          <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-foreground">
            {sound.sound}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{sound.displayName}</p>
        </div>
      </div>

      <div
        className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${colorClasses[sound.color]} opacity-30 blur-xl group-hover:opacity-50 transition-opacity`}
      />
    </motion.button>
  );
};

export default SoundCard;
