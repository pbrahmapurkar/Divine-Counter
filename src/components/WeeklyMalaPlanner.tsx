import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, RotateCcw, X } from 'lucide-react';
import { WeeklyMala, Weekday, MalaPlan, DEFAULT_WEEKLY_MALA, THEMES, getWeekday, getMantraById, getMantrasByTheme, MANTRAS } from '../data/weeklyMala';
import { loadWeeklyMala, saveWeeklyMala } from '../utils/weeklyMala';
import { toast } from 'sonner';

interface WeeklyMalaPlannerProps {
  onClose?: () => void;
}

const WEEKDAY_NAMES: Record<Weekday, string> = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
};

const WEEKDAY_ORDER: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function WeeklyMalaPlanner({ onClose }: WeeklyMalaPlannerProps) {
  const [schedule, setSchedule] = useState<WeeklyMala>(loadWeeklyMala());
  const [editingDay, setEditingDay] = useState<Weekday | null>(null);
  const currentWeekday = getWeekday();

  const handleDayClick = (day: Weekday) => {
    setEditingDay(day);
  };

  const handleSave = (day: Weekday, plan: MalaPlan) => {
    const updated = { ...schedule, [day]: plan };
    setSchedule(updated);
    saveWeeklyMala(updated);
    setEditingDay(null);
    toast.success(`${WEEKDAY_NAMES[day]} Practice updated.`);
  };

  const handleRestoreDefault = (day: Weekday) => {
    const updated = { ...schedule, [day]: DEFAULT_WEEKLY_MALA[day] };
    setSchedule(updated);
    saveWeeklyMala(updated);
    toast.success(`${WEEKDAY_NAMES[day]} restored to default.`);
  };

  const handleRestoreAllDefaults = () => {
    setSchedule(DEFAULT_WEEKLY_MALA);
    saveWeeklyMala(DEFAULT_WEEKLY_MALA);
    toast.success('All days restored to default schedule.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Weekly Mala Planner
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Customize your practice for each day of the week
          </p>
        </div>
        <button
          onClick={handleRestoreAllDefaults}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
          aria-label="Restore all defaults"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restore Defaults</span>
        </button>
      </div>

      {/* Day Cards */}
      <div className="space-y-3">
        {WEEKDAY_ORDER.map((day) => {
          const plan = schedule[day];
          const mantra = getMantraById(plan.mantraId);
          const theme = THEMES[plan.themeId];
          const isToday = day === currentWeekday;

          return (
            <motion.button
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleDayClick(day)}
              className={`
                w-full text-left rounded-xl border transition-all duration-200
                ${isToday 
                  ? 'border-[#D4AF37]/40 bg-gradient-to-br from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent shadow-sm' 
                  : 'border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5'
                }
              `}
              aria-label={`Edit ${WEEKDAY_NAMES[day]} practice`}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Theme Icon */}
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                    ${isToday ? 'bg-[#D4AF37]/20' : 'bg-gray-100/60 dark:bg-gray-700/60'}
                  `}>
                    {theme.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                        {WEEKDAY_NAMES[day]}
                      </h4>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#D4AF37] text-white">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                      {mantra?.mantra || plan.mantraId}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {theme.name} · {plan.beads} beads
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingDay && (
          <EditDayModal
            day={editingDay}
            currentPlan={schedule[editingDay]}
            onSave={(plan) => handleSave(editingDay, plan)}
            onRestoreDefault={() => handleRestoreDefault(editingDay)}
            onClose={() => setEditingDay(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface EditDayModalProps {
  day: Weekday;
  currentPlan: MalaPlan;
  onSave: (plan: MalaPlan) => void;
  onRestoreDefault: () => void;
  onClose: () => void;
}

function EditDayModal({ day, currentPlan, onSave, onRestoreDefault, onClose }: EditDayModalProps) {
  const [selectedThemeId, setSelectedThemeId] = useState(currentPlan.themeId);
  const [selectedMantraId, setSelectedMantraId] = useState(currentPlan.mantraId);
  const [beads, setBeads] = useState(currentPlan.beads);
  const [searchQuery, setSearchQuery] = useState('');

  const theme = THEMES[selectedThemeId];
  const availableMantras = getMantrasByTheme(selectedThemeId);
  const filteredMantras = availableMantras.filter(m => 
    m.mantra.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    onSave({
      themeId: selectedThemeId,
      mantraId: selectedMantraId,
      beads,
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-br from-white via-[#FDF6E3]/30 to-[#FAF0E6]/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 shadow-xl backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {WEEKDAY_NAMES[day]} Practice
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {theme.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Theme Selection */}
          <div className="flex gap-2 flex-wrap">
            {Object.values(THEMES).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedThemeId(t.id);
                  const firstMantra = getMantrasByTheme(t.id)[0];
                  if (firstMantra) setSelectedMantraId(firstMantra.id);
                }}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${selectedThemeId === t.id
                    ? 'bg-[#D4AF37] text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Search */}
          <input
            type="text"
            placeholder="Search mantras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 mb-4"
            aria-label="Search mantras"
          />

          {/* Mantra List */}
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Mantra
            </p>
            {filteredMantras.map((mantra) => (
              <button
                key={mantra.id}
                onClick={() => setSelectedMantraId(mantra.id)}
                className={`
                  w-full text-left p-3 rounded-xl border transition-all
                  ${selectedMantraId === mantra.id
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#D4AF37]/30'
                  }
                `}
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {mantra.mantra}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {mantra.energy}
                </p>
              </button>
            ))}
          </div>

          {/* Beads Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bead Count
            </label>
            <select
              value={beads}
              onChange={(e) => setBeads(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              aria-label="Bead count"
            >
              <option value="21">21 beads</option>
              <option value="27">27 beads</option>
              <option value="54">54 beads</option>
              <option value="108">108 beads (Traditional)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200/50 dark:border-gray-700/50 flex gap-3">
          <button
            onClick={onRestoreDefault}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Restore Default
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-white font-semibold hover:bg-[#caa634] shadow-sm transition-colors"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

