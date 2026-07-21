import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Volume2, Video } from "lucide-react";
import MouthDiagram, { type MouthType } from "./MouthDiagram";
import { getPhonemeVideo } from "@/lib/phonemeVideos";

/**
 * PhonemeAvatar — pluggable articulation demonstrator.
 *
 * Providers (Phase 1 ships `video` + `diagram`; Phase 2 will add `ai` / `3d`):
 *   - "video":   real close-up clinician video (preferred)
 *   - "diagram": clean, calm placement diagram fallback (no blinking face)
 *
 * Chooses the best available provider automatically:
 *   1. If a video is registered AND loads successfully → video.
 *   2. Otherwise → static-feel placement diagram.
 */

export type AvatarProvider = "auto" | "video" | "diagram" | "ai" | "3d";

interface PhonemeAvatarProps {
  phoneme: string;
  mouthType: MouthType;
  voicing: "voiced" | "voiceless" | "nasal";
  speaking: boolean;
  onTap?: () => void;
  provider?: AvatarProvider;
  size?: number;
}

const PhonemeAvatar = ({
  phoneme,
  mouthType,
  voicing,
  speaking,
  onTap,
  provider = "auto",
  size = 220,
}: PhonemeAvatarProps) => {
  const video = getPhonemeVideo(phoneme);
  const [videoAvailable, setVideoAvailable] = useState<boolean>(!!video);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setVideoAvailable(!!video);
  }, [phoneme, video]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoAvailable) return;
    if (speaking) {
      el.currentTime = 0;
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [speaking, videoAvailable]);

  const useVideo =
    (provider === "auto" || provider === "video") && videoAvailable && video;

  return (
    <motion.button
      onClick={onTap}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      animate={speaking ? { boxShadow: "0 0 0 6px hsl(var(--primary) / 0.25)" } : { boxShadow: "0 0 0 0px hsl(var(--primary) / 0)" }}
      className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-accent/20 to-primary/10 shadow-xl border-4 border-accent/30 flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`Hear and see the ${phoneme} sound`}
    >
      {useVideo ? (
        <video
          ref={videoRef}
          src={video!.src}
          poster={video!.poster}
          muted
          playsInline
          preload="metadata"
          loop
          onError={() => setVideoAvailable(false)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center px-2">
          <MouthDiagram type={mouthType} voicing={voicing} />
          <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
            <Video className="w-3 h-3" /> Add real video
          </span>
        </div>
      )}

      <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
        {useVideo ? <Play className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </div>
    </motion.button>
  );
};

export default PhonemeAvatar;
