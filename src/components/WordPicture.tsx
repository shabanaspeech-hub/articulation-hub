import { useWordPhoto } from "@/lib/wordPhotos";
import { useState } from "react";
import { ImageOff } from "lucide-react";

/** Prefer bundled photographs; never crop the subject or replace it with an unrelated visual. */
const WordPicture = ({ word, emoji, className = "", emojiClass = "" }: { word: string; emoji?: string; className?: string; emojiClass?: string }) => {
  const photo = useWordPhoto(word);
  const [failed, setFailed] = useState<string | null>(null);
  if (photo && photo !== failed) return <img src={photo} alt={word} className={`object-contain bg-card ${className}`} loading="eager" decoding="async" onError={() => setFailed(photo)} />;
  if (photo === undefined) return <div className={`animate-pulse bg-card ${className}`} aria-label={`Loading ${word} picture`} />;
  return <div className={`flex items-center justify-center bg-card ${className}`} role="img" aria-label={`Photo unavailable for ${word}`}><ImageOff className="w-10 h-10 text-muted-foreground" /></div>;
};

export default WordPicture;
