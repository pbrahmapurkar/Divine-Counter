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
  
  const nextMilestone = orderedMilestones.find(m => !m.isAchieved && m.days > currentStreak);
  const achievedMilestones = orderedMilestones.filter(m => m.isAchieved || currentStreak >= m.days);
  const lastAchievedMilestone = achievedMilestones[achievedMilestones.length - 1];

  const getProgressMessage = () => {
    if (currentStreak === 0) {
      return "Begin your journey to unlock beautiful milestones";
    }
    if (achievedMilestones.length === 0) {
      return "Your first milestone awaits";
    }
    if (nextMilestone) {
      const remaining = nextMilestone.days - currentStreak;
      return `You're ${remaining} day${remaining === 1 ? '' : 's'} from your next milestone`;
    }
    return "All milestones achieved! Your dedication is inspiring";
  };

  return (
    <div className="space-y-8">
      {/* Journey Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Current Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-orange-200/50 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-red-100/20" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Tinted circle background for better contrast */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-orange-500/20" />
                  <Flame className="relative w-6 h-6 text-[#D4AF37] dark:text-orange-300" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Current Streak</h3>
                  <p className="text-sm text-muted-foreground">Keep the momentum going!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600">
                  {currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">days</div>
              </div>
            </div>
            
            {/* Progress to next milestone */}
            {nextMilestone && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Next: {nextMilestone.name}</span>
                  <span>{currentStreak} / {nextMilestone.days}</span>
                </div>
                <div className="w-full bg-orange-200/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (currentStreak / nextMilestone.days) * 100)}%` }}
                    transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Longest Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-indigo-100/20" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg"
                  animate={{ rotate: [0, 1.5, -1.5, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Tinted circle background for better contrast */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#A68CF1]/20 to-purple-500/20" />
                  <Trophy className="relative w-6 h-6 text-[#A68CF1] dark:text-purple-300" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Longest Streak</h3>
                  <p className="text-sm text-muted-foreground">Your personal best</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">
                  {longestStreak}
                </div>
                <div className="text-sm text-muted-foreground">days</div>
              </div>
            </div>
            
            {/* Achievement message */}
            <div className="text-sm text-muted-foreground">
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
        className="space-y-6"
      >
        {/* Section Header */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">Your Journey Timeline</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
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
