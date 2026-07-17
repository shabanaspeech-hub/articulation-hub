import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Volume2 } from "lucide-react";
import SpeakingFace from "./SpeakingFace";
import type { MouthType } from "./MouthDiagram";
import { getPhonemeVideo } from "@/lib/phonemeVideos";

/**
 * PhonemeAvatar — pluggable articulation demonstrator.
 *
 * Providers (Phase 1 ships `video` + `svg`; Phase 2 will add `ai` / `3d`):
 *   - "video": real close-up clinician video (preferred)
 *   - "svg":   animated SVG SpeakingFace fallback
 *   - "ai":    reserved for HeyGen/D-ID/Synthesia (future)
 *   - "3d":    reserved for Ready Player Me / three.js (future)
 *
 * The component chooses the best available provider automatically:
 *   1. If a video is registered for the phoneme AND loads successfully → video.
 *   2. Otherwise → animated SVG.
 *
 * To swap the whole app to a different provider later, only this file needs
 * to change — every consumer just renders <PhonemeAvatar phoneme="P" ... />.
 */

export type AvatarProvider = "auto" | "video" | "svg" | "ai" | "3d";

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

  // Reset availability whenever the phoneme changes so a missing video for
  // one sound doesn't disable videos for the next.
  useEffect(() => {
    setVideoAvailable(!!video);
  }, [phoneme, video]);

  // Sync playback with the `speaking` prop (audio drives visual timing).
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoAvailable) return;
    if (speaking) {
      el.currentTime = 0;
      el.play().catch(() => {
        /* autoplay blocked — user tap will start it */
      });
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
      className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-accent/20 to-primary/10 shadow-xl border-4 border-accent/30"
      style={{ width: size, height: size }}
      aria-label={`Watch the ${phoneme} articulation`}
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
        <div className="w-full h-full flex items-center justify-center">
          <SpeakingFace
            type={mouthType}
            voicing={voicing}
            speaking={speaking}
            size={size - 20}
          />
        </div>
      )}

      {/* Play / speaker chip */}
      <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
        {useVideo ? <Play className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </div>

      {/* Subtle provider badge — helpful for QA, invisible-ish for kids */}
      <div className="absolute top-2 left-2 text-[9px] uppercase tracking-wide bg-background/70 backdrop-blur px-1.5 py-0.5 rounded-full text-muted-foreground">
        {useVideo ? "Video" : "Animated"}
      </div>
    </motion.button>
  );
};

export default PhonemeAvatar;
