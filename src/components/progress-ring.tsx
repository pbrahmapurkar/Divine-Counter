import { motion } from 'motion/react';
import { cn } from './ui/utils';
import { useId, useMemo } from 'react';

interface ProgressRingProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string; // optional accent color for the mala (beads + ring)
}

export function ProgressRing({
  current,
  total,
  size = 200,
  strokeWidth = 8,
  className,
  color,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current / total, 1);
  const strokeDashoffset = circumference - (progress * circumference);
  const gradientId = useId();

  // Derive a slightly darker color for the gradient end if a custom color is provided
  const { startColor, endColor } = useMemo(() => {
    function clamp(n: number) { return Math.max(0, Math.min(255, n)); }
    function hexToRgb(hex: string) {
      const m = hex.replace('#','');
      const n = m.length === 3 ? m.split('').map(c=>c+c).join('') : m;
      const r = parseInt(n.slice(0,2),16);
      const g = parseInt(n.slice(2,4),16);
      const b = parseInt(n.slice(4,6),16);
      return { r, g, b };
    }
    function darken(hex: string, pct = 0.15) {
      const {r,g,b} = hexToRgb(hex);
      const f = 1 - pct;
      return `rgb(${clamp(Math.round(r*f))}, ${clamp(Math.round(g*f))}, ${clamp(Math.round(b*f))})`;
    }
    if (color) {
      return { startColor: color, endColor: darken(color, 0.2) };
    }
    // Fallback to CSS variables
    return { startColor: 'var(--primary)', endColor: 'var(--primary-dark)' };
  }, [color]);

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
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
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
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="progress-milestone"
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
            fill={bead.completed ? (color || 'var(--primary)') : 'var(--border)'}
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
