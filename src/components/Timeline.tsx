import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Lock, Sparkles } from 'lucide-react';
import { StreakMilestone } from '../data/rewards';

interface TimelineProps {
  milestones: StreakMilestone[];
  currentStreak: number;
  onMilestoneClick?: (milestone: StreakMilestone) => void;
  className?: string;
}

type TimelineStatus = 'unlocked' | 'in-progress' | 'locked';

interface TimelineItemProps {
  milestone: StreakMilestone;
  index: number;
  status: TimelineStatus;
  currentStreak: number;
  previousMilestoneDays: number;
  onMilestoneClick?: (milestone: StreakMilestone) => void;
}

export function Timeline({ milestones, currentStreak, onMilestoneClick, className = "" }: TimelineProps) {
  const orderedMilestones = [...milestones].sort((a, b) => a.days - b.days);
  const firstIncompleteIndex = orderedMilestones.findIndex((milestone) => !milestone.isAchieved);
  
  if (orderedMilestones.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-orange-500/20 border border-[#D4AF37]/30 flex items-center justify-center">
            <span className="text-3xl">🌟</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Your Journey Awaits</h3>
          <p className="text-muted-foreground leading-relaxed">
            Begin your practice to unlock beautiful milestones and track your spiritual growth.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Vertical Timeline Connector - subtle dotted line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 z-0 hidden sm:block">
        <div className="h-full bg-gradient-to-b from-[#D4AF37]/20 via-[#D4AF37]/40 to-[#D4AF37]/20 rounded-full" 
             style={{
               backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, rgba(212, 175, 55, 0.3) 8px, rgba(212, 175, 55, 0.3) 12px)'
             }}
        />
      </div>

      {/* Mobile timeline connector - simplified */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 z-0 sm:hidden">
        <div className="h-full bg-gradient-to-b from-[#D4AF37]/20 via-[#D4AF37]/40 to-[#D4AF37]/20 rounded-full" />
      </div>

      {/* Timeline Items - Vertical Stack */}
      <div className="space-y-4 sm:space-y-6">
        {orderedMilestones.map((milestone, index) => {
          let status: TimelineStatus = 'locked';
          if (milestone.isAchieved) {
            status = 'unlocked';
          } else if (firstIncompleteIndex === index) {
            status = 'in-progress';
          } else {
            status = 'locked';
          }

          const previousMilestoneDays = index > 0 ? orderedMilestones[index - 1].days : 0;

          return (
            <TimelineItem
              key={milestone.days}
              milestone={milestone}
              index={index}
              status={status}
              currentStreak={currentStreak}
              previousMilestoneDays={previousMilestoneDays}
              onMilestoneClick={onMilestoneClick}
            />
          );
        })}
      </div>
    </div>
  );
}

function TimelineItem({
  milestone,
  index,
  status,
  currentStreak,
  previousMilestoneDays,
  onMilestoneClick
}: TimelineItemProps) {
  const isUnlocked = status === 'unlocked';
  const isActive = status === 'in-progress';
  const isLocked = status === 'locked';
  
  const cappedStreak = Math.min(Math.max(currentStreak, 0), milestone.days);
  const progressCurrent = isUnlocked ? milestone.days : cappedStreak;
  const progressPercentage = milestone.days > 0 ? (progressCurrent / milestone.days) * 100 : 0;
  const daysRemaining = Math.max(milestone.days - progressCurrent, 0);
  
  const getStatusLabel = () => {
    switch (status) {
      case 'unlocked':
        return 'Unlocked';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Locked';
    }
  };

  const getDescription = () => {
    if (status === 'unlocked') {
      return milestone.description || 'Milestone achieved. Beautiful work!';
    }
    if (status === 'in-progress') {
      return daysRemaining === 0 
        ? 'You\'re so close! Keep going!' 
        : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`;
    }
    return `Unlocks at ${milestone.days} day${milestone.days === 1 ? '' : 's'} streak`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: "easeOut"
      }}
      className="relative pl-12 sm:pl-16"
    >
      {/* Timeline Node */}
      <div className="absolute left-0 top-6 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.4, ease: "easeOut" }}
          className={`
            relative w-6 h-6 rounded-full border-2 flex items-center justify-center
            ${isUnlocked 
              ? 'bg-gradient-to-br from-[#D4AF37] to-[#FFD700] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30' 
              : isActive 
                ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 shadow-md shadow-[#D4AF37]/20' 
                : 'bg-white/60 dark:bg-gray-800/60 border-gray-300/40 dark:border-gray-600/40'
            }
          `}
        >
          {/* Glow effect for unlocked milestones */}
          {isUnlocked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.08 + 0.4, duration: 0.5 }}
              className="absolute inset-0 rounded-full bg-[#D4AF37]/30 blur-md -z-10"
            />
          )}
          
          {/* Active pulsing effect */}
          {isActive && (
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-[#D4AF37]/20"
            />
          )}
          
          {/* Icon inside node */}
          {isUnlocked ? (
            <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          ) : isLocked ? (
            <Lock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
          ) : (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 bg-[#D4AF37] rounded-full"
            />
          )}
        </motion.div>
      </div>

      {/* Milestone Card */}
      <motion.div
        whileHover={isUnlocked || isActive ? { scale: 1.01, y: -2 } : {}}
        whileTap={{ scale: 0.98 }}
        onClick={() => onMilestoneClick?.(milestone)}
        className={`
          relative overflow-hidden rounded-2xl border transition-all duration-300
          ${isUnlocked || isActive ? 'cursor-pointer' : 'cursor-default'}
          focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:ring-offset-2
          motion-reduce:transition-none
          ${isUnlocked 
            ? 'bg-gradient-to-br from-white/90 via-white/70 to-[#FDF6E3]/50 dark:from-gray-800/90 dark:via-gray-800/70 dark:to-gray-900/50 border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/10' 
            : isActive 
              ? 'bg-gradient-to-br from-white/80 via-[#FDF6E3]/40 to-[#FAF0E6]/30 dark:from-gray-800/80 dark:via-gray-900/40 dark:to-gray-900/30 border-[#D4AF37]/40 shadow-md shadow-[#D4AF37]/5' 
              : 'bg-white/60 dark:bg-gray-800/60 border-gray-200/50 dark:border-gray-700/50 shadow-sm opacity-75'
          }
        `}
        role={isUnlocked || isActive ? "button" : undefined}
        tabIndex={isUnlocked || isActive ? 0 : undefined}
        aria-label={`${milestone.name} milestone - ${getStatusLabel()}`}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && (isUnlocked || isActive)) {
            e.preventDefault();
            onMilestoneClick?.(milestone);
          }
        }}
      >
        {/* Subtle glow effect for unlocked milestones */}
        {isUnlocked && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent" />
          </motion.div>
        )}

        {/* Active warm glow */}
        {isActive && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-[#D4AF37]/8 via-transparent to-transparent" />
          </motion.div>
        )}

        <div className="relative p-5 sm:p-6">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                ${isUnlocked 
                  ? 'bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/20 shadow-sm' 
                  : isActive 
                    ? 'bg-[#D4AF37]/15' 
                    : 'bg-gray-100/60 dark:bg-gray-700/60'
                }
              `}>
                <span className={isUnlocked ? '' : isActive ? 'opacity-90' : 'opacity-50'}>
                  {milestone.icon}
                </span>
              </div>

              {/* Title and Streak Requirement */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`
                    text-sm font-semibold
                    ${isUnlocked ? 'text-[#D4AF37]' : isActive ? 'text-[#D4AF37]/80' : 'text-gray-500 dark:text-gray-400'}
                  `}>
                    {milestone.days} day{milestone.days === 1 ? '' : 's'}
                  </span>
                </div>
                <h3 className={`
                  text-lg font-semibold leading-tight mb-1
                  ${isUnlocked ? 'text-gray-900 dark:text-white' : isActive ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}
                `}>
                  {milestone.name}
                </h3>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`
              flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5
              ${isUnlocked 
                ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300' 
                : isActive 
                  ? 'bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 border-[#D4AF37]/40 dark:border-[#D4AF37]/50 text-[#D4AF37] dark:text-[#FFD700]' 
                  : 'bg-gray-100/60 dark:bg-gray-800/60 border-gray-300/40 dark:border-gray-600/40 text-gray-500 dark:text-gray-400'
              }
            `}>
              {isUnlocked && <Check className="w-3 h-3 flex-shrink-0" />}
              {isActive && <Sparkles className="w-3 h-3 flex-shrink-0" />}
              {isLocked && <Lock className="w-3 h-3 flex-shrink-0" />}
              <span className="truncate">{getStatusLabel()}</span>
            </div>
          </div>

          {/* Description */}
          <p className={`
            text-sm leading-relaxed mb-4
            ${isUnlocked ? 'text-gray-700 dark:text-gray-300' : isActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'}
          `}>
            {getDescription()}
          </p>

          {/* Progress Bar for Active Milestones */}
          {isActive && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                <span className="text-[#D4AF37] font-semibold">{progressCurrent} / {milestone.days}</span>
              </div>
              <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, progressPercentage)}%`
                  }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Unlocked celebration indicator */}
          {isUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 + 0.6 }}
              className="flex items-center gap-2 text-xs font-medium text-[#D4AF37] mt-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Milestone Achieved</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
