import { WeeklyMala, DailyOverride, Weekday, MalaPlan, DEFAULT_WEEKLY_MALA, getWeekday, isOverrideExpired, getMidnightTimestamp, getMantraById } from '../data/weeklyMala';

const STORAGE_KEY_WEEKLY = 'divine-counter-weekly-mala';
const STORAGE_KEY_OVERRIDE = 'divine-counter-daily-override';

// --- Load/Save Weekly Schedule ---
export function loadWeeklyMala(): WeeklyMala {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_WEEKLY);
    if (stored) {
      const parsed = JSON.parse(stored) as WeeklyMala;
      // Validate and merge with defaults for missing days
      const merged: WeeklyMala = { ...DEFAULT_WEEKLY_MALA };
      (Object.keys(merged) as Weekday[]).forEach(day => {
        if (parsed[day]) {
          merged[day] = parsed[day];
        }
      });
      return merged;
    }
  } catch (error) {
    console.error('Failed to load weekly mala:', error);
  }
  return DEFAULT_WEEKLY_MALA;
}

export function saveWeeklyMala(schedule: WeeklyMala): void {
  try {
    localStorage.setItem(STORAGE_KEY_WEEKLY, JSON.stringify(schedule));
  } catch (error) {
    console.error('Failed to save weekly mala:', error);
  }
}

// --- Load/Save Daily Override ---
export function loadDailyOverride(): DailyOverride | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_OVERRIDE);
    if (stored) {
      const override = JSON.parse(stored) as DailyOverride;
      if (!isOverrideExpired(override)) {
        return override;
      } else {
        // Clear expired override
        clearDailyOverride();
        return null;
      }
    }
  } catch (error) {
    console.error('Failed to load daily override:', error);
  }
  return null;
}

export function saveDailyOverride(plan: MalaPlan): void {
  try {
    const override: DailyOverride = {
      ...plan,
      expiresAt: getMidnightTimestamp(),
    };
    localStorage.setItem(STORAGE_KEY_OVERRIDE, JSON.stringify(override));
  } catch (error) {
    console.error('Failed to save daily override:', error);
  }
}

export function clearDailyOverride(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_OVERRIDE);
  } catch (error) {
    console.error('Failed to clear daily override:', error);
  }
}

// --- Get Today's Practice ---
export function getTodayPractice(): MalaPlan {
  // Check for active override first
  const override = loadDailyOverride();
  if (override && !isOverrideExpired(override)) {
    return {
      themeId: override.themeId,
      mantraId: override.mantraId,
      beads: override.beads,
    };
  }
  
  // Use weekly schedule
  const schedule = loadWeeklyMala();
  const weekday = getWeekday();
  return schedule[weekday];
}

// --- Convert MalaPlan to Counter-like object for HomeScreen ---
export function malaPlanToCounter(plan: MalaPlan, counterId: string = 'daily-mala'): { id: string; name: string; cycleCount: number; dailyGoal: number; icon?: string; color: string; reminderEnabled: boolean; reminderTime: string } {
  const mantra = getMantraById(plan.mantraId);
  
  return {
    id: counterId,
    name: mantra?.title || 'Daily Practice',
    cycleCount: plan.beads,
    dailyGoal: 1, // Default daily goal
    icon: 'lotus',
    color: '#D4AF37',
    reminderEnabled: false,
    reminderTime: '09:00',
  };
}

