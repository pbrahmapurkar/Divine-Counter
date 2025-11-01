import React from 'react';
import { motion } from 'motion/react';
import { PracticeMode } from '../data/customMala';

interface PracticeModeSelectorProps {
  mode: PracticeMode;
  onChange: (mode: PracticeMode) => void;
}

export function PracticeModeSelector({ mode, onChange }: PracticeModeSelectorProps) {
  return (
    <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-1 flex gap-1">
      <button
        onClick={() => onChange('daily')}
        className={`
          flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
          ${mode === 'daily'
            ? 'bg-white dark:bg-gray-700 text-[#D4AF37] shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }
        `}
        aria-label="Daily mode: Use the same practice set every day"
      >
        Daily
      </button>
      <button
        onClick={() => onChange('weekly')}
        className={`
          flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
          ${mode === 'weekly'
            ? 'bg-white dark:bg-gray-700 text-[#D4AF37] shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }
        `}
        aria-label="Weekly mode: Customize different practices for each weekday"
      >
        Weekly
      </button>
    </div>
  );
}

