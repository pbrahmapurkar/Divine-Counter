import React, { createContext, useContext, ReactNode } from 'react';

interface HistoryEntry {
  date: string;
  count: number;
  goalAchieved: boolean;
  practiceId: string;
}

interface CounterState {
  currentCount: number;
  todayProgress: number;
  lastCountDate: string;
}

interface PracticeContextType {
  undoLastCount: () => void;
  archivePreviousDayIfNeeded: (
    counterId: string,
    counterStates: { [key: string]: CounterState },
    setCounterStates: React.Dispatch<React.SetStateAction<{ [key: string]: CounterState }>>,
    setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>,
    dailyGoal: number
  ) => Promise<void>;
  performGlobalDailyReset: (
    counters: Array<{ id: string; dailyGoal: number }>,
    counterStates: { [key: string]: CounterState },
    setCounterStates: React.Dispatch<React.SetStateAction<{ [key: string]: CounterState }>>,
    setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>
  ) => Promise<void>;
  getLast7DaysData: (
    history: HistoryEntry[],
    todayProgress: number,
    dailyGoal: number
  ) => Array<{
    date: Date;
    dateString: string;
    dayName: string;
    practiceCount: number;
    goalAchieved: boolean;
    isToday: boolean;
  }>;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

interface PracticeProviderProps {
  children: ReactNode;
}

export function PracticeProvider({ children }: PracticeProviderProps) {
  const undoLastCount = () => {
    // This will be implemented by the component that uses this context
    console.warn('undoLastCount called but not implemented');
  };

  /**
   * Archives the previous day's progress if a new day has started
   * This function must be called at the very beginning of incrementCount
   */
  const archivePreviousDayIfNeeded = async (
    counterId: string,
    counterStates: { [key: string]: CounterState },
    setCounterStates: React.Dispatch<React.SetStateAction<{ [key: string]: CounterState }>>,
    setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>,
    dailyGoal: number
  ) => {
    const currentState = counterStates[counterId];
    if (!currentState) return;

    const today = new Date().toDateString();
    const lastCountDate = currentState.lastCountDate;

    // Check if a new day has started
    if (lastCountDate !== today) {
      console.log(`New day detected! Archiving ${lastCountDate} with progress: ${currentState.todayProgress}`);
      
      // Only archive if there was progress on the previous day
      if (currentState.todayProgress > 0) {
        const historyEntry: HistoryEntry = {
          date: lastCountDate, // This is yesterday's date
          count: currentState.todayProgress,
          goalAchieved: currentState.todayProgress >= dailyGoal,
          practiceId: counterId
        };

        // Add to history
        setHistory(prevHistory => {
          // Check if entry already exists for this date to avoid duplicates
          const existingIndex = prevHistory.findIndex(
            entry => entry.date === lastCountDate && entry.practiceId === counterId
          );
          if (existingIndex >= 0) {
            // Update existing entry
            const updatedHistory = [...prevHistory];
            updatedHistory[existingIndex] = historyEntry;
            return updatedHistory;
          } else {
            // Add new entry
            return [historyEntry, ...prevHistory];
          }
        });

        console.log(`Archived previous day: ${lastCountDate} with ${currentState.todayProgress} malas`);
      }

      // Reset today's progress and update lastCountDate
      setCounterStates(prevStates => ({
        ...prevStates,
        [counterId]: {
          ...currentState,
          todayProgress: 0,
          lastCountDate: today
        }
      }));
    }
  };

  /**
   * Performs a global daily reset for all practices
   * This function should be called when the app starts to ensure all practices are reset on a new day
   */
  const performGlobalDailyReset = async (
    counters: Array<{ id: string; dailyGoal: number }>,
    counterStates: { [key: string]: CounterState },
    setCounterStates: React.Dispatch<React.SetStateAction<{ [key: string]: CounterState }>>,
    setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>
  ) => {
    const today = new Date().toDateString();
    let hasNewDay = false;
    const newHistoryEntries: HistoryEntry[] = [];
    const updatedCounterStates: { [key: string]: CounterState } = {};

    // Check each counter to see if a new day has started
    for (const counter of counters) {
      const currentState = counterStates[counter.id];
      if (!currentState) continue;

      const lastCountDate = currentState.lastCountDate;

      // Check if a new day has started for this counter
      if (lastCountDate !== today) {
        hasNewDay = true;
        console.log(`New day detected for counter ${counter.id}! Archiving ${lastCountDate} with progress: ${currentState.todayProgress}`);
        
        // Archive previous day's progress if there was any
        if (currentState.todayProgress > 0) {
          const historyEntry: HistoryEntry = {
            date: lastCountDate, // This is yesterday's date
            count: currentState.todayProgress,
            goalAchieved: currentState.todayProgress >= counter.dailyGoal,
            practiceId: counter.id
          };
          newHistoryEntries.push(historyEntry);
          console.log(`Will archive counter ${counter.id}: ${lastCountDate} with ${currentState.todayProgress} malas`);
        }

        // Prepare updated state for this counter
        updatedCounterStates[counter.id] = {
          ...currentState,
          todayProgress: 0,
          lastCountDate: today
        };
      }
    }

    // If a new day was detected, update all states
    if (hasNewDay) {
      console.log(`Performing global daily reset for ${Object.keys(updatedCounterStates).length} counters`);
      
      // Add all new history entries
      if (newHistoryEntries.length > 0) {
        setHistory(prevHistory => {
          const updatedHistory = [...prevHistory];
          
          // Add each new entry, avoiding duplicates
          newHistoryEntries.forEach(newEntry => {
            const existingIndex = updatedHistory.findIndex(
              entry => entry.date === newEntry.date && entry.practiceId === newEntry.practiceId
            );
            if (existingIndex >= 0) {
              // Update existing entry
              updatedHistory[existingIndex] = newEntry;
            } else {
              // Add new entry
              updatedHistory.unshift(newEntry);
            }
          });
          
          return updatedHistory;
        });
      }

      // Reset all counter states
      setCounterStates(prevStates => ({
        ...prevStates,
        ...updatedCounterStates
      }));

      console.log(`Global daily reset completed. Archived ${newHistoryEntries.length} entries and reset ${Object.keys(updatedCounterStates).length} counters.`);
    }
  };

  /**
   * Generates data for the Last 7 Days view using persistent history
   */
  const getLast7DaysData = (
    history: HistoryEntry[],
    todayProgress: number,
    dailyGoal: number
  ) => {
    const days = [];
    const today = new Date();

    // Generate last 7 days (including today)
    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - offset);
      const dateString = date.toDateString();
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
      const isToday = offset === 0;

      let practiceCount = 0;
      let goalAchieved = false;

      if (isToday) {
        // For today, use live data
        practiceCount = todayProgress;
        goalAchieved = todayProgress >= dailyGoal;
      } else {
        // For past days, use persistent history
        const historyEntry = history.find(entry => entry.date === dateString);
        if (historyEntry) {
          practiceCount = historyEntry.count;
          goalAchieved = historyEntry.goalAchieved;
        }
        // If no history entry found, practiceCount remains 0
      }

      days.push({
        date,
        dateString,
        dayName,
        practiceCount,
        goalAchieved,
        isToday,
      });
    }

    return days;
  };

  return (
    <PracticeContext.Provider value={{ 
      undoLastCount, 
      archivePreviousDayIfNeeded,
      performGlobalDailyReset,
      getLast7DaysData
    }}>
      {children}
    </PracticeContext.Provider>
  );
}

export function usePractice() {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
}
