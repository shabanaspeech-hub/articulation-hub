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

const SoundDetail = () => {
  const { soundId } = useParams<{ soundId: string }>();
  const navigate = useNavigate();
  const { mode } = useAppMode();
  
  const sound = getSoundById(soundId || "");
  
  const [position, setPosition] = useState<Position>("initial");
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
    return words.length;
  }, [isSoundMovement, isSyllableLevel, isCVC, isMotorSequencing, syllables, cvcItems, sequenceCount, words]);

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

  return (
    <div style={toneStyle} className="relative isolate h-[100dvh] flex flex-col overflow-hidden">
      <img src={welcomeGarden} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover object-bottom" />
      {/* Header */}
      <header className="z-50 bg-background/70 backdrop-blur-lg border-b border-border shrink-0">
        <div className="container py-1.5 sm:py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </motion.div>
              
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-card flex items-center justify-center shadow-md">
                  <span className="font-fredoka text-2xl font-semibold text-primary">{sound.id.toLowerCase()}</span>
                </div>
                <div className="min-w-0">
                  <h1 className="font-fredoka text-lg sm:text-xl font-bold text-foreground truncate">
                    {sound.displayName} <span className="font-nunito text-sm font-bold text-muted-foreground">{getIpa(sound.id)}</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {isMotorMode ? "Motor Speech" : "Articulation"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isMotorMode && !isVowel && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={showPathway ? "default" : "outline"}
                    size="icon"
                    onClick={() => setShowPathway(!showPathway)}
                    className="rounded-xl"
                    title="Speech Motor Pathway"
                  >
                    🗺️
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" onClick={() => navigate("/")} className="rounded-xl">
                  <Home className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Pathway Sidebar */}
      <AnimatePresence>
        {showPathway && isMotorMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-card border-b border-border"
          >
            <div className="container py-2">
              <SpeechMotorPathway
                currentLevel={motorLevel}
                onLevelChange={(level) => {
                  handleMotorLevelChange(level);
                  setShowPathway(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Position Selector - only for word levels */}
      {isWordLevel && (
        <div className="container pt-2 shrink-0">
          <PositionSelector selectedPosition={position} onPositionChange={handlePositionChange} />
        </div>
      )}

      {/* Level Selector */}
      {!isVowel && <div className="container py-2 shrink-0">
        {isMotorMode ? (
          <MotorSpeechLevelSelector selectedLevel={motorLevel} onLevelChange={handleMotorLevelChange} />
        ) : (
          <LevelSelector selectedLevel={articulationLevel} onLevelChange={handleArticulationLevelChange} />
        )}
      </div>}

      {/* Main Practice Area — fills the remaining screen, no page scrolling */}
      <main className="flex-1 min-h-0 container flex flex-col items-center justify-start py-2 overflow-x-hidden overflow-y-auto">
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

      {/* Bottom Controls */}
      {!isSoundMovement && !isGames && totalItems > 0 && (
        <div className="shrink-0 bg-background/70 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)]">
          <div className="container py-2 flex items-center gap-3 sm:gap-6">
            <div className="flex-1 min-w-0">
              <ProgressBar current={currentIndex} total={totalItems} />
            </div>
            <NavigationControls
              onPrevious={handlePrevious}
              onNext={handleNext}
              onShuffle={handleShuffle}
              hasPrevious={currentIndex > 0}
              hasNext={currentIndex < totalItems - 1}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundDetail;
