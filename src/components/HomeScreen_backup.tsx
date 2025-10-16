import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Circle } from "lucide-react";
import { usePractice } from "../contexts/PracticeContext";
import { Header } from './Header';

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
  "Mindful moment"
];

// Web-compatible SafeAreaView
const SafeAreaView = ({ children }: { children: React.ReactNode }) => (
  <div
    className="min-h-screen bg-background"
    style={{
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      paddingLeft: 'env(safe-area-inset-left, 0px)',
      paddingRight: 'env(safe-area-inset-right, 0px)',
    }}
  >
    {children}
  </div>
);


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
  // Note: undoLastCount is handled via onDecrement prop from parent
  const [isPressed, setIsPressed] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [showSmartUndo, setShowSmartUndo] = useState(false);
  const [isModalPending, setIsModalPending] = useState(false);
  const [modalProgress, setModalProgress] = useState(0);
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
  const radius = Math.min(180, Math.min(window.innerHeight * 0.35, window.innerWidth * 0.35)); // Balanced size for good UX
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
    
    // Show smart undo button briefly
    setShowSmartUndo(true);
    if (smartUndoTimer.current) {
      clearTimeout(smartUndoTimer.current);
    }
    smartUndoTimer.current = setTimeout(() => {
      setShowSmartUndo(false);
    }, 3500); // Show for 3.5 seconds
    
    if (currentCount + 1 >= counter.cycleCount && !isModalPending) {
      // Calculate the new progress value that will be set
      const newProgress = todayProgress + 1;
      
      // Set modal pending flag to prevent duplicates
      setIsModalPending(true);
      
      // Store the correct progress value for the modal
      setModalProgress(newProgress);
      
      // Show session summary before completing
      setShowSessionSummary(true);
      setTimeout(() => {
        setShowSessionSummary(false);
        // Reset modal pending flag when modal closes
        setIsModalPending(false);
      }, 6000); // Show for 6 seconds
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
          if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
            navigator.vibrate(50); // Light feedback for undo
          }
          
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

  // Handle smart undo button click
  const handleSmartUndo = () => {
    setShowSmartUndo(false);
    if (smartUndoTimer.current) {
      clearTimeout(smartUndoTimer.current);
    }
    onDecrement();
  };


  // Smart Undo Button component
  const SmartUndoButton = () => (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, x: -10 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        x: 0,
        boxShadow: [
          "0 4px 12px rgba(212, 175, 55, 0.15)",
          "0 6px 16px rgba(212, 175, 55, 0.25)",
          "0 4px 12px rgba(212, 175, 55, 0.15)"
        ]
      }}
      exit={{ opacity: 0, scale: 0.8, x: -10 }}
      transition={{ 
        duration: 0.3, 
        ease: "backOut",
        boxShadow: { duration: 2, repeatType: "loop" }
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 8px 20px rgba(212, 175, 55, 0.3)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSmartUndo}
      className="absolute -right-20 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-700/85 backdrop-blur-xl rounded-2xl border border-[#D4AF37]/20 shadow-xl flex flex-col items-center justify-center hover:border-[#D4AF37]/40 transition-all duration-300 group"
    >
      <div className="flex items-center gap-1">
        <div>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-[#D4AF37]"
          >
            <path d="M3 7v6h6"/>
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
          </svg>
      </div>
      </div>
      <span className="text-xs text-[#D4AF37] mt-0.5 font-medium tracking-tight">
        -1
      </span>
      
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/5 to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </motion.button>
  );

  // Session Summary Card component
  const SessionSummaryCard = () => {
    const handleCloseModal = () => {
      setShowSessionSummary(false);
      setIsModalPending(false);
    };

    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-24 left-4 right-4 z-40"
        onClick={handleCloseModal}
      >
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 mx-auto cursor-pointer hover:scale-105 transition-transform" style={{ maxWidth: 'min(24rem, 90vw)' }}>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="text-2xl text-[#D4AF37] mb-3">✨ Cycle Complete! ✨</div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-[#D4AF37]" />
                <span className="text-sm text-muted-foreground">Today's Progress</span>
              </div>
              <span className="text-base text-[#D4AF37]">{modalProgress} of {counter.dailyGoal} Cycles</span>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <Circle size={16} className="text-[#D4AF37]" />
                <span className="text-sm text-muted-foreground">Total Taps Today</span>
              </div>
              <span className="text-base text-[#D4AF37]">{totalTapsToday} Taps</span>
            </div>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground/70"
          >
            Tap to begin the next cycle
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
    );
  };

  return (
    <SafeAreaView>
      {/* Fixed Header */}
      <Header
        title={getLivingGreeting()}
        subtitle={`${counter.name} • ${todayProgress}/${counter.dailyGoal} cycles today`}
      />
      
      {/* Fixed Content Area - Entire area between header and nav bar is tappable */}
      <div 
        className="fixed bg-gradient-to-br from-[#FDF6E3] to-[#FAF0E6] dark:from-gray-900 dark:to-gray-800"
        style={{
          top: '100px',
          left: 0,
          right: 0,
          bottom: '80px', // Space for navigation bar
          zIndex: 10
        }}
        ref={tapAreaRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Motivational Text */}
        <div className="pt-4 pb-2 text-center px-6">
          <AnimatePresence>
            {showMotivation && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-[#D4AF37] mt-2 italic"
              >
                {currentPhrase}
              </motion.p>
            )}
          </AnimatePresence>
      </div>

        {/* Central Luminous Counter - Centered in the fixed area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 h-full">
          <div className="relative cursor-pointer select-none">
              {/* Luminous Progress Ring */}
              <svg 
                width={radius * 2 + 40} 
                height={radius * 2 + 40} 
                className="transform -rotate-90"
                style={{ maxWidth: '100%', height: 'auto' }}
              >
                {/* Background ring */}
                <circle
                  cx={radius + 20}
                  cy={radius + 20}
                  r={radius}
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.15)"
                  strokeWidth="6"
                />
                {/* Enhanced Progress ring with luminous glow */}
                <circle
                  cx={radius + 20}
                  cy={radius + 20}
                  r={radius}
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out"
                  style={{
                    filter: `drop-shadow(0 0 ${Math.max(8, progressPercentage * 0.3)}px rgba(212,175,55,${Math.max(0.4, progressPercentage * 0.01)}))`,
                    opacity: Math.max(0.8, progressPercentage * 0.01)
                  }}
                />
                
                {/* Additional inner glow effect */}
                {progressPercentage > 0 && (
                  <circle
                    cx={radius + 20}
                    cy={radius + 20}
                    r={radius - 5}
                    fill="none"
                    stroke="url(#innerGlow)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={circumference * 0.95}
                    strokeDashoffset={strokeDashoffset * 0.95}
                    className="transition-all duration-700 ease-out"
                    style={{
                      opacity: Math.min(0.6, progressPercentage * 0.015)
                    }}
                  />
                )}
                
                {/* SVG Gradient Definitions */}
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFF8DC" />
                  </linearGradient>
                  <linearGradient id="innerGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFFFE0" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
              
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
              
              {/* Enhanced Count Display in Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative flex items-center">
                  <motion.div 
                    className="text-4xl sm:text-6xl text-[#D4AF37] mb-2"
                    animate={{ 
                      scale: isPressed ? 0.95 : 1,
                      textShadow: isPressed ? "0 0 25px rgba(212,175,55,0.9)" : `0 0 ${Math.max(5, progressPercentage * 0.3)}px rgba(212,175,55,0.4)`
                    }}
                    transition={{ duration: 0.1 }}
                    style={{
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {currentCount}
                  </motion.div>
                  
                  {/* Smart Undo Button */}
                  <AnimatePresence>
                    {showSmartUndo && currentCount > 0 && (
                      <SmartUndoButton />
                    )}
                  </AnimatePresence>
                </div>
                
                <motion.div 
                  className="text-base text-muted-foreground/70"
                  animate={{
                    opacity: progressPercentage > 85 ? [0.7, 1, 0.7] : 0.7
                  }}
                  transition={{
                    duration: 2,
                    repeat: progressPercentage > 85 ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  of {counter.cycleCount}
                </motion.div>
              </div>
            </div>
            
            {/* Instructional Text - Refined and Subtle */}
            <motion.div 
              className="text-sm text-muted-foreground/60 mt-8 font-medium text-center px-4"
              animate={{
                opacity: currentCount > 5 ? 0.4 : 0.8  // Fade instruction after user learns
              }}
              transition={{ duration: 1 }}
            >
              Swipe down to undo • Hold to reset
            </motion.div>
          </div>
        </div>
      </div>

      {/* Session Summary Card */}
      <AnimatePresence>
        {showSessionSummary && <SessionSummaryCard />}
      </AnimatePresence>

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
    </SafeAreaView>
  );
}
