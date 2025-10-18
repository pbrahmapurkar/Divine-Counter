import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { StreakMilestone } from '../data/rewards';

interface TimelineProps {
  milestones: StreakMilestone[];
  currentStreak: number;
  onMilestoneClick?: (milestone: StreakMilestone) => void;
  className?: string;
}

interface TimelineItemProps {
  milestone: StreakMilestone;
  index: number;
  isUnlocked: boolean;
  isActive: boolean;
  isLeft: boolean;
  currentStreak: number;
  onMilestoneClick?: (milestone: StreakMilestone) => void;
}

export function Timeline({ milestones, currentStreak, onMilestoneClick, className = "" }: TimelineProps) {
  const orderedMilestones = [...milestones].sort((a, b) => a.days - b.days);
  
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
      {/* Central Spine Line - Hidden on mobile, visible on larger screens */}
      <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 z-0">
        <div className="h-full bg-gradient-to-b from-[#D4AF37]/30 via-[#D4AF37]/60 to-[#D4AF37]/30 rounded-full" />
      </div>

      {/* Timeline Items */}
      <div className="space-y-6 sm:space-y-8 lg:space-y-12">
        {orderedMilestones.map((milestone, index) => {
          const isUnlocked = milestone.isAchieved || currentStreak >= milestone.days;
          const isActive = !isUnlocked && currentStreak >= milestone.days - 3; // Next few milestones
          const isLeft = index % 2 === 0;

          return (
            <TimelineItem
              key={milestone.days}
              milestone={milestone}
              index={index}
              isUnlocked={isUnlocked}
              isActive={isActive}
              isLeft={isLeft}
              currentStreak={currentStreak}
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
  isUnlocked, 
  isActive, 
  isLeft, 
  currentStreak, 
  onMilestoneClick 
}: TimelineItemProps) {
  const daysRemaining = Math.max(milestone.days - currentStreak, 0);
  const accentColor = milestone.color || '#D4AF37';
  
  const getStatusLabel = () => {
    if (isUnlocked) return 'Unlocked';
    if (isActive) return 'In Progress';
    return 'Locked';
  };

  const getStatusColor = () => {
    if (isUnlocked) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (isActive) return 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30';
    return 'text-muted-foreground bg-muted/50 border-muted-foreground/20';
  };

  const getDescription = () => {
    if (isUnlocked) {
      return milestone.description || 'Milestone achieved. Beautiful work!';
    }
    if (isActive) {
      return daysRemaining === 0 
        ? 'You\'re so close! Keep going!' 
        : `Just ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} to go`;
    }
    return `Unlock at ${milestone.days} day${milestone.days === 1 ? '' : 's'} streak`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className={`relative flex ${isLeft ? 'justify-start' : 'justify-end'} items-center`}
    >
      {/* Content Card */}
      <div className={`relative w-full max-w-sm sm:max-w-md ${isLeft ? 'pr-4 sm:pr-8 lg:pr-12' : 'pl-4 sm:pl-8 lg:pl-12'}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onMilestoneClick?.(milestone)}
          className={`
            relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:ring-offset-2
            motion-reduce:transition-none
            ${isUnlocked 
              ? 'border-transparent shadow-lg' 
              : isActive 
                ? 'border-[#D4AF37]/40 shadow-md' 
                : 'border-border/40 shadow-sm'
            }
            ${isUnlocked ? 'hover:shadow-xl' : 'hover:shadow-md'}
          `}
          role="button"
          tabIndex={0}
          aria-label={`${milestone.name} milestone - ${getStatusLabel()}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onMilestoneClick?.(milestone);
            }
          }}
          style={isUnlocked ? {
            background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 50%, #fff7e6 100%)`,
            boxShadow: `0 8px 32px ${accentColor}25`
          } : isActive ? {
            background: 'linear-gradient(135deg, #D4AF3710 0%, #D4AF3705 50%, #fff7e6 100%)',
            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.15)'
          } : undefined}
        >
          {/* Glow effect for unlocked milestones */}
          {isUnlocked && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div 
                className="absolute -top-4 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full blur-xl"
                style={{ background: `${accentColor}30` }}
              />
            </motion.div>
          )}

          {/* Active glow for in-progress milestones */}
          {isActive && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -top-2 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full blur-lg bg-[#D4AF37]/20" />
            </motion.div>
          )}

          <div className="p-6">
            {/* Header with icon and status */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  ${isUnlocked ? 'bg-white/80 shadow-lg' : isActive ? 'bg-[#D4AF37]/20' : 'bg-muted/60'}
                `}>
                  <span className={isUnlocked ? '' : isActive ? 'opacity-80' : 'opacity-50'}>
                    {milestone.icon}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {milestone.days} day{milestone.days === 1 ? '' : 's'} streak
                  </div>
                  <h3 className={`text-lg font-semibold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {milestone.name}
                  </h3>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={`
                px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5
                ${getStatusColor()}
              `}>
                {isUnlocked && (
                  <Check className="w-3 h-3 flex-shrink-0" />
                )}
                <span className="truncate">
                  {getStatusLabel()}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className={`text-sm leading-relaxed mb-4 ${
              isUnlocked ? 'text-foreground/80' : 'text-muted-foreground'
            }`}>
              {getDescription()}
            </p>

            {/* Progress indicator for active milestones */}
            {isActive && daysRemaining > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{currentStreak} / {milestone.days}</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (currentStreak / milestone.days) * 100)}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Call to action for unlocked milestones */}
            {isUnlocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-2 text-xs font-medium text-[#D4AF37]"
              >
                <span>✨</span>
                <span>Add Reflection</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Timeline Node */}
      <div className={`
        absolute top-1/2 -translate-y-1/2 z-10
        ${isLeft ? 'right-0 sm:right-0' : 'left-0 sm:left-0'}
      `}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.4, ease: "easeOut" }}
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center relative
            ${isUnlocked 
              ? 'border-[#D4AF37] bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/40' 
              : isActive 
                ? 'border-[#D4AF37] bg-[#D4AF37]/20 shadow-md shadow-[#D4AF37]/20' 
                : 'border-muted-foreground/40 bg-background'
            }
          `}
          role="img"
          aria-label={isUnlocked ? 'Milestone unlocked' : isActive ? 'Milestone in progress' : 'Milestone locked'}
        >
          {/* Subtle glow effect for unlocked milestones */}
          {isUnlocked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.6, duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-sm -z-10"
            />
          )}
          {isUnlocked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.4, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.7, duration: 0.3, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white stroke-2" />
              </motion.div>
            </motion.div>
          )}
          {isActive && !isUnlocked && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 bg-[#D4AF37] rounded-full"
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
