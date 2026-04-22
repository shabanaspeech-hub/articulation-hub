import { forwardRef } from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(({ current, total }, ref) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <div ref={ref} className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-nunito text-muted-foreground">Progress</span>
        <span className="text-sm font-fredoka font-semibold text-foreground">
          {current + 1} / {total}
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full gradient-primary rounded-full"
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
