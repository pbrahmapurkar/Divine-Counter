import { Counter, CountSession, UserProfile, AnalyticsData } from '../types';

// Storage Adapters
interface StorageAdapter {
  save<T>(key: string, data: T): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  getAll<T>(key: string): Promise<T[]>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

class LocalStorageAdapter implements StorageAdapter {
  private prefix = 'divine-counter-';

  async save<T>(key: string, data: T): Promise<void> {
    try {
      const serialized = JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      });
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.error('LocalStorage save error:', error);
      throw new Error('Failed to save to localStorage');
    }
  }

  async load<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('LocalStorage load error:', error);
      return null;
    }
  }

  async getAll<T>(key: string): Promise<T[]> {
    try {
      const items: T[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (storageKey?.startsWith(this.prefix + key)) {
          const item = localStorage.getItem(storageKey);
          if (item) {
            const parsed = JSON.parse(item);
            items.push(parsed.data);
          }
        }
      }
      return items;
    } catch (error) {
      console.error('LocalStorage getAll error:', error);
      return [];
    }
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(this.prefix + key);
  }

  async clear(): Promise<void> {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
    keys.forEach(key => localStorage.removeItem(key));
  }
}

class IndexedDBAdapter implements StorageAdapter {
  private dbName = 'DivineCounterDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('counters')) {
          db.createObjectStore('counters', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('analytics')) {
          db.createObjectStore('analytics', { keyPath: 'id' });
        }
      };
    });
  }

  async save<T>(key: string, data: T): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([key], 'readwrite');
      const store = transaction.objectStore(key);
      const request = store.put({
        ...data,
        id: (data as any).id || key,
        timestamp: new Date().toISOString()
      });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async load<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([key], 'readonly');
      const store = transaction.objectStore(key);
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(key: string): Promise<T[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([key], 'readonly');
      const store = transaction.objectStore(key);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(key: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([key], 'readwrite');
      const store = transaction.objectStore(key);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();
    
    const storeNames = Array.from(this.db!.objectStoreNames);
    const promises = storeNames.map(storeName => {
      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
    
    await Promise.all(promises);
  }
}

// Main Data Persistence Manager
export class DataPersistenceManager {
  private localStorage: LocalStorageAdapter;
  private indexedDB: IndexedDBAdapter;
  private syncQueue: Array<{ type: string; data: any; timestamp: Date }> = [];
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.localStorage = new LocalStorageAdapter();
    this.indexedDB = new IndexedDBAdapter();
    this.setupOnlineListener();
  }

  async initialize(): Promise<void> {
    try {
      await this.indexedDB.init();
      console.log('Data persistence initialized successfully');
    } catch (error) {
      console.error('Failed to initialize data persistence:', error);
      throw error;
    }
  }

  // Counter Management
  async saveCounter(counter: Counter): Promise<void> {
    try {
      // Save to localStorage first (fast)
      await this.localStorage.save(`counter-${counter.id}`, counter);
      
      // Save to IndexedDB (reliable)
      await this.indexedDB.save('counters', counter);
      
      // Queue for background sync if online
      if (this.isOnline) {
        this.queueSync('counter', counter);
      }
    } catch (error) {
      console.error('Failed to save counter:', error);
      this.handlePersistenceError(error, 'counter', counter);
    }
  }

  async loadCounter(id: string): Promise<Counter | null> {
    try {
      // Try localStorage first (fastest)
      let counter = await this.localStorage.load<Counter>(`counter-${id}`);
      
      // Fallback to IndexedDB if not found
      if (!counter) {
        const counters = await this.indexedDB.getAll<Counter>('counters');
        counter = counters.find(c => c.id === id) || null;
      }
      
      return counter;
    } catch (error) {
      console.error('Failed to load counter:', error);
      return null;
    }
  }

  async loadAllCounters(): Promise<Counter[]> {
    try {
      // Load from IndexedDB (most complete)
      const indexedCounters = await this.indexedDB.getAll<Counter>('counters');
      
      // Merge with localStorage for any missing data
      const localCounters = await this.localStorage.getAll<Counter>('counter');
      
      return this.mergeWithConflictResolution(indexedCounters, localCounters);
    } catch (error) {
      console.error('Failed to load counters:', error);
      return [];
    }
  }

  async deleteCounter(id: string): Promise<void> {
    try {
      await this.localStorage.delete(`counter-${id}`);
      await this.indexedDB.delete('counters');
      
      if (this.isOnline) {
        this.queueSync('delete-counter', { id });
      }
    } catch (error) {
      console.error('Failed to delete counter:', error);
      throw error;
    }
  }

  // Session Management
  async saveSession(session: CountSession): Promise<void> {
    try {
      await this.localStorage.save(`session-${session.id}`, session);
      await this.indexedDB.save('sessions', session);
      
      if (this.isOnline) {
        this.queueSync('session', session);
      }
    } catch (error) {
      console.error('Failed to save session:', error);
      this.handlePersistenceError(error, 'session', session);
    }
  }

  async loadSessions(counterId?: string): Promise<CountSession[]> {
    try {
      const sessions = await this.indexedDB.getAll<CountSession>('sessions');
      
      if (counterId) {
        return sessions.filter(session => session.counterId === counterId);
      }
      
      return sessions;
    } catch (error) {
      console.error('Failed to load sessions:', error);
      return [];
    }
  }

  // User Profile Management
  async saveUserProfile(user: UserProfile): Promise<void> {
    try {
      await this.localStorage.save('user-profile', user);
      await this.indexedDB.save('user', user);
      
      if (this.isOnline) {
        this.queueSync('user', user);
      }
    } catch (error) {
      console.error('Failed to save user profile:', error);
      this.handlePersistenceError(error, 'user', user);
    }
  }

  async loadUserProfile(): Promise<UserProfile | null> {
    try {
      let user = await this.localStorage.load<UserProfile>('user-profile');
      
      if (!user) {
        user = await this.indexedDB.load<UserProfile>('user');
      }
      
      return user;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  }

  // Analytics Management
  async saveAnalytics(analytics: AnalyticsData): Promise<void> {
    try {
      await this.localStorage.save('analytics', analytics);
      await this.indexedDB.save('analytics', analytics);
      
      if (this.isOnline) {
        this.queueSync('analytics', analytics);
      }
    } catch (error) {
      console.error('Failed to save analytics:', error);
      this.handlePersistenceError(error, 'analytics', analytics);
    }
  }

  async loadAnalytics(): Promise<AnalyticsData | null> {
    try {
      let analytics = await this.localStorage.load<AnalyticsData>('analytics');
      
      if (!analytics) {
        analytics = await this.indexedDB.load<AnalyticsData>('analytics');
      }
      
      return analytics;
    } catch (error) {
      console.error('Failed to load analytics:', error);
      return null;
    }
  }

  // Data Export/Import
  async exportAllData(): Promise<{
    counters: Counter[];
    sessions: CountSession[];
    user: UserProfile | null;
    analytics: AnalyticsData | null;
    exportDate: string;
  }> {
    try {
      const [counters, sessions, user, analytics] = await Promise.all([
        this.loadAllCounters(),
        this.loadSessions(),
        this.loadUserProfile(),
        this.loadAnalytics()
      ]);

      return {
        counters,
        sessions,
        user,
        analytics,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  async importData(data: {
    counters?: Counter[];
    sessions?: CountSession[];
    user?: UserProfile;
    analytics?: AnalyticsData;
  }): Promise<void> {
    try {
      const promises: Promise<void>[] = [];

      if (data.counters) {
        promises.push(...data.counters.map(counter => this.saveCounter(counter)));
      }
      
      if (data.sessions) {
        promises.push(...data.sessions.map(session => this.saveSession(session)));
      }
      
      if (data.user) {
        promises.push(this.saveUserProfile(data.user));
      }
      
      if (data.analytics) {
        promises.push(this.saveAnalytics(data.analytics));
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  // Utility Methods
  private mergeWithConflictResolution<T extends { id: string; updatedAt: string }>(
    indexed: T[],
    local: T[]
  ): T[] {
    const merged = new Map<string, T>();
    
    // Add indexed data first
    indexed.forEach(item => merged.set(item.id, item));
    
    // Merge local data, keeping the most recent
    local.forEach(item => {
      const existing = merged.get(item.id);
      if (!existing || new Date(item.updatedAt) > new Date(existing.updatedAt)) {
        merged.set(item.id, item);
      }
    });
    
    return Array.from(merged.values());
  }

  private queueSync(type: string, data: any): void {
    this.syncQueue.push({
      type,
      data,
      timestamp: new Date()
    });
    
    // Process queue in background
    this.processSyncQueue();
  }

  private async processSyncQueue(): Promise<void> {
    if (this.syncQueue.length === 0 || !this.isOnline) return;
    
    const item = this.syncQueue.shift();
    if (!item) return;
    
    try {
      // Here you would implement cloud sync logic
      console.log('Syncing to cloud:', item);
      
      // Simulate cloud sync
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Cloud sync failed:', error);
      // Re-queue for retry
      this.syncQueue.push(item);
    }
    
    // Continue processing
    if (this.syncQueue.length > 0) {
      setTimeout(() => this.processSyncQueue(), 1000);
    }
  }

  private handlePersistenceError(error: any, type: string, data: any): void {
    console.error(`Persistence error for ${type}:`, error);
    
    // Implement fallback strategies
    if (error.name === 'QuotaExceededError') {
      // Clear old data and retry
      this.clearOldData();
    }
  }

  private async clearOldData(): Promise<void> {
    try {
      // Clear sessions older than 30 days
      const sessions = await this.loadSessions();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentSessions = sessions.filter(session => 
        new Date(session.createdAt) > thirtyDaysAgo
      );
      
      await this.indexedDB.clear();
      await Promise.all(recentSessions.map(session => this.saveSession(session)));
      
    } catch (error) {
      console.error('Failed to clear old data:', error);
    }
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Cleanup
  async destroy(): Promise<void> {
    // Clear any pending sync operations
    this.syncQueue = [];
  }
}

// Singleton instance
export const dataManager = new DataPersistenceManager();
