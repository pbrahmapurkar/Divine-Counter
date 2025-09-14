import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  Home, Settings as SettingsIcon, History as HistoryIcon, Library,
  Minus, Play, Pause, Calendar, TrendingUp, Award,
  Sun, Moon, PlusCircle, ChevronLeft
} from 'lucide-react';
import { CounterButton } from './components/counter-button';
import { ProgressRing } from './components/progress-ring';
import { StatsCard } from './components/stats-card';
import { ThemeSelector } from './components/theme-selector';
import { SettingsScreen as SettingsPanel } from './components/SettingsScreen';
import { DivineLogo } from './components/divine-logo';
import { Onboarding as OBNew } from './components/onboarding/Onboarding';
import { CreateCounterDialog } from './components/create-counter-dialog';
import { CreateCounterPage } from './components/create-counter-page';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog';
import { toast, Toaster } from 'sonner';
import { haptic } from './core/haptics';
import { cn } from './components/ui/utils';
// import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { DiagnosticsPanel } from './components/diagnostics-panel';
import BootScreen from './components/boot/BootScreen';
import { preloadBootAssets } from './components/boot/boot-preload';
import { eventBus, createEvent, EventTypes } from './services/EventBus';
import CongratsOverlay from './components/overlays/CongratsOverlay';
import { useVolumeButtons } from './hooks/useVolumeButtons';

// Spec-local types (session-only, useState)
type Screen = 'counter' | 'history' | 'counters' | 'settings' | 'addCounter';
type DayKey = string; // YYYY-MM-DD

interface User { id: string; name: string; createdAt: number; }
interface Counter {
  id: string;
  name: string;
  color: string;
  cycleSize: number;
  target: number;
  totalCount: number;
  totalMaalas: number;
  todayCount: number;
  todayMaalas: number;
  streak: number;
  createdAt: number;
  updatedAt: number;
  archived?: boolean;
}
interface DayStats { rawCounts: number; manualMaalasDelta: number; }
type StatsByDay = Record<DayKey, Record<string, DayStats>>;
interface SessionStats { sessionCount: number; isActive: boolean; startTime: number | null; }
type DarkModePref = 'auto' | 'light' | 'dark';
interface Settings {
  hapticsEnabled: boolean;
  theme: string; // accent/theme id
  darkMode: DarkModePref;
  defaultCounterId?: string;
  customColor?: string;
  volumeButtonsEnabled?: boolean;
}

// Helpers
const dayKey = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10);
const derivedMaalas = (raw: number, delta: number, cycle: number) => Math.max(0, Math.floor(raw / Math.max(1, cycle)) + delta);
const isBoundaryCross = (prevRaw: number, nextRaw: number, cycle: number) => Math.floor(prevRaw / Math.max(1,cycle)) < Math.floor(nextRaw / Math.max(1,cycle));
const crossedBelowBoundary = (prevRaw: number, nextRaw: number, cycle: number) => Math.floor(prevRaw / Math.max(1,cycle)) > Math.floor(nextRaw / Math.max(1,cycle));

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [hasBooted, setHasBooted] = useState(false);
  // Global state (session only)
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [user, setUser] = useState<User|null>(null);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [activeCounterId, setActiveCounterId] = useState<string|undefined>(undefined);
  const [statsByDay, setStatsByDay] = useState<StatsByDay>({});
  const [session, setSession] = useState<SessionStats>({ sessionCount: 0, isActive: false, startTime: null });
  const [settings, setSettings] = useState<Settings>({
    hapticsEnabled: false,
    theme: 'nature',
    darkMode: 'light',
    volumeButtonsEnabled: false,
  });
  const [currentScreen, setCurrentScreen] = useState<Screen>('counter');
  const [showCounterDialog, setShowCounterDialog] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);

  const activeCounter = useMemo(() => counters.find(c => c.id === activeCounterId) ?? counters[0], [counters, activeCounterId]);

  // Theme application
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = settings.theme;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = settings.darkMode === 'dark' || (settings.darkMode === 'auto' && prefersDark);
    root.classList.toggle('dark', isDark);
  }, [settings.theme, settings.darkMode]);

  useEffect(() => {
    if (hasBooted) return;
    document.documentElement.classList.add('boot-lock');
    preloadBootAssets();
    const minHold = 1200; const maxHold = 2000;
    let released = false;
    const release = () => {
      if (released) return; released = true;
      document.documentElement.classList.remove('boot-lock');
      setHasBooted(true);
    };
    const minTimer = window.setTimeout(release, minHold);
    const maxTimer = window.setTimeout(release, maxHold);
    return () => { clearTimeout(minTimer); clearTimeout(maxTimer); };
  }, [hasBooted]);

  // Settings persistence (load on init, save on changes)
  const SETTINGS_KEY = 'divine-counter-settings-v1';
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with defaults to handle migrations
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Notifications/reminders removed

  // UI utilities
  // Haptics handled via core/haptics; call only on boundary

  // APIs from spec
  function createCounter(input: {name:string;color:string;cycleSize:number;target:number}) {
    const now = Date.now();
    const counter: Counter = {
      id: String(now),
      name: input.name.trim() || 'My Practice',
      color: input.color,
      cycleSize: Math.max(1, Math.floor(input.cycleSize)),
      target: Math.max(0, Math.floor(input.target)),
      totalCount: 0,
      totalMaalas: 0,
      todayCount: 0,
      todayMaalas: 0,
      streak: 0,
      createdAt: now,
      updatedAt: now,
    };
    setCounters(cs => [counter, ...cs]);
    setActiveCounterId(counter.id);
    const k = dayKey();
    setStatsByDay(prev => ({ ...prev, [k]: { ...(prev[k]||{}), [counter.id]: { rawCounts: 0, manualMaalasDelta: 0 } } }));
  }

  // function updateCounter(id: string, patch: Partial<Counter>) {
  //   setCounters(cs => cs.map(c => c.id !== id ? c : ({ ...c, ...patch, updatedAt: Date.now() })));
  // }

  function archiveCounter(id: string) {
    setCounters(cs => cs.map(c => c.id !== id ? c : ({ ...c, archived: true, updatedAt: Date.now() })));
    if (activeCounterId === id) {
      const next = counters.find(c => c.id !== id && !c.archived);
      setActiveCounterId(next?.id);
    }
  }

  function increment() {
    if (!activeCounter) return;
    const id = activeCounter.id; const cycle = activeCounter.cycleSize; const k = dayKey();
    setStatsByDay(prev => {
      const day = prev[k]?.[id] ?? { rawCounts: 0, manualMaalasDelta: 0 };
      const prevRaw = day.rawCounts; const nextRaw = prevRaw + 1;
      const nextDay: DayStats = { ...day, rawCounts: nextRaw };
      const nextStats = { ...prev, [k]: { ...(prev[k]||{}), [id]: nextDay } };

      setCounters(cs => cs.map(c => {
        if (c.id !== id) return c;
        const todayMaalas = derivedMaalas(nextRaw, nextDay.manualMaalasDelta, cycle);
        const bumpedMaalas = isBoundaryCross(prevRaw,nextRaw,cycle) ? 1 : 0;
        return {
          ...c,
          totalCount: c.totalCount + 1,
          todayCount: nextRaw,
          todayMaalas,
          totalMaalas: c.totalMaalas + bumpedMaalas,
          updatedAt: Date.now()
        };
      }));

      if (isBoundaryCross(prevRaw,nextRaw,cycle)) {
        if (settings.hapticsEnabled) haptic('success');
        toast.success('🪷 Maala complete');
        const sessionId = String(session.startTime || Date.now());
        const completedCount = Math.floor(nextRaw / Math.max(1, cycle));
        // Emit event unconditionally so UI can show congrats overlay
        eventBus.emit(createEvent.maalaCompleted(id, sessionId, completedCount));
      }

      return nextStats;
    });
    if (session.isActive) setSession(s => ({ ...s, sessionCount: s.sessionCount + 1 }));
  }

  function decrement() {
    if (!activeCounter) return;
    const id = activeCounter.id; const cycle = activeCounter.cycleSize; const k = dayKey();
    setStatsByDay(prev => {
      const day = prev[k]?.[id] ?? { rawCounts: 0, manualMaalasDelta: 0 };
      const prevRaw = day.rawCounts; const nextRaw = Math.max(0, prevRaw - 1);
      const nextDay: DayStats = { ...day, rawCounts: nextRaw };
      const nextStats = { ...prev, [k]: { ...(prev[k]||{}), [id]: nextDay } };

      setCounters(cs => cs.map(c => {
        if (c.id !== id) return c;
        const todayMaalasPrev = derivedMaalas(prevRaw, day.manualMaalasDelta, cycle);
        const todayMaalasNext = derivedMaalas(nextRaw, nextDay.manualMaalasDelta, cycle);
        const crossed = crossedBelowBoundary(prevRaw,nextRaw,cycle);
        if (crossed && todayMaalasPrev > 0) toast('Adjusted: below maala boundary');
        return {
          ...c,
          totalCount: Math.max(0, c.totalCount - (prevRaw>nextRaw?1:0)),
          todayCount: nextRaw,
          todayMaalas: todayMaalasNext,
          totalMaalas: Math.max(0, c.totalMaalas - (crossed ? 1 : 0)),
          updatedAt: Date.now()
        };
      }));

      return nextStats;
    });
    if (session.isActive) setSession(s => ({ ...s, sessionCount: Math.max(0, s.sessionCount - 1) }));
  }

  function manualAddMaala() {
    if (!activeCounter) return; const id = activeCounter.id; const k = dayKey(); const cycle = activeCounter.cycleSize;
    setStatsByDay(prev => {
      const day = prev[k]?.[id] ?? { rawCounts: 0, manualMaalasDelta: 0 };
      const nextDay: DayStats = { ...day, manualMaalasDelta: day.manualMaalasDelta + 1 };
      const nextStats = { ...prev, [k]: { ...(prev[k]||{}), [id]: nextDay } };
      setCounters(cs => cs.map(c => c.id !== id ? c : ({
        ...c,
        todayMaalas: derivedMaalas(nextDay.rawCounts, nextDay.manualMaalasDelta, cycle),
        totalMaalas: c.totalMaalas + 1,
        updatedAt: Date.now()
      })));
      return nextStats;
    });
  }

  function manualRemoveMaala() {
    if (!activeCounter) return; const id = activeCounter.id; const k = dayKey(); const cycle = activeCounter.cycleSize;
    setStatsByDay(prev => {
      const day = prev[k]?.[id] ?? { rawCounts: 0, manualMaalasDelta: 0 };
      const proposed = day.manualMaalasDelta - 1;
      const wouldBe = derivedMaalas(day.rawCounts, proposed, cycle);
      if (wouldBe < 0) { toast.error('Cannot go below 0 maalas'); return prev; }
      const nextDay: DayStats = { ...day, manualMaalasDelta: proposed };
      const nextStats = { ...prev, [k]: { ...(prev[k]||{}), [id]: nextDay } };
      setCounters(cs => cs.map(c => c.id !== id ? c : ({
        ...c,
        todayMaalas: derivedMaalas(nextDay.rawCounts, nextDay.manualMaalasDelta, cycle),
        totalMaalas: Math.max(0, c.totalMaalas - 1),
        updatedAt: Date.now()
      })));
      return nextStats;
    });
  }

  function startSession() { setSession(s => ({ ...s, isActive: true, startTime: Date.now() })); }
  function pauseSession() { setSession(s => ({ ...s, isActive: false })); }
  function resetToday() {
    // Strict RESET Today: session.sessionCount → no change
    if (!activeCounter) return;
    const id = activeCounter.id; const k = dayKey(); const cycle = activeCounter.cycleSize;
    setStatsByDay(prev => {
      const day = prev[k]?.[id] ?? { rawCounts: 0, manualMaalasDelta: 0 };
      const prevRaw = day.rawCounts;
      const prevDerived = derivedMaalas(day.rawCounts, day.manualMaalasDelta, cycle);
      const nextDay: DayStats = { ...day, rawCounts: 0 }; // manualMaalasDelta unchanged
      const nextStats = { ...prev, [k]: { ...(prev[k]||{}), [id]: nextDay } };
      setCounters(cs => cs.map(c => c.id !== id ? c : ({
        ...c,
        // todayCount/todayMaalas unchanged by spec
        totalCount: Math.max(0, c.totalCount - prevRaw),
        totalMaalas: Math.max(0, c.totalMaalas - prevDerived),
        updatedAt: Date.now(),
      })));
      return nextStats;
    });
    try { toast.success('Today reset'); } catch {}
  }
  function setHaptics(on:boolean) { setSettings(s => ({ ...s, hapticsEnabled: on })); }
  function setTheme(t: Settings['theme']) { setSettings(s => ({ ...s, theme: t })); }
  // Dark mode is controlled via settings.darkMode ('auto' | 'light' | 'dark')

  // Onboarding integration
  const handleOnboardingComplete = (data: { userName: string; counter: { id:string; name:string; color:string; cycleSize:number; target:number }; settings: { theme: string } }) => {
    const now = Date.now();
    setUser({ id: String(now), name: data.userName.trim().slice(0,40) || 'Friend', createdAt: now });
    createCounter({ name: data.counter.name, color: data.counter.color, cycleSize: data.counter.cycleSize, target: data.counter.target });
    setIsFirstRun(false);
    setCurrentScreen('counter');
  };

  // Render pieces
  const MobileContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen max-w-md mx-auto bg-background border-x border-border relative overflow-hidden">
      {children}
      <Toaster richColors />
    </div>
  );

  const Navigation = () => (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-[var(--dc-bottom-nav-h)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border z-50">
      <div className="grid grid-cols-4 gap-2 px-4 py-3">
        {[
          { id: 'counter', icon: Home, label: 'Home' },
          { id: 'history', icon: HistoryIcon, label: 'History' },
          { id: 'counters', icon: Library, label: 'Counters' },
          { id: 'settings', icon: SettingsIcon, label: 'Settings' }
        ].map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={currentScreen === id ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setCurrentScreen(id as Screen)}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-xl",
              currentScreen === id ? "text-primary border-primary/30 bg-primary/5" : "text-muted-foreground"
            )}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );

  const CounterScreen = () => {
    const k = dayKey();
    const today = activeCounter ? (statsByDay[k]?.[activeCounter.id]?.rawCounts ?? 0) : 0;
    const cycle = activeCounter?.cycleSize ?? 108;
    const greet = () => {
      const hr = new Date().getHours();
      if (hr < 12) return 'Good morning';
      if (hr < 18) return 'Good afternoon';
      return 'Good evening';
    };
    const tapsToNext = ((cycle - (today % cycle)) % cycle) || cycle;
    const pct = Math.round(((today % cycle) / cycle) * 100);
    const [showCongrats, setShowCongrats] = useState(false);
    useVolumeButtons(!!settings.volumeButtonsEnabled, { onUp: increment, onDown: decrement });
    useEffect(() => {
      const unsub = eventBus.subscribe(EventTypes.MAALA_COMPLETED, (e:any) => {
        // Only show for current active counter
        if (!activeCounter) return;
        if (e?.payload?.counterId === activeCounter.id) setShowCongrats(true);
      });
      return () => { unsub && unsub(); };
    }, [activeCounter?.id]);
    return (
      <div className="px-6 space-y-6" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 96px)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 128px)' }}>
        {/* Header (fixed, solid background) */}
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 px-6 pb-4 bg-background border-b border-border shadow"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)', minHeight: '96px' }}
        >
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DivineLogo size={40} className="text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">{greet()}{user?.name ? `, ${user.name}` : ''}</div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Divine Counter</h1>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setCurrentScreen('counters')} className="text-muted-foreground">⋯</Button>
          </div>
        </div>

        {/* Active practice card */}
        <Card className="shadow-elevated mt-2">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: activeCounter?.color || 'var(--primary)' }} />
                {activeCounter?.name || 'Practice'}
              </div>
              <div className="text-xs text-muted-foreground">{today % cycle} / {cycle}</div>
            </div>
            <div className="flex gap-1 items-center overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => {
                const threshold = Math.round((i + 1) / 30 * cycle);
                const filled = (today % cycle) >= threshold;
                return <div key={i} className={cn("h-1.5 flex-1 rounded-full", filled ? "bg-primary" : "bg-muted")}></div>;
              })}
            </div>
            <div className="text-xs text-muted-foreground mt-2">{today % cycle} of {cycle} beads • {pct}% complete</div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatsCard title="STREAK" value={activeCounter?.streak ?? 0} variant="streak" icon={<Award size={16} />} />
          <StatsCard title="PROGRESS" value={`${activeCounter?.todayMaalas ?? 0}/${activeCounter?.target ?? 1}`} variant="today" icon={<Calendar size={16} />} />
          <StatsCard title="TOTAL" value={activeCounter?.totalCount ?? 0} variant="total" icon={<TrendingUp size={16} />} />
        </div>

        {/* Taps to next pill */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/60 text-xs text-foreground">
            {tapsToNext} more taps to complete your mala
          </span>
        </div>

        {/* Ring + Button */}
        <div className="flex justify-center">
          <ProgressRing current={today % cycle} total={cycle} size={280} strokeWidth={12} color={activeCounter?.color} />
        </div>
        <div className="relative flex justify-center mb-10">
          <CounterButton count={today} onIncrement={increment} onDecrement={decrement} disabled={!activeCounter} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={decrement}
            disabled={!activeCounter || today === 0}
            className="absolute bottom-4 right-8 w-10 h-10 rounded-full p-0"
            aria-label="Decrement"
            title="-1"
          >
            -1
          </Button>
          <CongratsOverlay open={showCongrats} onClose={() => setShowCongrats(false)} cycleSize={cycle} />
        </div>
        {/* Quick actions removed per request */}

        {/* Session controls */}
        <div className="flex justify-center gap-4 mb-24">
          <Button variant="outline" size="lg" onClick={decrement} disabled={today===0} className="w-12 h-12 rounded-full p-0"><Minus size={20} /></Button>
          <Button variant="outline" size="lg" onClick={() => session.isActive ? pauseSession() : startSession()} className="w-12 h-12 rounded-full p-0">{session.isActive ? <Pause size={20} /> : <Play size={20} />}</Button>
        </div>
      </div>
    );
  };

  const HistoryScreen = () => {
    const k = dayKey();
    const day = activeCounter ? (statsByDay[k]?.[activeCounter.id] ?? { rawCounts: 0, manualMaalasDelta: 0 }) : { rawCounts: 0, manualMaalasDelta: 0 };
    const cycle = activeCounter?.cycleSize ?? 108;
    const todayMaalas = activeCounter ? derivedMaalas(day.rawCounts, day.manualMaalasDelta, cycle) : 0;
    const tapsToNext = activeCounter ? ((cycle - (day.rawCounts % cycle)) % cycle || cycle) : 0;

    const fmtDay = (dk: string) => {
      const d = new Date(dk);
      const today = new Date(dayKey());
      const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
      if (dk === dayKey()) return 'Today';
      if (dk === yesterday.toISOString().slice(0,10)) return 'Yesterday';
      return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const recentKeys = Object.keys(statsByDay)
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 7);

    const rows = activeCounter ? recentKeys
      .filter(dk => !!statsByDay[dk]?.[activeCounter.id])
      .map(dk => {
        const st = statsByDay[dk][activeCounter.id];
        const raw = st.rawCounts;
        const mal = derivedMaalas(st.rawCounts, st.manualMaalasDelta, activeCounter.cycleSize);
        const pct = Math.min(100, Math.round((raw % activeCounter.cycleSize) / activeCounter.cycleSize * 100));
        const status: 'completed' | 'partial' | 'missed' = mal >= (activeCounter.target || 0)
          ? (activeCounter.target ? 'completed' : 'partial')
          : (mal === 0 ? 'missed' : 'partial');
        return { dk, raw, mal, pct, status };
      }) : [];

    // Weekly progress (last 7 days)
    const weekKeys = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      return dayKey(d);
    });
    const weeklyMaalas = activeCounter ? weekKeys.reduce((acc, dk) => {
      const st = statsByDay[dk]?.[activeCounter.id];
      if (!st) return acc;
      return acc + derivedMaalas(st.rawCounts, st.manualMaalasDelta, activeCounter.cycleSize);
    }, 0) : 0;
    const weeklyTarget = (activeCounter?.target ?? 0) * 7;
    const weeklyPct = weeklyTarget > 0 ? Math.min(100, Math.round((weeklyMaalas / weeklyTarget) * 100)) : 0;

    return (
      <div className="p-6 space-y-6" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }}>
        {/* Header */}
        <div className="sticky top-0 z-40 -mx-6 px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Practice History</h2>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>

        {/* Today Summary Card */}
        <Card className="shadow-elevated gradient-primary/5">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <span className="text-muted-foreground">📅</span>
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-xs text-muted-foreground">{(day.rawCounts % cycle)} / {cycle}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatsCard title="MALAS" value={todayMaalas} variant="streak" />
              <StatsCard title="TAPS" value={day.rawCounts} variant="today" />
              <StatsCard title="TO NEXT" value={tapsToNext} variant="total" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{Math.round(((day.rawCounts % cycle) / cycle) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded">
                <div className="h-2 rounded gradient-primary" style={{ width: `${Math.round(((day.rawCounts % cycle) / cycle) * 100)}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Adjustments */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-base">Manual Adjustments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Need corrections? Use these when you practiced off-device or tapped by mistake.</p>
            <div className="grid grid-cols-2 gap-2">
              <Button disabled={!activeCounter} onClick={manualAddMaala} className="font-semibold" variant="primaryGradient">
                <PlusCircle size={16} /> Add Mala
              </Button>
              <Button variant="outline" disabled={!activeCounter} onClick={manualRemoveMaala} className="font-semibold border-destructive text-destructive hover:bg-destructive hover:text-white">
                <Minus size={16} /> Remove Mala
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Tip: Adjustments change today’s derived maalas without altering raw taps.</p>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-base">This Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-2 w-full bg-muted rounded">
              <div className="h-2 rounded gradient-primary" style={{ width: `${weeklyPct}%` }} />
            </div>
            <div className="text-xs text-muted-foreground">
              {weeklyTarget > 0 ? `${weeklyMaalas} of ${weeklyTarget} maalas • ${weeklyPct}%` : `${weeklyMaalas} maalas this week`}
            </div>
          </CardContent>
        </Card>

        {/* Recent Days */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-base">Recent Days</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent entries for this counter.</p>
            )}
            {rows.map(row => (
              <div key={row.dk} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{fmtDay(row.dk)}</span>
                  <span className="text-muted-foreground">{row.raw} taps • {row.mal} maala{row.mal!==1?'s':''}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded">
                  <div className="h-1.5 rounded bg-primary" style={{ width: `${row.pct}%` }} />
                </div>
                <div className="text-xs">
                  {row.status === 'completed' && <span className="px-2 py-0.5 rounded bg-[var(--success)] text-white">Goal reached</span>}
                  {row.status === 'partial' && <span className="px-2 py-0.5 rounded bg-[var(--warning)] text-white">Partial</span>}
                  {row.status === 'missed' && <span className="px-2 py-0.5 rounded bg-[var(--error)] text-white">Missed</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  const CountersScreen = () => (
    <div className="p-6 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Counters</h2>
        <Button onClick={() => { setEditingCounter(null); setCurrentScreen('addCounter'); }}><PlusCircle size={16} className="mr-2" />Add</Button>
      </div>
      <div className="space-y-2">
        {counters.filter(c => !c.archived).map(c => (
          <Card key={c.id} className={cn('cursor-pointer', activeCounterId===c.id && 'border-primary')} onClick={() => setActiveCounterId(c.id)}>
            <CardContent className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.color }} />
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.cycleSize} count • target {c.target}/day</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">{c.todayMaalas} / {c.totalMaalas} maal.</div>
                <Button variant="outline" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); archiveCounter(c.id); }}>Archive</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {counters.length===0 && (
          <div className="text-sm text-muted-foreground">No counters yet. Click Add to create one.</div>
        )}
      </div>
      <CreateCounterDialog
        open={showCounterDialog}
        onOpenChange={setShowCounterDialog}
        onSave={(cc: any) => {
          // Map dialog counter shape to spec shape
          createCounter({ name: cc.name, color: cc.color, cycleSize: cc.cycleSize, target: cc.target });
        }}
        editingCounter={editingCounter as any}
      />
    </div>
  );

  const SettingsScreen = () => {
    const appVersion = '1.0.0';
    const practicingSince = user ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : undefined;
    const streak = activeCounter?.streak ?? 0;
    const totalMaalas = activeCounter?.totalMaalas ?? 0;

    return (
      <div className="p-6 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-40 -mx-6 px-6 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => setCurrentScreen('counter')} aria-label="Back">
              <ChevronLeft />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
          </div>
          <div className="text-xs font-medium text-[color:var(--success)]">✓ Saved</div>
        </div>

        {/* Content */}
        <div className="mt-4 max-w-[420px] mx-auto space-y-4">
          {/* Profile */}
          <Card className="shadow-elevated">
            <CardContent className="pt-5 text-center space-y-1">
              <div className="font-semibold text-foreground">{user?.name || 'Friend'}</div>
              {practicingSince && (
                <div className="text-sm text-muted-foreground">Practicing since {practicingSince}</div>
              )}
              <div className="text-sm text-muted-foreground">{streak}-day streak • {totalMaalas} total malas</div>
            </CardContent>
          </Card>

          {/* Notifications removed */}

          {/* Appearance */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">🎨 Appearance</div>
            <Card className="shadow-elevated">
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 items-center gap-2">
                  <div className="font-medium">Theme</div>
                  <Select value={settings.darkMode} onValueChange={(v: DarkModePref)=> setSettings(s=> ({ ...s, darkMode: v }))}>
                    <SelectTrigger><SelectValue placeholder="Auto" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="font-medium mb-2">Accent Color</div>
                  <ThemeSelector currentTheme={settings.theme} onThemeChange={(t) => setTheme(t as any)} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Practice Settings */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">🧘‍♂️ Practice Settings</div>
            <Card className="shadow-elevated">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Haptic Feedback</div>
                    <div className="text-xs text-muted-foreground">Vibration on mala completion</div>
                  </div>
                  <Switch checked={settings.hapticsEnabled} onCheckedChange={setHaptics} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data & Privacy */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">📊 Data & Privacy</div>
            <Card className="shadow-elevated">
              <CardContent className="pt-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-between text-left">
                      <span>
                        <div className="font-medium text-destructive">Reset All Data</div>
                        <div className="text-xs text-muted-foreground">Permanently delete everything</div>
                      </span>
                      <span className="opacity-60">🗑️</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset all data?</AlertDialogTitle>
                      <AlertDialogDescription>This will delete all counters, history, and settings on this device. This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => { setIsFirstRun(true); setUser(null); setCounters([]); setActiveCounterId(undefined); setStatsByDay({}); toast.success('All data reset'); }}>Reset</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>

          {/* Help & Support (with simple search filter) */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">ℹ️ Help & Support</div>
            <Card className="shadow-elevated">
              <CardContent className="space-y-2 pt-2">
                {(search.trim()==='' || 'user guide'.includes(search.toLowerCase())) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">User Guide<span className="opacity-60">📖</span></Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[75vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>User Guide</DialogTitle></DialogHeader>
                    <div className="space-y-3 text-sm text-foreground">
                      <div>
                        <div className="font-medium">Start</div>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>Tap “+” to add a counter</li>
                          <li>Name it (e.g., “Gayatri Mantra”)</li>
                          <li>Choose cycle: 108 / 54 / 27 / 21 or Custom</li>
                          <li>Set a daily goal</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium">Count</div>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>Tap the big circle for +1</li>
                          <li>Use the small “−1” button to correct</li>
                          <li>The ring shows progress toward the cycle</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium">Track</div>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>History shows daily stats</li>
                          <li>Manual adjust maalas if needed</li>
                          <li>See streaks and weekly completion</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium">Tips</div>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>Practice at the same time daily</li>
                          <li>Restart phone if the app feels slow</li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>)}
                {(search.trim()==='' || 'contact'.includes(search.toLowerCase())) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">Contact Support<span className="opacity-60">💬</span></Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[75vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Support</DialogTitle></DialogHeader>
                    <div className="space-y-3 text-sm text-foreground">
                      <div className="font-medium">Contact</div>
                      <p className="text-muted-foreground">Email: pbrahmapurkar@gmail.com • Usually replies within 24–48 hours</p>
                      <div className="font-medium">Include</div>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        <li>Phone model</li>
                        <li>What happened?</li>
                        <li>App version: 1.0.0</li>
                      </ul>
                      <div className="font-medium">Try first</div>
                      <ol className="list-decimal pl-5 text-muted-foreground">
                        <li>Restart the app</li>
                        <li>Restart your phone</li>
                        <li>Update the app</li>
                        <li>Free storage space</li>
                      </ol>
                    </div>
                  </DialogContent>
                </Dialog>)}
              </CardContent>
            </Card>
          </div>

          {/* Legal & Information (with simple search filter) */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">📄 Legal & Information</div>
            <Card className="shadow-elevated">
              <CardContent className="space-y-2 pt-2">
                {(search.trim()==='' || 'about'.includes(search.toLowerCase())) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">About<span className="opacity-60">ℹ️</span></Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[75vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>About</DialogTitle></DialogHeader>
                    <div className="space-y-4 text-foreground text-sm">
                      <div className="text-center space-y-1">
                        <div className="text-2xl font-semibold">Divine Counter</div>
                        <div className="inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs text-muted-foreground">Version {appVersion}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="font-medium">Purpose</div>
                        <p className="text-muted-foreground">Simple, beautiful counting for a consistent daily practice.</p>
                      </div>

                      <div className="space-y-1">
                        <div className="font-medium">Highlights</div>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>Clean, tap-to-count interface</li>
                          <li>Multiple cycle sizes with custom option</li>
                          <li>Progress tracking and weekly insight</li>
                          <li>Optional haptics</li>
                          <li>Light/Dark themes</li>
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <div className="font-medium">Privacy</div>
                        <p className="text-muted-foreground">All data stays on your device. No accounts, no tracking.</p>
                      </div>

                      <div className="space-y-1">
                        <div className="font-medium">Contact</div>
                        <p className="text-muted-foreground">pbrahmapurkar@gmail.com</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>)}

                {(search.trim()==='' || 'privacy'.includes(search.toLowerCase())) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">Privacy Policy<span className="opacity-60">🔒</span></Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[75vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Privacy Policy</DialogTitle></DialogHeader>
                    <div className="space-y-3 text-foreground text-sm">
                      <p className="text-muted-foreground">We respect your privacy. Divine Counter is designed to keep your practice local to your device.</p>
                      <h4 className="font-medium">Local Storage</h4>
                      <p className="text-muted-foreground">All practice data stays on your device. No accounts, no servers, no analytics.</p>
                      <h4 className="font-medium">Optional Permissions</h4>
                      <p className="text-muted-foreground">Haptic feedback.</p>
                      <p className="text-xs text-muted-foreground">Last updated: 14 Sep 2025</p>
                    </div>
                  </DialogContent>
                </Dialog>)}

                {(search.trim()==='' || 'terms'.includes(search.toLowerCase())) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">Terms<span className="opacity-60">📋</span></Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[75vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Terms</DialogTitle></DialogHeader>
                    <div className="space-y-3 text-foreground text-sm">
                      <div className="text-muted-foreground">Version {appVersion} • Sept 2025</div>
                      <div>
                        <div className="font-medium">You May</div>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>Use for personal practice</li>
                          <li>Track your counting and progress</li>
                          <li>Share feedback</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium">Don’t</div>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>Resell or redistribute</li>
                          <li>Use disrespectfully</li>
                          <li>Reverse engineer</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium">Disclaimer</div>
                        <p className="text-muted-foreground">App provided “as is”. No guarantees. May contain bugs.</p>
                      </div>
                      <div>
                        <div className="font-medium">Legal</div>
                        <p className="text-muted-foreground">Indian law applies • Contact: pbrahmapurkar@gmail.com</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>)}

                {(search.trim()==='' || 'license licenses credits'.includes(search.toLowerCase())) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">Licenses<span className="opacity-60">🔓</span></Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[75vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Licenses</DialogTitle></DialogHeader>
                    <div className="space-y-3 text-foreground text-sm">
                      <p className="text-muted-foreground">Built using wonderful open‑source libraries:</p>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        <li>React (MIT) — App framework</li>
                        <li>Capacitor (MIT) — Native features</li>
                        <li>TypeScript (Apache) — Development</li>
                        <li>Lucide React (ISC) — Icons</li>
                        <li>Framer Motion (MIT) — Animations</li>
                      </ul>
                      <div className="text-muted-foreground">Questions? pbrahmapurkar@gmail.com</div>
                    </div>
                  </DialogContent>
                </Dialog>)}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <div>Made with 🙏 for your spiritual journey</div>
            <div>Version {appVersion}</div>
          </div>
        </div>
      </div>
    );
  };

  if (!hasBooted) return <BootScreen />;

  // Onboarding guard - must onboard if first run, no user, or no counters
  const mustOnboard = isFirstRun || !user || counters.length === 0;
  
  if (mustOnboard) {
    return (
      <OBNew
        onComplete={(p) => {
          const now = Date.now();
          setUser({ id: String(now), name: p.userName || 'Seeker', createdAt: now });
          createCounter({ name: p.counter.name, color: p.counter.color, cycleSize: p.cycleSize, target: p.counter.target });
          setIsFirstRun(false);
          setCurrentScreen('counter');
        }}
        onSkip={() => {
          const now = Date.now();
          setUser({ id: String(now), name: '', createdAt: now });
          createCounter({ name: 'My Practice', color: '#34C759', cycleSize: 108, target: 1 });
          setIsFirstRun(false);
        }}
      />
    );
  }

  return (
    <MobileContainer>
      <AnimatePresence mode="wait">
        <motion.main
          key={currentScreen}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.20, ease: 'easeOut' }}
          className="min-h-screen"
        >
          {currentScreen === 'counter' && <CounterScreen />}
          {currentScreen === 'settings' && (
            <SettingsPanel
              version={'1.0.0'}
              settings={{
                hapticsEnabled: settings.hapticsEnabled,
                dark: settings.darkMode === 'dark',
                theme: (settings.theme === 'spiritual' ? 'saffron' : settings.theme === 'calm' ? 'blue' : 'green') as any,
                customColor: (settings as any).customColor,
                defaultCounterId: settings.defaultCounterId,
              }}
              counters={counters.map(c => ({ id: c.id, name: c.name }))}
              setTheme={(t)=> setSettings(s=> ({ ...s, theme: t==='saffron' ? 'spiritual' : t==='blue' ? 'calm' : 'nature' }))}
              setCustomColor={(hex)=> setSettings(s=> ({ ...(s as any), customColor: hex }))}
              setDark={(on)=> setSettings(s=> ({ ...s, darkMode: on ? 'dark' : 'light' }))}
              setHaptics={setHaptics}
              setVolumeButtonsEnabled={(on)=> setSettings(s=> ({ ...s, volumeButtonsEnabled: on }))}
              setDefaultCounter={(id)=> setSettings(s=> ({ ...s, defaultCounterId: id }))}
              resetOnboarding={()=> { const now=Date.now(); setIsFirstRun(true); setUser(null); setCounters([]); setActiveCounterId(undefined); setStatsByDay({}); setCurrentScreen('counter'); }}
              goBack={()=> setCurrentScreen('counter')}
            />
          )}
          {currentScreen === 'history' && <HistoryScreen />}
          {currentScreen === 'counters' && <CountersScreen />}
          {currentScreen === 'addCounter' && (
            <CreateCounterPage
              onCancel={() => setCurrentScreen('counters')}
              onSave={(input) => { createCounter(input); setCurrentScreen('counters'); }}
            />
          )}
        </motion.main>
      </AnimatePresence>
      <Navigation />
      
      {/* Dev-only diagnostics panel */}
      <DiagnosticsPanel
        currentScreen={currentScreen}
        activeCounterId={activeCounterId}
        activeCounterName={activeCounter?.name}
        cycleSize={activeCounter?.cycleSize}
        todayRaw={activeCounter ? (statsByDay[dayKey()]?.[activeCounter.id]?.rawCounts ?? 0) : 0}
        todayDerivedMaalas={activeCounter?.todayMaalas ?? 0}
        hapticsEnabled={settings.hapticsEnabled}
        onSimulateBoundaryCross={() => {
          if (activeCounter) {
            const k = dayKey();
            const day = statsByDay[k]?.[activeCounter.id] ?? { rawCounts: 0, manualMaalasDelta: 0 };
            const prevRaw = day.rawCounts;
            const nextRaw = 108; // Simulate 107→108
            setStatsByDay(prev => ({
              ...prev,
              [k]: { ...(prev[k]||{}), [activeCounter.id]: { ...day, rawCounts: nextRaw } }
            }));
            setCounters(cs => cs.map(c => c.id === activeCounter.id ? {
              ...c,
              totalCount: c.totalCount + (nextRaw - prevRaw),
              todayCount: nextRaw,
              todayMaalas: Math.floor(nextRaw / c.cycleSize),
              totalMaalas: c.totalMaalas + 1,
              updatedAt: Date.now()
            } : c));
          }
        }}
        onSimulateBelowBoundary={() => {
          if (activeCounter) {
            const k = dayKey();
            const day = statsByDay[k]?.[activeCounter.id] ?? { rawCounts: 0, manualMaalasDelta: 0 };
            const prevRaw = day.rawCounts;
            const nextRaw = 107; // Simulate 110→107
            setStatsByDay(prev => ({
              ...prev,
              [k]: { ...(prev[k]||{}), [activeCounter.id]: { ...day, rawCounts: nextRaw } }
            }));
            setCounters(cs => cs.map(c => c.id === activeCounter.id ? {
              ...c,
              totalCount: Math.max(0, c.totalCount - (prevRaw - nextRaw)),
              todayCount: nextRaw,
              todayMaalas: Math.floor(nextRaw / c.cycleSize),
              totalMaalas: Math.max(0, c.totalMaalas - 1),
              updatedAt: Date.now()
            } : c));
          }
        }}
        onAddMaala={manualAddMaala}
        onRemoveMaala={manualRemoveMaala}
      />
    </MobileContainer>
  );
}
