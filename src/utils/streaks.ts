import { STREAK_MILESTONES, StreakMilestone } from "../data/rewards";

interface StreakCalculationResult {
  currentStreak: number;
  milestones: StreakMilestone[];
}

const normalizeDate = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toDateString();
};

export const calculateAndUpdateStreak = (
  history: Array<{ date: string; goalAchieved: boolean }>,
  existingMilestones: StreakMilestone[] = STREAK_MILESTONES
): StreakCalculationResult => {
  const achievedDates = new Set(
    history
      .filter((entry) => entry.goalAchieved)
      .map((entry) => normalizeDate(entry.date))
      .filter(Boolean)
  );

  let currentStreak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toDateString();
    if (achievedDates.has(key)) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  let hasChanges = false;
  const sourceMilestones = existingMilestones.length ? existingMilestones : STREAK_MILESTONES;

  const updatedMilestones = sourceMilestones.map((milestone) => {
    if (milestone.isAchieved || currentStreak >= milestone.days) {
      if (!milestone.isAchieved) {
        hasChanges = true;
        return {
          ...milestone,
          isAchieved: true,
          achievedAt: milestone.achievedAt ?? new Date().toISOString(),
        };
      }
      return milestone;
    }

    return milestone;
  });

  return {
    currentStreak,
    milestones: hasChanges ? updatedMilestones : sourceMilestones,
  };
};

export type { StreakCalculationResult };
