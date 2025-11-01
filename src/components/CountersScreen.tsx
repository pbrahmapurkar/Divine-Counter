import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { Plus, Edit3, Trash2, Sun, Moon, Star, Flower, Triangle, Circle, Heart, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from './Header';
import { gentleHaptic } from '../utils/haptics';

// Type definitions for mouse and touch events
type ReactMouseEvent = React.MouseEvent<HTMLButtonElement>;
type ReactTouchEvent = React.TouchEvent<HTMLDivElement>;

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
  currentCount: number;
  todayProgress: number;
  lastCountDate: string;
}

interface CountersScreenProps {
  counters: Counter[];
  activeCounterId: string;
  counterStates: { [counterId: string]: CounterState };
  onSelectCounter: (counterId: string) => void;
  onAddCounter: () => void;
  onEditCounter?: (counterId: string) => void;
  onDeleteCounter?: (counterId: string) => void;
  onNavigateToAddPractice?: () => void;
}

// Icon mapping for spiritual symbols
const iconMap = {
  sun: Sun,
  moon: Moon,
  star: Star,
  lotus: Flower,
  triangle: Triangle,
  circle: Circle,
  heart: Heart,
  mandala: Zap,
};

const getIcon = (iconName: string = "lotus") => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Flower;
  return IconComponent;
};

// Web-compatible SafeAreaView
const SafeAreaView = ({ children }: { children: ReactNode }) => (
  <div
    className="h-screen bg-background flex flex-col overflow-hidden"
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

// ScrollView for scrollable content
const ScrollView = ({ children }: { children: ReactNode }) => (
  <div 
    className="flex-1 overflow-y-auto"
    style={{ 
      marginTop: '100px',
      paddingInline: 16, 
      paddingBottom: 120 // Space for button + bottom nav + extra clearance
    }}
  >
    {children}
  </div>
);

export function CountersScreen({ 
  counters, 
  activeCounterId, 
  counterStates,
  onSelectCounter, 
  onAddCounter,
  onEditCounter,
  onDeleteCounter,
  onNavigateToAddPractice
}: CountersScreenProps) {
  const [swipedCounterId, setSwipedCounterId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    if (!swipedCounterId) return;
    const exists = counters.some(counter => counter.id === swipedCounterId);
    if (!exists) {
      setSwipedCounterId(null);
    }
  }, [counters, swipedCounterId]);

  const openActions = (counterId: string) => {
    setSwipedCounterId(prev => (prev === counterId ? prev : counterId));
  };

  const closeActions = (counterId?: string) => {
    setSwipedCounterId(prev => {
      if (!prev) return null;
      if (!counterId) return null;
      return prev === counterId ? null : prev;
    });
  };

  const registerSwipeTracking = (counterId: string, startX: number, startY: number, pointerType: "mouse" | "touch") => {
    let hasHandled = false;

    const SWIPE_THRESHOLD = 60;
    const ANGLE_THRESHOLD = 50;

    const cleanup = () => {
      if (pointerType === "touch") {
        document.removeEventListener("touchmove", handleMove as EventListener);
        document.removeEventListener("touchend", cleanup);
        document.removeEventListener("touchcancel", cleanup);
      } else {
        document.removeEventListener("mousemove", handleMove as EventListener);
        document.removeEventListener("mouseup", cleanup);
      }

      // Allow click events again on next tick
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    };

    const handleMove = (event: TouchEvent | MouseEvent) => {
      if (hasHandled) return;

      let currentX: number | undefined;
      let currentY: number | undefined;

      if (pointerType === "touch") {
        const touchEvent = event as TouchEvent;
        if (touchEvent.touches.length === 0) return;
        currentX = touchEvent.touches[0].clientX;
        currentY = touchEvent.touches[0].clientY;
      } else {
        const mouseEvent = event as MouseEvent;
        currentX = mouseEvent.clientX;
        currentY = mouseEvent.clientY;
      }

      if (currentX === undefined || currentY === undefined) {
        return;
      }

      const deltaX = currentX - startX;
      const deltaY = Math.abs(currentY - startY);

      if (Math.abs(deltaX) < SWIPE_THRESHOLD || deltaY > ANGLE_THRESHOLD) {
        return;
      }

      hasHandled = true;
      suppressClickRef.current = true;

      if (deltaX < 0) {
        openActions(counterId);
      } else {
        closeActions(counterId);
      }

      cleanup();
    };

    if (pointerType === "touch") {
      document.addEventListener("touchmove", handleMove, { passive: true });
      document.addEventListener("touchend", cleanup);
      document.addEventListener("touchcancel", cleanup);
    } else {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", cleanup);
    }
  };

  const handleEdit = (counterId: string, e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEditCounter?.(counterId);
    setSwipedCounterId(null);
  };

  const handleDeleteClick = (counterId: string, e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowDeleteConfirm(counterId);
    setSwipedCounterId(null);
  };

  const handleDeleteConfirm = (counterId: string) => {
    onDeleteCounter?.(counterId);
    setShowDeleteConfirm(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleFABClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to add practice screen if available, otherwise open add counter modal
    if (onNavigateToAddPractice) {
      onNavigateToAddPractice();
    } else {
      onAddCounter();
    }
    
    // Provide haptic feedback asynchronously (non-blocking)
    try {
      await gentleHaptic();
    } catch (error) {
      // Silently fail haptics - navigation already executed
      console.debug('Haptic feedback failed:', error);
    }
  };

  const handleCardSelect = (counterId: string) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    if (swipedCounterId) {
      setSwipedCounterId(null);
    }

    onSelectCounter(counterId);
  };

  // Empty state
  if (counters.length === 0) {
    return (
      <SafeAreaView>
        <Header
          title="My Practices"
          subtitle="Manage your spiritual practices"
        />
        
        <ScrollView>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10 flex items-center justify-center mb-6">
              <Flower size={32} className="text-[#D4AF37]/60" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-foreground/90">Your sanctuary awaits</h2>
            <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed">
              Create your first spiritual practice counter to begin tracking your daily meditation journey.
            </p>
          </div>
        </ScrollView>
        
        {/* Add Practice Counter Button */}
        <div 
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 88px)', // Bottom nav height (~72px) + extra spacing (16px)
            paddingLeft: 'calc(env(safe-area-inset-left) + 16px)',
            paddingRight: 'calc(env(safe-area-inset-right) + 16px)',
            paddingTop: '20px'
          }}
        >
          <motion.button
            onClick={handleFABClick}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 bg-[#D4AF37] text-white rounded-full shadow-2xl shadow-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-base relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5C158] active:bg-[#caa634] touch-manipulation cursor-pointer"
            aria-label="Add Practice Counter"
            style={{ minHeight: '48px', zIndex: 41 }}
            type="button"
          >
            <Plus size={20} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative z-10">Add Practice Counter</span>
          </motion.button>
        </div>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Header
        title="My Practices"
        subtitle="Manage your spiritual practices"
      />
      
      <ScrollView>
        <div className="space-y-5 pt-6 pb-4">
          {counters.map((counter) => {
            const IconComponent = getIcon(counter.icon);
            const counterState = counterStates[counter.id];
            const isActive = activeCounterId === counter.id;
            const isSwipped = swipedCounterId === counter.id;
            const todayProgress = counterState?.todayProgress || 0;
            const currentCount = counterState?.currentCount || 0;
            const progressPercent = counter.dailyGoal > 0 
              ? Math.min((todayProgress / counter.dailyGoal) * 100, 100)
              : 0;
            
            return (
              <div key={counter.id} className="relative overflow-hidden">
                {/* Practice Card */}
                <div
                  className={`
                    relative bg-card rounded-xl border transition-all duration-300 cursor-pointer
                    ${isActive 
                      ? 'border-2 shadow-lg shadow-[#D4AF37]/20' 
                      : 'border-border/50 hover:border-[#D4AF37]/40'
                    }
                    ${isSwipped ? 'translate-x-[-120px]' : 'translate-x-0'}
                  `}
                  style={{
                    borderColor: isActive ? counter.color : undefined,
                    boxShadow: isActive ? `0 8px 32px ${counter.color}20` : undefined
                  }}
                  onClick={() => handleCardSelect(counter.id)}
                  onTouchStart={(event: ReactTouchEvent<HTMLDivElement>) => {
                    const firstTouch = event.touches[0];
                    if (!firstTouch) return;
                    registerSwipeTracking(counter.id, firstTouch.clientX, firstTouch.clientY, "touch");
                  }}
                  onMouseDown={(event) => {
                    registerSwipeTracking(counter.id, event.clientX, event.clientY, "mouse");
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Icon with color background */}
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: `${counter.color}15` }}
                        >
                          <IconComponent 
                            size={20} 
                            style={{ color: counter.color }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-foreground/90">{counter.name}</h3>
                            {isActive && (
                              <span className="px-2.5 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium rounded-full border border-[#D4AF37]/20 flex-shrink-0">
                                Active
                              </span>
                            )}
                          </div>
                          
                          {/* Progress indicator */}
                          <div className="text-sm text-muted-foreground mb-3 font-medium">
                            {todayProgress > 0 ? (
                              <span>{todayProgress} of {counter.dailyGoal} cycles today</span>
                            ) : (
                              <span>Goal: {counter.dailyGoal} cycles/day</span>
                            )}
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full bg-muted/60 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                backgroundColor: counter.color,
                                width: `${progressPercent}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Current count indicator */}
                      <div className="text-xs text-muted-foreground text-right flex-shrink-0 ml-2">
                        <div className="opacity-40 mb-1">← swipe</div>
                        {currentCount > 0 && (
                          <div className="font-medium text-foreground/70">
                            {currentCount}/{counter.cycleCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Swipe Actions */}
                <AnimatePresence>
                  {isSwipped && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute right-0 top-0 h-full flex items-center gap-3 pr-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleEdit(counter.id, e)}
                        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                      >
                        <Edit3 size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDeleteClick(counter.id, e)}
                        className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollView>
      
      {/* Add Practice Counter Button */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 88px)', // Bottom nav height (~72px) + extra spacing (16px)
          paddingLeft: 'calc(env(safe-area-inset-left) + 16px)',
          paddingRight: 'calc(env(safe-area-inset-right) + 16px)',
          paddingTop: '20px'
        }}
      >
        <motion.button
          onClick={handleFABClick}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-12 bg-[#D4AF37] text-white rounded-full shadow-2xl shadow-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-base relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5C158] active:bg-[#caa634] touch-manipulation cursor-pointer"
          aria-label="Add Practice Counter"
          style={{ minHeight: '48px', zIndex: 41 }}
          type="button"
        >
          <Plus size={20} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
          <span className="relative z-10">Add Practice Counter</span>
        </motion.button>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={handleDeleteCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 max-w-sm w-full border shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Trash2 size={24} className="text-red-600 dark:text-red-400" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Delete Practice?</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Are you sure you want to permanently delete{' '}
                  <span className="font-medium text-foreground">
                    "{counters.find(c => c.id === showDeleteConfirm)?.name}"
                  </span>
                  ? All its history and journal entries will be lost.
                </p>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteCancel}
                    className="flex-1 py-3 px-4 rounded-xl border border-border hover:bg-muted/50 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 font-medium shadow-lg"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SafeAreaView>
  );
}
