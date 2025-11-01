import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Calendar } from 'lucide-react';
import { getTodayPractices, updatePracticeProgress, getPracticeMode } from '../utils/customMala';
import { PracticeItem, getWeekday } from '../data/customMala';
import { MantraCard } from './MantraCard';

interface TodaysPracticesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractice?: (practice: PracticeItem) => void;
}

export function TodaysPracticesSheet({
  isOpen,
  onClose,
  onStartPractice,
}: TodaysPracticesSheetProps) {
  const [practices, setPractices] = useState<PracticeItem[]>([]);
  const mode = getPracticeMode();
  const weekday = getWeekday();

  useEffect(() => {
    if (isOpen) {
      const todayPractices = getTodayPractices();
      setPractices(todayPractices);
    }
  }, [isOpen]);

  const handleIncrement = (id: string) => {
    const practice = practices.find(p => p.id === id);
    if (practice) {
      const newProgress = Math.min((practice.progress || 0) + 1, practice.beads);
      updatePracticeProgress(mode, weekday, id, newProgress);
      setPractices(getTodayPractices());
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Sheet */}
        <motion.div
          className="relative w-full max-h-[80vh] bg-gradient-to-br from-white via-[#FDF6E3]/30 to-[#FAF0E6]/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 rounded-t-3xl border-t border-[#D4AF37]/25 shadow-2xl overflow-hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Today's Practices
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {practices.length} {practices.length === 1 ? 'practice' : 'practices'} scheduled
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(80vh-80px)] px-6 py-4">
            {practices.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-orange-500/20 border border-[#D4AF37]/30 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No practices scheduled
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add practices in the Planner to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {practices.map((practice) => (
                  <div key={practice.id} className="relative">
                    <MantraCard
                      practice={practice}
                      onIncrement={() => handleIncrement(practice.id)}
                      className="mb-3"
                    />
                    {/* Start Practice Button */}
                    {onStartPractice && (
                      <button
                        onClick={() => {
                          onStartPractice(practice);
                          onClose();
                        }}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#caa634] text-white font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
                        aria-label={`Start practice: ${practice.title}`}
                      >
                        <Play className="w-5 h-5" />
                        Start Practice
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

