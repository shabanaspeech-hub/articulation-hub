import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { getSoundById, Position, PracticeLevel, MotorSpeechLevel, generateCV, generateCVCVTargets, generateVC, getCVCWords, SyllableItem, soundRows } from "@/data/soundsData";
import welcomeGarden from "@/assets/welcome-garden.jpg";
import { Button } from "@/components/ui/button";
import PositionSelector from "@/components/PositionSelector";
import LevelSelector from "@/components/LevelSelector";
import MotorSpeechLevelSelector from "@/components/MotorSpeechLevelSelector";
import PracticeCard from "@/components/PracticeCard";
import ProgressBar from "@/components/ProgressBar";
import NavigationControls from "@/components/NavigationControls";
import SoundMovementCard from "@/components/SoundMovementCard";
import MotorSequencingCard from "@/components/MotorSequencingCard";
import SpeechMotorPathway from "@/components/SpeechMotorPathway";
import GamesView from "@/components/games/GamesView";
import { useAppMode } from "@/contexts/AppModeContext";
import { generateSequences } from "@/components/MotorSequencingCard";
import { getIpa } from "@/lib/ipa";
import MinimalPairCard from "@/components/MinimalPairCard";
import { getMinimalPairs } from "@/data/minimalPairs";

const SoundDetail = () => {
  const { soundId } = useParams<{ soundId: string }>();
  const navigate = useNavigate();
  const { mode } = useAppMode();
  
  const sound = getSoundById(soundId || "");
  
  const [position, setPosition] = useState<Position>("initial");
  const [phoneMenu, setPhoneMenu] = useState(false);
  const [articulationLevel, setArticulationLevel] = useState<PracticeLevel>("cv");
  const [motorLevel, setMotorLevel] = useState<MotorSpeechLevel>("sound-movement");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showPathway, setShowPathway] = useState(false);

  const isMotorMode = mode === "motor-speech";
  const isVowel = sound?.kind === "vowel";
  const activeLevel = isVowel ? "sound-movement" : isMotorMode ? motorLevel : articulationLevel;

  const isSyllableLevel = activeLevel === "cv" || activeLevel === "cvcv" || activeLevel === "vc";
  const isSoundMovement = activeLevel === "sound-movement";
  const isMotorSequencing = activeLevel === "motor-sequencing";
  const isCVC = activeLevel === "cvc";
  const isWordLevel = activeLevel === "words" || activeLevel === "phrases" || activeLevel === "sentences";
  const isGames = activeLevel === "games";
  const isPairs = activeLevel === "minimal-pairs";
  const pairs = useMemo(() => (sound && isPairs ? getMinimalPairs(sound.id) : []), [sound, isPairs]);

  const syllables = useMemo(() => {
    if (!sound) return [];
    if (activeLevel === "cv") return generateCV(sound.sound);
    if (activeLevel === "cvcv") return generateCVCVTargets(sound.sound);
    if (activeLevel === "vc") return generateVC(sound.sound);
    return [];
  }, [sound, activeLevel]);

  const cvcItems = useMemo(() => {
    if (!sound || !isCVC) return [];
    return getCVCWords(sound.sound);
  }, [sound, isCVC]);

  const sequenceCount = useMemo(() => {
    if (!sound || !isMotorSequencing) return 0;
    return generateSequences(sound.sound).length;
  }, [sound, isMotorSequencing]);

  const words = useMemo(() => {
    if (!sound) return [];
    return sound.words[position];
  }, [sound, position]);

  const totalItems = useMemo(() => {
    if (isSoundMovement) return 1;
    if (isSyllableLevel) return syllables.length;
    if (isCVC) return cvcItems.length;
    if (isMotorSequencing) return sequenceCount;
    if (isPairs) return pairs.length;
    return words.length;
  }, [isSoundMovement, isSyllableLevel, isCVC, isMotorSequencing, isPairs, pairs, syllables, cvcItems, sequenceCount, words]);

  const currentWord = isWordLevel ? words[currentIndex] : null;
  const currentSyllable = isSyllableLevel ? syllables[currentIndex] : null;

  const handlePositionChange = useCallback((newPosition: Position) => {
    setPosition(newPosition);
    setCurrentIndex(0);
  }, []);

  const handleArticulationLevelChange = useCallback((newLevel: PracticeLevel) => {
    setArticulationLevel(newLevel);
    setCurrentIndex(0);
  }, []);

  const handleMotorLevelChange = useCallback((newLevel: MotorSpeechLevel) => {
    setMotorLevel(newLevel);
    setCurrentIndex(0);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < totalItems - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, totalItems]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleShuffle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * totalItems);
    setDirection(1);
    setCurrentIndex(randomIndex);
  }, [totalItems]);

  if (!sound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-fredoka text-2xl mb-4">Sound not found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  // Same 3-colour family as the home page rows (ink, ink, coral, coral, green, green).
  const rowIndex = soundRows.findIndex(ids => ids.includes(sound.id));
  const toneVar = ["--welcome-ink", "--welcome-ink", "--welcome-coral", "--welcome-coral", "--welcome-green", "--welcome-green"][rowIndex] ?? "--welcome-ink";
  const toneStyle = {
    "--primary": `var(${toneVar})`,
    "--ring": `var(${toneVar})`,
    "--gradient-primary": `linear-gradient(135deg, hsl(var(${toneVar})), hsl(var(${toneVar}) / 0.8))`,
  } as React.CSSProperties;

  const railLevels: { key: string; label: string }[] = isMotorMode
    ? [
        { key: "sound-movement", label: "movement" }, { key: "cv", label: "cv" }, { key: "vc", label: "vc" },
        { key: "cvcv", label: "cvcv" }, { key: "cvc", label: "cvc" }, { key: "motor-sequencing", label: "sequencing" },
        { key: "words", label: "words" }, { key: "phrases", label: "phrases" }, { key: "sentences", label: "sentences" },
        { key: "minimal-pairs", label: "pairs" },
      ]
    : [
        { key: "sound-movement", label: "sound" }, { key: "cv", label: "cv" }, { key: "cvcv", label: "cvcv" },
        { key: "words", label: "words" }, { key: "phrases", label: "phrases" }, { key: "sentences", label: "sentences" },
        { key: "minimal-pairs", label: "pairs" }, { key: "games", label: "games" },
      ];
  const pill = (active: boolean) =>
    `w-full rounded-full px-2 py-1 sm:py-1.5 font-fredoka font-semibold text-xs sm:text-base lg:text-lg leading-tight transition-all ${
      active ? "bg-card text-primary shadow-md" : "bg-card/40 text-primary/70 hover:bg-card/70"
    }`;

  return (
    <div style={toneStyle} className="relative isolate h-[100dvh] flex flex-row overflow-hidden [--stage-w:calc(100vw-7.5rem)] max-[499px]:[--stage-w:100vw] sm:[--stage-w:calc(100vw-13rem)] lg:[--stage-w:calc(100vw-16rem)]">
      {/* Phone only: compact level menu pill + popup sheet (rail hidden on phones) */}
      <button
        onClick={() => setPhoneMenu(true)}
        className="hidden max-[499px]:flex absolute right-2 top-2 z-50 items-center gap-1 rounded-full bg-card text-primary font-fredoka font-semibold text-sm px-3 py-1.5 shadow-lg"
      >
        <span className="text-lg font-bold leading-none">{sound.id.toLowerCase()}</span>
        <span>· {isWordLevel ? `${position} · ` : ""}{railLevels.find(l => l.key === activeLevel)?.label ?? "levels"} ▾</span>
      </button>
      {phoneMenu && (
        <div className="fixed inset-0 z-[60] flex items-end bg-foreground/40" onClick={() => setPhoneMenu(false)}>
          <div className="w-full rounded-t-3xl bg-card p-4 pb-6 shadow-2xl max-h-[85dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-baseline justify-center gap-2 mb-3">
              <span className="font-fredoka font-bold text-primary text-4xl leading-none">{sound.id.toLowerCase()}</span>
              <span className="font-nunito font-bold text-primary/80 text-lg">{getIpa(sound.id)}</span>
            </div>
            {isWordLevel && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {(["initial", "medial", "final"] as Position[]).map((p) => (
                  <button key={p} onClick={() => { handlePositionChange(p); setPhoneMenu(false); }}
                    className={`rounded-full py-2 font-fredoka font-semibold ${position === p ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>{p}</button>
                ))}
              </div>
            )}
            {!isVowel && (
              <div className="grid grid-cols-2 gap-2">
                {railLevels.map((l) => (
                  <button key={l.key}
                    onClick={() => { isMotorMode ? handleMotorLevelChange(l.key as MotorSpeechLevel) : handleArticulationLevelChange(l.key as PracticeLevel); setPhoneMenu(false); }}
                    className={`rounded-full py-2.5 font-fredoka font-semibold ${activeLevel === l.key ? "bg-primary text-primary-foreground shadow-md" : "bg-primary/10 text-primary"}`}>{l.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {!isSoundMovement && !isGames && totalItems > 0 && (
        <div className="hidden max-[499px]:flex absolute bottom-2 left-1/2 -translate-x-1/2 z-40 items-center gap-3 rounded-full bg-card/90 px-3 py-1 shadow-lg">
          <button aria-label="Previous" disabled={currentIndex === 0} onClick={handlePrevious} className="w-9 h-9 rounded-full bg-card text-primary font-bold text-lg shadow disabled:opacity-40">‹</button>
          <span className="font-fredoka font-semibold text-primary text-sm">{currentIndex + 1}/{totalItems}</span>
          <button aria-label="Next" disabled={currentIndex >= totalItems - 1} onClick={handleNext} className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow disabled:opacity-40">›</button>
          <button onClick={handleShuffle} className="text-xs font-nunito font-semibold text-primary/80 underline">shuffle</button>
        </div>
      )}
      <img src={welcomeGarden} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover object-bottom" />

      {/* Done button — top-left, like Articulation Station */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate("/")}
        className="absolute left-2 top-2 sm:left-4 sm:top-4 z-50 rounded-full bg-primary text-primary-foreground font-fredoka font-semibold text-sm sm:text-lg px-3 py-1.5 sm:px-5 sm:py-3 shadow-lg"
      >
        done
      </motion.button>

      {/* Main Practice Area — giant flashcard */}
      <main className="flex-1 min-w-0 min-h-0 flex flex-col items-center justify-center py-2 pl-2 max-[499px]:px-2 max-[499px]:pt-12 max-[499px]:pb-14 sm:pl-24 lg:pl-28 overflow-x-hidden overflow-y-auto">
        {showPathway && isMotorMode && (
          <div className="w-full max-w-3xl mb-2 rounded-2xl bg-card p-2 shadow-lg">
            <SpeechMotorPathway currentLevel={motorLevel} onLevelChange={(level) => { handleMotorLevelChange(level); setShowPathway(false); }} />
          </div>
        )}
        {isGames ? (
          <GamesView sound={sound} />
        ) : (
        <AnimatePresence mode="popLayout" initial={true} custom={direction}>
        <motion.div
          key={`swipe-${activeLevel}-${position}-${currentIndex}`}
          custom={direction}
          className="w-full flex flex-col items-center my-auto"
          drag={totalItems > 1 && !isSoundMovement ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, info) => {
            const swipe = info.offset.x + info.velocity.x * 0.2;
            if (swipe < -80 && currentIndex < totalItems - 1) {
              handleNext();
            } else if (swipe > 80 && currentIndex > 0) {
              handlePrevious();
            }
          }}
          variants={{
            // Flashcard "fly": card swoops in tilted from the side and settles.
            enter: (d: number) => ({ x: d >= 0 ? "60vw" : "-60vw", y: 30, rotate: d >= 0 ? 14 : -14, scale: 0.7, opacity: 0 }),
            center: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
            exit: (d: number) => ({ x: d >= 0 ? "-60vw" : "60vw", y: -20, rotate: d >= 0 ? -14 : 14, scale: 0.7, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        >
          {isSoundMovement && (
            <SoundMovementCard
              key={`movement-${sound.sound}`}
              sound={sound.sound}
              currentIndex={currentIndex}
            />
          )}
          {isSyllableLevel && currentSyllable && (
            <PracticeCard
              key={`syllable-${activeLevel}-${currentIndex}`}
              syllable={currentSyllable}
              level={activeLevel as PracticeLevel}
              activeLevel={activeLevel}
              soundLetter={sound.sound}
              position={position}
            />
          )}
          {isCVC && cvcItems[currentIndex] && (
            <PracticeCard
              key={`cvc-${currentIndex}`}
              cvcItem={cvcItems[currentIndex]}
              level={"words" as PracticeLevel}
              soundLetter={sound.sound}
              position={position}
            />
          )}
          {isMotorSequencing && (
            <MotorSequencingCard
              key={`seq-${currentIndex}`}
              sound={sound.sound}
              currentIndex={currentIndex}
            />
          )}
          {isPairs && pairs[currentIndex] && (
            <MinimalPairCard key={`pair-${currentIndex}`} pair={pairs[currentIndex]} id={`pair-${sound.id}-${currentIndex}`} />
          )}
          {isPairs && pairs.length === 0 && (
            <p className="font-nunito text-muted-foreground text-center p-8">No minimal pairs for this sound yet. Pairs: p/b, m/n, l/r, r/v, k/t, g/d, sh/s.</p>
          )}
          {isWordLevel && currentWord && (
            <PracticeCard
              key={`${position}-${currentIndex}`}
              word={currentWord}
              level={activeLevel as PracticeLevel}
              soundLetter={sound.sound}
              position={position}
            />
          )}
        </motion.div>
        </AnimatePresence>
        )}
      </main>

      {/* Right side rail — sound, positions, levels, next/prev (Articulation Station style) */}
      <aside className="max-[499px]:hidden shrink-0 w-[6.5rem] sm:w-36 lg:w-44 h-full flex flex-col items-stretch gap-1.5 sm:gap-2 py-2 sm:py-4 pr-2 sm:pr-4 overflow-y-auto [scrollbar-width:none]">
        <div className="flex items-baseline justify-center gap-1.5 py-1">
          <span className="font-fredoka font-bold text-primary text-3xl sm:text-5xl leading-none">{sound.id.toLowerCase()}</span>
          <span className="font-nunito font-bold text-primary/80 text-sm sm:text-xl">{getIpa(sound.id)}</span>
        </div>

        {isWordLevel && (["initial", "medial", "final"] as Position[]).map((p) => (
          <button key={p} onClick={() => handlePositionChange(p)} className={pill(position === p)}>{p}</button>
        ))}

        {!isVowel && (
          <div className="mt-1 flex flex-col gap-1 sm:gap-1.5 rounded-2xl bg-primary/10 p-1 sm:p-1.5">
            {railLevels.map((l) => (
              <button
                key={l.key}
                onClick={() => isMotorMode ? handleMotorLevelChange(l.key as MotorSpeechLevel) : handleArticulationLevelChange(l.key as PracticeLevel)}
                className={`w-full rounded-full px-1 py-1 font-fredoka font-semibold text-[0.7rem] sm:text-sm lg:text-base leading-tight transition-all ${
                  activeLevel === l.key ? "bg-primary text-primary-foreground shadow-md" : "text-primary hover:bg-card/70"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}

        {isMotorMode && !isVowel && (
          <button onClick={() => setShowPathway(!showPathway)} className={pill(showPathway)} title="Speech Motor Pathway">🗺️ path</button>
        )}

        {!isSoundMovement && !isGames && totalItems > 0 && (
          <div className="mt-auto flex flex-col items-center gap-1.5 pt-2">
            <span className="font-fredoka font-semibold text-primary text-sm sm:text-base">{currentIndex + 1}/{totalItems}</span>
            <div className="flex gap-1 sm:gap-2">
              <button aria-label="Previous" disabled={currentIndex === 0} onClick={handlePrevious} className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-card text-primary font-bold text-lg shadow-md disabled:opacity-40">‹</button>
              <button aria-label="Next" disabled={currentIndex >= totalItems - 1} onClick={handleNext} className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-md disabled:opacity-40">›</button>
            </div>
            <button onClick={handleShuffle} className="text-xs sm:text-sm font-nunito font-semibold text-primary/80 underline">shuffle</button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default SoundDetail;
