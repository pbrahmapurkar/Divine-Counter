import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles } from 'lucide-react';

interface JourneyHeaderProps {
  currentStreak: number;
  totalMilestonesUnlocked: number;
  userName: string;
  className?: string;
}

export function JourneyHeader({
  currentStreak,
  totalMilestonesUnlocked,
  userName,
  className = ""
}: JourneyHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getProgressMessage = () => {
    if (currentStreak === 0) {
      return "Ready to begin your mindful journey";
    }
    if (currentStreak === 1) {
      return "Your journey has begun";
    }
    if (currentStreak < 7) {
      return "Building beautiful momentum";
    }
    if (currentStreak < 30) {
      return "Your dedication is inspiring";
    }
    return "Your practice radiates wisdom";
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 via-orange-50/30 to-amber-50/20 dark:from-[#D4AF37]/10 dark:via-orange-950/20 dark:to-amber-950/10 ${className}`}
      style={{
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.1)'
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-16 h-16 border border-[#D4AF37]/30 rounded-full" />
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-[#D4AF37]/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-[#D4AF37]/10 rounded-full" />
      </div>

      {/* Subtle glow effect */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute -top-8 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full blur-2xl bg-[#D4AF37]/20" />
      </motion.div>

      <div className="relative z-10 p-6 sm:p-8">
        {/* Header text */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
          >
            {getGreeting()}, {userName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm sm:text-base text-muted-foreground"
          >
            {getProgressMessage()}
          </motion.p>
        </div>

        {/* Metrics grid - two column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center group bg-white/40 dark:bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/20 dark:border-white/10 backdrop-blur-sm"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-300/30 mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-200 relative">
              {/* Tinted circle background for better contrast */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-orange-500/30" />
              <Flame className="relative w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] dark:text-orange-300" />
            </div>
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {currentStreak}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Day Streak
              </p>
            </div>
          </motion.div>

          {/* Total Milestones */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center group bg-white/40 dark:bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/20 dark:border-white/10 backdrop-blur-sm"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-yellow-500/20 border border-[#D4AF37]/30 mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-200 relative">
              {/* Tinted circle background for better contrast */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D4AF37]/40 to-yellow-500/40" />
              <Sparkles className="relative w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] dark:text-yellow-300" />
            </div>
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {totalMilestonesUnlocked}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Milestones
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
}
