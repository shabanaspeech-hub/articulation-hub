import { useState } from "react";
import { motion } from "framer-motion";
import { Puzzle, Sparkles } from "lucide-react";
import { SoundData, soundsData } from "@/data/soundsData";
import MatchingGame from "./MatchingGame";
import PopBalloonGame from "./PopBalloonGame";

interface GamesViewProps {
  sound: SoundData;
}

type GameKey = "matching" | "balloon";

const games: { key: GameKey; label: string; emoji: string; icon: React.ReactNode }[] = [
  { key: "matching", label: "Matching", emoji: "🧩", icon: <Puzzle className="w-4 h-4" /> },
  { key: "balloon", label: "Pop Balloons", emoji: "🎈", icon: <Sparkles className="w-4 h-4" /> },
];

const GamesView = ({ sound }: GamesViewProps) => {
  const [active, setActive] = useState<GameKey>("matching");

  // Pool of all words containing the target sound (across positions)
  const targetWords = [
    ...sound.words.initial,
    ...sound.words.medial,
    ...sound.words.final,
  ];

  // Distractor words from other sounds for sound-discrimination games
  const distractorWords = soundsData
    .filter((s) => s.sound !== sound.sound)
    .flatMap((s) => s.words.initial.slice(0, 2));

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex gap-2 p-1.5 bg-secondary rounded-2xl">
        {games.map((g) => (
          <motion.button
            key={g.key}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActive(g.key)}
            className={`px-4 py-2 rounded-xl font-fredoka text-sm flex items-center gap-2 transition-all ${
              active === g.key
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            <span>{g.emoji}</span>
            <span>{g.label}</span>
          </motion.button>
        ))}
      </div>

      {active === "matching" && (
        <MatchingGame words={targetWords} soundLetter={sound.sound} />
      )}
      {active === "balloon" && (
        <PopBalloonGame
          targetWords={targetWords}
          distractorWords={distractorWords}
          soundLetter={sound.sound}
        />
      )}
    </div>
  );
};

export default GamesView;
