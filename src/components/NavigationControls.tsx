import { forwardRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const NavigationControls = forwardRef<HTMLDivElement, NavigationControlsProps>(({ 
  onPrevious,
  onNext,
  onShuffle,
  hasPrevious,
  hasNext,
}, ref) => {
  return (
    <div ref={ref} className="flex items-center justify-center gap-4">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="lg"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="w-14 h-14 rounded-2xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="lg"
          onClick={onShuffle}
          className="w-14 h-14 rounded-2xl"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="default"
          size="lg"
          onClick={onNext}
          disabled={!hasNext}
          className="w-14 h-14 rounded-2xl gradient-primary border-0"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
});

NavigationControls.displayName = "NavigationControls";

export default NavigationControls;
