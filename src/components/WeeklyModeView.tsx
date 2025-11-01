import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Plus, Calendar } from 'lucide-react';
import { Weekday, PracticeItem, WEEKDAY_NAMES, WEEKDAY_ORDER, getWeekday } from '../data/customMala';
import { MantraCard } from './MantraCard';
import { AddEditPracticeModal } from './AddEditPracticeModal';

interface WeeklyModeViewProps {
  weeklyMala: Record<Weekday, PracticeItem[]>;
  onAdd: (weekday: Weekday, practice: PracticeItem) => void;
  onEdit: (weekday: Weekday, id: string, practice: PracticeItem) => void;
  onDelete: (weekday: Weekday, id: string) => void;
  onIncrement: (weekday: Weekday, id: string) => void;
}

export function WeeklyModeView({
  weeklyMala,
  onAdd,
  onEdit,
  onDelete,
  onIncrement,
}: WeeklyModeViewProps) {
  const [expandedDays, setExpandedDays] = useState<Set<Weekday>>(new Set([getWeekday()]));
  const [editingDay, setEditingDay] = useState<Weekday | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const currentWeekday = getWeekday();

  const toggleDay = (day: Weekday) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const editingPractice = editingDay && editingId
    ? weeklyMala[editingDay]?.find(p => p.id === editingId)
    : undefined;

  const handleSave = (practice: PracticeItem) => {
    if (editingDay && editingId) {
      onEdit(editingDay, editingId, practice);
      setEditingDay(null);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {WEEKDAY_ORDER.map((day) => {
        const practices = weeklyMala[day] || [];
        const isExpanded = expandedDays.has(day);
        const isToday = day === currentWeekday;

        return (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 overflow-hidden"
          >
            {/* Day Header */}
            <button
              onClick={() => toggleDay(day)}
              className={`
                w-full p-4 flex items-center justify-between
                ${isToday ? 'bg-gradient-to-r from-[#D4AF37]/10 to-transparent' : ''}
                hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
              `}
              aria-label={`${WEEKDAY_NAMES[day]}, ${practices.length} practices`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {WEEKDAY_NAMES[day]}
                    </h3>
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#D4AF37] text-white">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {practices.length} {practices.length === 1 ? 'practice' : 'practices'}
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`
                  w-5 h-5 text-gray-400 transition-transform duration-200
                  ${isExpanded ? 'transform rotate-180' : ''}
                `}
              />
            </button>

            {/* Practices List */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 pt-2">
                    {practices.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          No practices yet for this day.
                        </p>
                        <button
                          onClick={() => {
                            setEditingDay(day);
                            setEditingId(null);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] font-medium text-sm transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Practice
                        </button>
                      </div>
                    ) : (
                      <>
                        <AnimatePresence mode="popLayout">
                          {practices.map((practice) => (
                            <MantraCard
                              key={practice.id}
                              practice={practice}
                              onIncrement={() => onIncrement(day, practice.id)}
                              onEdit={(id) => {
                                setEditingDay(day);
                                setEditingId(id);
                              }}
                              onDelete={(id) => onDelete(day, id)}
                            />
                          ))}
                        </AnimatePresence>

                        {/* Add Practice Button */}
                        <button
                          onClick={() => {
                            setEditingDay(day);
                            setEditingId(null);
                          }}
                          className="w-full p-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] font-medium text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Practice
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Edit Modal */}
      {editingDay && (
        <AddEditPracticeModal
          isOpen={true}
          practice={editingPractice}
          onSave={(practice) => {
            if (editingId) {
              handleSave(practice);
            } else {
              onAdd(editingDay, practice);
              setEditingDay(null);
            }
          }}
          onClose={() => {
            setEditingDay(null);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}

