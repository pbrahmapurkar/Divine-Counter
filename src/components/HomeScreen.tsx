import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Circle } from "lucide-react";
import { usePractice } from "../contexts/PracticeContext";
import { Header } from './Header';
import { spiritualQuotes } from "../data/spiritualQuotes";

interface Counter {
  id: string;
  name: string;
  color: string;
  cycleCount: number;
  dailyGoal: number;
}

interface HomeScreenProps {
  counter: Counter;
  currentCount: number;
  todayProgress: number;
  streak: number;
  userName: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onCycleComplete: () => void;
  onResetCurrentCount: () => void;
}

const motivationalPhrases = [
  "Peace within",
  "Stay blessed", 
  "Focus",
  "Be present",
  "Find stillness",
  "Breathe deeply",
  "Trust the process",
  "Inner light",
  "Calm mind",
  "Sacred moment"
];

export function HomeScreen({ 
  counter, 
  currentCount, 
  todayProgress, 
  streak, 
  userName,
  onIncrement, 
  onDecrement,
  onCycleComplete,
  onResetCurrentCount
}: HomeScreenProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [currentQuote, setCurrentQuote] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteChangedByMala, setQuoteChangedByMala] = useState(false);
  const previousCountRef = useRef(currentCount);
  const [showResetModal, setShowResetModal] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [totalTapsToday, setTotalTapsToday] = useState(0);
  const longPressTimer = useRef<number>();
  const touchStartTime = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const tapAreaRef = useRef<HTMLDivElement>(null);
  const smartUndoTimer = useRef<number>();
  const hasTouchStarted = useRef<boolean>(false);

  // Progress calculations
  const progressPercentage = (currentCount / counter.cycleCount) * 100;
  const radius = Math.min(180, Math.min(window.innerHeight * 0.25, window.innerWidth * 0.4)); // Larger responsive radius
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Calculate total taps today
  useEffect(() => {
    setTotalTapsToday(todayProgress * counter.cycleCount + currentCount);
  }, [todayProgress, currentCount, counter.cycleCount]);

  // Generate Living Greeting
  const getLivingGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "";
    
    if (hour < 6) {
      timeGreeting = "Good early morning";
    } else if (hour < 12) {
      timeGreeting = "Good morning";
    } else if (hour < 17) {
      timeGreeting = "Good afternoon";
    } else if (hour < 20) {
      timeGreeting = "Good evening";
    } else {
      timeGreeting = "Good night";
    }

    if (streak > 0) {
      return `${timeGreeting}, ${userName}. You're on a ${streak}-day streak.`;
    } else {
      return `Welcome, ${userName}. Let's begin today's practice.`;
    }
  };

  // Show motivational phrases occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) { // 15% chance every 8 seconds
        const phrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
        setCurrentPhrase(phrase);
        setShowMotivation(true);
        
        setTimeout(() => setShowMotivation(false), 3000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Initialize with first quote
  useEffect(() => {
    setCurrentQuote(spiritualQuotes[0]);
  }, []);

  // Cycle through spiritual quotes when a mala is completed
  useEffect(() => {
    // Check if a mala was just completed
    // The app resets when count >= cycleCount, so we check if:
    // 1. Previous count was at or near the cycle count (indicating completion)
    // 2. Current count is 0 (indicating reset)
    // 3. Previous count was not 0 (to avoid triggering on initial load)
    if (previousCountRef.current >= counter.cycleCount - 1 && 
        currentCount === 0 && 
        previousCountRef.current > 0) {
      // Mala was just completed, change the quote
      setQuoteIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % spiritualQuotes.length;
        setCurrentQuote(spiritualQuotes[nextIndex]);
        setQuoteChangedByMala(true);
        return nextIndex;
      });
    }
    
    // Update the ref for next comparison
    previousCountRef.current = currentCount;
  }, [currentCount, counter.cycleCount]);

  // Reset the mala completion flag after animation
  useEffect(() => {
    if (quoteChangedByMala) {
      const timer = setTimeout(() => {
        setQuoteChangedByMala(false);
      }, 2000); // Reset after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [quoteChangedByMala]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (smartUndoTimer.current) {
        clearTimeout(smartUndoTimer.current);
      }
    };
  }, []);

  // Create ripple effect
  const createRipple = (event: React.TouchEvent | React.MouseEvent) => {
    if (!tapAreaRef.current) return;
    
    const rect = tapAreaRef.current.getBoundingClientRect();
    
    let x: number, y: number;
    
    if ('touches' in event && event.touches && event.touches.length > 0) {
      // Touch event
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else if ('changedTouches' in event && event.changedTouches && event.changedTouches.length > 0) {
      // Touch end event - use changedTouches
      x = event.changedTouches[0].clientX - rect.left;
      y = event.changedTouches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
  };

  // Handle tap/increment
  const handleIncrement = (event: React.TouchEvent | React.MouseEvent) => {
    createRipple(event);
    
    
    if (currentCount + 1 >= counter.cycleCount) {
      onCycleComplete();
    }
    onIncrement();
  };

  // Handle swipe down for undo
  const handleTouchStart = (event: React.TouchEvent) => {
    hasTouchStarted.current = true;
    touchStartTime.current = Date.now();
    touchStartY.current = event.touches[0].clientY;
    setIsPressed(true);
    
    // Start long press timer for reset
    longPressTimer.current = setTimeout(() => {
      setShowResetModal(true);
      setIsPressed(false);
    }, 1500);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    const startY = touch.clientY;
    
    // Cancel long press if finger moves
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime.current;
    setIsPressed(false);
    
    // Cancel long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    // Only register tap if it wasn't a long press
    if (touchDuration < 1500) {
      const changedTouch = event.changedTouches[0];
      const startY = touchStartY.current;
      const deltaY = changedTouch.clientY - startY;
      
      // Enhanced swipe down gesture detection
      // Require minimum 60px downward movement and at least 30px vertical movement
      if (deltaY > 60 && Math.abs(deltaY) > 30) {
        // Swipe down - undo last tap
        if (currentCount > 0) {
          // Hide smart undo button when gesture is used
          setShowSmartUndo(false);
          if (smartUndoTimer.current) {
            clearTimeout(smartUndoTimer.current);
          }
          
          // Add haptic feedback for swipe undo
          // Note: HapticsService.action() is already called in handleDecrement
          
          onDecrement();
        }
      } else {
        // Normal tap
        handleIncrement(event);
      }
    }
    
    // Reset touch flag after a short delay to prevent mouse events
    setTimeout(() => {
      hasTouchStarted.current = false;
    }, 100);
  };

  // Mouse handlers for desktop
  const handleMouseDown = () => {
    setIsPressed(true);
    longPressTimer.current = setTimeout(() => {
      setShowResetModal(true);
      setIsPressed(false);
    }, 1500);
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    // Only handle mouse events if touch hasn't started
    if (!hasTouchStarted.current) {
      handleIncrement(event);
    }
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleReset = () => {
    onResetCurrentCount();
    setShowResetModal(false);
  };


  // Progress Pod component
  const ProgressPod = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1
      }}
      transition={{ duration: 0.3 }}
      className="absolute top-6 left-6 z-10"
    >
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 dark:border-gray-700/30 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {/* Three stacked circles representing malas */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < todayProgress 
                    ? 'bg-[#D4AF37]' 
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground/80">
            Today: {todayProgress} / {counter.dailyGoal}
          </span>
        </div>
      </div>
    </motion.div>
  );



  return (
    <div 
      className="h-screen bg-gradient-to-br from-[#FDF6E3] to-[#FAF0E6] dark:from-gray-900 dark:to-gray-800 overflow-hidden" 
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-white/98 via-white/95 to-white/98 dark:from-gray-900/98 dark:via-gray-900/95 dark:to-gray-900/98 backdrop-blur-xl border-b border-gradient-to-r from-transparent via-gray-200/30 to-transparent dark:via-gray-700/30 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="px-6 py-4">
          {/* Header Content Container */}
          <div className="flex items-center justify-between">
            {/* Left Section - Practice Info */}
            <div className="flex-1 min-w-0">
              {/* Practice Name with Enhanced Design */}
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full shadow-lg shadow-[#D4AF37]/30"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-[#D4AF37] rounded-full animate-pulse opacity-30"></div>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    {counter.name}
                  </h1>
                  <div className="h-0.5 w-16 bg-gradient-to-r from-[#D4AF37] to-transparent mt-1 rounded-full"></div>
                </div>
              </motion.div>
            </div>
            
            {/* Right Section - Enhanced Progress Indicator */}
            <motion.div 
              className="text-right ml-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {/* Compact Progress Badge */}
              <div className="bg-gradient-to-r from-[#D4AF37]/15 to-[#FFD700]/15 dark:from-[#D4AF37]/25 dark:to-[#FFD700]/25 rounded-xl px-3 py-2 border border-[#D4AF37]/25 dark:border-[#D4AF37]/35 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {todayProgress}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    / {counter.dailyGoal}
                  </div>
                  <div className="text-xs text-[#D4AF37] dark:text-[#FFD700] font-medium">
                    malas
                  </div>
                </div>
                
                {/* Compact Progress Bar */}
                <div className="w-full bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (todayProgress / counter.dailyGoal) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Welcome Greeting Section */}
      <div className="px-4 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 tracking-tight">
            {getLivingGreeting()}
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] mx-auto rounded-full mb-2"></div>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Begin your spiritual journey with mindful counting and peaceful practice
          </p>
        </motion.div>
      </div>

      {/* Main Content Area - Centered with Flexbox */}
      <div 
        className="flex-1 flex flex-col items-center justify-center px-4 overflow-hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Spiritual Quotes Display */}
        <div className="mb-4 text-center max-w-md mx-auto">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: quoteChangedByMala ? [1, 1.05, 1] : 1,
              rotateY: quoteChangedByMala ? [0, 5, 0] : 0
            }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: quoteChangedByMala ? 1.2 : 0.8, 
              ease: "easeOut" 
            }}
            className="relative"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-[#FFD700]/5 rounded-2xl blur-xl"
              animate={{
                scale: quoteChangedByMala ? [1, 1.1, 1] : 1,
                opacity: quoteChangedByMala ? [0.5, 0.8, 0.5] : 0.5
              }}
              transition={{ duration: 1.2 }}
            ></motion.div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#D4AF37]/20">
              <motion.div
                className="text-sm text-gray-700 leading-relaxed italic"
                animate={{
                  textShadow: quoteChangedByMala 
                    ? "0 4px 12px rgba(212, 175, 55, 0.3)" 
                    : "0 2px 8px rgba(212, 175, 55, 0.1)",
                  color: quoteChangedByMala ? "#B8860B" : "#374151"
                }}
                transition={{ duration: 1.2 }}
              >
                "{currentQuote}"
              </motion.div>
              <motion.div
                className="mt-3 text-xs font-medium"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: quoteChangedByMala ? 1 : 0.7,
                  color: quoteChangedByMala ? "#D4AF37" : "#D4AF37"
                }}
                transition={{ delay: 0.5 }}
              >
                {quoteChangedByMala ? "✨ New Wisdom from Mala Completion ✨" : "Spiritual Wisdom"}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Motivational Text */}
        <div className="mb-3 text-center">
        <AnimatePresence>
          {showMotivation && (
            <motion.p
                key={currentPhrase}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
                className="text-xs text-[#D4AF37] italic font-medium"
            >
              {currentPhrase}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

        {/* Instructional Text - Positioned Above Main Circle */}
        <motion.div
          className="text-sm text-gray-600 mb-4 font-bold text-center"
          animate={{ 
            opacity: currentCount > 5 ? 0.4 : 0.9  // Fade instruction after user learns
          }}
          transition={{ duration: 1 }}
        >
          Swipe down to undo • Hold to reset
        </motion.div>

        {/* Central Luminous Counter - Single Hero Element */}
        <div 
          className="relative cursor-pointer select-none flex-shrink-0"
          ref={tapAreaRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            filter: 'drop-shadow(0 8px 25px rgba(212, 175, 55, 0.15))'
          }}
        >
          {/* Ripple Effects */}
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full bg-[#D4AF37] opacity-30"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                left: ripple.x - 20,
                top: ripple.y - 20,
                width: 40,
                height: 40,
              }}
            />
          ))}

          {/* Luminous Progress Ring */}
          <motion.svg 
            width={radius * 2 + 40} 
            height={radius * 2 + 40} 
            className="transform -rotate-90"
            style={{ maxWidth: '100%', height: 'auto' }}
            animate={{
              scale: isPressed ? 0.98 : 1,
            }}
            transition={{ duration: 0.1 }}
          >
            {/* Background ring */}
            <circle
              cx={radius + 20}
              cy={radius + 20}
              r={radius}
              fill="none"
              stroke="rgba(212, 175, 55, 0.08)"
              strokeWidth="8"
            />
            {/* Enhanced Progress ring with luminous glow */}
            <circle
              cx={radius + 20}
              cy={radius + 20}
              r={radius}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter: 'drop-shadow(0 8px 25px rgba(212, 175, 55, 0.15))'
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
          
          {/* Enhanced Count Display in Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative flex items-center">
              <motion.div 
                className="text-5xl sm:text-7xl text-[#D4AF37] mb-2"
                animate={{ 
                  scale: isPressed ? 0.95 : 1,
                  textShadow: isPressed ? "0 0 20px rgba(212,175,55,0.8)" : "0 0 10px rgba(212,175,55,0.3)"
                }}
                transition={{ duration: 0.1 }}
                style={{
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {currentCount}
              </motion.div>
              
            </div>
            
            <motion.div 
              className="text-lg text-muted-foreground/70"
              animate={{
                opacity: progressPercentage > 85 ? [0.7, 1, 0.7] : 0.7
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              of {counter.cycleCount}
            </motion.div>
          </div>
        </div>
      </div>


      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6"
            onClick={() => setShowResetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full"
              style={{ maxWidth: 'min(24rem, 90vw)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg mb-3">End this session?</h3>
              <p className="text-muted-foreground mb-6">
                This will reset your current count to 0.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#D4AF37] text-white hover:bg-[#B8941F] transition-colors"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}