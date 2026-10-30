import { motion } from "framer-motion";
import { useEffect } from "react";
import { WordItem, PracticeLevel, SyllableItem, CVCItem, getSyllablePhonetic } from "@/data/soundsData";
import VoiceRecorder from "./VoiceRecorder";
import { speakPhoneticText } from "@/lib/speech";
import { getWordImage } from "@/lib/wordImages";
import { speakVCSyllable, stopVCSyllable } from "@/lib/vcSpeech";
import { cvcvAudioSources, cvcvClipKey, playClip } from "@/lib/cvcvAudio";


interface PracticeCardProps {
  word?: WordItem;
  syllable?: SyllableItem;
  cvcItem?: CVCItem;
  level: PracticeLevel;
  activeLevel?: string;
  soundLetter: string;
  position: string;
}

const PracticeCard = ({ word, syllable, cvcItem, level, activeLevel, soundLetter, position }: PracticeCardProps) => {
  const isSyllableLevel = level === "cv" || level === "cvcv" || level === "vc";
  useEffect(() => () => stopVCSyllable(), [syllable?.syllable, level]);
  // Grows with the screen (phone → iPad → desktop) but always leaves room for
  // header, tabs, recorder and next/prev so the page never needs scrolling.
  const textAbove = !!word && !isSyllableLevel && !cvcItem;
  const cardSizeClass = textAbove
    ? "w-[min(34rem,80vw,max(8rem,calc(100dvh-30rem)))] h-[min(34rem,80vw,max(8rem,calc(100dvh-30rem)))] [@media(max-height:640px)]:w-[min(26rem,42vw,max(7rem,calc(100dvh-20rem)))] [@media(max-height:640px)]:h-[min(26rem,42vw,max(7rem,calc(100dvh-20rem)))]"
    : "w-[min(34rem,80vw,max(9rem,calc(100dvh-25rem)))] h-[min(34rem,80vw,max(9rem,calc(100dvh-25rem)))] [@media(max-height:640px)]:w-[min(26rem,42vw,max(8rem,calc(100dvh-17rem)))] [@media(max-height:640px)]:h-[min(26rem,42vw,max(8rem,calc(100dvh-17rem)))]";



  const getDisplayText = () => {
    if (isSyllableLevel && syllable) return syllable.display;
    if (cvcItem) return cvcItem.display;
    if (!word) return "";
    switch (level) {
      case "words":
        return word.word;
      case "phrases":
        return word.phrase;
      case "sentences":
        return word.sentence;
      default:
        return "";
    }
  };

  const highlightSound = (text: string) => {
    const lowerText = text.toLowerCase();
    const lowerSound = soundLetter.toLowerCase();
    const index = lowerText.indexOf(lowerSound);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.slice(0, index)}
        <span className="text-primary font-bold">{text.slice(index, index + soundLetter.length)}</span>
        {text.slice(index + soundLetter.length)}
      </>
    );
  };


  const speakWord = async () => {
    if (level === "vc" && syllable) {
      if (await speakVCSyllable(syllable.syllable)) return;
      speakPhoneticText(getSyllablePhonetic(syllable.display.toLowerCase()), { rate: 0.55, pitch: 1.1, volume: 1 });
      return;
    }
    if (level === "cvcv" && syllable && cvcvAudioSources[cvcvClipKey(syllable.syllable)]) {
      if (await playClip(syllable.syllable)) return;
    }
    const text = getDisplayText();
    let speakText = text;
    
    if (isSyllableLevel && syllable) {
      const display = syllable.display.toLowerCase();
      const phonetic = getSyllablePhonetic(display);
      if (phonetic !== display) {
        speakText = phonetic;
      } else if (activeLevel === "cvcv" || level === "cvcv") {
        // For CVCV, split into halves and get phonetics
        const half = Math.floor(display.length / 2);
        const p1 = getSyllablePhonetic(display.slice(0, half));
        const p2 = getSyllablePhonetic(display.slice(half));
        speakText = `${p1} ${p2}`;
      }
    }
    
    speakPhoneticText(speakText, { rate: isSyllableLevel ? 0.55 : 0.75, pitch: 1.1, volume: 1 });
  };

  return (
    <motion.div
      className="max-w-full flex flex-col items-center gap-3 sm:gap-4 [@media(max-height:640px)_and_(orientation:landscape)]:flex-row [@media(max-height:640px)_and_(orientation:landscape)]:gap-6"
    >
      {/* Syllable mode: big text bubble instead of image */}


      {isSyllableLevel && syllable ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={speakWord}
          className="relative cursor-pointer"
          aria-label={`Tap to hear ${syllable.display}`}
        >
          <div className={`${cardSizeClass} rounded-3xl bg-gradient-to-br from-card to-primary/10 bg-card flex flex-col items-center justify-center shadow-lg border-4 border-primary/20`}>
            {syllable.image && (
              <span className="text-[clamp(2.5rem,8vmin,5rem)] mb-1 sm:mb-2">{syllable.image}</span>
            )}
            <span className="font-fredoka text-[clamp(3.5rem,14vmin,8rem)] font-bold text-primary">
              {syllable.display}
            </span>
          </div>
        </motion.button>
      ) : cvcItem ? (
        /* CVC word mode */
        <motion.button
          whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
          whileTap={{ scale: 0.9 }}
          onClick={speakWord}
          className="relative cursor-pointer"
          aria-label={`Tap to hear ${cvcItem.display}`}
        >
          <div className={`${cardSizeClass} [container-type:size] rounded-3xl bg-card flex flex-col items-center justify-center shadow-lg border-4 border-primary/20 overflow-hidden`}>
            {(() => {
              const img = getWordImage(cvcItem.word);
              return img ? (
                <img src={img} alt={cvcItem.display} className="w-[78%] h-[70%] object-contain drop-shadow-md" loading="lazy" />
              ) : (
                <span className="text-[length:58cqmin] leading-none drop-shadow-md">{cvcItem.image}</span>
              );
            })()}
            <span className="font-fredoka text-[clamp(1.5rem,5vmin,2.5rem)] font-bold text-primary mt-1">{cvcItem.display}</span>
          </div>
        </motion.button>
      ) : word ? (
        /* Word/Phrase/Sentence mode: image with tap-to-hear */
        <motion.button
          whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
          whileTap={{ scale: 0.9 }}
          onClick={speakWord}
          className="relative cursor-pointer flex flex-col items-center gap-2"
          aria-label={`Tap to hear ${getDisplayText()}`}
        >
          <span className="font-fredoka text-2xl md:text-3xl font-bold text-foreground text-center px-2 leading-snug">
            {highlightSound(getDisplayText())}
          </span>
          <div className={`${cardSizeClass} [container-type:size] rounded-3xl bg-card flex items-center justify-center shadow-lg border-4 border-primary/10 overflow-hidden`}>
            {(() => {
              const img = getWordImage(word.word);
              return img ? (
                <img src={img} alt={word.word} className="w-[88%] h-[88%] object-contain drop-shadow-md" loading="lazy" />
              ) : (
                <span className="text-[length:70cqmin] leading-none drop-shadow-md">{word.image}</span>
              );
            })()}
          </div>

          <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-primary/20 blur-xl" />
        </motion.button>
      ) : null}

      {/* Voice Recorder — saves per-target so parents can reuse familiar voices */}
      <div className="w-[min(20rem,85vw)]">
      <VoiceRecorder
        label="Record your voice"
        storageKey={`practice:${soundLetter}:${level}:${position}:${
          syllable?.display || cvcItem?.word || word?.word || ""
        }`}
      />
      </div>
    </motion.div>
  );
};

export default PracticeCard;