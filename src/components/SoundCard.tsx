import { SoundData } from "@/data/soundsData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SoundCardProps {
  sound: SoundData;
  index: number;
}

const colorClasses: Record<SoundData["color"], string> = {
  blue: "text-welcome-blue",
  green: "text-welcome-green",
  orange: "text-welcome-coral",
  pink: "text-welcome-coral",
  yellow: "text-welcome-green",
  teal: "text-welcome-blue",
};

const SoundCard = ({ sound }: SoundCardProps) => {

  return (
    <Button asChild variant="ghost" className={`welcome-sound-tile h-auto aspect-square w-full min-w-0 flex-col gap-2 rounded-2xl p-2 sm:p-4 bg-welcome-tile hover:bg-welcome-tile ${colorClasses[sound.color]}`}>
      <Link to={`/sound/${sound.id}`} aria-label={`Practice ${sound.displayName}`}>
        <span className="font-fredoka text-5xl sm:text-6xl font-medium leading-none lowercase">{sound.sound}</span>
        <span className="text-xs sm:text-sm font-nunito font-bold text-welcome-ink">{sound.displayName}</span>
      </Link>
    </Button>
  );
};

export default SoundCard;
