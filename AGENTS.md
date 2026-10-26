# Architecture rules

- Keep welcome-page presentation in Index and SoundCard; reuse existing mode context and sound routes so visual redesigns do not change clinical behavior.
- Keep vowel targets isolation-only through the shared SoundMovementCard and existing isolated video keys; do not generate consonant syllables or empty word levels for vowels.
- Route VC playback through target-keyed, explicitly phoneme-synthesized whole-syllable audio; never fall back to browser text interpretation, which can spell letters. Keep phoneme definitions in vcPhonemes and generated clips in the VC asset manifest, independent of other levels.
- Store welcome row grouping in soundRows independently of clinical sound colors so presentation changes preserve practice data and assets.