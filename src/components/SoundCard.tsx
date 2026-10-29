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
    <Button asChild variant="ghost" className={`welcome-sound-tile h-full w-full min-w-0 min-h-0 flex-col gap-0.5 rounded-2xl p-1 overflow-hidden bg-welcome-tile hover:bg-welcome-tile transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 ${rowColors[row] ?? "text-welcome-ink"}`}>
      <Link to={`/sound/${sound.id}`} aria-label={`Practice ${letter} sound, ${ipa}`}>
        <span className="welcome-sound-letter font-fredoka font-semibold leading-none">{letter}</span>
        {ipa && <span className="welcome-sound-ipa font-nunito font-semibold opacity-60 leading-none">{ipa}</span>}
      </Link>
    </Button>
  );
};

export default SoundCard;
