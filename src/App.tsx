import { useState, useEffect, useRef } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { CountersScreen } from "./components/CountersScreen";
import { PracticeJournalScreen } from "./components/PracticeJournalScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { BottomNavigation } from "./components/BottomNavigation";
import { BootScreen } from "./components/BootScreen";
import { WelcomingRitualStep1 } from "./components/WelcomingRitualStep1";
import { WelcomingRitualStep2 } from "./components/WelcomingRitualStep2";
import { WelcomingRitualStep3 } from "./components/WelcomingRitualStep3";
import { AddCounterModal } from "./components/AddCounterModal";
import { EditPracticeScreen } from "./components/EditPracticeScreen";
import { AddPracticeScreen } from "./components/AddPracticeScreen";
import { PracticeProvider } from "./contexts/PracticeContext";
import { HapticsService } from "./utils/haptics";
import { VolumeButtons } from "@capacitor-community/volume-buttons";
import { toast } from "sonner@2.0.3";

interface Counter {
  id: string;
  name: string;
  color: string;
  cycleCount: number;
  dailyGoal: number;
}

interface CounterState {
  [counterId: string]: {
    currentCount: number;
    todayProgress: number;
    lastCountDate: string;
  };
}

interface HistoryEntry {
  date: string;
  count: number;
  goalAchieved: boolean;
}

interface JournalEntry {
  date: string;
  reflection: string;
}

interface Settings {
  hapticFeedback: boolean;
  volumeKeyControl: boolean;
}

type OnboardingStep = "greeting" | "practice" | "affirmation";
type AppScreen = "home" | "history" | "counters" | "settings" | "edit-practice" | "add-practice";

export default function App() {
  // Core state
  const [isBooting, setIsBooting] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("greeting");
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [isNotificationPending, setIsNotificationPending] = useState(false);
  
  // Counter management
  const [counters, setCounters] = useState<Counter[]>([]);
  const [activeCounterId, setActiveCounterId] = useState<string>("");
  const [counterStates, setCounterStates] = useState<CounterState>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(0);
  
  // Settings
  const [settings, setSettings] = useState<Settings>({
    hapticFeedback: true,
    volumeKeyControl: false
  });
  
  // UI state
  const [isAddCounterModalOpen, setIsAddCounterModalOpen] = useState(false);
  const [editingCounterId, setEditingCounterId] = useState<string>("");
  const [onboardingData, setOnboardingData] = useState<{
    userName: string;
    practiceData?: {
      cycleCount: number;
      name: string;
      theme: any;
      dailyGoal: number;
    };
  }>({ userName: "" });
  
  // Store userName separately for easy access
  const [userName, setUserName] = useState("");

  // Refs for volume control to avoid stale closures
  const handleIncrementRef = useRef<() => void>();
  const handleDecrementRef = useRef<() => void>();

  // Initialize app on first load
  useEffect(() => {
    // Only check saved data after boot screen completes
    if (!isBooting) {
      const savedOnboarding = localStorage.getItem("divine-counter-onboarded");
      const savedCounters = localStorage.getItem("divine-counter-counters");
      const savedStates = localStorage.getItem("divine-counter-states");
      const savedHistory = localStorage.getItem("divine-counter-history");
      const savedJournalEntries = localStorage.getItem("divine-counter-journal");
      const savedSettings = localStorage.getItem("divine-counter-settings");
      const savedActiveCounter = localStorage.getItem("divine-counter-active");

      if (savedOnboarding && savedCounters) {
        setIsOnboarding(false);
        setCounters(JSON.parse(savedCounters));
        
        if (savedStates) setCounterStates(JSON.parse(savedStates));
        if (savedHistory) setHistory(JSON.parse(savedHistory));
        if (savedJournalEntries) setJournalEntries(JSON.parse(savedJournalEntries));
        if (savedSettings) setSettings(JSON.parse(savedSettings));
        if (savedActiveCounter) setActiveCounterId(savedActiveCounter);
        
        // Load stored userName
        const savedUserName = localStorage.getItem("divine-counter-username");
        if (savedUserName) setUserName(savedUserName);
      }
    }
  }, [isBooting]);


  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem("divine-counter-onboarded", "true");
    localStorage.setItem("divine-counter-counters", JSON.stringify(counters));
    localStorage.setItem("divine-counter-states", JSON.stringify(counterStates));
    localStorage.setItem("divine-counter-history", JSON.stringify(history));
    localStorage.setItem("divine-counter-journal", JSON.stringify(journalEntries));
    localStorage.setItem("divine-counter-settings", JSON.stringify(settings));
    localStorage.setItem("divine-counter-active", activeCounterId);
    localStorage.setItem("divine-counter-username", userName);
  };

  useEffect(() => {
    if (!isOnboarding) {
      saveData();
    }
  }, [counters, counterStates, history, journalEntries, settings, activeCounterId, userName, isOnboarding]);

  // Calculate streak
  useEffect(() => {
    if (history.length === 0) {
      setStreak(0);
      return;
    }

    let currentStreak = 0;
    const today = new Date().toDateString();
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const entry of sortedHistory) {
      if (entry.goalAchieved) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
  }, [history]);

  // Onboarding handlers
  const handleGreetingNext = (userName: string) => {
    setOnboardingData(prev => ({ ...prev, userName }));
    setOnboardingStep("practice");
  };

  const handlePracticeNext = (practiceData: any) => {
    setOnboardingData(prev => ({ ...prev, practiceData }));
    setOnboardingStep("affirmation");
  };

  const handleOnboardingComplete = () => {
    if (!onboardingData.practiceData) return;
    
    const { practiceData } = onboardingData;
    
    // Store userName
    setUserName(onboardingData.userName);
    
    // Create the first counter
    const counter: Counter = {
      id: Date.now().toString(),
      name: practiceData.name,
      color: practiceData.theme.accentColor,
      cycleCount: practiceData.cycleCount,
      dailyGoal: practiceData.dailyGoal
    };

    setCounters([counter]);
    setActiveCounterId(counter.id);
    setCounterStates({
      [counter.id]: {
        currentCount: 0,
        todayProgress: 0,
        lastCountDate: new Date().toDateString()
      }
    });
    
    setIsOnboarding(false);
    toast.success(`Welcome to your sacred practice, ${onboardingData.userName}! 🙏`);
  };

  // Counter actions
  const handleIncrement = () => {
    if (!activeCounterId) return;
    
    const counter = counters.find(c => c.id === activeCounterId);
    if (!counter) return;

    // Trigger haptic feedback on every tap if enabled
    if (settings.hapticFeedback) {
      HapticsService.tap();
    }

    const today = new Date().toDateString();
    const currentState = counterStates[activeCounterId] || {
      currentCount: 0,
      todayProgress: 0,
      lastCountDate: today
    };

    let newCount = currentState.currentCount + 1;
    let newTodayProgress = currentState.todayProgress;

    // Reset count if it reaches cycle limit
    if (newCount >= counter.cycleCount && !isNotificationPending) {
      newCount = 0;
      newTodayProgress++;
      
      // Set notification flag to prevent duplicates
      setIsNotificationPending(true);
      
      // Show completion feedback
      toast.success("Mala complete! 🎉");
      
      // Always trigger celebratory haptic feedback on mala completion
      HapticsService.completion();
      
      // Reset notification flag after a short delay
      setTimeout(() => {
        setIsNotificationPending(false);
      }, 1000);
    }

    // Reset daily progress if new day
    if (currentState.lastCountDate !== today) {
      newTodayProgress = newCount >= counter.cycleCount ? 1 : 0;
      
      // Update history for previous day
      if (currentState.todayProgress > 0) {
        const newEntry: HistoryEntry = {
          date: currentState.lastCountDate,
          count: currentState.todayProgress,
          goalAchieved: currentState.todayProgress >= counter.dailyGoal
        };
        setHistory(prev => [newEntry, ...prev.slice(0, 29)]); // Keep last 30 days
      }
    }

    setCounterStates(prev => ({
      ...prev,
      [activeCounterId]: {
        currentCount: newCount,
        todayProgress: newTodayProgress,
        lastCountDate: today
      }
    }));
  };

  const handleDecrement = () => {
    if (!activeCounterId) return;
    
    const currentState = counterStates[activeCounterId];
    if (!currentState || currentState.currentCount <= 0) return;

    // Trigger haptic feedback for undo action if enabled
    if (settings.hapticFeedback) {
      HapticsService.action();
    }

    setCounterStates(prev => ({
      ...prev,
      [activeCounterId]: {
        ...currentState,
        currentCount: currentState.currentCount - 1
      }
    }));
  };

  const resetCurrentCount = () => {
    if (!activeCounterId) return;
    
    const currentState = counterStates[activeCounterId];
    if (!currentState) return;

    // Trigger haptic feedback for reset action if enabled
    if (settings.hapticFeedback) {
      HapticsService.action();
    }

    setCounterStates(prev => ({
      ...prev,
      [activeCounterId]: {
        ...currentState,
        currentCount: 0
        // Note: todayProgress and lastCountDate remain unchanged
      }
    }));
  };

  // Update refs to avoid stale closures
  useEffect(() => {
    handleIncrementRef.current = handleIncrement;
    handleDecrementRef.current = handleDecrement;
  }, [handleIncrement, handleDecrement]);

  // Volume key control
  useEffect(() => {
    if (!settings.volumeKeyControl) {
      console.log('Volume key control is disabled');
      return;
    }

    let listener: any = null;

    const setupVolumeControl = async () => {
      try {
        console.log('Setting up volume key control...');
        await VolumeButtons.startListening();
        
        listener = await VolumeButtons.addListener('volumeButtonPressed', (event) => {
          console.log('Volume button pressed:', event);
          
          if (event.direction === 'up' && handleIncrementRef.current) {
            console.log('Volume UP pressed - incrementing count');
            handleIncrementRef.current();
          } else if (event.direction === 'down' && handleDecrementRef.current) {
            console.log('Volume DOWN pressed - decrementing count');
            handleDecrementRef.current();
          }
        });
        
        console.log('Volume key control activated successfully');
        toast.success('Volume key control enabled');
      } catch (error) {
        console.error('Volume key control setup failed:', error);
        toast.error('Volume key control not available on this device');
      }
    };

    setupVolumeControl();

    // Cleanup function
    return () => {
      if (listener) {
        try {
          VolumeButtons.removeAllListeners();
          VolumeButtons.stopListening();
          console.log('Volume key control deactivated');
        } catch (error) {
          console.warn('Error during volume control cleanup:', error);
        }
      }
    };
  }, [settings.volumeKeyControl, activeCounterId]);

  const handleCycleComplete = () => {
    // This is handled in handleIncrement
  };

  // Counter management
  const handleSelectCounter = (counterId: string) => {
    setActiveCounterId(counterId);
    setCurrentScreen("home");
  };

  const handleAddCounter = (counterData: Omit<Counter, "id">) => {
    const counter: Counter = {
      ...counterData,
      id: Date.now().toString()
    };

    setCounters(prev => [...prev, counter]);
    setCounterStates(prev => ({
      ...prev,
      [counter.id]: {
        currentCount: 0,
        todayProgress: 0,
        lastCountDate: new Date().toDateString()
      }
    }));
    
    toast.success(`${counter.name} counter added!`);
  };

  const handleEditCounter = (counterId: string) => {
    setEditingCounterId(counterId);
    setCurrentScreen("edit-practice");
  };

  const handleUpdateCounter = (updatedCounter: Counter) => {
    setCounters(prev => prev.map(counter => 
      counter.id === updatedCounter.id ? updatedCounter : counter
    ));
    setCurrentScreen("counters");
    setEditingCounterId("");
    toast.success(`${updatedCounter.name} updated successfully!`);
  };

  const handleDeleteCounter = (counterId: string) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter) return;

    // Trigger haptic feedback for delete action if enabled
    if (settings.hapticFeedback) {
      HapticsService.action();
    }

    // Remove counter from list
    setCounters(prev => prev.filter(c => c.id !== counterId));
    
    // Remove counter state
    setCounterStates(prev => {
      const newStates = { ...prev };
      delete newStates[counterId];
      return newStates;
    });
    
    // Remove from history (filter out entries for this counter if needed)
    // For now, we'll keep history as it might be useful for data migration
    
    // If deleted counter was active, switch to first available counter
    if (activeCounterId === counterId) {
      const remainingCounters = counters.filter(c => c.id !== counterId);
      setActiveCounterId(remainingCounters.length > 0 ? remainingCounters[0].id : "");
    }
    
    toast.success(`${counter.name} deleted`);
  };

  const handleNavigateToOnboarding = () => {
    setIsOnboarding(true);
    setOnboardingStep("practice");
    setOnboardingData(prev => ({ ...prev, userName }));
  };

  // Settings handlers
  const handleSettingToggle = (setting: keyof Settings) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleResetTutorial = () => {
    // Trigger haptic feedback for reset tutorial action if enabled
    if (settings.hapticFeedback) {
      HapticsService.action();
    }

    setIsOnboarding(true);
    setOnboardingStep("greeting");
    setOnboardingData({ userName: "" });
    setUserName("");
  };

  // Journal handlers
  const handleAddJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => {
      const existing = prev.findIndex(e => e.date === entry.date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = entry;
        return updated;
      }
      return [...prev, entry];
    });
    toast.success("Reflection saved 🙏");
  };

  // Get current counter and state
  const activeCounter = counters.find(c => c.id === activeCounterId);
  const activeCounterState = activeCounterId ? counterStates[activeCounterId] : null;

  // Show boot screen first
  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  if (isOnboarding) {
    return (
      <div className="min-h-screen">
        {onboardingStep === "greeting" && (
          <WelcomingRitualStep1 onNext={handleGreetingNext} />
        )}
        {onboardingStep === "practice" && (
          <WelcomingRitualStep2
            userName={onboardingData.userName}
            onNext={handlePracticeNext}
            onBack={() => setOnboardingStep("greeting")}
          />
        )}
        {onboardingStep === "affirmation" && onboardingData.practiceData && (
          <WelcomingRitualStep3
            userName={onboardingData.userName}
            practiceData={onboardingData.practiceData}
            onComplete={handleOnboardingComplete}
            onBack={() => setOnboardingStep("practice")}
          />
        )}
      </div>
    );
  }

  return (
    <div 
        className="min-h-screen bg-background"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
      {/* Main Content Area with proper spacing for bottom navigation */}
      <div className="pb-20">
          {currentScreen === "home" && activeCounter && activeCounterState && (
          <PracticeProvider onDecrement={handleDecrement}>
            <HomeScreen
              counter={activeCounter}
              currentCount={activeCounterState.currentCount}
              todayProgress={activeCounterState.todayProgress}
              streak={streak}
              userName={userName}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onCycleComplete={handleCycleComplete}
              onResetCurrentCount={resetCurrentCount}
            />
          </PracticeProvider>
          )}
        
        {currentScreen === "history" && activeCounter && activeCounterState && (
          <PracticeJournalScreen
            todayProgress={activeCounterState.todayProgress}
            dailyGoal={activeCounter.dailyGoal}
            streak={streak}
            history={history}
            journalEntries={journalEntries}
            onAddJournalEntry={handleAddJournalEntry}
          />
        )}
        
        {currentScreen === "counters" && (
          <CountersScreen
            counters={counters}
            activeCounterId={activeCounterId}
            counterStates={counterStates}
            onSelectCounter={handleSelectCounter}
            onAddCounter={() => setIsAddCounterModalOpen(true)}
            onEditCounter={handleEditCounter}
            onDeleteCounter={handleDeleteCounter}
            onNavigateToAddPractice={() => setCurrentScreen("add-practice")}
          />
        )}
        
        {currentScreen === "settings" && (
          <SettingsScreen
            hapticFeedback={settings.hapticFeedback}
            onHapticFeedbackToggle={() => handleSettingToggle("hapticFeedback")}
            volumeKeyControl={settings.volumeKeyControl}
            onVolumeKeyControlToggle={() => handleSettingToggle("volumeKeyControl")}
            onResetTutorial={handleResetTutorial}
          />
        )}

        {currentScreen === "edit-practice" && editingCounterId && (
          <EditPracticeScreen
            counter={counters.find(c => c.id === editingCounterId)!}
            onSave={handleUpdateCounter}
            onBack={() => setCurrentScreen("counters")}
          />
        )}

        {currentScreen === "add-practice" && (
          <AddPracticeScreen
            onSave={handleAddCounter}
            onBack={() => setCurrentScreen("counters")}
          />
        )}
      </div>

      {/* Bottom Navigation - Fixed at bottom */}
      {currentScreen !== "edit-practice" && currentScreen !== "add-practice" && (
        <BottomNavigation
          activeScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen as AppScreen)}
        />
      )}

      <AddCounterModal
        isOpen={isAddCounterModalOpen}
        onClose={() => setIsAddCounterModalOpen(false)}
        onAdd={handleAddCounter}
      />
    </div>
  );
}