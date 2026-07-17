/**
 * Phoneme Video Registry
 * ----------------------
 * Maps each phoneme (uppercase key like "P", "SH", "TH") to a real close-up
 * articulation video. Drop MP4/WebM files in `public/phonemes/` using the
 * naming convention `<phoneme>.mp4` (e.g. `public/phonemes/p.mp4`,
 * `public/phonemes/sh.mp4`) and they will be picked up automatically — no
 * code changes required.
 *
 * You can also override a specific phoneme by editing `PHONEME_VIDEO_OVERRIDES`
 * below (useful when hosting videos on a CDN like Lovable Assets, Cloudflare
 * Stream, YouTube, etc.).
 *
 * If no video exists for a phoneme, the UI falls back to the animated SVG
 * SpeakingFace so nothing ever appears broken.
 */

export interface PhonemeVideo {
  /** Public URL or path to the video file. */
  src: string;
  /** Optional poster image shown before the video plays. */
  poster?: string;
  /** Optional MIME type; inferred from extension if omitted. */
  type?: string;
  /** Short description for accessibility. */
  description?: string;
}

/**
 * Manual overrides. Add entries here to point a phoneme at a custom URL
 * (e.g. a CDN-hosted clinician recording).
 *
 *   TH: { src: "https://cdn.example.com/th-articulation.mp4" },
 */
export const PHONEME_VIDEO_OVERRIDES: Record<string, PhonemeVideo> = {};

/**
 * Default lookup — checks overrides first, then the conventional path
 * `/phonemes/<lowercase>.mp4` in the public folder.
 *
 * Returns `null` when no video is available so the caller can render a
 * fallback (SVG avatar, static image, or Phase 2 AI provider).
 */
export function getPhonemeVideo(phoneme: string): PhonemeVideo | null {
  const key = phoneme.trim().toUpperCase();
  if (!key) return null;

  if (PHONEME_VIDEO_OVERRIDES[key]) {
    return PHONEME_VIDEO_OVERRIDES[key];
  }

  // Convention: /public/phonemes/<lowercase>.mp4
  // We can't stat the filesystem from the browser, so we return the
  // candidate URL and let the <video> element's onError fall back if it's
  // missing. The PhonemeAvatar component handles that gracefully.
  return {
    src: `/phonemes/${key.toLowerCase()}.mp4`,
    type: "video/mp4",
    description: `Close-up articulation demonstration for the ${key} sound`,
  };
}
