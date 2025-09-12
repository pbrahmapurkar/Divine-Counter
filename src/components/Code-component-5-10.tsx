import { motion } from 'motion/react';
import { cn } from './ui/utils';

interface DivineLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function DivineLogo({ size = 80, className, animated = false }: DivineLogoProps) {
  const beadCount = 108;
  const beads = Array.from({ length: beadCount }, (_, i) => {
    const angle = (i / beadCount) * 2 * Math.PI;
    const radius = size * 0.45;
    const x = size / 2 + radius * Math.cos(angle);
    const y = size / 2 + radius * Math.sin(angle);
    return { x, y, angle };
  });

  const LogoContent = () => (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {/* Mala beads circle */}
        {beads.map((bead, index) => (
          <motion.circle
            key={index}
            cx={bead.x}
            cy={bead.y}
            r={size * 0.015}
            fill="currentColor"
            className="text-primary"
            initial={animated ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={animated ? { delay: index * 0.005, duration: 0.3 } : undefined}
          />
        ))}
        
        {/* Larger center bead */}
        <motion.circle
          cx={size / 2}
          cy={size * 0.05}
          r={size * 0.025}
          fill="currentColor"
          className="text-secondary"
          initial={animated ? { scale: 0 } : { scale: 1 }}
          animate={{ scale: 1 }}
          transition={animated ? { delay: 0.8, duration: 0.4 } : undefined}
        />
      </svg>

      {/* Lotus symbol in center */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={animated ? { scale: 0, rotate: -180 } : { scale: 1, rotate: 0 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={animated ? { delay: 1, duration: 0.6, ease: "easeOut" } : undefined}
      >
        <svg 
          width={size * 0.35} 
          height={size * 0.35} 
          viewBox="0 0 100 100" 
          className="text-primary"
          fill="currentColor"
        >
          {/* Lotus petals */}
          <path d="M50 20 C35 25, 35 35, 50 40 C65 35, 65 25, 50 20 Z" />
          <path d="M50 20 C45 35, 55 45, 70 40 C65 25, 55 15, 50 20 Z" />
          <path d="M50 20 C55 35, 45 45, 30 40 C35 25, 45 15, 50 20 Z" />
          <path d="M50 40 C35 45, 35 55, 50 60 C65 55, 65 45, 50 40 Z" />
          <path d="M50 40 C45 55, 55 65, 70 60 C65 45, 55 35, 50 40 Z" />
          <path d="M50 40 C55 55, 45 65, 30 60 C35 45, 45 35, 50 40 Z" />
          <path d="M50 60 C35 65, 35 75, 50 80 C65 75, 65 65, 50 60 Z" />
          <path d="M50 60 C45 75, 55 85, 70 80 C65 65, 55 55, 50 60 Z" />
          <path d="M50 60 C55 75, 45 85, 30 80 C35 65, 45 55, 50 60 Z" />
        </svg>
      </motion.div>
    </div>
  );

  return animated ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LogoContent />
    </motion.div>
  ) : (
    <LogoContent />
  );
}