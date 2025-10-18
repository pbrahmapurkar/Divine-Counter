import React, { useReducer, useEffect, useRef, useMemo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Capacitor } from "@capacitor/core";
import { Haptics, NotificationType } from "@capacitor/haptics";
import { spiritualQuotes } from "../data/spiritualQuotes";
import { GoldenLogo } from './GoldenLogo';
import { SafeAreaHeader } from './SafeAreaView';
import { useVolumeKeys } from '../hooks/useVolumeKeys';
import { lightHaptic, successHaptic, errorHaptic } from '../utils/haptics';
import { toast } from 'sonner';

// --- Type Definitions ---
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

interface HomeScreenProps {
  counter: Counter;
  currentCount: number;
  todayProgress: number;
  streak: number;
  userName: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onResetCurrentCount: () => void;
  hapticsEnabled: boolean;
}

interface State {
  showResetModal: boolean;
  ripples: { id: number; x: number; y: number }[];
}

type Action =
  | { type: 'SHOW_RESET_MODAL' }
  | { type: 'HIDE_RESET_MODAL' }
  | { type: 'ADD_RIPPLE'; payload: { x: number; y: number } }
  | { type: 'REMOVE_RIPPLE'; payload: number };

// --- Reducer for UI State ---
const initialState: State = {
  showResetModal: false,
  ripples: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SHOW_RESET_MODAL':
      return { ...state, showResetModal: true };
    case 'HIDE_RESET_MODAL':
      return { ...state, showResetModal: false };
    case 'ADD_RIPPLE': {
      const newRipple = { id: Date.now(), ...action.payload };
      return { ...state, ripples: [...state.ripples, newRipple] };
    }
    case 'REMOVE_RIPPLE':
      return { ...state, ripples: state.ripples.filter(r => r.id !== action.payload) };
    default:
      return state;
  }
}

// --- Custom Hooks for Logic Separation ---

const useLivingGreeting = (userName: string, streak: number) => {
  return useMemo(() => {
    const hour = new Date().getHours();
    let timeGreeting = "Welcome";
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 17) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";

    if (streak > 0) {
      return `${timeGreeting}, ${userName}. You're on a ${streak}-day streak.`;
    }
    return `Welcome, ${userName}. Let's begin today's practice.`;
  }, [userName, streak]);
};

const useSpiritualQuotes = (currentCount: number, cycleCount: number) => {
  const [quote, setQuote] = useState(spiritualQuotes[0]);
  const [isNew, setIsNew] = useState(false);
  const prevCountRef = useRef(currentCount);

  useEffect(() => {
    if (prevCountRef.current >= cycleCount - 1 && currentCount === 0 && prevCountRef.current > 0) {
      setQuote(spiritualQuotes[Math.floor(Math.random() * spiritualQuotes.length)]);
      setIsNew(true);
      const timer = setTimeout(() => setIsNew(false), 2000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = currentCount;
  }, [currentCount, cycleCount]);

  return { quote, isNew };
};


// --- Main HomeScreen Component ---
export function HomeScreen({
  counter,
  currentCount,
  todayProgress,
  streak,
  userName,
  onIncrement,
  onDecrement,
  onResetCurrentCount,
  hapticsEnabled,
}: HomeScreenProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const tapAreaRef = useRef<HTMLDivElement>(null);
  const longPressTimeoutRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const livingGreeting = useLivingGreeting(userName, streak);
  const { quote: currentQuote, isNew: quoteChangedByMala } = useSpiritualQuotes(currentCount, counter.cycleCount);
  
  // Volume key handlers with safety checks
  const handleVolumeUp = useCallback(() => {
    if (!counter) {
      toast.error('No active counter selected.');
      errorHaptic();
      return;
    }

    // Check if goal is already reached
    if (todayProgress >= counter.dailyGoal) {
      toast.success('Goal reached 🎉');
      successHaptic();
      return;
    }

    onIncrement();
    lightHaptic();
  }, [counter, todayProgress, onIncrement]);

  const handleVolumeDown = useCallback(() => {
    if (!counter) {
      toast.error('No active counter selected.');
      errorHaptic();
      return;
    }

    // Prevent negative values
    if (currentCount <= 0) {
      toast.error('Already at zero.');
      errorHaptic();
      return;
    }

    onDecrement();
    lightHaptic();
  }, [counter, currentCount, onDecrement]);

  // Integrate volume key controls
  useVolumeKeys({
    onVolumeUp: handleVolumeUp,
    onVolumeDown: handleVolumeDown,
  });
  
  const handleReset = useCallback(() => {
    onResetCurrentCount();
    dispatch({ type: 'HIDE_RESET_MODAL' });
  }, [onResetCurrentCount]);

  const handleCreateRipple = (event?: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // 1. Check if the event or tap area exists. If not, do nothing.
    if (!event || !tapAreaRef.current) return;
    
    const rect = tapAreaRef.current.getBoundingClientRect();
    let x = 0, y = 0;
    
    // 2. Safely check for touch or mouse coordinates
    const nativeEvent: any = 'nativeEvent' in event ? event.nativeEvent : event;

    if (nativeEvent.touches && nativeEvent.touches.length > 0) {
      x = nativeEvent.touches[0].clientX - rect.left;
      y = nativeEvent.touches[0].clientY - rect.top;
    } else if (typeof nativeEvent.clientX === 'number' && typeof nativeEvent.clientY === 'number') {
      x = nativeEvent.clientX - rect.left;
      y = nativeEvent.clientY - rect.top;
    } else {
      // Fallback to the center if no coordinates are found
      x = rect.width / 2;
      y = rect.height / 2;
    }
    
    const newRipple = { id: Date.now(), x, y };
    dispatch({ type: 'ADD_RIPPLE', payload: newRipple });
  };

  const handleIncrement = (event?: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    handleCreateRipple(event);
    onIncrement();
  };

  const triggerResetModal = useCallback(() => {
    if (hapticsEnabled && Capacitor.isNativePlatform()) {
      Haptics.notification({ type: NotificationType.Warning }).catch(() => {});
    }
    dispatch({ type: 'SHOW_RESET_MODAL' });
  }, [hapticsEnabled]);

  const clearLongPressTimer = () => {
    if (longPressTimeoutRef.current) {
      window.clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, []);

  const handleLongPressStart = () => {
    if (longPressTimeoutRef.current) {
      return;
    }
    longPressTriggeredRef.current = false;
    clearLongPressTimer();
    longPressTimeoutRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      triggerResetModal();
    }, 3000);
  };

  const handleLongPressEnd = () => {
    if (longPressTimeoutRef.current) {
      clearLongPressTimer();
      if (!longPressTriggeredRef.current) {
        onDecrement();
      }
    }
  };

  const handleLongPressCancel = () => {
    clearLongPressTimer();
    longPressTriggeredRef.current = false;
  };


  return (
    <div className="h-screen bg-gradient-to-br from-[#FDF6E3] to-[#FAF0E6] dark:from-gray-900 dark:to-gray-800 overflow-hidden flex flex-col relative">
      {/* Subtle Background Ambiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/10 to-[#FFD700]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 left-8 w-48 h-48 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-blue-200/15 to-cyan-200/15 dark:from-blue-800/8 dark:to-cyan-800/8 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <HeaderComponent counterName={counter.name} todayProgress={todayProgress} dailyGoal={counter.dailyGoal} />

      <div className="px-4 py-2" style={{ paddingTop: '100px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 tracking-tight">{livingGreeting}</h2>
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-hidden relative z-10">
        <SpiritualQuoteDisplay quote={currentQuote} isNew={quoteChangedByMala} />

        {/* Golden Logo above count */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onPointerDown={handleLongPressStart}
              onPointerUp={handleLongPressEnd}
              onPointerLeave={handleLongPressCancel}
              onPointerCancel={handleLongPressCancel}
              className="flex items-center justify-center p-2 rounded-full bg-white/60 dark:bg-white/10 shadow-sm hover:shadow-md transition-shadow"
            >
              <GoldenLogo size="bright" animated={true} />
            </motion.button>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">-1</span>
          </div>
        </motion.div>

        <motion.div 
          className="relative cursor-pointer select-none flex-shrink-0"
          ref={tapAreaRef}
          whileTap={{ scale: 0.97 }}
          onClick={(event) => handleIncrement(event)}
        >
          <RippleLayer ripples={state.ripples} onRippleEnd={(id) => dispatch({ type: 'REMOVE_RIPPLE', payload: id })} />
          <ProgressRing 
            currentCount={currentCount}
            cycleCount={counter.cycleCount}
          />
          <CountDisplay
            currentCount={currentCount}
            cycleCount={counter.cycleCount}
          />
        </motion.div>
      </div>
      
      <ResetModal 
        isOpen={state.showResetModal}
        onClose={() => dispatch({ type: 'HIDE_RESET_MODAL' })}
        onConfirm={handleReset}
      />
    </div>
  );
}


// --- Sub-components for better readability and performance ---

const HeaderComponent = React.memo(({ counterName, todayProgress, dailyGoal }: { counterName: string; todayProgress: number; dailyGoal: number }) => (
    <SafeAreaHeader className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
                {/* App Logo */}
                <div className="flex items-center gap-2">
                    <GoldenLogo size="md" animated={true} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Home</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{counterName}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl px-3 py-2 shadow-sm">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                        <span className="text-base font-extrabold text-[#D4AF37]">{todayProgress}</span> / <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{dailyGoal}</span> <span className="text-xs text-gray-500 dark:text-gray-400">cycles</span>
                    </div>
                </div>
            </div>
        </div>
    </SafeAreaHeader>
));


const SpiritualQuoteDisplay = React.memo(({ quote, isNew }: { quote: string; isNew: boolean }) => (
    <div className="mb-4 text-center max-w-md mx-auto">
      <motion.div key={quote} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <div className="relative bg-gradient-to-br from-white/40 via-white/30 to-white/20 dark:from-gray-800/40 dark:via-gray-800/30 dark:to-gray-800/20 backdrop-blur-md rounded-2xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-gray-900/20 border border-white/30 dark:border-gray-700/30">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">"{quote}"</p>
          {isNew && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-3 text-xs font-medium text-[#D4AF37]">✨ New Wisdom ✨</motion.p>}
        </div>
      </motion.div>
    </div>
));


const ProgressRing = React.memo(({ currentCount, cycleCount }: { currentCount: number; cycleCount: number }) => {
    const progressPercentage = (currentCount / cycleCount) * 100;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

    return (
        <motion.svg 
            width={radius * 2 + 40} 
            height={radius * 2 + 40} 
            className="transform -rotate-90" 
            style={{
                filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.1))',
            }}
        >
            {/* Inner shadow circle */}
            <circle 
                cx={radius + 20} 
                cy={radius + 20} 
                r={radius - 4} 
                fill="none" 
                stroke="rgba(0, 0, 0, 0.1)" 
                strokeWidth="2"
                style={{
                    filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))'
                }}
            />
            {/* Background ring */}
            <circle 
                cx={radius + 20} 
                cy={radius + 20} 
                r={radius} 
                fill="none" 
                stroke="rgba(212, 175, 55, 0.08)" 
                strokeWidth="8" 
            />
            {/* Progress ring with pulsating glow */}
            <motion.circle
                cx={radius + 20} 
                cy={radius + 20} 
                r={radius}
                fill="none" 
                stroke="url(#progressGradient)" 
                strokeWidth="12"
                strokeLinecap="round" 
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ 
                    strokeDashoffset,
                    filter: [
                        'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3))',
                        'drop-shadow(0 0 16px rgba(212, 175, 55, 0.4))',
                        'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3))'
                    ]
                }}
                transition={{ 
                    strokeDashoffset: { duration: 0.5, ease: "easeOut" },
                    filter: { 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }
                }}
            />
            <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
            </defs>
        </motion.svg>
    );
});


const CountDisplay = React.memo(({ currentCount, cycleCount }: { currentCount: number; cycleCount: number }) => {
    const [displayCount, setDisplayCount] = useState(currentCount);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (currentCount !== displayCount) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setDisplayCount(currentCount);
                setIsAnimating(false);
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [currentCount, displayCount]);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div 
            className="text-7xl text-[#D4AF37] mb-2 font-bold" 
            key={displayCount}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: isAnimating ? [0.8, 1.1, 1] : 1
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut",
              scale: { duration: 0.4 }
            }}
          >
            {displayCount}
          </motion.div>
          <motion.div 
            className="text-sm text-gray-500/60 font-medium"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0.7 }}
          >
            of {cycleCount}
          </motion.div>
          <div className="mt-1 text-xs text-gray-500/60 font-medium">
            {currentCount}/{cycleCount} current
          </div>
        </div>
    );
});


const RippleLayer = React.memo(({ ripples, onRippleEnd }: { ripples: { id: number, x: number, y: number }[], onRippleEnd: (id: number) => void }) => (
    <>
        {ripples.map((ripple) => (
            <motion.div
                key={ripple.id}
                className="absolute rounded-full bg-[#D4AF37] opacity-30"
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                onAnimationComplete={() => onRippleEnd(ripple.id)}
                style={{ left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40 }}
            />
        ))}
    </>
));


const ResetModal = React.memo(({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6" onClick={onClose}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gradient-to-br from-[#FDF6E3] to-[#FAF0E6] dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg mb-3">End this session?</h3>
                    <p className="text-gray-500 mb-6">This will reset your current count to 0.</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                        <button onClick={onConfirm} className="flex-1 py-3 px-4 rounded-xl bg-[#D4AF37] text-white hover:bg-opacity-90">Reset</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
));
