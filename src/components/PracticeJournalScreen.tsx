import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Infinity, Heart, X, Edit3, Sparkles, Sun, Check, Star } from "lucide-react";
import { Header } from './Header';
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

interface HistoryEntry {
  date: string;
  count: number;
  goalAchieved: boolean;
}

interface JournalEntry {
  date: string;
  reflection: string;
}

interface PracticeJournalScreenProps {
  todayProgress: number;
  dailyGoal: number;
  streak: number;
  history: HistoryEntry[];
  journalEntries?: JournalEntry[];
  onAddJournalEntry?: (entry: JournalEntry) => void;
}

export function PracticeJournalScreen({ 
  todayProgress, 
  dailyGoal, 
  streak, 
  history,
  journalEntries = [],
  onAddJournalEntry 
}: PracticeJournalScreenProps) {

  // Calculate all-time total
  const allTimeTotal = history.reduce((sum, entry) => sum + entry.count, 0) + todayProgress;
  
  // Generate last 7 days data
  const generateLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
      const fullDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const isToday = i === 0;
      const isPast = i > 0; // Yesterday or before
      const historyEntry = history.find(entry => entry.date === dateString);
      const journalEntry = journalEntries.find(entry => entry.date === dateString);
      
      let malasCompleted = 0;
      let goalAchieved = false;
      
      if (isToday) {
        malasCompleted = todayProgress;
        goalAchieved = todayProgress >= dailyGoal;
      } else if (historyEntry) {
        malasCompleted = historyEntry.count;
        goalAchieved = historyEntry.goalAchieved;
      }
      
      // Determine if day should be disabled
      const isDisabled = isPast && malasCompleted === 0;
      
      days.push({
        date,
        dateString,
        dayName,
        fullDayName,
        malasCompleted,
        dailyGoal,
        goalAchieved,
        isToday,
        isPast,
        isDisabled,
        reflection: journalEntry?.reflection || null,
        intensity: goalAchieved ? 1 : Math.min(malasCompleted / dailyGoal, 0.8)
      });
    }
    
    return days;
  };

  const last7Days = generateLast7Days();
  const goalsMetInLast7Days = last7Days.filter(day => day.goalAchieved).length;




  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get bar height based on practice count
  const getBarHeight = (malasCompleted: number) => {
    if (malasCompleted === 0) return 8;
    return Math.max(12, Math.min(60, (malasCompleted / dailyGoal) * 60));
  };

  // Get color intensity for bars
  const getBarColor = (malasCompleted: number, goalAchieved: boolean) => {
    if (malasCompleted === 0) return 'bg-muted/30';
    if (goalAchieved) return 'bg-gradient-to-t from-[#D4AF37] to-yellow-400';
    return `bg-gradient-to-t from-[#D4AF37]/60 to-yellow-400/60`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/10 relative flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        title="My Journey"
        subtitle="Track your spiritual progress and reflections"
      />
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 dark:from-orange-800/10 dark:to-yellow-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-3xl" />
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto" style={{ paddingTop: '100px' }}>
        <div className="px-4 pt-8 pb-24 relative z-10">

        {/* Simplified Insight Cards - Day Streak and All-Time */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-6 mb-8"
        >
          {/* Current Streak Card */}
          <motion.div 
            className="relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/40 dark:via-red-950/40 dark:to-pink-950/40 rounded-3xl p-6 border border-orange-200/60 dark:border-orange-800/40 overflow-hidden group"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: streak > 0 ? '0 8px 32px rgba(255, 140, 66, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 right-2 w-6 h-6 border border-orange-300 rounded-full" />
              <div className="absolute bottom-2 left-2 w-4 h-4 bg-orange-200 rounded-full" />
            </div>
            
            <div className="relative flex flex-col items-center text-center">
              <motion.div
                animate={{ 
                  scale: streak > 0 ? [1, 1.15, 1] : [1],
                  rotate: streak > 0 ? [0, 5, -5, 0] : [0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-4"
              >
                <Flame size={28} className={`${streak > 0 ? 'text-orange-500' : 'text-gray-400'} drop-shadow-sm`} />
              </motion.div>
              <div className="text-3xl text-orange-600 dark:text-orange-400 mb-1">{streak}</div>
              <div className="text-sm text-orange-500/80 dark:text-orange-400/80">Day Streak</div>
              
              {streak > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"
                />
              )}
            </div>
          </motion.div>

          {/* All-Time Card */}
          <motion.div 
            className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/40 dark:via-pink-950/40 dark:to-rose-950/40 rounded-3xl p-6 border border-purple-200/60 dark:border-purple-800/40 overflow-hidden"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: '0 8px 32px rgba(147, 51, 234, 0.1)'
            }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 left-2 w-5 h-5 border-2 border-purple-300 rounded-full" />
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-purple-200 rounded-full" />
              <div className="absolute top-4 right-4 w-2 h-2 bg-pink-300 rounded-full" />
            </div>
            
            <div className="relative flex flex-col items-center text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Infinity size={28} className="text-purple-500 drop-shadow-sm" />
              </motion.div>
              <div className="text-3xl text-purple-600 dark:text-purple-400 mb-1">{allTimeTotal}</div>
              <div className="text-sm text-purple-500/80 dark:text-purple-400/80 mb-1">All-Time</div>
              <div className="text-xs text-purple-400/60 dark:text-purple-300/60">Total Malas</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Last 7 Days Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6 bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50"
        >
          <h2 className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-orange-500 mb-2">
            Last 7 Days
          </h2>
          <div className="text-sm text-muted-foreground">
            {goalsMetInLast7Days > 0 
              ? `Goal met on ${goalsMetInLast7Days} of the last 7 days`
              : "Your weekly activity"
            }
          </div>
        </motion.div>

        {/* Last 7 Days Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-border/50 shadow-xl mb-8 overflow-hidden relative"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-50/20 to-purple-50/20 dark:from-transparent dark:via-orange-950/10 dark:to-purple-950/10 pointer-events-none" />
          
          <div className="relative flex items-end justify-between gap-4 h-32">
            {last7Days.map((day, index) => (
              <motion.div
                key={day.dateString}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`flex-1 flex flex-col items-center group ${
                  day.isDisabled 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'cursor-default'
                }`}
              >
                {/* Day label */}
                <div className={`text-sm mb-2 transition-colors ${
                  day.isToday 
                    ? 'text-[#D4AF37] font-semibold' 
                    : day.isDisabled
                    ? 'text-muted-foreground/50'
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {day.dayName}
                </div>
                
                {/* Bar container */}
                <div className="relative flex-1 w-full flex items-end">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className={`
                      w-full rounded-t-lg transition-all duration-300 relative
                      ${!day.isDisabled && 'group-hover:scale-105'}
                      ${getBarColor(day.malasCompleted, day.goalAchieved)}
                      ${day.isToday ? 'ring-2 ring-[#D4AF37] ring-opacity-50' : ''}
                      ${day.isDisabled ? 'opacity-50' : ''}
                    `}
                    style={{ height: `${getBarHeight(day.malasCompleted)}px` }}
                  >
                    {/* Goal achievement indicator */}
                    {day.goalAchieved && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                      >
                        <Check size={12} className="text-green-500 bg-white rounded-full p-0.5" />
                      </motion.div>
                    )}
                    
                    {/* Practice count */}
                    {day.malasCompleted > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="text-xs font-semibold text-white drop-shadow-sm">
                          {day.malasCompleted}
                        </span>
                      </motion.div>
                    )}
                    
                    {/* Today indicator */}
                    {day.isToday && (
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1 -right-1 w-4 h-4 text-[#D4AF37]"
                      >
                        <Sun size={12} />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                
                {/* Date */}
                <div className="text-xs text-muted-foreground mt-2 group-hover:text-foreground transition-colors">
                  {day.date.getDate()}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 pt-4 border-t border-border/30 flex items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-t from-[#D4AF37]/60 to-yellow-400/60 rounded-sm" />
              <span>Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-t from-[#D4AF37] to-yellow-400 rounded-sm" />
              <span>Goal Met</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={10} className="text-green-500" />
              <span>Achievement</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Empty State */}
        {history.length === 0 && todayProgress === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-16 relative"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-2 border-dashed border-[#D4AF37] rounded-full"
              />
            </div>
            
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="mb-6 relative z-10"
            >
              <Heart size={64} className="text-[#D4AF37] mx-auto opacity-80 drop-shadow-lg" />
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-orange-500 mb-4"
            >
              Your Sacred Journey Awaits
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-muted-foreground leading-relaxed max-w-md mx-auto text-lg"
            >
              Begin with a single breath, a whispered mantra. Watch as your dedication paints a beautiful tapestry of mindful moments across this sacred calendar.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              className="flex justify-center gap-4 mt-8"
            >
              <Star size={20} className="text-[#D4AF37] opacity-60" />
              <Sparkles size={20} className="text-orange-400 opacity-60" />
              <Star size={20} className="text-[#D4AF37] opacity-60" />
            </motion.div>
          </motion.div>
        )}
      </div>

      </div>
    </div>
  );
}
