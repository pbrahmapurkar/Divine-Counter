// --- Data Model ---
export type Weekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type PracticeMode = "daily" | "weekly";

export interface PracticeItem {
  id: string;
  title: string;
  beads: number;
  notes?: string;
  progress?: number; // Current bead count for today
}

export interface DailyMala {
  practices: PracticeItem[];
}

export type WeeklyMala = {
  [K in Weekday]: PracticeItem[];
};

export interface PlannerData {
  practiceMode: PracticeMode;
  dailyMala: DailyMala;
  weeklyMala: WeeklyMala;
  lastUpdated: string;
}

// --- Defaults ---
export const DEFAULT_PLANNER_DATA: PlannerData = {
  practiceMode: "daily",
  dailyMala: {
    practices: [],
  },
  weeklyMala: {
    sun: [],
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
  },
  lastUpdated: new Date().toISOString(),
};

export const WEEKDAY_NAMES: Record<Weekday, string> = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};

export const WEEKDAY_ORDER: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// --- Utilities ---
export function getWeekday(): Weekday {
  const day = new Date().getDay();
  const weekdays: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return weekdays[day];
}

export function generateId(): string {
  return `practice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

