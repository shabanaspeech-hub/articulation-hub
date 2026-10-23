import { SoundData } from "@/data/soundsData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getIpa } from "@/lib/ipa";

interface SoundCardProps {
  sound: SoundData;
  index: number;
  row: number;
}

const rowColors = ["text-welcome-violet", "text-welcome-amber", "text-welcome-coral", "text-welcome-rose", "text-welcome-blue", "text-welcome-green"];

const SoundCard = ({ sound, row }: SoundCardProps) => {
  const ipa = getIpa(sound.id);
  return (
    <Button asChild variant="ghost" className={`welcome-sound-tile h-auto aspect-square w-full min-w-0 flex-col gap-0.5 sm:gap-1.5 rounded-2xl sm:rounded-3xl p-1 sm:p-3 bg-welcome-tile hover:bg-welcome-tile transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 ${rowColors[row] ?? "text-welcome-blue"}`}>
      <Link to={`/sound/${sound.id}`} aria-label={`Practice ${sound.displayName}, IPA ${ipa}`}>
        <span className="font-fredoka text-[clamp(1.5rem,7vw,3.5rem)] font-semibold leading-none">{sound.displayName}</span>
        {ipa && <span className="font-nunito text-[clamp(0.65rem,2.4vw,0.95rem)] font-bold opacity-70 leading-none">{ipa}</span>}
      </Link>
    </Button>
  );
};

export default SoundCard;
