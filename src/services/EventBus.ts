import { AppEvent } from '../types';

// Event Bus Implementation
class EventBus {
  private listeners = new Map<string, Function[]>();
  private eventHistory: AppEvent[] = [];
  private maxHistorySize = 1000;

  emit(event: AppEvent): void {
    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify listeners
    const handlers = this.listeners.get(event.type) || [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);
      }
    });

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Event emitted:', event);
    }
  }

  subscribe(eventType: string, handler: Function): () => void {
    const handlers = this.listeners.get(eventType) || [];
    handlers.push(handler);
    this.listeners.set(eventType, handlers);
    
    // Return unsubscribe function
    return () => this.unsubscribe(eventType, handler);
  }

  unsubscribe(eventType: string, handler: Function): void {
    const handlers = this.listeners.get(eventType) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.listeners.set(eventType, handlers);
    }
  }

  // Get event history for debugging
  getEventHistory(): AppEvent[] {
    return [...this.eventHistory];
  }

  // Clear event history
  clearHistory(): void {
    this.eventHistory = [];
  }

  // Get listeners count for monitoring
  getListenerCount(eventType: string): number {
    return this.listeners.get(eventType)?.length || 0;
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Event Types and Creators
export const EventTypes = {
  // Counter Events
  COUNTER_CREATED: 'COUNTER_CREATED',
  COUNTER_UPDATED: 'COUNTER_UPDATED',
  COUNTER_DELETED: 'COUNTER_DELETED',
  COUNTER_SELECTED: 'COUNTER_SELECTED',
  
  // Counting Events
  COUNT_INCREMENTED: 'COUNT_INCREMENTED',
  COUNT_DECREMENTED: 'COUNT_DECREMENTED',
  MAALA_COMPLETED: 'MAALA_COMPLETED',
  SESSION_STARTED: 'SESSION_STARTED',
  SESSION_PAUSED: 'SESSION_PAUSED',
  SESSION_ENDED: 'SESSION_ENDED',
  
  // User Events
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_PREFERENCES_UPDATED: 'USER_PREFERENCES_UPDATED',
  
  // Analytics Events
  INSIGHT_GENERATED: 'INSIGHT_GENERATED',
  ANALYTICS_UPDATED: 'ANALYTICS_UPDATED',
  
  // System Events
  APP_STARTED: 'APP_STARTED',
  APP_ERROR: 'APP_ERROR',
  DATA_SYNCED: 'DATA_SYNCED',
  OFFLINE_MODE: 'OFFLINE_MODE',
  ONLINE_MODE: 'ONLINE_MODE',
  
  // UI Events
  SCREEN_CHANGED: 'SCREEN_CHANGED',
  THEME_CHANGED: 'THEME_CHANGED',
  NOTIFICATION_SHOWN: 'NOTIFICATION_SHOWN',
  
  // Practice Events
  GOAL_ACHIEVED: 'GOAL_ACHIEVED',
  STREAK_BROKEN: 'STREAK_BROKEN',
  PRACTICE_REMINDER: 'PRACTICE_REMINDER'
} as const;

// Event Creators
export const createEvent = {
  counterCreated: (counter: any) => ({
    type: EventTypes.COUNTER_CREATED,
    payload: counter,
    timestamp: new Date(),
    source: 'CounterService'
  }),

  counterUpdated: (counterId: string, updates: any) => ({
    type: EventTypes.COUNTER_UPDATED,
    payload: { counterId, updates },
    timestamp: new Date(),
    source: 'CounterService'
  }),

  counterDeleted: (counterId: string) => ({
    type: EventTypes.COUNTER_DELETED,
    payload: { counterId },
    timestamp: new Date(),
    source: 'CounterService'
  }),

  counterSelected: (counter: any) => ({
    type: EventTypes.COUNTER_SELECTED,
    payload: counter,
    timestamp: new Date(),
    source: 'CounterButton'
  }),

  countIncremented: (counterId: string, newCount: number, sessionId?: string) => ({
    type: EventTypes.COUNT_INCREMENTED,
    payload: { counterId, newCount, sessionId },
    timestamp: new Date(),
    source: 'CounterButton'
  }),

  countDecremented: (counterId: string, newCount: number, sessionId?: string) => ({
    type: EventTypes.COUNT_DECREMENTED,
    payload: { counterId, newCount, sessionId },
    timestamp: new Date(),
    source: 'CounterButton'
  }),

  maalaCompleted: (counterId: string, sessionId: string, maalaCount: number) => ({
    type: EventTypes.MAALA_COMPLETED,
    payload: { counterId, sessionId, maalaCount },
    timestamp: new Date(),
    source: 'CounterService'
  }),

  sessionStarted: (session: any) => ({
    type: EventTypes.SESSION_STARTED,
    payload: session,
    timestamp: new Date(),
    source: 'SessionManager'
  }),

  sessionPaused: (sessionId: string) => ({
    type: EventTypes.SESSION_PAUSED,
    payload: { sessionId },
    timestamp: new Date(),
    source: 'SessionManager'
  }),

  sessionEnded: (sessionId: string, duration: number, countsCompleted: number) => ({
    type: EventTypes.SESSION_ENDED,
    payload: { sessionId, duration, countsCompleted },
    timestamp: new Date(),
    source: 'SessionManager'
  }),

  userLogin: (user: any) => ({
    type: EventTypes.USER_LOGIN,
    payload: user,
    timestamp: new Date(),
    source: 'AuthService'
  }),

  userLogout: () => ({
    type: EventTypes.USER_LOGOUT,
    payload: null,
    timestamp: new Date(),
    source: 'AuthService'
  }),

  userPreferencesUpdated: (preferences: any) => ({
    type: EventTypes.USER_PREFERENCES_UPDATED,
    payload: preferences,
    timestamp: new Date(),
    source: 'SettingsService'
  }),

  insightGenerated: (insight: any) => ({
    type: EventTypes.INSIGHT_GENERATED,
    payload: insight,
    timestamp: new Date(),
    source: 'AnalyticsEngine'
  }),

  analyticsUpdated: (analytics: any) => ({
    type: EventTypes.ANALYTICS_UPDATED,
    payload: analytics,
    timestamp: new Date(),
    source: 'AnalyticsEngine'
  }),

  appStarted: () => ({
    type: EventTypes.APP_STARTED,
    payload: { version: '1.0.0', timestamp: new Date().toISOString() },
    timestamp: new Date(),
    source: 'App'
  }),

  appError: (error: Error, context?: string) => ({
    type: EventTypes.APP_ERROR,
    payload: { error: error.message, stack: error.stack, context },
    timestamp: new Date(),
    source: context || 'Unknown'
  }),

  dataSynced: (dataType: string, success: boolean) => ({
    type: EventTypes.DATA_SYNCED,
    payload: { dataType, success },
    timestamp: new Date(),
    source: 'DataPersistenceManager'
  }),

  offlineMode: () => ({
    type: EventTypes.OFFLINE_MODE,
    payload: { timestamp: new Date().toISOString() },
    timestamp: new Date(),
    source: 'NetworkManager'
  }),

  onlineMode: () => ({
    type: EventTypes.ONLINE_MODE,
    payload: { timestamp: new Date().toISOString() },
    timestamp: new Date(),
    source: 'NetworkManager'
  }),

  screenChanged: (fromScreen: string, toScreen: string) => ({
    type: EventTypes.SCREEN_CHANGED,
    payload: { fromScreen, toScreen },
    timestamp: new Date(),
    source: 'Navigation'
  }),

  themeChanged: (theme: string, isDark: boolean) => ({
    type: EventTypes.THEME_CHANGED,
    payload: { theme, isDark },
    timestamp: new Date(),
    source: 'ThemeManager'
  }),

  notificationShown: (type: string, message: string) => ({
    type: EventTypes.NOTIFICATION_SHOWN,
    payload: { type, message },
    timestamp: new Date(),
    source: 'NotificationService'
  }),

  goalAchieved: (goalId: string, goalType: string) => ({
    type: EventTypes.GOAL_ACHIEVED,
    payload: { goalId, goalType },
    timestamp: new Date(),
    source: 'GoalManager'
  }),

  streakBroken: (counterId: string, streakLength: number) => ({
    type: EventTypes.STREAK_BROKEN,
    payload: { counterId, streakLength },
    timestamp: new Date(),
    source: 'StreakManager'
  }),

  practiceReminder: (counterId: string, reminderType: string) => ({
    type: EventTypes.PRACTICE_REMINDER,
    payload: { counterId, reminderType },
    timestamp: new Date(),
    source: 'ReminderService'
  })
};

// Event Handlers for Common Patterns
export class EventHandlers {
  // Analytics Handler
  static analyticsHandler = (event: AppEvent) => {
    // Track events for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.type, {
        event_category: 'user_interaction',
        event_label: event.source,
        value: 1
      });
    }
  };

  // Error Handler
  static errorHandler = (event: AppEvent) => {
    if (event.type === EventTypes.APP_ERROR) {
      // Log error to external service
      console.error('App Error:', event.payload);
      
      // Send to error tracking service
      if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.captureException(new Error(event.payload.error));
      }
    }
  };

  // Performance Handler
  static performanceHandler = (event: AppEvent) => {
    // Track performance metrics
    if (event.type === EventTypes.SESSION_ENDED) {
      const duration = event.payload.duration;
      
      // Track session duration
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'session_duration', {
          event_category: 'performance',
          value: Math.round(duration / 1000) // Convert to seconds
        });
      }
    }
  };

  // User Engagement Handler
  static engagementHandler = (event: AppEvent) => {
    // Track user engagement patterns
    const engagementEvents = [
      EventTypes.COUNT_INCREMENTED,
      EventTypes.MAALA_COMPLETED,
      EventTypes.SESSION_STARTED,
      EventTypes.GOAL_ACHIEVED
    ];

    if (engagementEvents.includes(event.type as any)) {
      // Update user engagement score
      localStorage.setItem('lastEngagement', new Date().toISOString());
    }
  };
}

// Initialize Event Handlers
export function initializeEventHandlers(): void {
  // Register global event handlers
  eventBus.subscribe(EventTypes.APP_ERROR, EventHandlers.errorHandler);
  eventBus.subscribe(EventTypes.SESSION_ENDED, EventHandlers.performanceHandler);
  eventBus.subscribe(EventTypes.COUNT_INCREMENTED, EventHandlers.engagementHandler);
  eventBus.subscribe(EventTypes.MAALA_COMPLETED, EventHandlers.engagementHandler);
  eventBus.subscribe(EventTypes.SESSION_STARTED, EventHandlers.engagementHandler);
  eventBus.subscribe(EventTypes.GOAL_ACHIEVED, EventHandlers.engagementHandler);

  // Register analytics handler for all events
  Object.values(EventTypes).forEach(eventType => {
    eventBus.subscribe(eventType, EventHandlers.analyticsHandler);
  });
}

// Event Middleware for State Management
export function createEventMiddleware() {
  return (store: any) => (next: any) => (action: any) => {
    // Emit event before state update
    if (action.type && action.type.startsWith('COUNTER_')) {
      eventBus.emit({
        type: action.type,
        payload: action.payload,
        timestamp: new Date(),
        source: 'ReduxStore'
      });
    }

    return next(action);
  };
}

// Debug Utilities
export const EventDebug = {
  // Get all events of a specific type
  getEventsByType: (eventType: string): AppEvent[] => {
    return eventBus.getEventHistory().filter(event => event.type === eventType);
  },

  // Get events from a specific source
  getEventsBySource: (source: string): AppEvent[] => {
    return eventBus.getEventHistory().filter(event => event.source === source);
  },

  // Get events within a time range
  getEventsInRange: (startTime: Date, endTime: Date): AppEvent[] => {
    return eventBus.getEventHistory().filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    );
  },

  // Get event statistics
  getEventStats: () => {
    const history = eventBus.getEventHistory();
    const stats = new Map<string, number>();
    
    history.forEach(event => {
      stats.set(event.type, (stats.get(event.type) || 0) + 1);
    });

    return Object.fromEntries(stats);
  }
};

// Export the event bus instance
export default eventBus;
