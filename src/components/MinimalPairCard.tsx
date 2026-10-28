import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";
import { speakPhoneticText } from "@/lib/speech";
import type { MinimalPair } from "@/data/minimalPairs";

interface Props { pair: MinimalPair & { sounds: [string, string] }; id: string }

const MinimalPairCard = ({ pair, id }: Props) => {
  const say = (word: string) => speakPhoneticText(word, { rate: 0.6, pitch: 1.05 });
  const items = [{ ...pair.a, sound: pair.sounds[0] }, { ...pair.b, sound: pair.sounds[1] }];
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4">
      <p className="font-fredoka text-lg sm:text-xl font-semibold text-welcome-ink">/{pair.sounds[0]}/ vs /{pair.sounds[1]}/</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full">
        {items.map((it) => (
          <motion.button
            key={it.word}
            whileTap={{ scale: 0.96 }}
            onClick={() => say(it.word)}
            aria-label={`Hear ${it.word}`}
            className="relative aspect-square rounded-[2rem] bg-card border border-border shadow-sm flex flex-col items-center justify-center gap-2 p-3"
          >
            <span className="text-[clamp(3rem,14vw,6rem)] leading-none">{it.image}</span>
            <span className="font-fredoka font-bold text-[clamp(1.4rem,5vw,2.4rem)] text-foreground">{it.word}</span>
            <span className="font-nunito text-sm text-muted-foreground">/{it.sound}/</span>
            <Volume2 className="absolute top-3 right-3 w-5 h-5 text-primary" />
          </motion.button>
        ))}
      </div>
      <VoiceRecorder itemId={id} />
    </div>
  );
};

export default MinimalPairCard;
