import React from 'react';
import { motion } from 'motion/react';
import { Flame, Trophy, Lock, Sparkles, CheckCircle } from 'lucide-react';
import { STREAK_MILESTONES, StreakMilestone } from '../data/rewards';

interface StreaksComponentProps {
  currentStreak: number;
  longestStreak: number;
  milestones?: StreakMilestone[];
  onMilestoneClick?: (milestone: StreakMilestone) => void;
}

export function StreaksComponent({
  currentStreak,
  longestStreak,
  milestones,
  onMilestoneClick
}: StreaksComponentProps) {
  const hydratedMilestones = milestones?.length ? milestones : STREAK_MILESTONES;
  const orderedMilestones = [...hydratedMilestones].sort((a, b) => a.days - b.days);

  const achievedMilestones = orderedMilestones.filter(m => (m.isAchieved ?? false) || currentStreak >= m.days);
  const lastMilestone = achievedMilestones.length ? achievedMilestones[achievedMilestones.length - 1] : { days: 0, name: 'Start' };
  const nextMilestone = orderedMilestones.find(m => m.days > currentStreak);

  const progressDenominator = nextMilestone ? nextMilestone.days - lastMilestone.days : 1;
  const rawProgress = nextMilestone ? currentStreak - lastMilestone.days : currentStreak - lastMilestone.days;
  const milestoneProgress = Math.min(100, Math.max(0, (rawProgress / progressDenominator) * 100));
  const progressLabelCurrent = Math.max(0, rawProgress);
  const progressLabelTarget = Math.max(1, progressDenominator);
  const getMilestoneStatus = (milestone: StreakMilestone) => {
    const achieved = milestone.isAchieved || currentStreak >= milestone.days;
    if (achieved) {
      return milestone.isAchieved ? 'celebrated' : 'unlocked';
    }
    return 'locked';
  };

  return (
    <div className="space-y-6">
      {/* Current Streak Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative flex items-center justify-center w-14 h-14"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 opacity-90"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -inset-2 rounded-full bg-gradient-to-br from-yellow-100/40 via-amber-200/40 to-orange-300/40 blur-xl"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-yellow-200/60 shadow-[0_0_18px_rgba(251,191,36,0.35)]">
                <Flame className="w-6 h-6 text-[#D97706]" />
              </div>
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Current Streak</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Keep the momentum going!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {currentStreak}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">days</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {nextMilestone
                ? `Next milestone: ${nextMilestone.name}`
                : 'You have completed every milestone!'}
            </span>
            <span>
              {nextMilestone
                ? `${progressLabelCurrent}/${progressLabelTarget} days toward next milestone`
                : `${currentStreak} days total`}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${nextMilestone ? milestoneProgress : 100}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Longest Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative flex items-center justify-center w-14 h-14"
              animate={{ rotate: [0, 1.5, -1.5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-300 via-purple-400 to-amber-200 opacity-90"
                animate={{ opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -inset-2 rounded-full bg-gradient-to-br from-purple-200/40 via-rose-200/40 to-yellow-200/40 blur-xl"
                animate={{ opacity: [0.35, 0.75, 0.35] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-purple-200/60 shadow-[0_0_18px_rgba(167,139,250,0.35)]">
                <Trophy className="w-6 h-6 text-[#8B5CF6]" />
              </div>
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Longest Streak</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your personal best</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {longestStreak}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">days</div>
          </div>
        </div>
      </motion.div>

      {/* Milestones Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Streak Milestones</h3>
        <div className="relative px-4 sm:px-10 md:px-16">
          <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 z-0 -translate-x-1/2">
            <div className="h-full border-l-2 border-dotted border-border/60 opacity-70" />
          </div>
          <div className="space-y-14">
            {orderedMilestones.length > 0 ? (
              orderedMilestones.map((milestone, index) => {
                const status = getMilestoneStatus(milestone);
                const accentColor = milestone.color || '#F59E0B';
                const isUnlocked = status === 'unlocked' || status === 'celebrated';
                const daysRemaining = Math.max(milestone.days - currentStreak, 0);
                const displayName = (milestone.name || (milestone as any).title || `Milestone ${milestone.days}`) as string;
                const milestoneSubtitle = isUnlocked
                  ? milestone.description || 'Milestone achieved. Beautiful work!'
                  : daysRemaining <= 0
                    ? 'Almost within reach — keep going!'
                    : `You're ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} away`;
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={milestone.days}
                    className={`relative flex ${isLeft ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`relative w-full max-w-xl ${isLeft ? 'pr-16 md:pr-24' : 'pl-16 md:pl-24'}`}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        className={`relative overflow-hidden rounded-3xl border transition-all duration-500 backdrop-blur-md ${
                          isUnlocked
                            ? 'border-transparent'
                            : 'border-border/70 bg-card/70 text-muted-foreground/90'
                        }`}
                        style={isUnlocked ? {
                          background: `linear-gradient(135deg, ${accentColor}33 0%, ${accentColor}14 45%, #fff7e6 100%)`,
                          boxShadow: `0 26px 56px ${accentColor}50`
                        } : undefined}
                        onClick={() => onMilestoneClick?.(milestone)}
                      >
                        {isUnlocked && (
                          <motion.div
                            className="pointer-events-none absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.15, 0.35, 0.15] }}
                            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <div
                              className="absolute -top-12 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full blur-3xl"
                              style={{ background: `${accentColor}55` }}
                            />
                          </motion.div>
                        )}

                        <div className="absolute top-5 right-5">
                          {isUnlocked ? (
                            <motion.div
                              initial={{ scale: 0.8, rotate: -8 }}
                              animate={{ scale: [1, 1.12, 1], rotate: [0, 6, -4, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                              className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 shadow-xl"
                            >
                              <CheckCircle className="h-5 w-5 text-white" />
                            </motion.div>
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                              <Lock className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-center text-center gap-5 px-10 pb-10 pt-14">
                          <motion.div
                            className={`flex h-16 w-16 items-center justify-center rounded-3xl md:h-20 md:w-20 ${
                              isUnlocked ? 'bg-white/80 shadow-2xl' : 'bg-muted/70 text-muted-foreground'
                            }`}
                            animate={isUnlocked ? { scale: [1, 1.1, 1], rotate: [0, 4, -4, 0] } : undefined}
                            transition={isUnlocked ? { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } : undefined}
                          >
                            {isUnlocked ? (
                              <motion.span
                                animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="text-4xl"
                                role="img"
                                aria-hidden
                              >
                                {milestone.icon}
                              </motion.span>
                            ) : (
                              <span className="text-3xl opacity-50" role="img" aria-hidden>
                                {milestone.icon}
                              </span>
                            )}
                          </motion.div>

                          <div className="flex flex-col items-center text-center gap-3">
                            <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                              isUnlocked ? 'text-amber-700/80' : 'text-muted-foreground/60'
                            }`}>
                              {milestone.days} day{milestone.days === 1 ? '' : 's'} streak
                            </div>
                            <h4 className={`text-2xl font-semibold ${
                              isUnlocked ? 'text-amber-900' : 'text-foreground'
                            }`}>
                              {displayName}
                            </h4>
                            <p className={`text-base leading-relaxed ${
                              isUnlocked ? 'text-amber-700/90' : 'text-muted-foreground/75'
                            }`}>
                              {milestoneSubtitle}
                            </p>
                            {!isUnlocked && daysRemaining > 0 && (
                              <p className="text-xs font-medium text-muted-foreground/50 tracking-wide text-center">
                                On your path — stay devoted ✨
                              </p>
                            )}
                          </div>
                        </div>

                        {isUnlocked && (
                          <motion.div
                            className={`absolute bottom-6 ${isLeft ? 'left-12' : 'right-12'} flex items-center gap-1 text-xs font-semibold text-amber-700/90`}
                            initial={{ opacity: 0.45 }}
                            animate={{ opacity: [0.45, 1, 0.45] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Unlocked</span>
                          </motion.div>
                        )}
                      </motion.div>

                      <div
                        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isLeft ? 'right-[-40px]' : 'left-[-40px]'} flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-center gap-3`}
                      >
                        <div
                          className="h-0.5 w-12 rounded-full"
                          style={{ backgroundColor: isUnlocked ? accentColor : 'rgba(148, 163, 184, 0.45)' }}
                        />
                        <div
                          className="h-4 w-4 rounded-full border-2"
                          style={{
                            borderColor: isUnlocked ? accentColor : 'rgba(148, 163, 184, 0.7)',
                            backgroundColor: isUnlocked ? `${accentColor}33` : '#ffffff',
                            boxShadow: isUnlocked ? `0 0 12px ${accentColor}55` : undefined,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-sm text-muted-foreground">
                No milestones available yet.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
