import React, { useState, useEffect, useCallback, useRef } from "react";
import { Haptics, NotificationType, ImpactStyle } from "@capacitor/haptics";
import { LocalNotifications } from "@capacitor/local-notifications";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { HomeScreen } from "./components/HomeScreen";
import { CountersScreen } from "./components/CountersScreen";
import { PracticeJournalScreen } from "./components/PracticeJournalScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import {
  AboutPage,
  PrivacyPolicyPage,
  TermsOfServicePage
} from "./components/info";
import { BottomNavigation } from "./components/BottomNavigation";
import { BootScreen } from "./components/BootScreen";
import { WelcomingRitualStep1 } from "./components/WelcomingRitualStep1";
import { WelcomingRitualStep2 } from "./components/WelcomingRitualStep2";
import { WelcomingRitualStep3 } from "./components/WelcomingRitualStep3";
import { AddCounterModal } from "./components/AddCounterModal";
import { EditPracticeScreen } from "./components/EditPracticeScreen";
import { AddPracticeScreen } from "./components/AddPracticeScreen";
import { toast } from "sonner";
import { REWARDS, STREAK_MILESTONES, getRewardsByStreak, Reward, StreakMilestone } from "./data/rewards";
import { RewardUnlockModal } from "./components/RewardUnlockModal";
import { VolumeButtonTester } from "./components/VolumeButtonTester";
import { calculateAndUpdateStreak } from "./utils/streaks";

// --- Helper Functions ---
const MAX_HISTORY_ENTRIES = 365;

const hydrateMilestones = (savedMilestones?: StreakMilestone[]): StreakMilestone[] => {
  return STREAK_MILESTONES.map(base => {
    const saved = savedMilestones?.find(m => m.days === base.days);
    return {
      ...base,
      isAchieved: saved?.isAchieved ?? false,
      achievedAt: saved?.achievedAt,
    };
  });
};

const parseReminderTime = (time: string): { hour: number; minute: number } | null => {
  if (!time || typeof time !== "string") return null;
  const [hourStr, minuteStr] = time.split(":");
  if (hourStr === undefined || minuteStr === undefined) return null;
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return {
    hour: Math.max(0, Math.min(23, hour)),
    minute: Math.max(0, Math.min(59, minute)),
  };
};

const computeNotificationId = (counterId: string): number => {
  // Always use hash-based approach to ensure we stay within 32-bit integer limits
  // This prevents issues with IDs that were created using Date.now()
  let hash = 0;
  for (let i = 0; i < counterId.length; i += 1) {
    hash = (hash * 31 + counterId.charCodeAt(i)) % 2147483647;
  }
  // Ensure we return a positive integer between 1 and 2147483647 (max Java int)
  return Math.abs(hash) || 1;
};

const generateUniqueIntId = (): number => {
  const maxInt = 2147483647;
  return Math.floor(Math.random() * maxInt);
};

const hydrateCounter = (raw: Partial<Counter> & { id: string | number }): Counter => {
  const reminderEnabled = Boolean(raw.reminderEnabled);
  const reminderTime = raw.reminderTime && /^\d{2}:\d{2}$/.test(raw.reminderTime)
    ? raw.reminderTime
    : "09:00";

  return {
    id: String(raw.id ?? generateUniqueIntId()),
    name: raw.name || "Practice",
    color: raw.color || "#D4AF37",
    cycleCount: raw.cycleCount ?? 108,
    dailyGoal: raw.dailyGoal ?? 3,
    icon: raw.icon || "lotus",
    reminderEnabled,
    reminderTime,
  };
};

// --- Interfaces ---
interface Counter {
  id: string;
  name: string;
  color: string;
  cycleCount: number;
  dailyGoal: number;
  icon?: string;
  reminderEnabled: boolean;
  reminderTime: string;
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
  practiceId: string;
}
interface JournalEntry {
  date: string;
  reflection: string;
}
interface Settings {
  hapticsEnabled: boolean;
  volumeKeyControl: boolean;
}
type OnboardingStep = "greeting" | "practice" | "affirmation";
type AppScreen =
  | "home"
  | "history"
  | "counters"
  | "settings"
  | "edit-practice"
  | "add-practice"
  | "about"
  | "privacy"
  | "terms";

// --- Main App Component ---
export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState("greeting" as OnboardingStep);
  const [currentScreen, setCurrentScreen] = useState("home" as AppScreen);
  const [isNotificationPending, setIsNotificationPending] = useState(false);
  const [counters, setCounters] = useState([] as Counter[]);
  const [activeCounterId, setActiveCounterId] = useState("");
  const [counterStates, setCounterStates] = useState({} as CounterState);
  const [history, setHistory] = useState([] as HistoryEntry[]);
  const [journalEntries, setJournalEntries] = useState([] as JournalEntry[]);
  const [streak, setStreak] = useState(0);
  const [settings, setSettings] = useState({
    hapticsEnabled: true,
    volumeKeyControl: true
  } as Settings);
  const [isAddCounterModalOpen, setIsAddCounterModalOpen] = useState(false);
  const [editingCounterId, setEditingCounterId] = useState("");
  const [onboardingData, setOnboardingData] = useState({ userName: "" } as { userName: string; practiceData?: any; });
  const [userName, setUserName] = useState("");
  
  // Reward System State
  const [rewards, setRewards] = useState(REWARDS.map(reward => ({ ...reward, isUnlocked: false })) as Reward[]);
  const [milestones, setMilestones] = useState(() => hydrateMilestones());
  const [unlockedRewards, setUnlockedRewards] = useState([] as string[]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [newRewards, setNewRewards] = useState([] as Reward[]);
  const [newReward, setNewReward] = useState(null as Reward | null);
  const [pendingRewards, setPendingRewards] = useState([] as Reward[]);
  const [longestStreak, setLongestStreak] = useState(0);
  const notificationPermissionRequestedRef = useRef(false);
  const hasSyncedRemindersRef = useRef(false);

  const ensureNotificationPermissions = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    try {
      const permissionStatus = await LocalNotifications.checkPermissions();
      if (permissionStatus.display === 'granted') {
        return true;
      }

      if (!notificationPermissionRequestedRef.current) {
        notificationPermissionRequestedRef.current = true;
        const requestStatus = await LocalNotifications.requestPermissions();
        if (requestStatus.display === 'granted') {
          return true;
        }
      }

      toast.error("Notifications are disabled. Enable them in settings to receive reminders.");
    } catch (error) {
      console.error("Failed to request notification permissions", error);
    }

    return false;
  }, []);

  const cancelReminderForCounter = useCallback(async (counterId: string) => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      const id = computeNotificationId(counterId);
    await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch (error) {
      console.error("Failed to cancel reminder", error);
    }
  }, []);

  const scheduleReminderForCounter = useCallback(async (counter: Counter) => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const notificationId = computeNotificationId(counter.id);

    try {
      await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
    } catch (error) {
      console.error("Failed to cancel existing reminder", error);
    }

    if (!counter.reminderEnabled) {
      return;
    }

    const permissionGranted = await ensureNotificationPermissions();
    if (!permissionGranted) {
      return;
    }

    const time = parseReminderTime(counter.reminderTime);
    if (!time) {
      console.warn("Invalid reminder time, skipping schedule", counter.reminderTime);
      return;
    }

    try {
      const notificationId = computeNotificationId(counter.id);
      console.log('--- DEBUGGING NOTIFICATION ---');
      console.log('Scheduling for practice:', counter.name);
      console.log('Original Practice ID from state:', counter.id, '(type: ' + typeof counter.id + ')');
      console.log('Safe notification ID generated:', notificationId, '(type: ' + typeof notificationId + ')');
      console.log('------------------------------');
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title: `Time for your ${counter.name} practice`,
            body: "A moment for your daily ritual. Let's begin. 🙏",
            schedule: {
              repeats: true,
              every: 'day',
              on: { hour: time.hour, minute: time.minute },
              allowWhileIdle: true,
            },
          },
        ],
      });
    } catch (error) {
      console.error("Failed to schedule reminder", error);
    }
  }, [ensureNotificationPermissions]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    if (isBooting || isOnboarding) {
      return;
    }
    if (hasSyncedRemindersRef.current) {
      return;
    }

    hasSyncedRemindersRef.current = true;

    counters.forEach(counter => {
      if (counter.reminderEnabled) {
        scheduleReminderForCounter(counter);
      } else {
        cancelReminderForCounter(counter.id);
      }
    });
  }, [isBooting, isOnboarding, counters, scheduleReminderForCounter, cancelReminderForCounter]);

  // Load data from localStorage on initial load
  useEffect(() => {
    if (!isBooting) {
      const savedOnboarding = localStorage.getItem("divine-counter-onboarded");
      if (savedOnboarding) {
        setIsOnboarding(false);
        const savedActiveCounterId = localStorage.getItem("divine-counter-active") || "";
        const storedCounters = JSON.parse(localStorage.getItem("divine-counter-counters") || '[]');
        const hydratedCounters = storedCounters.map((counter: Counter) => hydrateCounter(counter));
        setCounters(hydratedCounters);
        setCounterStates(JSON.parse(localStorage.getItem("divine-counter-states") || '{}'));
        const rawHistory = JSON.parse(localStorage.getItem("divine-counter-history") || '[]');
        const legacyFallbackId =
          hydratedCounters.length === 1
            ? hydratedCounters[0].id
            : savedActiveCounterId || 'legacy';
        const normalizedHistory = Array.isArray(rawHistory)
          ? rawHistory.map((entry: any) => ({
              ...entry,
              practiceId: typeof entry.practiceId === 'string' && entry.practiceId.length > 0
                ? entry.practiceId
                : legacyFallbackId,
            }))
          : [];
        setHistory(normalizedHistory);
        setJournalEntries(JSON.parse(localStorage.getItem("divine-counter-journal") || '[]'));
        setSettings(JSON.parse(localStorage.getItem("divine-counter-settings") || '{"hapticsEnabled":true,"volumeKeyControl":true}'));
        setActiveCounterId(savedActiveCounterId);
        setUserName(localStorage.getItem("divine-counter-username") || "");
        setUnlockedRewards(JSON.parse(localStorage.getItem("divine-counter-unlocked-rewards") || '[]'));
        setLongestStreak(parseInt(localStorage.getItem("divine-counter-longest-streak") || '0'));
        const savedMilestones = localStorage.getItem("divine-counter-milestones");
        setMilestones(hydrateMilestones(savedMilestones ? JSON.parse(savedMilestones) : undefined));
        setRewards(JSON.parse(localStorage.getItem("divine-counter-rewards") || JSON.stringify(REWARDS.map(reward => ({ ...reward, isUnlocked: false })))));
      }
    }
  }, [isBooting]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isOnboarding && !isBooting) {
    localStorage.setItem("divine-counter-onboarded", "true");
    localStorage.setItem("divine-counter-counters", JSON.stringify(counters));
    localStorage.setItem("divine-counter-states", JSON.stringify(counterStates));
    localStorage.setItem("divine-counter-history", JSON.stringify(history));
    localStorage.setItem("divine-counter-journal", JSON.stringify(journalEntries));
    localStorage.setItem("divine-counter-settings", JSON.stringify(settings));
    localStorage.setItem("divine-counter-active", activeCounterId);
    localStorage.setItem("divine-counter-username", userName);
    localStorage.setItem("divine-counter-unlocked-rewards", JSON.stringify(unlockedRewards));
    localStorage.setItem("divine-counter-longest-streak", longestStreak.toString());
    localStorage.setItem("divine-counter-milestones", JSON.stringify(milestones));
    localStorage.setItem("divine-counter-rewards", JSON.stringify(rewards));
    }
  }, [counters, counterStates, history, journalEntries, settings, activeCounterId, userName, isOnboarding, isBooting, milestones, rewards, unlockedRewards, longestStreak]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const mainScreens: AppScreen[] = ["home", "history", "counters", "settings"];

    const backHandler = CapacitorApp.addListener("backButton", () => {
      if (isOnboarding) {
        if (onboardingStep === "affirmation") {
          setOnboardingStep("practice");
          return;
        }

        if (onboardingStep === "practice") {
          setOnboardingStep("greeting");
          return;
        }

        CapacitorApp.exitApp();
        return;
      }

      if (showRewardModal) {
        setShowRewardModal(false);
        return;
      }

      if (isAddCounterModalOpen) {
        setIsAddCounterModalOpen(false);
        return;
      }

      if (currentScreen === "add-practice" || currentScreen === "edit-practice") {
        setCurrentScreen("counters");
        return;
      }

      if (mainScreens.includes(currentScreen)) {
        CapacitorApp.exitApp();
        return;
      }
    });

    return () => {
      backHandler.remove();
    };
  }, [currentScreen, isAddCounterModalOpen, isOnboarding, onboardingStep, showRewardModal]);

  // Detect day change based on local time and roll over progress/history
  useEffect(() => {
    if (isBooting || isOnboarding || !activeCounterId) {
      return;
    }

    const currentState = counterStates[activeCounterId];
    if (!currentState) {
      return;
    }

    const todayString = new Date().toDateString();
    if (currentState.lastCountDate === todayString) {
      return;
    }

    const counter = counters.find(c => c.id === activeCounterId);
    if (!counter) {
      return;
    }

    if (currentState.todayProgress > 0) {
      const newEntry: HistoryEntry = {
        date: currentState.lastCountDate,
        count: currentState.todayProgress,
        goalAchieved: currentState.todayProgress >= counter.dailyGoal,
        practiceId: counter.id,
      };

      setHistory(prev => {
        const deduped = prev.filter(
          entry => !(entry.date === newEntry.date && entry.practiceId === newEntry.practiceId)
        );
        const updated = [newEntry, ...deduped];
        return updated.slice(0, MAX_HISTORY_ENTRIES);
      });
    }

    setCounterStates(prev => {
      const existing = prev[activeCounterId];
      if (!existing) {
        return prev;
      }

      return {
        ...prev,
        [activeCounterId]: {
          ...existing,
          todayProgress: 0,
          lastCountDate: todayString,
        },
      };
    });
  }, [isBooting, isOnboarding, activeCounterId, counterStates, counters]);

  // Reward system - queue new rewards when streak reaches unlock thresholds
  useEffect(() => {
    if (streak <= 0 || pendingRewards.length > 0) {
      return;
    }

    const rewardsForStreak = getRewardsByStreak(streak, rewards);
    const lockedRewards = rewardsForStreak.filter(reward => !reward.isUnlocked);

    if (lockedRewards.length === 0) {
      return;
    }

    setPendingRewards(lockedRewards);
    setNewReward(lockedRewards[0]);
  }, [streak, rewards, pendingRewards]);

  // Reward system - unlock queued rewards and trigger celebration UI
  useEffect(() => {
    if (!pendingRewards.length || !newReward) {
      return;
    }

    const unlockTimestamp = new Date().toISOString();

    setRewards(prev => prev.map(reward =>
      pendingRewards.some(pending => pending.id === reward.id)
        ? { ...reward, isUnlocked: true, unlockedAt: unlockTimestamp }
        : reward
    ));

    setUnlockedRewards(prev => {
      const idsToAdd = pendingRewards.map(reward => reward.id);
      const merged = new Set([...prev, ...idsToAdd]);
      return Array.from(merged);
    });

    setNewRewards(pendingRewards.map(reward => ({
      ...reward,
      isUnlocked: true,
      unlockedAt: unlockTimestamp
    })));

    setShowRewardModal(true);

    toast.success(`🎉 New Reward Unlocked: ${newReward.name}!`, {
      duration: 4000,
    });

    setPendingRewards([]);
  }, [pendingRewards, newReward]);

  // Streak calculation & milestone persistence
  useEffect(() => {
    if (isOnboarding) {
      return;
    }

    setMilestones((previousMilestones) => {
      const { currentStreak: calculatedStreak, milestones: updatedMilestones } = calculateAndUpdateStreak(
        history,
        previousMilestones
      );

      setStreak(calculatedStreak);
      setLongestStreak((prev) => Math.max(prev, calculatedStreak));

      updatedMilestones.forEach((milestone, index) => {
        const wasAchieved = previousMilestones[index]?.isAchieved;
        if (!wasAchieved && milestone.isAchieved) {
          toast.success(`🎉 Milestone Achieved! ${milestone.days}-day streak unlocked.`);
        }
      });

      if (updatedMilestones === previousMilestones) {
        return previousMilestones;
      }

      return updatedMilestones;
    });
  }, [history, isOnboarding]);

  // Onboarding handlers (No Changes)
  const handleGreetingNext = (name: string) => {
    setOnboardingData({ userName: name });
    setOnboardingStep("practice");
  };
  const handlePracticeNext = (data: any) => {
    setOnboardingData(prev => ({ ...prev, practiceData: data }));
    setOnboardingStep("affirmation");
  };
  const handleOnboardingComplete = async () => {
    if (!onboardingData.practiceData) return;
    setUserName(onboardingData.userName);
    const counterId = generateUniqueIntId();
    const counter: Counter = {
      id: String(counterId),
      name: onboardingData.practiceData.name,
      color: onboardingData.practiceData.theme.accentColor,
      cycleCount: onboardingData.practiceData.cycleCount,
      dailyGoal: onboardingData.practiceData.dailyGoal,
      icon: 'lotus',
      reminderEnabled: onboardingData.practiceData.reminderEnabled ?? false,
      reminderTime: onboardingData.practiceData.reminderTime || "09:00",
    };
    setCounters([counter]);
    setActiveCounterId(counter.id);
    setCounterStates({ [counter.id]: { currentCount: 0, todayProgress: 0, lastCountDate: new Date().toDateString() } });
    setCurrentScreen("home");
    setOnboardingStep("greeting");
    setIsOnboarding(false);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    toast.success(`Welcome, ${onboardingData.userName}! 🙏`);

    if (counter.reminderEnabled) {
      await scheduleReminderForCounter(counter);
    }
  };

  // Counter Actions - CORRECTED HAPTIC LOGIC
  const handleIncrement = useCallback(() => {
    if (!activeCounterId) return;
    const counter = counters.find(c => c.id === activeCounterId);
    if (!counter) return;

    if (settings.hapticsEnabled && Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    }

    const today = new Date().toDateString();
    const currentState = counterStates[activeCounterId] || { currentCount: 0, todayProgress: 0, lastCountDate: today };
    let newCount = currentState.currentCount + 1;
    let newTodayProgress = currentState.todayProgress;

    // Check if cycle is completed
    if (newCount >= counter.cycleCount && !isNotificationPending) {
      // Cycle completed - reset count and increment today's progress
      newCount = 0;
      newTodayProgress++;
      setIsNotificationPending(true);
      
      // Haptic feedback for cycle completion
      if (settings.hapticsEnabled && Capacitor.isNativePlatform()) {
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
        Haptics.notification({ type: NotificationType.Success }).catch(() => {});
      }
      
      toast.success("Cycle complete! 🎉");
      setTimeout(() => setIsNotificationPending(false), 1000);
    }

    // Handle day change
    if (currentState.lastCountDate !== today) {
      // Save previous day's progress to history
      if (currentState.todayProgress > 0) {
        const newEntry: HistoryEntry = {
          date: currentState.lastCountDate,
          count: currentState.todayProgress,
          goalAchieved: currentState.todayProgress >= counter.dailyGoal,
          practiceId: counter.id
        };
        setHistory(prev => {
          const deduped = prev.filter(
            entry => !(entry.date === newEntry.date && entry.practiceId === newEntry.practiceId)
          );
          const updated = [newEntry, ...deduped];
          return updated.slice(0, MAX_HISTORY_ENTRIES);
        });
      }
    }

    setCounterStates(prev => ({ ...prev, [activeCounterId]: { currentCount: newCount, todayProgress: newTodayProgress, lastCountDate: today } }));
  }, [activeCounterId, counters, settings.hapticsEnabled, counterStates, isNotificationPending]);

  const handleDecrement = useCallback(() => {
    if (!activeCounterId) return;
    const currentState = counterStates[activeCounterId];
    if (!currentState || currentState.currentCount <= 0) return;

    if (settings.hapticsEnabled && Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    }

    setCounterStates(prev => ({ ...prev, [activeCounterId]: { ...currentState, currentCount: currentState.currentCount - 1 } }));
  }, [activeCounterId, counterStates, settings.hapticsEnabled]);

  useEffect(() => {
    if (!settings.volumeKeyControl) {
      console.log("✋ Volume key control is disabled");
      return;
    }

    if (!activeCounterId) {
      console.log("⚠️ Volume key control requires an active counter");
      return;
    }

    if (!Capacitor.isNativePlatform()) {
      console.log("🌐 Volume key control is only available on native Android/iOS devices");
      return;
    }

    let isActive = true;
    let volumeButtons: typeof import("@capacitor-community/volume-buttons")["VolumeButtons"] | null = null;
    let modulePromise: Promise<typeof import("@capacitor-community/volume-buttons")> | null = null;

    const setupVolumeControl = async () => {
      try {
        console.log("🔧 Setting up volume key control...");
        modulePromise = import("@capacitor-community/volume-buttons");
        const module = await modulePromise;
        volumeButtons = module.VolumeButtons;

        if (!isActive) {
          return;
        }

        try {
          const status = await volumeButtons.isWatching();
          if (status.value) {
            await volumeButtons.clearWatch();
            console.log("🔄 Existing volume key control watcher cleared before re-initializing");
          }
        } catch (statusError) {
          console.log("⚠️ Unable to verify existing volume key control watcher", statusError);
        }

        await volumeButtons.watchVolume({ suppressVolumeIndicator: true }, (event) => {
          if (!isActive) {
            return;
          }

          if (event.direction === "up") {
            console.log("🔼 Volume UP pressed - incrementing count");
            handleIncrement();
          } else if (event.direction === "down") {
            console.log("🔽 Volume DOWN pressed - decrementing count");
            handleDecrement();
          }
        });

        console.log("✅ Volume buttons watcher started successfully!");
        console.log("📱 Press Volume UP to increment, Volume DOWN to decrement");
      } catch (error) {
        console.error("❌ Failed to set up volume key control:", error);
        toast.error("Failed to enable volume button control. Check console for details.");
      }
    };

    setupVolumeControl();

    return () => {
      isActive = false;

      (async () => {
        try {
          const module = volumeButtons
            ? { VolumeButtons: volumeButtons }
            : modulePromise
              ? await modulePromise
              : null;
          const buttons = module?.VolumeButtons;

          if (!buttons) {
            return;
          }

          try {
            await buttons.clearWatch();
            console.log("🛑 Volume key control watcher cleared");
          } catch (error) {
            if (error instanceof Error && error.message.includes("not been been watched")) {
              console.log("ℹ️ Volume key control watcher was already cleared");
              return;
            }
            throw error;
          }
        } catch (error) {
          console.error("❌ Failed to clean up volume key control:", error);
        }
      })();
    };
  }, [settings.volumeKeyControl, activeCounterId, handleIncrement, handleDecrement]);

  const resetCurrentCount = useCallback(() => {
    if (!activeCounterId) return;
    const currentState = counterStates[activeCounterId];
    if (!currentState) return;

    if (settings.hapticsEnabled) {
      Haptics.selectionStart();
    }

    setCounterStates(prev => ({ ...prev, [activeCounterId]: { ...currentState, currentCount: 0 } }));
  }, [activeCounterId, counterStates, settings.hapticsEnabled]);

  // Other handlers (No Changes)
  const handleCycleComplete = () => { /* Handled in increment */ };
  const handleSelectCounter = (id: string) => { setActiveCounterId(id); setCurrentScreen("home"); };
  const handleAddCounter = useCallback(async (data: Omit<Counter, "id">) => {
    const id = generateUniqueIntId();
    const newCounter = hydrateCounter({ ...data, id });

    setCounters(prev => [...prev, newCounter]);
    setCounterStates(prev => ({
      ...prev,
      [newCounter.id]: {
        currentCount: 0,
        todayProgress: 0,
        lastCountDate: new Date().toDateString(),
      },
    }));
    setActiveCounterId(newCounter.id);

    if (newCounter.reminderEnabled) {
      await scheduleReminderForCounter(newCounter);
    } else {
      await cancelReminderForCounter(newCounter.id);
    }

    toast.success("Practice added");
  }, [scheduleReminderForCounter, cancelReminderForCounter]);

  const handleEditCounter = useCallback((id: string) => {
    setEditingCounterId(id);
    setCurrentScreen("edit-practice");
  }, []);

  const handleUpdateCounter = useCallback(async (updated: Counter) => {
    const hydrated = hydrateCounter(updated);

    setCounters(prev => prev.map(counter => (counter.id === hydrated.id ? hydrated : counter)));

    if (hydrated.reminderEnabled) {
      await scheduleReminderForCounter(hydrated);
    } else {
      await cancelReminderForCounter(hydrated.id);
    }

    toast.success("Practice updated");
  }, [scheduleReminderForCounter, cancelReminderForCounter]);

  const handleDeleteCounter = useCallback(async (id: string) => {
    const remainingCounters = counters.filter(counter => counter.id !== id);
    setCounters(remainingCounters);
    setCounterStates(prev => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });

    if (activeCounterId === id) {
      setActiveCounterId(remainingCounters[0]?.id || "");
    }

    await cancelReminderForCounter(id);
    toast.success("Practice deleted");
  }, [cancelReminderForCounter, counters, activeCounterId]);
  const handleSettingToggle = (setting: keyof Settings) => { 
    setSettings(prev => {
      const newValue = !prev[setting];
      
      // Show feedback for volume key control
      if (setting === "volumeKeyControl") {
        if (Capacitor.isNativePlatform()) {
          toast.success(
            newValue 
              ? "Volume buttons enabled! Use volume keys to count." 
              : "Volume buttons disabled.",
            { duration: 3000 }
          );
        } else {
          toast.info(
            "Volume button control only works on Android/iOS devices. Build and deploy to test this feature.",
            { duration: 5000 }
          );
        }
      }
      
      return { ...prev, [setting]: newValue };
    });
  };
  const handleResetTutorial = useCallback(() => {
    const storageKeys = [
      "divine-counter-onboarded",
      "divine-counter-counters",
      "divine-counter-states",
      "divine-counter-history",
      "divine-counter-journal",
      "divine-counter-settings",
      "divine-counter-active",
      "divine-counter-username",
      "divine-counter-unlocked-rewards",
      "divine-counter-longest-streak",
      "divine-counter-milestones",
      "divine-counter-rewards",
    ];

    storageKeys.forEach((key) => localStorage.removeItem(key));

    setIsNotificationPending(false);
    setIsAddCounterModalOpen(false);
    setShowRewardModal(false);
    setPendingRewards([]);
    setNewRewards([]);
    setNewReward(null);

    if (Capacitor.isNativePlatform()) {
      LocalNotifications.cancelAll().catch(error => console.error("Failed to cancel notifications during reset", error));
    }

    setCounters([]);
    setActiveCounterId("");
    setCounterStates({});
    setHistory([]);
    setJournalEntries([]);
    setUnlockedRewards([]);
    setStreak(0);
    setLongestStreak(0);
    setRewards(REWARDS.map(reward => ({ ...reward, isUnlocked: false })));
    setMilestones(hydrateMilestones());

    setSettings({ hapticsEnabled: true, volumeKeyControl: true });
    setUserName("");
    setOnboardingData({ userName: "" });
    setEditingCounterId("");

    setIsOnboarding(true);
    setOnboardingStep("greeting");
    setCurrentScreen("home");
  }, []);
  const handleAddJournalEntry = (entry: JournalEntry) => { /* ... */ };
  
  // Reward system handlers
  const handleClaimReward = (rewardId: string) => {
    setRewards(prev => prev.map(reward => 
      reward.id === rewardId 
        ? { ...reward, isUnlocked: true, unlockedAt: new Date().toISOString() }
        : reward
    ));
    setUnlockedRewards(prev => [...prev, rewardId]);
    toast.success("Reward claimed! 🎉");
  };
  
  const activeCounter = counters.find(c => c.id === activeCounterId);
  const activeCounterState = activeCounterId ? counterStates[activeCounterId] : null;

  // Render Logic (No Changes)
  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  if (isOnboarding) {
    return (
      <div className="min-h-screen">
        {onboardingStep === "greeting" && <WelcomingRitualStep1 onNext={handleGreetingNext} />}
        {onboardingStep === "practice" && <WelcomingRitualStep2 userName={onboardingData.userName} onNext={handlePracticeNext} onBack={() => setOnboardingStep("greeting")} />}
        {onboardingStep === "affirmation" && onboardingData.practiceData && <WelcomingRitualStep3 userName={onboardingData.userName} practiceData={onboardingData.practiceData} onComplete={handleOnboardingComplete} onBack={() => setOnboardingStep("practice")} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="pb-20">
        {currentScreen === "home" && activeCounter && activeCounterState && (
          <HomeScreen
            counter={activeCounter}
            currentCount={activeCounterState.currentCount}
            todayProgress={activeCounterState.todayProgress}
            streak={streak}
            userName={userName}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onResetCurrentCount={resetCurrentCount}
            hapticsEnabled={settings.hapticsEnabled}
          />
        )}
        {currentScreen === "history" && activeCounter && activeCounterState && (
          <PracticeJournalScreen
            counterName={activeCounter.name}
            todayProgress={activeCounterState.todayProgress}
            dailyGoal={activeCounter.dailyGoal}
            streak={streak}
            longestStreak={longestStreak}
            history={history}
            activePracticeId={activeCounter.id}
            journalEntries={journalEntries}
            unlockedRewards={unlockedRewards}
            milestones={milestones}
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
            hapticsEnabled={settings.hapticsEnabled}
            onHapticsToggle={() => handleSettingToggle("hapticsEnabled")}
            volumeKeyControlEnabled={settings.volumeKeyControl}
            onVolumeKeyControlToggle={() => handleSettingToggle("volumeKeyControl")}
            onResetTutorial={handleResetTutorial}
            onOpenInfoPage={(key) => setCurrentScreen(key as AppScreen)}
          />
        )}
        {currentScreen === "about" && (
          <AboutPage onBack={() => setCurrentScreen("settings")} />
        )}
        {currentScreen === "privacy" && (
          <PrivacyPolicyPage onBack={() => setCurrentScreen("settings")} />
        )}
        {currentScreen === "terms" && (
          <TermsOfServicePage onBack={() => setCurrentScreen("settings")} />
        )}
        {currentScreen === "edit-practice" && editingCounterId && (
          <EditPracticeScreen
            counter={counters.find(c => c.id === editingCounterId)!}
            onSave={handleUpdateCounter}
            onBack={() => setCurrentScreen("counters")}
            rewards={rewards}
          />
        )}
        {currentScreen === "add-practice" && (
          <AddPracticeScreen
            onSave={handleAddCounter}
            onBack={() => setCurrentScreen("counters")}
          />
        )}
      </div>
      {!["edit-practice", "add-practice", "about", "privacy", "terms"].includes(currentScreen) && (
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
      
      {/* Reward Unlock Modal */}
      <RewardUnlockModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        rewards={newRewards}
        onClaim={handleClaimReward}
      />
    </div>
  );
}
