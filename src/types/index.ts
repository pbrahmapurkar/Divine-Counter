// Enhanced Type Definitions for Divine Counter
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  lastActive: string;
}

export interface UserPreferences {
  theme: 'spiritual' | 'minimal' | 'nature' | 'custom';
  isDark: boolean;
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  // reminders removed
  achievements: boolean;
  streaks: boolean;
  weeklyReports: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  voiceCommands: boolean;
  hapticFeedback: boolean;
}

export interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  cloudSync: boolean;
  shareProgress: boolean;
}

export type CounterCategory = 'japa' | 'pranayama' | 'meditation' | 'custom';

export interface Counter {
  id: string;
  name: string;
  mantra?: string;
  description?: string;
  category: CounterCategory;
  color: string;
  cycleSize: number;
  target: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  statistics: CounterStatistics;
  settings: CounterSettings;
  history: CountSession[];
  createdAt: string;
  updatedAt: string;
}

export interface CounterStatistics {
  totalCount: number;
  totalMaalas: number;
  todayCount: number;
  todayMaalas: number;
  weeklyCount: number;
  monthlyCount: number;
  longestStreak: number;
  currentStreak: number;
  averageSessionTime: number;
  completionRate: number;
  lastPracticeDate?: string;
  bestDay?: string;
  consistencyScore: number;
}

export interface CounterSettings {
  hapticFeedback: boolean;
  soundEffects: boolean;
  autoIncrement: boolean;
  timeTracking: boolean;
  // reminders removed
  volumeButtonCounting: boolean;
}

export interface CountSession {
  id: string;
  counterId: string;
  startTime: Date;
  endTime?: Date;
  countsCompleted: number;
  maalasCompleted: number;
  sessionType: 'manual' | 'timed' | 'target-based';
  duration: number; // in milliseconds
  interruptions: number;
  focusScore: number; // 1-10 based on consistency
  notes?: string;
  mood?: 'peaceful' | 'focused' | 'distracted' | 'energized';
  location?: string;
  tags?: string[];
  createdAt: string;
}

export interface SessionState {
  current: CountSession | null;
  isActive: boolean;
  isPaused: boolean;
  lastActivity: Date;
  sessionBuffer: CountSession[]; // Unsaved sessions
}

export interface AppState {
  user: UserProfile | null;
  counters: Counter[];
  activeCounter: Counter | null;
  session: SessionState;
  preferences: UserPreferences;
  analytics: AnalyticsData;
  isLoading: boolean;
  error: string | null;
}

export interface AnalyticsData {
  totalPracticeTime: number;
  totalSessions: number;
  averageSessionLength: number;
  mostActiveDay: string;
  mostActiveTime: string;
  consistencyTrend: number[];
  insights: Insight[];
  lastUpdated: string;
}

export interface Insight {
  type: 'consistency' | 'progress' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
  createdAt: string;
}

export interface PracticeGoal {
  id: string;
  type: 'streak' | 'total' | 'consistency' | 'time-based';
  target: number;
  deadline?: Date;
  reward?: string;
  progress: number;
  isCompleted: boolean;
  counterId?: string;
  createdAt: string;
}

export interface GroupPractice {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  sharedCounters: Counter[];
  challenges: GroupChallenge[];
  leaderboard: LeaderboardEntry[];
  schedule: GroupSchedule;
  createdAt: string;
}

export interface GroupMember {
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
  stats: MemberStats;
}

export interface GroupChallenge {
  id: string;
  name: string;
  description: string;
  target: number;
  duration: {
    start: Date;
    end: Date;
  };
  participants: string[]; // User IDs
  currentProgress: Map<string, number>;
  rewards: ChallengeReward[];
  isActive: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  rank: number;
  avatar?: string;
}

export interface GroupSchedule {
  daily: TimeSlot[];
  weekly: WeeklySchedule;
  customDates: Date[];
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;
  counterId: string;
  description?: string;
}

export interface WeeklySchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

// Action Types for Reducer
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'ADD_COUNTER'; payload: Counter }
  | { type: 'UPDATE_COUNTER'; payload: { id: string; updates: Partial<Counter> } }
  | { type: 'DELETE_COUNTER'; payload: string }
  | { type: 'SET_ACTIVE_COUNTER'; payload: Counter | null }
  | { type: 'INCREMENT_COUNTER'; payload: { counterId: string; amount?: number } }
  | { type: 'COMPLETE_MAALA'; payload: { counterId: string; sessionId: string } }
  | { type: 'START_SESSION'; payload: CountSession }
  | { type: 'PAUSE_SESSION'; payload: string }
  | { type: 'END_SESSION'; payload: { sessionId: string; endTime: Date } }
  | { type: 'ADD_INSIGHT'; payload: Insight }
  | { type: 'UPDATE_ANALYTICS'; payload: AnalyticsData };

// Event Types
export interface AppEvent {
  type: string;
  payload: any;
  timestamp: Date;
  source: string;
  userId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProgressMetrics {
  currentCycle: number;
  cycleProgress: number; // percentage
  maalasCompleted: number;
  targetProgress: number; // percentage
  streakDays: number;
  estimatedCompletion: Date;
}
