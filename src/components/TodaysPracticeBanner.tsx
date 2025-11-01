import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, X, RefreshCw } from 'lucide-react';
import { getMantraById, THEMES } from '../data/weeklyMala';
import { getTodayPractice, clearDailyOverride, malaPlanToCounter } from '../utils/weeklyMala';
import { toast } from 'sonner';

interface TodaysPracticeBannerProps {
  onOverride?: (counter: ReturnType<typeof malaPlanToCounter>) => void;
  onSelectOther?: () => void;
}

export function TodaysPracticeBanner({ onOverride, onSelectOther }: TodaysPracticeBannerProps) {
  const [practice, setPractice] = useState(getTodayPractice());
  const [hasOverride, setHasOverride] = useState(false);

  useEffect(() => {
    // Refresh on focus
    const handleFocus = () => {
      const current = getTodayPractice();
      setPractice(current);
      // Check if there's an active override
      try {
        const override = localStorage.getItem('divine-counter-daily-override');
        if (override) {
          const parsed = JSON.parse(override);
          const expiresAt = new Date(parsed.expiresAt);
          setHasOverride(expiresAt > new Date());
        } else {
          setHasOverride(false);
        }
      } catch {
        setHasOverride(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    handleFocus(); // Check on mount

    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const mantra = getMantraById(practice.mantraId);
  const theme = THEMES[practice.themeId];

  const handleClearOverride = () => {
    clearDailyOverride();
    const defaultPractice = getTodayPractice();
    setPractice(defaultPractice);
    setHasOverride(false);
    toast.success('Reverted to scheduled practice.');
    if (onOverride) {
      const counter = malaPlanToCounter(defaultPractice);
      onOverride(counter);
    }
  };

  const handleSelectOther = () => {
    if (onSelectOther) {
      onSelectOther();
    }
  };

  if (!mantra) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-4 mb-4 rounded-xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/10 via-[#D4AF37]/5 to-white/60 dark:from-[#D4AF37]/10 dark:via-[#D4AF37]/5 dark:to-gray-800/60 backdrop-blur-sm shadow-sm"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-lg">
              {theme.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wide">
                  Today's Practice
                </p>
                {hasOverride && (
                  <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-[#D4AF37]/20 text-[#D4AF37]">
                    Override
                  </span>
                )}
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
                {mantra.mantra}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {mantra.energy} · {practice.beads} beads
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasOverride && (
              <button
                onClick={handleClearOverride}
                className="p-1.5 rounded-lg hover:bg-[#D4AF37]/20 transition-colors"
                aria-label="Clear override"
                title="Revert to scheduled practice"
              >
                <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
              </button>
            )}
            <button
              onClick={handleSelectOther}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-colors"
              aria-label="Use another mantra for today"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

