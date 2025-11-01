import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronUp } from 'lucide-react';
import { getTodayPractices, resetDailyProgress } from '../utils/customMala';
import { PracticeItem } from '../data/customMala';

interface TodaysPracticesBannerProps {
  onOpenSheet: () => void;
}

export function TodaysPracticesBanner({ onOpenSheet }: TodaysPracticesBannerProps) {
  const [practices, setPractices] = useState<PracticeItem[]>([]);

  useEffect(() => {
    // Reset progress at start of new day
    resetDailyProgress();
    
    const updatePractices = () => {
      const todayPractices = getTodayPractices();
      setPractices(todayPractices);
    };

    updatePractices();
    
    // Refresh on focus
    const handleFocus = () => {
      resetDailyProgress();
      updatePractices();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (practices.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-4 mb-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 text-center"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Add a practice to begin your journey.
        </p>
        <button
          onClick={onOpenSheet}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] font-medium text-sm transition-colors"
          aria-label="Open planner to add practice"
        >
          <Calendar className="w-4 h-4" />
          Go to Planner
        </button>
      </motion.div>
    );
  }

  const totalBeads = practices.reduce((sum, p) => sum + (p.progress || 0), 0);

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onOpenSheet}
      className="w-full mx-4 mb-4 rounded-xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/10 via-[#D4AF37]/5 to-white/60 dark:from-[#D4AF37]/10 dark:via-[#D4AF37]/5 dark:to-gray-800/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-left"
      aria-label={`Today's Practices: ${practices.length} items added`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wide">
                Today's Practices
              </p>
            </div>
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
              {practices.length} {practices.length === 1 ? 'item' : 'items'} added
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {totalBeads} beads counted today
            </p>
          </div>
        </div>
        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </motion.button>
  );
}

