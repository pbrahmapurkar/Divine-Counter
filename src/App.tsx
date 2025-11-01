import React, { useState, useEffect, useCallback, useRef } from "react";
import { Haptics, NotificationType, ImpactStyle } from "@capacitor/haptics";
import { LocalNotifications } from "@capacitor/local-notifications";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { HomeScreen } from "./components/HomeScreen";
import { CountersScreen } from "./components/CountersScreen";
import { PracticeJournalScreen } from "./components/PracticeJournalScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import {
  AboutPage,
  SupportProjectPage,
  PrivacyPolicyPage,
  TermsOfServicePage
} from "./components/info";
import { BottomNavigation } from "./components/BottomNavigation";
import { BootScreen } from "./components/BootScreen";
import { WelcomingRitualStep1 } from "./components/WelcomingRitualStep1";
import { WelcomingRitualStep2 } from "./components/WelcomingRitualStep2";
import { WelcomingRitualStep3 } from "./components/WelcomingRitualStep3";
import { ResetLoadingOverlay } from "./components/ResetLoadingOverlay";
import { AddCounterModal } from "./components/AddCounterModal";
import { EditPracticeScreen } from "./components/EditPracticeScreen";
import { AddPracticeScreen } from "./components/AddPracticeScreen";
import { toast } from "sonner";
import { REWARDS, STREAK_MILESTONES, getRewardsByStreak, Reward, StreakMilestone } from "./data/rewards";
import { RewardUnlockModal } from "./components/RewardUnlockModal";
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

const LEGACY_MILESTONE_KEY = "__legacy__";

const hydrateMilestoneStore = (saved?: unknown): Record<string, StreakMilestone[]> => {
  if (!saved) {
    return {};
  }

  if (Array.isArray(saved)) {
    return {
      [LEGACY_MILESTONE_KEY]: hydrateMilestones(saved),
    };
  }

  if (typeof saved === "object" && saved !== null) {
    return Object.entries(saved as Record<string, StreakMilestone[]>).reduce<Record<string, StreakMilestone[]>>(
      (accumulator, [practiceId, value]) => {
        if (Array.isArray(value)) {
          accumulator[practiceId] = hydrateMilestones(value);
        } else {
          accumulator[practiceId] = hydrateMilestones();
        }
        return accumulator;
      },
      {}
    );
  }

  return {};
};

const areMilestonesEqual = (
  a: StreakMilestone[] | undefined,
  b: StreakMilestone[]
): boolean => {
  if (!a || a.length !== b.length) {
    return false;
  }

  for (let index = 0; index < a.length; index += 1) {
    const previous = a[index];
    const next = b[index];
    if (
      previous.days !== next.days ||
      previous.isAchieved !== next.isAchieved ||
      (previous.achievedAt ?? "") !== (next.achievedAt ?? "")
    ) {
      return false;
    }
  }

  return true;
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

const DONATION_URL = "https://buymeacoffee.com/pbrahmapurd";

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
  enableVolumeKeys: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  hapticsEnabled: true,
  enableVolumeKeys: false
};

const normalizeSettings = (value: Partial<Settings> | null | undefined): Settings => ({
  hapticsEnabled: typeof value?.hapticsEnabled === "boolean" ? value.hapticsEnabled : DEFAULT_SETTINGS.hapticsEnabled,
  enableVolumeKeys: typeof value?.enableVolumeKeys === "boolean" ? value.enableVolumeKeys : DEFAULT_SETTINGS.enableVolumeKeys
});
type OnboardingStep = "greeting" | "practice" | "affirmation";
type AppScreen =
  | "home"
  | "history"
  | "counters"
  | "settings"
  | "edit-practice"
  | "add-practice"
  | "about"
  | "support"
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
  const [settings, setSettings] = useState<Settings>(() => normalizeSettings(null));
  const [isAddCounterModalOpen, setIsAddCounterModalOpen] = useState(false);
  const [editingCounterId, setEditingCounterId] = useState("");
  const [onboardingData, setOnboardingData] = useState({ userName: "" } as { userName: string; practiceData?: any; });
  const [userName, setUserName] = useState("");
  
  // Reward System State
  const [rewards, setRewards] = useState(REWARDS.map(reward => ({ ...reward, isUnlocked: false })) as Reward[]);
  const [milestoneStore, setMilestoneStore] = useState<Record<string, StreakMilestone[]>>({});
  const [milestones, setMilestones] = useState(() => hydrateMilestones());
  const [unlockedRewards, setUnlockedRewards] = useState([] as string[]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [newRewards, setNewRewards] = useState([] as Reward[]);
  const [newReward, setNewReward] = useState(null as Reward | null);
  const [pendingRewards, setPendingRewards] = useState([] as Reward[]);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const notificationPermissionRequestedRef = useRef(false);
  const hasSyncedRemindersRef = useRef(false);
  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const performScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      if (typeof document !== "undefined") {
        document.body?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
        document.documentElement?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
      }
    };

    // Allow layout to settle before resetting scroll
    requestAnimationFrame(performScroll);
  }, []);

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

  useEffect(() => {
    scrollToTop();
  }, [currentScreen, scrollToTop]);

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
      console.log("[Load] Boot complete, checking localStorage for saved data...");
      console.log("[Load] Current isOnboarding state:", isOnboarding);
      
      // CRITICAL: Check localStorage FIRST, regardless of isOnboarding state
      // This ensures we properly restore the onboarding flag from storage
      const savedOnboarding = localStorage.getItem("divine-counter-onboarded");
      console.log("[Load] divine-counter-onboarded in localStorage:", savedOnboarding);
      
      if (savedOnboarding === "true") {
        // User has completed onboarding - load saved data
        console.log("[Load] Found onboarding flag - user has completed onboarding, loading data...");
        
        // Only load if we're currently in onboarding mode (prevents re-hydration after explicit reset)
        if (isOnboarding) {
          console.log("[Load] Currently in onboarding mode but flag exists - switching to app mode");
          setIsOnboarding(false);
        }
        
        const savedActiveCounterId = localStorage.getItem("divine-counter-active") || "";
        console.log("[Load] Active counter ID:", savedActiveCounterId || "(none)");
        
        const storedCounters = JSON.parse(localStorage.getItem("divine-counter-counters") || '[]');
        const hydratedCounters = storedCounters.map((counter: Counter) => hydrateCounter(counter));
        console.log("[Load] Loaded", hydratedCounters.length, "counters");
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
        try {
          const storedSettingsRaw = localStorage.getItem("divine-counter-settings");
          const parsedSettings = storedSettingsRaw ? JSON.parse(storedSettingsRaw) : null;
          setSettings(normalizeSettings(parsedSettings));
        } catch (error) {
          console.warn("[Load] Failed to parse saved settings, falling back to defaults", error);
          setSettings(normalizeSettings(null));
        }
        setActiveCounterId(savedActiveCounterId);
        setUserName(localStorage.getItem("divine-counter-username") || "");
        setUnlockedRewards(JSON.parse(localStorage.getItem("divine-counter-unlocked-rewards") || '[]'));
        setLongestStreak(parseInt(localStorage.getItem("divine-counter-longest-streak") || '0'));
        const savedMilestoneState = localStorage.getItem("divine-counter-milestones");
        if (savedMilestoneState) {
          setMilestoneStore(hydrateMilestoneStore(JSON.parse(savedMilestoneState)));
        }
        setRewards(JSON.parse(localStorage.getItem("divine-counter-rewards") || JSON.stringify(REWARDS.map(reward => ({ ...reward, isUnlocked: false })))));
        console.log("[Load] Data loaded successfully - user should see app, not onboarding");
      } else {
        // No onboarding flag - first launch or after reset
        console.log("[Load] No onboarding flag found - user needs to complete onboarding");
        if (!isOnboarding) {
          console.warn("[Load] WARNING: isOnboarding is false but no flag in storage - this shouldn't happen");
          console.warn("[Load] This might indicate a reset occurred. Setting isOnboarding=true");
          setIsOnboarding(true);
        }
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
    localStorage.setItem("divine-counter-milestones", JSON.stringify(milestoneStore));
    localStorage.setItem("divine-counter-rewards", JSON.stringify(rewards));
    }
  }, [counters, counterStates, history, journalEntries, settings, activeCounterId, userName, isOnboarding, isBooting, milestoneStore, rewards, unlockedRewards, longestStreak]);

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
      backHandler.then(handler => handler.remove());
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

    if (!activeCounterId) {
      setMilestones(hydrateMilestones());
      setStreak(0);
      setLongestStreak(0);
      return;
    }

    const activeCounter = counters.find(counter => counter.id === activeCounterId);
    if (!activeCounter) {
      return;
    }

    const todayState = counterStates[activeCounterId];
    const practiceHistory = history.filter(entry => entry.practiceId === activeCounterId);
    const storedMilestones =
      milestoneStore[activeCounterId] ??
      milestoneStore[LEGACY_MILESTONE_KEY] ??
      hydrateMilestones();

    const {
      currentStreak: calculatedStreak,
      longestStreak: calculatedLongestStreak,
      milestones: updatedMilestones,
      newlyAchieved
    } = calculateAndUpdateStreak(
      practiceHistory,
      storedMilestones,
      {
        todayProgress: todayState?.todayProgress ?? 0,
        dailyGoal: activeCounter.dailyGoal,
      }
    );

    setStreak(calculatedStreak);
    setLongestStreak(calculatedLongestStreak);
    setMilestones(previous => (areMilestonesEqual(previous, updatedMilestones) ? previous : updatedMilestones));

    if (newlyAchieved.length > 0) {
      newlyAchieved.forEach((milestone) => {
        toast.success(`🎉 Milestone Achieved! ${milestone.days}-day streak unlocked.`);
      });
    }

    setMilestoneStore((previousStore) => {
      const previousMilestonesForPractice =
        previousStore[activeCounterId] ?? previousStore[LEGACY_MILESTONE_KEY];

      const shouldUpdate = !areMilestonesEqual(previousMilestonesForPractice, updatedMilestones);
      const legacyPresent = Boolean(previousStore[LEGACY_MILESTONE_KEY]);

      if (!shouldUpdate && !legacyPresent) {
        return previousStore;
      }

      const nextStore = { ...previousStore };
      if (shouldUpdate || !nextStore[activeCounterId]) {
        nextStore[activeCounterId] = updatedMilestones;
      }
      if (legacyPresent && activeCounterId !== LEGACY_MILESTONE_KEY) {
        delete nextStore[LEGACY_MILESTONE_KEY];
      }

      return nextStore;
    });
  }, [history, counterStates, activeCounterId, counters, milestoneStore, isOnboarding]);

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
    console.log("[Onboarding] Completing onboarding...");
    if (!onboardingData.practiceData) {
      console.error("[Onboarding] ERROR: No practice data found");
      return;
    }
    
    console.log("[Onboarding] Setting up initial counter...");
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
    setMilestoneStore(prev => {
      const next = { ...prev };
      next[counter.id] = hydrateMilestones();
      if (next[LEGACY_MILESTONE_KEY]) {
        delete next[LEGACY_MILESTONE_KEY];
      }
      return next;
    });
    setMilestones(hydrateMilestones());
    setStreak(0);
    setLongestStreak(0);
    setCurrentScreen("home");
    setOnboardingStep("greeting");
    
    // CRITICAL: Set onboarding to false BEFORE saving to localStorage
    // This ensures the save useEffect will write the flag
    console.log("[Onboarding] Setting isOnboarding=false - save useEffect should write divine-counter-onboarded flag");
    setIsOnboarding(false);
    
    // Force immediate write of onboarding flag (don't wait for useEffect)
    try {
      localStorage.setItem("divine-counter-onboarded", "true");
      console.log("[Onboarding] Explicitly saved divine-counter-onboarded flag to localStorage");
    } catch (error) {
      console.error("[Onboarding] ERROR: Failed to save onboarding flag", error);
    }
    
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    toast.success(`Welcome, ${onboardingData.userName}! 🙏`);

    if (counter.reminderEnabled) {
      await scheduleReminderForCounter(counter);
    }
    
    console.log("[Onboarding] Onboarding complete - user should now see app");
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
    const newCounter = hydrateCounter({ ...data, id: String(id) });

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
    setMilestoneStore(prev => {
      const next = { ...prev, [newCounter.id]: hydrateMilestones() };
      if (next[LEGACY_MILESTONE_KEY]) {
        delete next[LEGACY_MILESTONE_KEY];
      }
      return next;
    });
    setMilestones(hydrateMilestones());
    setStreak(0);
    setLongestStreak(0);

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
    setMilestoneStore(prev => {
      if (!(id in prev)) {
        return prev;
      }
      const { [id]: _removedMilestones, ...rest } = prev;
      return rest;
    });

    if (activeCounterId === id) {
      setActiveCounterId(remainingCounters[0]?.id || "");
    }

    await cancelReminderForCounter(id);
    toast.success("Practice deleted");
  }, [cancelReminderForCounter, counters, activeCounterId]);
  const handleDonate = useCallback(async () => {
    const url = DONATION_URL;

    try {
      await Browser.open({ url });
      return;
    } catch (browserError) {
      console.error("Failed to open Buy Me a Coffee via Browser plugin", browserError);
    }

    try {
      if (typeof window !== "undefined") {
        const opened = window.open(url, "_blank", "noopener,noreferrer");
        if (opened) {
          return;
        }
      }
    } catch (windowError) {
      console.error("Failed to open Buy Me a Coffee via window fallback", windowError);
    }

    toast.error("Couldn't open the Buy Me a Coffee page. Please check your internet connection.");
  }, []);
  const handleSettingToggle = (setting: keyof Settings) => { setSettings(prev => ({ ...prev, [setting]: !prev[setting] })); };
  const handleResetTutorial = useCallback(() => {
    console.log("[Reset] ===== STARTING INSTANT RESET =====");
    console.log("[Reset] Phase 1: Showing loading overlay...");
    
    // Show loading overlay immediately
    setIsResetting(true);
    
    try {
      // STEP 1: Set onboarding state IMMEDIATELY (synchronously, no delays)
      // This prevents save useEffect from re-saving data
      console.log("[Reset] Phase 2: Setting onboarding state to prevent re-save...");
      setIsOnboarding(true);
      setOnboardingStep("greeting");
      setCurrentScreen("home");
      
      // STEP 2: Clear ALL localStorage keys (including custom mala features)
      console.log("[Reset] Phase 3: Clearing localStorage...");
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
        // Custom Mala Planner storage keys
        "divine-counter-custom-mala-planner",
        // Weekly Mala storage keys
        "divine-counter-weekly-mala",
        "divine-counter-daily-override",
        // Additional progress tracking keys
        "divine-counter-last-progress-reset",
      ];

      let clearedCount = 0;
      storageKeys.forEach((key) => {
        try {
          localStorage.removeItem(key);
          clearedCount++;
        } catch (error) {
          console.error(`[Reset] Failed to remove localStorage key ${key}:`, error);
        }
      });
      console.log(`[Reset] Cleared ${clearedCount}/${storageKeys.length} localStorage keys`);

      // STEP 3: Clear sessionStorage (if any data exists)
      console.log("[Reset] Phase 4: Clearing sessionStorage...");
      try {
        sessionStorage.clear();
        console.log("[Reset] sessionStorage cleared");
      } catch (error) {
        console.error("[Reset] Failed to clear sessionStorage:", error);
      }

      // STEP 4: Reset ALL React state IMMEDIATELY (synchronously, no setTimeout)
      console.log("[Reset] Phase 5: Resetting React state...");
      setIsNotificationPending(false);
      setIsAddCounterModalOpen(false);
      setShowRewardModal(false);
      setPendingRewards([]);
      setNewRewards([]);
      setNewReward(null);

      setCounters([]);
      setActiveCounterId("");
      setCounterStates({});
      setHistory([]);
      setJournalEntries([]);
      setUnlockedRewards([]);
      setStreak(0);
      setLongestStreak(0);
      setRewards(REWARDS.map(reward => ({ ...reward, isUnlocked: false })));
      setMilestoneStore({});
      setMilestones(hydrateMilestones());

      setSettings(normalizeSettings(null));
      setUserName("");
      setOnboardingData({ userName: "" });
      setEditingCounterId("");

      // Reset refs
      notificationPermissionRequestedRef.current = false;
      hasSyncedRemindersRef.current = false;

      console.log("[Reset] All React state reset synchronously");

      // STEP 5: Cancel native notifications (async, but don't wait)
      if (Capacitor.isNativePlatform()) {
        console.log("[Reset] Phase 6: Cancelling native notifications...");
        LocalNotifications.cancel({ notifications: [] })
          .then(() => {
            console.log("[Reset] Notifications cancelled successfully");
          })
          .catch((error) => {
            console.error("[Reset] Failed to cancel notifications:", error);
          });
      }

      // STEP 6: Verify storage is cleared
      console.log("[Reset] Phase 7: Verifying storage cleared...");
      const onboardedCheck = localStorage.getItem("divine-counter-onboarded");
      if (onboardedCheck) {
        console.warn("[Reset] WARNING: divine-counter-onboarded still exists after reset!");
      } else {
        console.log("[Reset] Verified: divine-counter-onboarded successfully removed");
      }

      // STEP 7: Trigger reload for fresh mount (after brief delay to show overlay)
      console.log("[Reset] Phase 8: Triggering reload for fresh mount...");
      console.log("[Reset] ===== RESET COMPLETE - RELOADING =====");
      
      // Use setTimeout with minimal delay just to let React render the overlay
      // then reload for a completely fresh mount
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 100); // Minimal delay just for UX (show overlay briefly)

    } catch (error) {
      console.error("[Reset] CRITICAL ERROR during reset:", error);
      setIsResetting(false);
      // Still try to show onboarding even if reset partially failed
      setIsOnboarding(true);
      setOnboardingStep("greeting");
      setCurrentScreen("home");
    }
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
      <>
        <ResetLoadingOverlay isVisible={isResetting} />
        <div className="min-h-screen">
          {onboardingStep === "greeting" && <WelcomingRitualStep1 onNext={handleGreetingNext} />}
          {onboardingStep === "practice" && <WelcomingRitualStep2 userName={onboardingData.userName} onNext={handlePracticeNext} onBack={() => setOnboardingStep("greeting")} />}
          {onboardingStep === "affirmation" && onboardingData.practiceData && <WelcomingRitualStep3 userName={onboardingData.userName} practiceData={onboardingData.practiceData} onComplete={handleOnboardingComplete} onBack={() => setOnboardingStep("practice")} />}
        </div>
      </>
    );
  }

  return (
    <>
      <ResetLoadingOverlay isVisible={isResetting} />
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
            enableVolumeKeys={settings.enableVolumeKeys}
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
            userName={userName}
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
            enableVolumeKeys={settings.enableVolumeKeys}
            onHapticsToggle={() => handleSettingToggle("hapticsEnabled")}
            onVolumeKeysToggle={() => handleSettingToggle("enableVolumeKeys")}
            onResetTutorial={handleResetTutorial}
            onOpenInfoPage={(key) => setCurrentScreen(key as AppScreen)}
          />
        )}
        {currentScreen === "about" && (
          <>
            <AboutPage onBack={() => setCurrentScreen("settings")} />
            <BottomNavigation
              activeScreen="about"
              onNavigate={setCurrentScreen}
              hapticsEnabled={settings.hapticsEnabled}
            />
          </>
        )}
        {currentScreen === "support" && (
          <>
            <SupportProjectPage
              onBack={() => setCurrentScreen("settings")}
              onDonate={handleDonate}
            />
            <BottomNavigation
              activeScreen="support"
              onNavigate={setCurrentScreen}
              hapticsEnabled={settings.hapticsEnabled}
            />
          </>
        )}
        {currentScreen === "privacy" && (
          <>
            <PrivacyPolicyPage onBack={() => setCurrentScreen("settings")} />
            <BottomNavigation
              activeScreen="privacy"
              onNavigate={setCurrentScreen}
              hapticsEnabled={settings.hapticsEnabled}
            />
          </>
        )}
        {currentScreen === "terms" && (
          <>
            <TermsOfServicePage onBack={() => setCurrentScreen("settings")} />
            <BottomNavigation
              activeScreen="terms"
              onNavigate={setCurrentScreen}
              hapticsEnabled={settings.hapticsEnabled}
            />
          </>
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
      {!["edit-practice", "add-practice", "about", "support", "privacy", "terms"].includes(currentScreen) && (
      <BottomNavigation
        activeScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen as AppScreen)}
        hapticsEnabled={settings.hapticsEnabled}
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
    </>
  );
}
