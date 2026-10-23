import { SoundData } from "@/data/soundsData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SoundCardProps {
  sound: SoundData;
  index: number;
  row: number;
}

const rowColors = ["text-welcome-violet", "text-welcome-amber", "text-welcome-coral", "text-welcome-rose", "text-welcome-blue", "text-welcome-green"];

const SoundCard = ({ sound, row }: SoundCardProps) => {

  return (
    <Button asChild variant="ghost" className={`welcome-sound-tile h-auto aspect-square w-full min-w-0 flex-col gap-1 sm:gap-2 rounded-2xl p-1 sm:p-4 bg-welcome-tile hover:bg-welcome-tile ${rowColors[row] ?? "text-welcome-blue"}`}>
      <Link to={`/sound/${sound.id}`} aria-label={`Practice ${sound.displayName}`}>
        <span className="font-fredoka text-3xl sm:text-6xl font-medium leading-none lowercase">{sound.sound}</span>
        <span className="text-xs sm:text-sm font-nunito font-bold">{sound.displayName}</span>
      </Link>
    </Button>
  );
};

export default SoundCard;
