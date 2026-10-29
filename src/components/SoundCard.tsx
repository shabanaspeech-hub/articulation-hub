import { SoundData } from "@/data/soundsData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getIpa } from "@/lib/ipa";

interface SoundCardProps {
  sound: SoundData;
  index: number;
  row: number;
}

const rowColors = ["text-welcome-ink", "text-welcome-ink", "text-welcome-coral", "text-welcome-coral", "text-welcome-green", "text-welcome-green"];

const SoundCard = ({ sound, row }: SoundCardProps) => {
  const ipa = getIpa(sound.id).replace(/^\[|\]$/g, "/");
  const letter = sound.id.toLowerCase();
  return (
    <Button asChild variant="ghost" className={`welcome-sound-tile h-auto aspect-square w-full min-w-0 flex-col gap-0.5 sm:gap-1.5 rounded-2xl sm:rounded-3xl p-1 sm:p-3 bg-welcome-tile hover:bg-welcome-tile transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 ${rowColors[row] ?? "text-welcome-ink"}`}>
      <Link to={`/sound/${sound.id}`} aria-label={`Practice ${letter} sound, ${ipa}`}>
        <span className="font-fredoka text-[clamp(1.6rem,min(9vw,6dvh),4.5rem)] font-semibold leading-none">{letter}</span>
        {ipa && <span className="font-nunito text-[clamp(0.6rem,min(2.6vw,1.8dvh),1.1rem)] font-semibold opacity-60 leading-none">{ipa}</span>}
      </Link>
    </Button>
  );
};

export default SoundCard;
