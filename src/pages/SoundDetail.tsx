import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { getSoundById, Position, PracticeLevel, MotorSpeechLevel, generateCV, generateCVCVTargets, generateVC, getCVCWords, SyllableItem } from "@/data/soundsData";
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

const SoundDetail = () => {
  const { soundId } = useParams<{ soundId: string }>();
  const navigate = useNavigate();
  const { mode } = useAppMode();
  
  const sound = getSoundById(soundId || "");
  
  const [position, setPosition] = useState<Position>("initial");
  const [articulationLevel, setArticulationLevel] = useState<PracticeLevel>("sound");
  const [motorLevel, setMotorLevel] = useState<MotorSpeechLevel>("sound-movement");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPathway, setShowPathway] = useState(false);

  const isMotorMode = mode === "motor-speech";
  const activeLevel = isMotorMode ? motorLevel : articulationLevel;

  const isSyllableLevel = activeLevel === "cv" || activeLevel === "cvcv" || activeLevel === "vc";
  const isSoundMovement = activeLevel === "sound-movement";
  const isIsolationLevel = activeLevel === "sound" || isSoundMovement;
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
    if (isIsolationLevel) return 1;
    if (isSyllableLevel) return syllables.length;
    if (isCVC) return cvcItems.length;
    if (isMotorSequencing) return sequenceCount;
    return words.length;
  }, [isIsolationLevel, isSyllableLevel, isCVC, isMotorSequencing, syllables, cvcItems, sequenceCount, words]);

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
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, totalItems]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleShuffle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * totalItems);
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

  const colorClasses = {
    blue: "from-sound-blue to-blue-400",
    green: "from-sound-green to-emerald-400",
    orange: "from-sound-orange to-amber-400",
    pink: "from-sound-pink to-rose-400",
    yellow: "from-sound-yellow to-yellow-300",
    teal: "from-sound-teal to-cyan-400",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </motion.div>
              
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[sound.color]} flex items-center justify-center shadow-md`}>
                  <span className="text-2xl">{sound.icon}</span>
                </div>
                <div>
                  <h1 className="font-fredoka text-xl font-bold text-foreground">
                    {sound.displayName}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {isMotorMode ? "Motor Speech Mode" : `Practice the "${sound.sound}" sound`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isMotorMode && (
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
        <div className="container py-4">
          <PositionSelector selectedPosition={position} onPositionChange={handlePositionChange} />
        </div>
      )}

      {/* Level Selector */}
      <div className="container pb-4 pt-2">
        {isMotorMode ? (
          <MotorSpeechLevelSelector selectedLevel={motorLevel} onLevelChange={handleMotorLevelChange} />
        ) : (
          <LevelSelector selectedLevel={articulationLevel} onLevelChange={handleArticulationLevelChange} />
        )}
      </div>

      {/* Main Practice Area */}
      <main className="flex-1 container flex flex-col items-center justify-center py-8 overflow-hidden">
        {isGames ? (
          <GamesView sound={sound} />
        ) : (
        <motion.div
          key={`swipe-${activeLevel}-${currentIndex}`}
          className="w-full flex flex-col items-center"
          drag={totalItems > 1 && !isIsolationLevel ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80 && currentIndex < totalItems - 1) {
              handleNext();
            } else if (info.offset.x > 80 && currentIndex > 0) {
              handlePrevious();
            }
          }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
        >
          {activeLevel === "sound" && (
            <SoundMovementCard
              key={`isolation-${sound.sound}`}
              sound={sound.sound}
              currentIndex={0}
            />
          )}
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
        )}
      </main>

      {/* Bottom Controls */}
      {!isIsolationLevel && !isGames && totalItems > 0 && (
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border">
          <div className="container py-4 space-y-4">
            <ProgressBar current={currentIndex} total={totalItems} />
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
