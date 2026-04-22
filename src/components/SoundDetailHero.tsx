import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoundData } from "@/data/soundsData";
import { getIsolationIpaLabel } from "@/lib/speech";

interface SoundDetailHeroProps {
  color: SoundData["color"];
  displayName: string;
  isMotorMode: boolean;
  onPlay: () => void;
  sound: string;
}

const colorClasses = {
  blue: "from-sound-blue to-blue-400",
  green: "from-sound-green to-emerald-400",
  orange: "from-sound-orange to-amber-400",
  pink: "from-sound-pink to-rose-400",
  yellow: "from-sound-yellow to-yellow-300",
  teal: "from-sound-teal to-cyan-400",
};

const SoundDetailHero = ({ color, displayName, isMotorMode, onPlay, sound }: SoundDetailHeroProps) => {
  return (
    <section className="rounded-[2rem] border border-border bg-card px-5 py-6 text-center shadow-[var(--shadow-card)]">
      <div
        className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${colorClasses[color]} text-4xl font-fredoka text-primary-foreground shadow-lg`}
      >
        {sound}
      </div>

      <p className="text-sm font-nunito font-semibold text-muted-foreground">{displayName}</p>
      <h2 className="mt-1 font-fredoka text-5xl font-bold text-foreground md:text-6xl">{sound}</h2>
      <p className="mt-1 text-lg font-nunito text-primary">{getIsolationIpaLabel(sound)}</p>
      <p className="mx-auto mt-3 max-w-md text-sm font-nunito text-muted-foreground">
        {isMotorMode
          ? "Start with a slow isolated model, then move through the practice levels below."
          : "Listen to the isolated sound first, then move into syllables, words, and sentences."}
      </p>

      <div className="mt-5 flex justify-center">
        <Button onClick={onPlay} size="lg" className="rounded-2xl px-6 font-fredoka text-base">
          <Volume2 className="h-5 w-5" />
          Play sound
        </Button>
      </div>
    </section>
  );
};

export default SoundDetailHero;