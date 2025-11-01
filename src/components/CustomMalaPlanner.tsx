import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import { PracticeMode, PracticeItem, Weekday } from '../data/customMala';
import {
  loadPlannerData,
  savePlannerData,
  setPracticeMode,
  getPracticeMode,
  addDailyPractice,
  updateDailyPractice,
  deleteDailyPractice,
  addWeeklyPractice,
  updateWeeklyPractice,
  deleteWeeklyPractice,
  updatePracticeProgress,
} from '../utils/customMala';
import { PracticeModeSelector } from './PracticeModeSelector';
import { DailyModeView } from './DailyModeView';
import { WeeklyModeView } from './WeeklyModeView';
import { SafeAreaView } from './SafeAreaView';
import { Header } from './Header';

interface CustomMalaPlannerProps {
  onBack?: () => void;
}

export function CustomMalaPlanner({ onBack }: CustomMalaPlannerProps) {
  const [mode, setMode] = useState<PracticeMode>(getPracticeMode());
  const [data, setData] = useState(loadPlannerData());

  // Refresh data when mode changes
  useEffect(() => {
    const currentData = loadPlannerData();
    setData(currentData);
  }, [mode]);

  const handleModeChange = (newMode: PracticeMode) => {
    setMode(newMode);
    setPracticeMode(newMode);
  };

  // Daily mode handlers
  const handleAddDaily = (practice: PracticeItem) => {
    addDailyPractice(practice);
    setData(loadPlannerData());
  };

  const handleEditDaily = (id: string, practice: PracticeItem) => {
    updateDailyPractice(id, practice);
    setData(loadPlannerData());
  };

  const handleDeleteDaily = (id: string) => {
    deleteDailyPractice(id);
    setData(loadPlannerData());
  };

  const handleIncrementDaily = (id: string) => {
    const practice = data.dailyMala.practices.find(p => p.id === id);
    if (practice) {
      const newProgress = Math.min((practice.progress || 0) + 1, practice.beads);
      updatePracticeProgress('daily', null, id, newProgress);
      setData(loadPlannerData());
    }
  };

  // Weekly mode handlers
  const handleAddWeekly = (weekday: Weekday, practice: PracticeItem) => {
    addWeeklyPractice(weekday, practice);
    setData(loadPlannerData());
  };

  const handleEditWeekly = (weekday: Weekday, id: string, practice: PracticeItem) => {
    updateWeeklyPractice(weekday, id, practice);
    setData(loadPlannerData());
  };

  const handleDeleteWeekly = (weekday: Weekday, id: string) => {
    deleteWeeklyPractice(weekday, id);
    setData(loadPlannerData());
  };

  const handleIncrementWeekly = (weekday: Weekday, id: string) => {
    const practice = data.weeklyMala[weekday]?.find(p => p.id === id);
    if (practice) {
      const newProgress = Math.min((practice.progress || 0) + 1, practice.beads);
      updatePracticeProgress('weekly', weekday, id, newProgress);
      setData(loadPlannerData());
    }
  };

  return (
    <SafeAreaView className="relative flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/10">
      <Header
        title="Custom Mala Planner"
        subtitle="Manage your daily or weekly practices"
        showBackButton={!!onBack}
        onBack={onBack}
      />

      <main className="flex flex-1 flex-col" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 112px)' }}>
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 pb-32 pt-4">
            <div className="space-y-6">
              {/* Mode Selector */}
              <div className="space-y-3">
                <PracticeModeSelector mode={mode} onChange={handleModeChange} />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-4">
                  {mode === 'daily'
                    ? 'Use the same practice set every day.'
                    : 'Customize different practices for each weekday.'}
                </p>
              </div>

              {/* Content */}
              {mode === 'daily' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Daily Practices
                  </h2>
                  <DailyModeView
                    practices={data.dailyMala.practices}
                    onAdd={handleAddDaily}
                    onEdit={handleEditDaily}
                    onDelete={handleDeleteDaily}
                    onIncrement={handleIncrementDaily}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Weekly Planner
                  </h2>
                  <WeeklyModeView
                    weeklyMala={data.weeklyMala}
                    onAdd={handleAddWeekly}
                    onEdit={handleEditWeekly}
                    onDelete={handleDeleteWeekly}
                    onIncrement={handleIncrementWeekly}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </SafeAreaView>
  );
}

