import React from 'react';
import { motion } from 'motion/react';
import { Flame, Trophy, Sparkles, Target } from 'lucide-react';
import { Timeline } from './Timeline';
import { StreakMilestone } from '../data/rewards';

interface MilestoneTimelineProps {
  currentStreak: number;
  longestStreak: number;
  milestones?: StreakMilestone[];
  onMilestoneClick?: (milestone: StreakMilestone) => void;
}

export function MilestoneTimeline({
  currentStreak,
  longestStreak,
  milestones = [],
  onMilestoneClick
}: MilestoneTimelineProps) {
  const hydratedMilestones = milestones.length ? milestones : [];
  const orderedMilestones = [...hydratedMilestones].sort((a, b) => a.days - b.days);
  
  const nextMilestone = orderedMilestones.find(m => !m.isAchieved);
  const achievedMilestones = orderedMilestones.filter(m => m.isAchieved);
  const lastAchievedMilestone = achievedMilestones[achievedMilestones.length - 1];

  const getProgressMessage = () => {
    if (currentStreak === 0) {
      return "Begin your journey to unlock beautiful milestones";
    }
    if (achievedMilestones.length === 0) {
      return "Your first milestone awaits";
    }
    if (nextMilestone) {
      const remaining = Math.max(nextMilestone.days - currentStreak, 0);
      return `You're ${remaining} day${remaining === 1 ? '' : 's'} from your next milestone`;
    }
    return "All milestones achieved! Your dedication is inspiring";
  };

  return (
    <div className="space-y-6">
      {/* Sticky Header with Streak Count */}
      <div className="sticky top-0 z-20 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6 bg-gradient-to-b from-white/95 via-white/90 to-white/80 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Current Streak</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {currentStreak} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">day{currentStreak === 1 ? '' : 's'}</span>
              </div>
            </div>
          </div>
          
          {/* Progress to next milestone chip */}
          {nextMilestone && currentStreak > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/10 to-[#FFD700]/10 border border-[#D4AF37]/30 dark:border-[#D4AF37]/40">
              <div className="text-xs font-semibold text-[#D4AF37] dark:text-[#FFD700]">
                {currentStreak} / {nextMilestone.days}
              </div>
            </div>
          )}
        </div>
        
        {/* Next milestone progress bar */}
        {nextMilestone && currentStreak > 0 && (
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Next: {nextMilestone.name}</span>
              <span className="text-[#D4AF37] font-semibold">
                {Math.min(currentStreak, nextMilestone.days)} / {nextMilestone.days}
              </span>
            </div>
            <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (currentStreak / nextMilestone.days) * 100)}%`
                }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Journey Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Current Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white/90 via-[#FDF6E3]/40 to-[#FAF0E6]/30 dark:from-gray-800/90 dark:via-gray-900/40 dark:to-gray-900/30 shadow-sm"
        >
          <div className="relative p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/20 shadow-sm"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Flame className="relative w-6 h-6 text-[#D4AF37]" />
                </motion.div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Current Streak</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Keep the momentum going!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
                  {currentStreak}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">days</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Longest Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white/90 via-[#FDF6E3]/40 to-[#FAF0E6]/30 dark:from-gray-800/90 dark:via-gray-900/40 dark:to-gray-900/30 shadow-sm"
        >
          <div className="relative p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 shadow-sm"
                  animate={{ rotate: [0, 1.5, -1.5, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Trophy className="relative w-6 h-6 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Longest Streak</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your personal best</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {longestStreak}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">days</div>
              </div>
            </div>
            
            {/* Achievement message */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {longestStreak === currentStreak 
                ? "You're at your personal best!" 
                : "Keep practicing to beat your record"
              }
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-5"
      >
        {/* Section Header */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Your Journey Timeline</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {getProgressMessage()}
          </p>
        </div>

        {/* Timeline */}
        <Timeline
          milestones={orderedMilestones}
          currentStreak={currentStreak}
          onMilestoneClick={onMilestoneClick}
        />
      </motion.div>

      {/* Empty State */}
      {orderedMilestones.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto">
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 2, -2, 0] 
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-orange-500/20 border border-[#D4AF37]/30 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-[#D4AF37]" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Your Journey Awaits</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Begin your practice to unlock beautiful milestones and track your spiritual growth. Each day brings you closer to your goals.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-sm font-medium text-[#D4AF37]">
              <Target className="w-4 h-4" />
              <span>Start your first practice</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
