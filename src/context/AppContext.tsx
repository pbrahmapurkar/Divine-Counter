import { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, UserProfile, Counter, CountSession, SessionState, AnalyticsData } from '../types';

// Initial State
const initialState: AppState = {
  user: null,
  counters: [],
  activeCounter: null,
  session: {
    current: null,
    isActive: false,
    isPaused: false,
    lastActivity: new Date(),
    sessionBuffer: []
  },
  preferences: {
    theme: 'spiritual',
    isDark: false,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: {
      reminders: false,
      achievements: true,
      streaks: true,
      weeklyReports: false,
      soundEnabled: true,
      vibrationEnabled: false
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      voiceCommands: false,
      hapticFeedback: false
    },
    privacy: {
      dataCollection: true,
      analytics: true,
      cloudSync: false,
      shareProgress: false
    }
  },
  analytics: {
    totalPracticeTime: 0,
    totalSessions: 0,
    averageSessionLength: 0,
    mostActiveDay: '',
    mostActiveTime: '',
    consistencyTrend: [],
    insights: [],
    lastUpdated: new Date().toISOString()
  },
  isLoading: false,
  error: null
};

// Reducer Function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'UPDATE_USER_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    case 'ADD_COUNTER':
      const newCounters = [...state.counters, action.payload];
      return {
        ...state,
        counters: newCounters,
        activeCounter: state.activeCounter || action.payload
      };

    case 'UPDATE_COUNTER':
      return {
        ...state,
        counters: state.counters.map(counter =>
          counter.id === action.payload.id
            ? { ...counter, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : counter
        ),
        activeCounter: state.activeCounter?.id === action.payload.id
          ? { ...state.activeCounter, ...action.payload.updates, updatedAt: new Date().toISOString() }
          : state.activeCounter
      };

    case 'DELETE_COUNTER':
      const filteredCounters = state.counters.filter(counter => counter.id !== action.payload);
      return {
        ...state,
        counters: filteredCounters,
        activeCounter: state.activeCounter?.id === action.payload
          ? filteredCounters[0] || null
          : state.activeCounter
      };

    case 'SET_ACTIVE_COUNTER':
      return { ...state, activeCounter: action.payload };

    case 'INCREMENT_COUNTER':
      return {
        ...state,
        counters: state.counters.map(counter => {
          if (counter.id === action.payload.counterId) {
            const amount = action.payload.amount || 1;
            const newCount = counter.statistics.todayCount + amount;
            const newMaalas = Math.floor(newCount / counter.cycleSize);
            
            return {
              ...counter,
              statistics: {
                ...counter.statistics,
                totalCount: counter.statistics.totalCount + amount,
                todayCount: newCount,
                todayMaalas: newMaalas,
                totalMaalas: counter.statistics.totalMaalas + (newMaalas - counter.statistics.todayMaalas),
                lastPracticeDate: new Date().toISOString()
              },
              updatedAt: new Date().toISOString()
            };
          }
          return counter;
        }),
        activeCounter: state.activeCounter?.id === action.payload.counterId
          ? (() => {
              const amount = action.payload.amount || 1;
              const newCount = state.activeCounter!.statistics.todayCount + amount;
              const newMaalas = Math.floor(newCount / state.activeCounter!.cycleSize);
              
              return {
                ...state.activeCounter!,
                statistics: {
                  ...state.activeCounter!.statistics,
                  totalCount: state.activeCounter!.statistics.totalCount + amount,
                  todayCount: newCount,
                  todayMaalas: newMaalas,
                  totalMaalas: state.activeCounter!.statistics.totalMaalas + (newMaalas - state.activeCounter!.statistics.todayMaalas),
                  lastPracticeDate: new Date().toISOString()
                },
                updatedAt: new Date().toISOString()
              };
            })()
          : state.activeCounter
      };

    case 'COMPLETE_MAALA':
      return {
        ...state,
        counters: state.counters.map(counter => {
          if (counter.id === action.payload.counterId) {
            return {
              ...counter,
              statistics: {
                ...counter.statistics,
                totalMaalas: counter.statistics.totalMaalas + 1,
                todayMaalas: counter.statistics.todayMaalas + 1,
                currentStreak: counter.statistics.currentStreak + 1,
                longestStreak: Math.max(counter.statistics.longestStreak, counter.statistics.currentStreak + 1)
              },
              updatedAt: new Date().toISOString()
            };
          }
          return counter;
        }),
        activeCounter: state.activeCounter?.id === action.payload.counterId
          ? {
              ...state.activeCounter,
              statistics: {
                ...state.activeCounter.statistics,
                totalMaalas: state.activeCounter.statistics.totalMaalas + 1,
                todayMaalas: state.activeCounter.statistics.todayMaalas + 1,
                currentStreak: state.activeCounter.statistics.currentStreak + 1,
                longestStreak: Math.max(state.activeCounter.statistics.longestStreak, state.activeCounter.statistics.currentStreak + 1)
              },
              updatedAt: new Date().toISOString()
            }
          : state.activeCounter
      };

    case 'START_SESSION':
      return {
        ...state,
        session: {
          ...state.session,
          current: action.payload,
          isActive: true,
          isPaused: false,
          lastActivity: new Date()
        }
      };

    case 'PAUSE_SESSION':
      return {
        ...state,
        session: {
          ...state.session,
          isPaused: true,
          lastActivity: new Date()
        }
      };

    case 'END_SESSION':
      if (!state.session.current) return state;
      
      const endedSession: CountSession = {
        ...state.session.current,
        endTime: action.payload.endTime,
        duration: action.payload.endTime.getTime() - state.session.current.startTime.getTime()
      };

      return {
        ...state,
        session: {
          ...state.session,
          current: null,
          isActive: false,
          isPaused: false,
          sessionBuffer: [...state.session.sessionBuffer, endedSession]
        },
        analytics: {
          ...state.analytics,
          totalSessions: state.analytics.totalSessions + 1,
          totalPracticeTime: state.analytics.totalPracticeTime + endedSession.duration,
          averageSessionLength: (state.analytics.totalPracticeTime + endedSession.duration) / (state.analytics.totalSessions + 1),
          lastUpdated: new Date().toISOString()
        }
      };

    case 'ADD_INSIGHT':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          insights: [...state.analytics.insights, action.payload],
          lastUpdated: new Date().toISOString()
        }
      };

    case 'UPDATE_ANALYTICS':
      return {
        ...state,
        analytics: action.payload
      };

    default:
      return state;
  }
}

// Context Creation
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider Component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Action Creators
export const appActions = {
  setLoading: (loading: boolean): AppAction => ({
    type: 'SET_LOADING',
    payload: loading
  }),

  setError: (error: string | null): AppAction => ({
    type: 'SET_ERROR',
    payload: error
  }),

  setUser: (user: UserProfile): AppAction => ({
    type: 'SET_USER',
    payload: user
  }),

  updateUserPreferences: (preferences: Partial<AppState['preferences']>): AppAction => ({
    type: 'UPDATE_USER_PREFERENCES',
    payload: preferences
  }),

  addCounter: (counter: Counter): AppAction => ({
    type: 'ADD_COUNTER',
    payload: counter
  }),

  updateCounter: (id: string, updates: Partial<Counter>): AppAction => ({
    type: 'UPDATE_COUNTER',
    payload: { id, updates }
  }),

  deleteCounter: (id: string): AppAction => ({
    type: 'DELETE_COUNTER',
    payload: id
  }),

  setActiveCounter: (counter: Counter | null): AppAction => ({
    type: 'SET_ACTIVE_COUNTER',
    payload: counter
  }),

  incrementCounter: (counterId: string, amount?: number): AppAction => ({
    type: 'INCREMENT_COUNTER',
    payload: { counterId, amount }
  }),

  completeMaala: (counterId: string, sessionId: string): AppAction => ({
    type: 'COMPLETE_MAALA',
    payload: { counterId, sessionId }
  }),

  startSession: (session: CountSession): AppAction => ({
    type: 'START_SESSION',
    payload: session
  }),

  pauseSession: (sessionId: string): AppAction => ({
    type: 'PAUSE_SESSION',
    payload: sessionId
  }),

  endSession: (sessionId: string, endTime: Date): AppAction => ({
    type: 'END_SESSION',
    payload: { sessionId, endTime }
  }),

  addInsight: (insight: AppState['analytics']['insights'][0]): AppAction => ({
    type: 'ADD_INSIGHT',
    payload: insight
  }),

  updateAnalytics: (analytics: AnalyticsData): AppAction => ({
    type: 'UPDATE_ANALYTICS',
    payload: analytics
  })
};
