import { motion } from 'motion/react';
import { cn } from './ui/utils';

interface ProgressRingProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({ 
  current, 
  total, 
  size = 200, 
  strokeWidth = 8,
  className 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current / total, 1);
  const strokeDashoffset = circumference - (progress * circumference);

  // Generate bead positions for mala visualization
  const beadCount = Math.min(total, 108); // Max 108 beads for traditional mala
  const beads = Array.from({ length: beadCount }, (_, i) => {
    const angle = (i / beadCount) * 2 * Math.PI - Math.PI / 2;
    const beadRadius = radius - strokeWidth / 2;
    const x = size / 2 + beadRadius * Math.cos(angle);
    const y = size / 2 + beadRadius * Math.sin(angle);
    return { x, y, completed: i < current };
  });

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Mala beads */}
        {beads.map((bead, index) => (
          <motion.circle
            key={index}
            cx={bead.x}
            cy={bead.y}
            r={2}
            fill="currentColor"
            className={bead.completed ? "text-primary" : "text-muted"}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.01, duration: 0.3 }}
          />
        ))}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {current}
          </div>
          <div className="text-sm text-muted-foreground">
            of {total}
          </div>
        </div>
      </div>
    </div>
  );
}