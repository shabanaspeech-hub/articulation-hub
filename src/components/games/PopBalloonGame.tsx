import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles, Heart } from "lucide-react";
import { WordItem } from "@/data/soundsData";
import { Button } from "@/components/ui/button";
import { speakPhoneticText } from "@/lib/speech";

interface PopBalloonGameProps {
  targetWords: WordItem[];
  distractorWords: WordItem[];
  soundLetter: string;
}

interface Balloon {
  id: number;
  word: string;
  image: string;
  isTarget: boolean;
  x: number; // percentage 0-100
  delay: number;
  duration: number;
  color: string;
  popped: boolean;
}

const balloonColors = [
  "from-pink-400 to-rose-500",
  "from-sky-400 to-blue-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-green-500",
  "from-violet-400 to-purple-500",
  "from-yellow-400 to-amber-500",
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildRound = (
  targets: WordItem[],
  distractors: WordItem[],
  total: number,
  targetCount: number,
  startId: number,
): Balloon[] => {
  const tPicks = shuffle(targets).slice(0, Math.min(targetCount, targets.length));
  const dPicks = shuffle(distractors).slice(0, Math.max(0, total - tPicks.length));
  const items = shuffle([
    ...tPicks.map((w) => ({ w, isTarget: true })),
    ...dPicks.map((w) => ({ w, isTarget: false })),
  ]);
  return items.map((it, i) => ({
    id: startId + i,
    word: it.w.word,
    image: it.w.image,
    isTarget: it.isTarget,
    x: 5 + Math.random() * 85,
    delay: i * 0.6 + Math.random() * 0.3,
    duration: 7 + Math.random() * 3,
    color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
    popped: false,
  }));
};

const PopBalloonGame = ({ targetWords, distractorWords, soundLetter }: PopBalloonGameProps) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const idRef = useRef(0);

  const balloons = useMemo(() => {
    const total = 5;
    const targetCount = 3;
    const start = idRef.current;
    idRef.current += total;
    return buildRound(targetWords, distractorWords, total, targetCount, start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, targetWords, distractorWords]);

  const [activeBalloons, setActiveBalloons] = useState<Balloon[]>(balloons);

  useEffect(() => {
    setActiveBalloons(balloons);
  }, [balloons]);

  const gameOver = lives <= 0;

  const handlePop = (id: number) => {
    const b = activeBalloons.find((x) => x.id === id);
    if (!b || b.popped) return;

    speakPhoneticText(b.word, { rate: 0.85, pitch: 1.1 });

    if (b.isTarget) {
      setScore((s) => s + 1);
      setFeedback("correct");
    } else {
      setLives((l) => Math.max(0, l - 1));
      setFeedback("wrong");
    }
    setActiveBalloons((bs) => bs.map((x) => (x.id === id ? { ...x, popped: true } : x)));
    setTimeout(() => setFeedback(null), 600);
  };

  const handleEscape = (id: number) => {
    setActiveBalloons((bs) => bs.map((x) => (x.id === id ? { ...x, popped: true } : x)));
  };

  const allDone = activeBalloons.length > 0 && activeBalloons.every((b) => b.popped);

  useEffect(() => {
    if (allDone && !gameOver) {
      const t = setTimeout(() => setRound((r) => r + 1), 1200);
      return () => clearTimeout(t);
    }
  }, [allDone, gameOver]);

  const reset = () => {
    setScore(0);
    setLives(3);
    setRound((r) => r + 1);
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full px-2">
        <div className="font-fredoka text-lg">
          Score: <span className="text-primary">{score}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 ${
                i < lives ? "fill-rose-500 text-rose-500" : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="font-nunito text-sm text-muted-foreground text-center">
        Pop balloons with the <span className="font-bold text-primary">"{soundLetter.toUpperCase()}"</span> sound!
      </p>

      <div className="relative w-full h-[420px] rounded-3xl bg-gradient-to-b from-sky-100 to-sky-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden border-2 border-border shadow-inner">
        <AnimatePresence>
          {!gameOver &&
            activeBalloons.map(
              (b) =>
                !b.popped && (
                  <motion.button
                    key={b.id}
                    initial={{ y: 460, opacity: 0 }}
                    animate={{ y: -120, opacity: 1 }}
                    exit={{ scale: 1.4, opacity: 0 }}
                    transition={{
                      duration: b.duration,
                      delay: b.delay,
                      ease: "linear",
                      opacity: { duration: 0.3 },
                    }}
                    onAnimationComplete={() => handleEscape(b.id)}
                    onClick={() => handlePop(b.id)}
                    style={{ left: `${b.x}%` }}
                    className="absolute bottom-0 -translate-x-1/2 cursor-pointer"
                    aria-label={`Balloon: ${b.word}`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-20 h-24 rounded-[50%] bg-gradient-to-br ${b.color} shadow-lg flex flex-col items-center justify-center`}
                      >
                        <span className="text-3xl">{b.image}</span>
                        <span className="font-fredoka text-[10px] text-white drop-shadow">
                          {b.word}
                        </span>
                      </div>
                      <div className="w-0.5 h-6 bg-foreground/30" />
                    </div>
                  </motion.button>
                ),
            )}
        </AnimatePresence>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2"
            >
              <div
                className={`px-4 py-2 rounded-full font-fredoka text-lg shadow-lg ${
                  feedback === "correct"
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white"
                }`}
              >
                {feedback === "correct" ? "🎉 Yes!" : "Oops!"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {gameOver && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <Sparkles className="w-12 h-12 text-primary" />
            <div className="font-fredoka text-2xl">Game Over!</div>
            <div className="font-nunito text-lg">Final Score: {score}</div>
            <Button onClick={reset} className="rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" /> Play Again
            </Button>
          </div>
        )}
      </div>

      {!gameOver && (
        <Button onClick={reset} variant="ghost" size="sm" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" /> Restart
        </Button>
      )}
    </div>
  );
};

export default PopBalloonGame;
