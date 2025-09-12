import { motion } from 'motion/react';
import { cn } from './ui/utils';

interface CounterButtonProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  className?: string;
}

export function CounterButton({ 
  count, 
  onIncrement, 
  onDecrement, 
  disabled = false,
  className 
}: CounterButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative w-48 h-48 rounded-full bg-gradient-to-b from-card to-card/80 border-2 border-primary/20 shadow-lg",
        "flex items-center justify-center transition-all duration-200 active:scale-95",
        "hover:shadow-xl hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      onClick={onIncrement}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Lotus pattern background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100" className="text-primary" fill="currentColor">
          <path d="M50 20 C35 25, 35 35, 50 40 C65 35, 65 25, 50 20 Z" />
          <path d="M50 20 C45 35, 55 45, 70 40 C65 25, 55 15, 50 20 Z" />
          <path d="M50 20 C55 35, 45 45, 30 40 C35 25, 45 15, 50 20 Z" />
          <path d="M50 40 C35 45, 35 55, 50 60 C65 55, 65 45, 50 40 Z" />
          <path d="M50 40 C45 55, 55 65, 70 60 C65 45, 55 35, 50 40 Z" />
          <path d="M50 40 C55 55, 45 65, 30 60 C35 45, 45 35, 50 40 Z" />
        </svg>
      </div>
      
      {/* Counter display */}
      <div className="text-center z-10">
        <div className="text-5xl font-mono font-bold text-foreground mb-1">
          {count}
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          TAP TO COUNT
        </div>
      </div>

      {/* Swipe indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
        ⬇ swipe to -1
      </div>
    </motion.button>
  );
}