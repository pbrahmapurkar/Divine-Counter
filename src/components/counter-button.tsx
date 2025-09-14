import { motion, useReducedMotion } from 'motion/react';
import { cn } from './ui/utils';
import { useState, useRef } from 'react';

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
  const prefersReducedMotion = useReducedMotion();
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleIncrement = () => {
    onIncrement();
  };

  const handleDecrement = () => {
    if (count <= 0) return;
    onDecrement();
  };

  // Gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    
    // Check for downward swipe (decrement gesture)
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 50) {
      handleDecrement();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <motion.button
      className={cn(
        "relative w-48 h-48 rounded-full bg-gradient-to-b from-card to-card/80 border-2 border-primary/20 shadow-lg",
        "flex items-center justify-center transition-all duration-200 active:scale-95",
        "hover:shadow-xl hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      ref={buttonRef}
      onClick={handleIncrement}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      animate={prefersReducedMotion || disabled ? undefined : { scale: [1, 1.015, 1] }}
      transition={prefersReducedMotion || disabled ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
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

      {/* Removed swipe hint; a dedicated -1 button is shown elsewhere */}
    </motion.button>
  );
}
