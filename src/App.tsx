import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Settings, 
  History, 
  Library, 
  Minus, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus,
  ChevronLeft,
  Calendar,
  TrendingUp,
  Award,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { CounterButton } from './components/counter-button';
import { ProgressRing } from './components/progress-ring';
import { StatsCard } from './components/stats-card';
import { ThemeSelector } from './components/theme-selector';
import { CounterCard } from './components/counter-card';
import { DivineLogo } from './components/divine-logo';
import { Onboarding } from './components/onboarding';
import { CreateCounterDialog } from './components/create-counter-dialog';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { cn } from './components/ui/utils';

interface Counter {
  id: string;
  name: string;
  color: string;
  cycleSize: number;
  target: number;
  totalCount: number;
  todayCount: number;
  maalasCompleted: number;
  todayMaalas: number;
  streak: number;
}

interface SessionStats {
  sessionCount: number;
  isActive: boolean;
  startTime: number | null;
}

type Screen = 'counter' | 'settings' | 'history' | 'counters';

export default function App() {
  // Core state
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('counter');
  const [theme, setTheme] = useState('spiritual');
  const [isDark, setIsDark] = useState(false);
  
  // Counter state
  const [count, setCount] = useState(0);
  const [session, setSession] = useState<SessionStats>({
    sessionCount: 0,
    isActive: false,
    startTime: null
  });

  // Settings state
  const [settings, setSettings] = useState({
    haptics: false, // Default OFF as required
    sound: true,
    volumeButtons: false,
    reminderEnabled: false,
    reminderTime: '09:00'
  });

  // User state
  const [userName, setUserName] = useState('');

  // Counter state
  const [counters, setCounters] = useState<Counter[]>([
    {
      id: '1',
      name: 'Morning Practice',
      color: '#FF9500',
      cycleSize: 108,
      target: 1,
      totalCount: 2160,
      todayCount: 108,
      maalasCompleted: 20,
      todayMaalas: 1,
      streak: 7
    },
    {
      id: '2',
      name: 'Evening Count',
      color: '#007AFF',
      cycleSize: 54,
      target: 2,
      totalCount: 540,
      todayCount: 54,
      maalasCompleted: 10,
      todayMaalas: 1,
      streak: 3
    }
  ]);
  const [activeCounter, setActiveCounter] = useState<Counter>(counters[0]);

  // Modals
  const [showCounterDialog, setShowCounterDialog] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, isDark]);

  // Maala completion check
  useEffect(() => {
    if (count > 0 && count % activeCounter.cycleSize === 0) {
      setShowCompletion(true);
      // Update counter stats
      setActiveCounter(prev => ({
        ...prev,
        maalasCompleted: prev.maalasCompleted + 1,
        totalCount: prev.totalCount + activeCounter.cycleSize,
        todayMaalas: prev.todayMaalas + 1
      }));
      
      // Update in counters array
      setCounters(prev => prev.map(c => 
        c.id === activeCounter.id 
          ? { ...c, maalasCompleted: c.maalasCompleted + 1, totalCount: c.totalCount + activeCounter.cycleSize, todayMaalas: c.todayMaalas + 1 }
          : c
      ));
      
      if (settings.sound) {
        toast.success('🪷 Maala Complete!');
      }
    }
  }, [count, activeCounter.cycleSize, activeCounter.id, settings.sound]);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setSession(prev => ({
      ...prev,
      sessionCount: prev.sessionCount + 1,
      isActive: true,
      startTime: prev.startTime || Date.now()
    }));
    
    // Update active counter today count
    setActiveCounter(prev => ({
      ...prev,
      todayCount: prev.todayCount + 1
    }));
    
    // Update in counters array
    setCounters(prev => prev.map(c => 
      c.id === activeCounter.id 
        ? { ...c, todayCount: c.todayCount + 1 }
        : c
    ));
  };

  const handleDecrement = () => {
    if (count > 0) {
      const wasAtMaalaBoundary = count % activeCounter.cycleSize === 0;
      
      setCount(prev => prev - 1);
      setSession(prev => ({
        ...prev,
        sessionCount: Math.max(0, prev.sessionCount - 1)
      }));
      
      // Update active counter today count
      setActiveCounter(prev => ({
        ...prev,
        todayCount: Math.max(0, prev.todayCount - 1)
      }));
      
      // Update in counters array
      setCounters(prev => prev.map(c => 
        c.id === activeCounter.id 
          ? { ...c, todayCount: Math.max(0, c.todayCount - 1) }
          : c
      ));
      
      // If crossing below maala boundary, adjust maala count
      if (wasAtMaalaBoundary && activeCounter.todayMaalas > 0) {
        setActiveCounter(prev => ({
          ...prev,
          todayMaalas: Math.max(0, prev.todayMaalas - 1),
          maalasCompleted: Math.max(0, prev.maalasCompleted - 1)
        }));
        
        setCounters(prev => prev.map(c => 
          c.id === activeCounter.id 
            ? { ...c, todayMaalas: Math.max(0, c.todayMaalas - 1), maalasCompleted: Math.max(0, c.maalasCompleted - 1) }
            : c
        ));
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    setSession({
      sessionCount: 0,
      isActive: false,
      startTime: null
    });
  };

  const handleCounterSelect = (counter: Counter) => {
    setActiveCounter(counter);
    setCount(0); // Reset counter when switching
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleOnboardingComplete = (data: { userName: string; counter: Counter; settings: any }) => {
    const newCounter = {
      ...data.counter,
      totalCount: 0,
      todayCount: 0,
      maalasCompleted: 0,
      todayMaalas: 0,
      streak: 0
    };
    
    setUserName(data.userName);
    setCounters([newCounter]);
    setActiveCounter(newCounter);
    setTheme(data.settings.theme);
    setIsFirstRun(false);
  };

  const handleAddMaala = () => {
    setActiveCounter(prev => ({
      ...prev,
      maalasCompleted: prev.maalasCompleted + 1,
      todayMaalas: prev.todayMaalas + 1,
      totalCount: prev.totalCount + prev.cycleSize
    }));
    
    setCounters(prev => prev.map(c => 
      c.id === activeCounter.id 
        ? { ...c, maalasCompleted: c.maalasCompleted + 1, todayMaalas: c.todayMaalas + 1, totalCount: c.totalCount + c.cycleSize }
        : c
    ));
  };

  const handleRemoveMaala = () => {
    if (activeCounter.maalasCompleted > 0) {
      setActiveCounter(prev => ({
        ...prev,
        maalasCompleted: Math.max(0, prev.maalasCompleted - 1),
        todayMaalas: Math.max(0, prev.todayMaalas - 1),
        totalCount: Math.max(0, prev.totalCount - prev.cycleSize)
      }));
      
      setCounters(prev => prev.map(c => 
        c.id === activeCounter.id 
          ? { ...c, maalasCompleted: Math.max(0, c.maalasCompleted - 1), todayMaalas: Math.max(0, c.todayMaalas - 1), totalCount: Math.max(0, c.totalCount - c.cycleSize) }
          : c
      ));
    }
  };

  const handleCreateCounter = (counter: Counter) => {
    if (editingCounter) {
      // Edit existing counter
      setCounters(prev => prev.map(c => c.id === counter.id ? counter : c));
      if (activeCounter.id === counter.id) {
        setActiveCounter(counter);
      }
    } else {
      // Add new counter
      setCounters(prev => [...prev, counter]);
      setActiveCounter(counter); // Make it active immediately
    }
    setEditingCounter(null);
  };

  // Mobile responsive container
  const MobileContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen max-w-md mx-auto bg-background border-x border-border relative overflow-hidden">
      {children}
    </div>
  );

  // Navigation
  const Navigation = () => (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-sm border-t border-border p-4 z-50">
      <div className="flex justify-around items-center">
        {[
          { id: 'counter', icon: Home, label: 'Counter' },
          { id: 'history', icon: History, label: 'History' },
          { id: 'counters', icon: Library, label: 'Counters' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ].map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => setCurrentScreen(id as Screen)}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3",
              currentScreen === id ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );

  // Counter Screen
  const CounterScreen = () => (
    <div className="p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DivineLogo size={40} className="text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Divine Counter</h1>
            <p className="text-sm text-muted-foreground">
              {userName ? `${userName}'s ` : ''}{activeCounter.name}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('counters')}
          className="text-muted-foreground"
        >
          Switch
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatsCard
          title="Today"
          value={session.sessionCount}
          variant="today"
          icon={<Calendar size={16} />}
        />
        <StatsCard
          title="Total"
          value={activeCounter.totalCount.toLocaleString()}
          variant="total"
          icon={<TrendingUp size={16} />}
        />
        <StatsCard
          title="Maalas Today"
          value={activeCounter.todayMaalas}
          subtitle={`of ${activeCounter.target}`}
          variant="streak"
          icon={<Award size={16} />}
        />
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center">
        <ProgressRing 
          current={count % activeCounter.cycleSize || (count === 0 ? 0 : activeCounter.cycleSize)}
          total={activeCounter.cycleSize}
          size={280}
          strokeWidth={12}
        />
      </div>

      {/* Main Counter Button */}
      <div className="flex justify-center">
        <CounterButton
          count={count}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleDecrement}
          disabled={count === 0}
          className="w-12 h-12 rounded-full p-0"
        >
          <Minus size={20} />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => setSession(prev => ({ ...prev, isActive: !prev.isActive }))}
          className="w-12 h-12 rounded-full p-0"
        >
          {session.isActive ? <Pause size={20} /> : <Play size={20} />}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="w-12 h-12 rounded-full p-0"
            >
              <RotateCcw size={20} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Counter?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset your current count to zero. Your session progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  // Settings Screen
  const SettingsScreen = () => (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Appearance
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDark(!isDark)}
                className="h-8 w-8 p-0"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeSelector 
              currentTheme={theme}
              onThemeChange={handleThemeChange}
            />
          </CardContent>
        </Card>

        {/* Default Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Default Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default-cycle-size">Default Cycle Size</Label>
              <Select
                value={activeCounter.cycleSize.toString()}
                onValueChange={(value) => {
                  const newSize = parseInt(value);
                  setActiveCounter(prev => ({ ...prev, cycleSize: newSize }));
                  setCounters(prev => prev.map(c => 
                    c.id === activeCounter.id ? { ...c, cycleSize: newSize } : c
                  ));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="54">54 (Half Maala)</SelectItem>
                  <SelectItem value="108">108 (Full Maala)</SelectItem>
                  <SelectItem value="216">216 (Double Maala)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="haptics">Haptic Feedback</Label>
              <Switch
                id="haptics"
                checked={settings.haptics}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, haptics: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sound">Sound Effects</Label>
              <Switch
                id="sound"
                checked={settings.sound}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, sound: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="volume-buttons">Volume Button Counting</Label>
              <Switch
                id="volume-buttons"
                checked={settings.volumeButtons}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, volumeButtons: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsFirstRun(true)}
            >
              Reset Onboarding
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About Divine Counter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              A sacred space for your spiritual counting practice.
            </p>
            <p className="text-xs text-muted-foreground">
              Created by <span className="font-medium text-foreground">Pratik Prakash Brahmapurkar</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // History Screen
  const HistoryScreen = () => (
    <div className="p-6 pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Maala Tracker</h1>

      <div className="grid grid-cols-2 gap-4">
        <StatsCard
          title="Today's Count"
          value={session.sessionCount}
          variant="today"
          icon={<Calendar size={16} />}
        />
        <StatsCard
          title="Current Streak"
          value={`${activeCounter.streak} days`}
          variant="streak"
          icon={<Award size={16} />}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatsCard
          title="Maalas Completed"
          value={activeCounter.maalasCompleted}
          icon={<RotateCcw size={16} />}
        />
        <StatsCard
          title="Total Count"
          value={activeCounter.totalCount.toLocaleString()}
          icon={<TrendingUp size={16} />}
        />
      </div>

      {/* Manual Maala Adjustment */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Maala Adjustment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Current Maalas: {activeCounter.maalasCompleted}</p>
              <p className="text-sm text-muted-foreground">Manually adjust your maala count</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveMaala}
                disabled={activeCounter.maalasCompleted === 0}
                className="w-10 h-10 rounded-full p-0"
              >
                <MinusCircle size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddMaala}
                className="w-10 h-10 rounded-full p-0"
              >
                <PlusCircle size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: 'Today', count: session.sessionCount, maalas: activeCounter.todayMaalas, time: '15 min' },
              { date: 'Yesterday', count: 108, maalas: 1, time: '22 min' },
              { date: '2 days ago', count: 54, maalas: 1, time: '12 min' },
              { date: '3 days ago', count: 108, maalas: 1, time: '18 min' }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="font-medium text-foreground">{session.date}</div>
                  <div className="text-sm text-muted-foreground">{session.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{session.count} counts</div>
                  <div className="text-xs text-muted-foreground">{session.maalas} maala{session.maalas !== 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Counters Library Screen
  const CountersScreen = () => (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Counter Library</h1>
        <Button
          onClick={() => {
            setEditingCounter(null);
            setShowCounterDialog(true);
          }}
          size="sm"
        >
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {counters.map((counter) => (
          <CounterCard
            key={counter.id}
            counter={counter}
            isActive={activeCounter.id === counter.id}
            onSelect={handleCounterSelect}
            onEdit={(counter) => {
              setEditingCounter(counter);
              setShowCounterDialog(true);
            }}
            onDelete={(counter) => {
              setCounters(prev => prev.filter(c => c.id !== counter.id));
              if (activeCounter.id === counter.id && counters.length > 1) {
                setActiveCounter(counters.find(c => c.id !== counter.id)!);
              }
            }}
          />
        ))}
      </div>
    </div>
  );

  // Maala Completion Modal
  const MaalaCompletionModal = () => (
    <Dialog open={showCompletion} onOpenChange={setShowCompletion}>
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">🪷 Maala Complete!</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <DivineLogo size={80} className="mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground mb-4">
            You have completed {Math.floor(count / activeCounter.cycleSize)} maala(s) of {activeCounter.cycleSize} counts.
          </p>
          <p className="text-sm text-muted-foreground italic">
            "With each count, may peace flow through your being"
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCompletion(false)} className="flex-1">
            Continue
          </Button>
          <Button onClick={() => { setCount(0); setShowCompletion(false); }} className="flex-1">
            New Maala
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Show onboarding on first run
  if (isFirstRun) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onSkip={() => {
          // Create default counter with empty name state
          const defaultCounter: Counter = {
            id: '1',
            name: 'My Practice',
            color: '#F2994A',
            cycleSize: 108,
            target: 1,
            totalCount: 0,
            todayCount: 0,
            maalasCompleted: 0,
            todayMaalas: 0,
            streak: 0
          };
          setCounters([defaultCounter]);
          setActiveCounter(defaultCounter);
          setUserName(''); // Empty name state
          setIsFirstRun(false);
        }}
      />
    );
  }

  return (
    <MobileContainer>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {currentScreen === 'counter' && <CounterScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
          {currentScreen === 'history' && <HistoryScreen />}
          {currentScreen === 'counters' && <CountersScreen />}
        </motion.div>
      </AnimatePresence>

      <Navigation />
      <MaalaCompletionModal />
      <CreateCounterDialog
        open={showCounterDialog}
        onOpenChange={setShowCounterDialog}
        onSave={handleCreateCounter}
        editingCounter={editingCounter}
      />
    </MobileContainer>
  );
}