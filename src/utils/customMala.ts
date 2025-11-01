import { PlannerData, DEFAULT_PLANNER_DATA, PracticeMode, DailyMala, WeeklyMala, Weekday, PracticeItem } from '../data/customMala';

const STORAGE_KEY = 'divine-counter-custom-mala-planner';

// --- Load/Save Planner Data ---
export function loadPlannerData(): PlannerData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PlannerData;
      // Merge with defaults to ensure all fields exist
      return {
        ...DEFAULT_PLANNER_DATA,
        ...parsed,
        dailyMala: parsed.dailyMala || DEFAULT_PLANNER_DATA.dailyMala,
        weeklyMala: parsed.weeklyMala || DEFAULT_PLANNER_DATA.weeklyMala,
      };
    }
  } catch (error) {
    console.error('Failed to load planner data:', error);
  }
  return DEFAULT_PLANNER_DATA;
}

export function savePlannerData(data: PlannerData): void {
  try {
    const toSave = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save planner data:', error);
  }
}

// --- Mode Management ---
export function setPracticeMode(mode: PracticeMode): void {
  const data = loadPlannerData();
  data.practiceMode = mode;
  savePlannerData(data);
}

export function getPracticeMode(): PracticeMode {
  const data = loadPlannerData();
  return data.practiceMode;
}

// --- Daily Mode Operations ---
export function addDailyPractice(practice: PracticeItem): void {
  const data = loadPlannerData();
  data.dailyMala.practices.push(practice);
  savePlannerData(data);
}

export function updateDailyPractice(id: string, updates: Partial<PracticeItem>): void {
  const data = loadPlannerData();
  const index = data.dailyMala.practices.findIndex(p => p.id === id);
  if (index >= 0) {
    data.dailyMala.practices[index] = { ...data.dailyMala.practices[index], ...updates };
    savePlannerData(data);
  }
}

export function deleteDailyPractice(id: string): void {
  const data = loadPlannerData();
  data.dailyMala.practices = data.dailyMala.practices.filter(p => p.id !== id);
  savePlannerData(data);
}

export function reorderDailyPractices(startIndex: number, endIndex: number): void {
  const data = loadPlannerData();
  const [removed] = data.dailyMala.practices.splice(startIndex, 1);
  data.dailyMala.practices.splice(endIndex, 0, removed);
  savePlannerData(data);
}

// --- Weekly Mode Operations ---
export function addWeeklyPractice(weekday: Weekday, practice: PracticeItem): void {
  const data = loadPlannerData();
  if (!data.weeklyMala[weekday]) {
    data.weeklyMala[weekday] = [];
  }
  data.weeklyMala[weekday].push(practice);
  savePlannerData(data);
}

export function updateWeeklyPractice(weekday: Weekday, id: string, updates: Partial<PracticeItem>): void {
  const data = loadPlannerData();
  const practices = data.weeklyMala[weekday] || [];
  const index = practices.findIndex(p => p.id === id);
  if (index >= 0) {
    practices[index] = { ...practices[index], ...updates };
    data.weeklyMala[weekday] = practices;
    savePlannerData(data);
  }
}

export function deleteWeeklyPractice(weekday: Weekday, id: string): void {
  const data = loadPlannerData();
  if (data.weeklyMala[weekday]) {
    data.weeklyMala[weekday] = data.weeklyMala[weekday].filter(p => p.id !== id);
    savePlannerData(data);
  }
}

export function reorderWeeklyPractices(weekday: Weekday, startIndex: number, endIndex: number): void {
  const data = loadPlannerData();
  const practices = data.weeklyMala[weekday] || [];
  const [removed] = practices.splice(startIndex, 1);
  practices.splice(endIndex, 0, removed);
  data.weeklyMala[weekday] = practices;
  savePlannerData(data);
}

// --- Get Today's Practices ---
export function getTodayPractices(): PracticeItem[] {
  const data = loadPlannerData();
  
  if (data.practiceMode === 'daily') {
    return data.dailyMala.practices || [];
  } else {
    const weekday: Weekday = (() => {
      const day = new Date().getDay();
      const weekdays: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      return weekdays[day];
    })();
    return data.weeklyMala[weekday] || [];
  }
}

// --- Reset Progress for New Day ---
export function resetDailyProgress(): void {
  const data = loadPlannerData();
  const today = new Date().toDateString();
  const lastReset = localStorage.getItem('divine-counter-last-progress-reset');
  
  if (lastReset !== today) {
    // Reset all practice progress
    if (data.practiceMode === 'daily') {
      data.dailyMala.practices.forEach(p => {
        p.progress = 0;
      });
    } else {
      Object.values(data.weeklyMala).forEach(practices => {
        practices.forEach(p => {
          p.progress = 0;
        });
      });
    }
    savePlannerData(data);
    localStorage.setItem('divine-counter-last-progress-reset', today);
  }
}

// --- Update Practice Progress ---
export function updatePracticeProgress(mode: PracticeMode, weekday: Weekday | null, practiceId: string, progress: number): void {
  const data = loadPlannerData();
  
  if (mode === 'daily') {
    const practice = data.dailyMala.practices.find(p => p.id === practiceId);
    if (practice) {
      practice.progress = progress;
      savePlannerData(data);
    }
  } else if (weekday) {
    const practice = data.weeklyMala[weekday]?.find(p => p.id === practiceId);
    if (practice) {
      practice.progress = progress;
      savePlannerData(data);
    }
  }
}

