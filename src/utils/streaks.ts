import { STREAK_MILESTONES, StreakMilestone } from "../data/rewards";

interface StreakCalculationOptions {
  todayProgress?: number;
  dailyGoal?: number;
}

interface StreakCalculationResult {
  currentStreak: number;
  longestStreak: number;
  milestones: StreakMilestone[];
  newlyAchieved: StreakMilestone[];
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
  existingMilestones: StreakMilestone[] = STREAK_MILESTONES,
  options: StreakCalculationOptions = {}
): StreakCalculationResult => {
  const achievedDates = new Set(
    history
      .filter((entry) => entry.goalAchieved)
      .map((entry) => normalizeDate(entry.date))
      .filter(Boolean)
  );

  if (
    typeof options.todayProgress === "number" &&
    typeof options.dailyGoal === "number" &&
    options.dailyGoal > 0 &&
    options.todayProgress >= options.dailyGoal
  ) {
    achievedDates.add(normalizeDate(new Date()));
  }

  let currentStreak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (achievedDates.has(cursor.toDateString())) {
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const sortedDates = Array.from(achievedDates)
    .map((dateString) => new Date(dateString))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 0;
  let runningCount = 0;
  let previousDate: Date | null = null;

  sortedDates.forEach((date) => {
    if (!previousDate) {
      runningCount = 1;
    } else {
      const diffInDays = Math.round(
        (date.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      runningCount = diffInDays === 1 ? runningCount + 1 : 1;
    }

    if (runningCount > longestStreak) {
      longestStreak = runningCount;
    }

    previousDate = date;
  });

  if (longestStreak < currentStreak) {
    longestStreak = currentStreak;
  }

  const sourceMilestones = STREAK_MILESTONES;
  const existingMilestoneMap = new Map(existingMilestones.map((milestone) => [milestone.days, milestone]));

  const newlyAchieved: StreakMilestone[] = [];

  const updatedMilestones = sourceMilestones.map((baseMilestone) => {
    const previous = existingMilestoneMap.get(baseMilestone.days);
    const wasAchieved = previous?.isAchieved ?? false;
    const isAchieved = longestStreak >= baseMilestone.days;

    let achievedAt = previous?.achievedAt;

    if (isAchieved && !wasAchieved) {
      achievedAt = new Date().toISOString();
      newlyAchieved.push({
        ...baseMilestone,
        isAchieved: true,
        achievedAt,
      });
    }

    if (!isAchieved) {
      achievedAt = undefined;
    }

    return {
      ...baseMilestone,
      isAchieved,
      achievedAt,
    };
  });

  return {
    currentStreak,
    longestStreak,
    milestones: updatedMilestones,
    newlyAchieved,
  };
};

export type { StreakCalculationResult };
