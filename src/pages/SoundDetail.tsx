import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { getSoundById, Position, PracticeLevel, WordItem } from "@/data/soundsData";
import { Button } from "@/components/ui/button";
import PositionSelector from "@/components/PositionSelector";
import LevelSelector from "@/components/LevelSelector";
import PracticeCard from "@/components/PracticeCard";
import ProgressBar from "@/components/ProgressBar";
import NavigationControls from "@/components/NavigationControls";

const SoundDetail = () => {
  const { soundId } = useParams<{ soundId: string }>();
  const navigate = useNavigate();
  
  const sound = getSoundById(soundId || "");
  
  const [position, setPosition] = useState<Position>("initial");
  const [level, setLevel] = useState<PracticeLevel>("words");
  const [currentIndex, setCurrentIndex] = useState(0);

  const words = useMemo(() => {
    if (!sound) return [];
    return sound.words[position];
  }, [sound, position]);

  const currentWord = words[currentIndex];

  const handlePositionChange = useCallback((newPosition: Position) => {
    setPosition(newPosition);
    setCurrentIndex(0);
  }, []);

  const handleLevelChange = useCallback((newLevel: PracticeLevel) => {
    setLevel(newLevel);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, words.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleShuffle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentIndex(randomIndex);
  }, [words.length]);

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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </motion.div>
              
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[sound.color]} flex items-center justify-center shadow-md`}
                >
                  <span className="text-2xl">{sound.icon}</span>
                </div>
                <div>
                  <h1 className="font-fredoka text-xl font-bold text-foreground">
                    {sound.displayName}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Practice the "{sound.sound}" sound
                  </p>
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/")}
                className="rounded-xl"
              >
                <Home className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Position Selector */}
      <div className="container py-4">
        <PositionSelector
          selectedPosition={position}
          onPositionChange={handlePositionChange}
        />
      </div>

      {/* Level Selector */}
      <div className="container pb-4">
        <LevelSelector selectedLevel={level} onLevelChange={handleLevelChange} />
      </div>

      {/* Main Practice Area */}
      <main className="flex-1 container flex flex-col items-center justify-center py-8">
        <AnimatePresence mode="wait">
          {currentWord && (
            <PracticeCard
              key={`${position}-${currentIndex}`}
              word={currentWord}
              level={level}
              soundLetter={sound.sound}
              position={position}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Controls */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="container py-4 space-y-4">
          <ProgressBar current={currentIndex} total={words.length} />
          
          <NavigationControls
            onPrevious={handlePrevious}
            onNext={handleNext}
            onShuffle={handleShuffle}
            hasPrevious={currentIndex > 0}
            hasNext={currentIndex < words.length - 1}
          />
        </div>
      </div>
    </div>
  );
};

export default SoundDetail;
