import { useWordPhoto } from "@/lib/wordPhotos";
import { getWordImage } from "@/lib/wordImages";

/** Real photo for a word; local illustration then emoji only if no photo is reachable (e.g. offline). */
const WordPicture = ({ word, emoji, className = "", emojiClass = "" }: { word: string; emoji?: string; className?: string; emojiClass?: string }) => {
  const photo = useWordPhoto(word);
  if (photo) return <img src={photo} alt={word} className={`object-cover rounded-2xl ${className}`} loading="lazy" />;
  if (photo === undefined) return <div className={`animate-pulse rounded-2xl bg-muted ${className}`} aria-label={`Loading ${word} picture`} />;
  const local = getWordImage(word);
  if (local) return <img src={local} alt={word} className={`object-contain ${className}`} loading="lazy" />;
  return <span className={`leading-none drop-shadow-md ${emojiClass}`}>{emoji}</span>;
};

export default WordPicture;
