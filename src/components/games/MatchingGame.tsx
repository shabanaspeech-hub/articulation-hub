import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import { WordItem } from "@/data/soundsData";
import { Button } from "@/components/ui/button";
import { speakPhoneticText } from "@/lib/speech";

interface MatchingGameProps {
  words: WordItem[];
  soundLetter: string;
}

interface Card {
  id: number;
  pairId: number;
  word: string;
  image: string;
  flipped: boolean;
  matched: boolean;
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildDeck = (words: WordItem[], pairCount: number): Card[] => {
  const picks = shuffle(words).slice(0, pairCount);
  const cards: Card[] = [];
  picks.forEach((w, idx) => {
    for (let k = 0; k < 2; k++) {
      cards.push({
        id: idx * 2 + k,
        pairId: idx,
        word: w.word,
        image: w.image,
        flipped: false,
        matched: false,
      });
    }
  });
  return shuffle(cards);
};

const MatchingGame = ({ words, soundLetter }: MatchingGameProps) => {
  const [pairCount, setPairCount] = useState(3);
  const [deck, setDeck] = useState<Card[]>(() => buildDeck(words, 3));
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const allMatched = useMemo(() => deck.length > 0 && deck.every((c) => c.matched), [deck]);

  useEffect(() => {
    setDeck(buildDeck(words, pairCount));
    setSelected([]);
    setMoves(0);
    setCelebrate(false);
  }, [words, pairCount]);

  useEffect(() => {
    if (allMatched) {
      setCelebrate(true);
      speakPhoneticText("Great job!", { rate: 0.9, pitch: 1.2 });
    }
  }, [allMatched]);

  const handleFlip = (id: number) => {
    if (selected.length === 2) return;
    const card = deck.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newDeck = deck.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    const newSelected = [...selected, id];
    setDeck(newDeck);
    setSelected(newSelected);

    speakPhoneticText(card.word, { rate: 0.8, pitch: 1.1 });

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected;
      const ca = newDeck.find((c) => c.id === a)!;
      const cb = newDeck.find((c) => c.id === b)!;
      if (ca.pairId === cb.pairId) {
        setTimeout(() => {
          setDeck((d) => d.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c)));
          setSelected([]);
          speakPhoneticText("Match!", { rate: 0.9, pitch: 1.3 });
        }, 500);
      } else {
        setTimeout(() => {
          setDeck((d) =>
            d.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)),
          );
          setSelected([]);
        }, 900);
      }
    }
  };

  const reset = () => {
    setDeck(buildDeck(words, pairCount));
    setSelected([]);
    setMoves(0);
    setCelebrate(false);
  };

  const cols = pairCount <= 3 ? "grid-cols-3" : pairCount === 4 ? "grid-cols-4" : "grid-cols-4";

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2">
          {[2, 3, 4].map((n) => (
            <Button
              key={n}
              size="sm"
              variant={pairCount === n ? "default" : "outline"}
              onClick={() => setPairCount(n)}
              className="rounded-xl font-fredoka"
            >
              {n} pairs
            </Button>
          ))}
        </div>
        <div className="text-sm font-nunito text-muted-foreground">Moves: {moves}</div>
      </div>

      <div className={`grid ${cols} gap-3 w-full`}>
        {deck.map((card) => (
          <motion.button
            key={card.id}
            whileHover={{ scale: card.matched ? 1 : 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFlip(card.id)}
            className="aspect-square rounded-2xl relative perspective"
            aria-label={card.flipped || card.matched ? card.word : "Hidden card"}
          >
            <motion.div
              animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 preserve-3d"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* back */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="font-fredoka text-3xl text-primary-foreground">
                  {soundLetter.toUpperCase()}
                </span>
              </div>
              {/* front */}
              <div
                className={`absolute inset-0 rounded-2xl bg-card border-4 ${
                  card.matched ? "border-primary" : "border-accent/40"
                } flex flex-col items-center justify-center shadow-md`}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <span className="text-4xl md:text-5xl">{card.image}</span>
                <span className="font-fredoka text-xs md:text-sm text-foreground mt-1">
                  {card.word}
                </span>
              </div>
            </motion.div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex flex-col items-center gap-3 mt-2"
          >
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-fredoka text-lg shadow-lg">
              <Sparkles className="w-5 h-5" />
              You matched them all!
            </div>
            <Button onClick={reset} variant="outline" className="rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" /> Play again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!celebrate && (
        <Button onClick={reset} variant="ghost" size="sm" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" /> Reset
        </Button>
      )}
    </div>
  );
};

export default MatchingGame;
