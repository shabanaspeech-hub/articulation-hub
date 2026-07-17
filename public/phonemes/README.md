# Phoneme Videos

Drop close-up articulation videos in this folder. Each file must be named
after its phoneme (lowercase) and use `.mp4`:

```
public/phonemes/
  p.mp4      # /p/ bilabial stop
  b.mp4      # /b/ bilabial stop (voiced)
  m.mp4      # /m/ bilabial nasal
  t.mp4      # /t/ alveolar stop
  d.mp4      # /d/ alveolar stop (voiced)
  n.mp4      # /n/ alveolar nasal
  k.mp4      # /k/ velar stop
  g.mp4      # /g/ velar stop (voiced)
  f.mp4      # /f/ labiodental fricative
  v.mp4      # /v/ labiodental fricative (voiced)
  s.mp4      # /s/ alveolar fricative
  z.mp4      # /z/ alveolar fricative (voiced)
  h.mp4      # /h/ glottal fricative
  w.mp4      # /w/ labiovelar glide
  y.mp4      # /j/ palatal glide
  l.mp4      # /l/ lateral
  r.mp4      # /r/ rhotic
  j.mp4      # /dʒ/ postalveolar affricate (voiced)
  ch.mp4     # /tʃ/ postalveolar affricate (voiceless)
  sh.mp4     # /ʃ/ postalveolar fricative
  th.mp4     # /θ/ dental fricative
```

## Recording guidance for clinician videos

- 1080p or higher, close-up on the mouth (chin to nose).
- 4–8 seconds per clip; the player loops silently while the TTS speaks.
- Neutral background, even lighting on the lips and teeth.
- Encode as H.264 MP4 with `-movflags +faststart` for instant playback:
  ```
  ffmpeg -i raw.mov -vcodec libx264 -crf 22 -preset slow \
         -movflags +faststart -an public/phonemes/p.mp4
  ```
- Videos are muted by the player (audio comes from the TTS engine) — no
  need to record clean audio.

## Hosting on a CDN instead

If you'd rather host videos on a CDN (Cloudflare Stream, Lovable Assets,
YouTube, etc.), add entries to `PHONEME_VIDEO_OVERRIDES` in
`src/lib/phonemeVideos.ts`:

```ts
export const PHONEME_VIDEO_OVERRIDES = {
  P: { src: "https://cdn.example.com/p.mp4" },
  TH: { src: "https://cdn.example.com/th.mp4", poster: "..." },
};
```

## Missing videos

Any phoneme without a video file automatically falls back to the animated
SVG SpeakingFace, so the app never shows a broken player.
