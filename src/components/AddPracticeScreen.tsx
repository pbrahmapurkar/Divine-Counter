import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Check } from "lucide-react";
import { Header } from './Header';

// Assumes theme is now in a central file, e.g., src/config/theme.ts
// import { goldenSunriseTheme } from '../config/theme'; 

interface Theme {
  id: string;
  name: string;
  baseColor: string;
  accentColor: string;
  lightColor: string;
  preview: {
    bg: string;
    ring: string;
    text: string;
  };
}

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

interface AddPracticeScreenProps {
  onSave: (data: Omit<Counter, "id">) => void;
  onBack: () => void;
}

// This theme object should ideally be imported from a central theme file.
const goldenSunriseTheme: Theme = {
  id: 'golden-sunrise',
  name: 'Golden Sunrise',
  baseColor: '#FDF6E3',
  accentColor: '#D4AF37',
  lightColor: '#FAF0E6',
  preview: {
    bg: 'from-[#FDF6E3] to-[#FAF0E6]',
    ring: '#D4AF37',
    text: '#D4AF37'
  }
};

const cycleCounts = [21, 27, 54, 108];

// Main Component
export function AddPracticeScreen({ onSave, onBack }: AddPracticeScreenProps) {
  const [selectedCycle, setSelectedCycle] = useState(108);
  const [customCycle, setCustomCycle] = useState("");
  const [practiceName, setPracticeName] = useState("");
  const [dailyGoal, setDailyGoal] = useState(3);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");

  const selectedTheme = goldenSunriseTheme;

  const handleSave = () => {
    const finalCycleCount = customCycle ? parseInt(customCycle) || selectedCycle : selectedCycle;
    
    if (practiceName.trim().length > 0 && dailyGoal > 0) {
      onSave({
        name: practiceName,
        color: selectedTheme.accentColor,
        cycleCount: finalCycleCount,
        dailyGoal,
        icon: "lotus",
        reminderEnabled,
        reminderTime
      });
      onBack();
    }
  };

  const getCurrentCycle = () => customCycle ? parseInt(customCycle) || selectedCycle : selectedCycle;

  const isValid = practiceName.trim().length > 0 && dailyGoal > 0;

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br ${selectedTheme.preview.bg} overflow-hidden`}>
      <Header
        title="Add New Practice"
        subtitle="Create a new spiritual practice"
        showBackButton={true}
        onBack={onBack}
      />

      {/* Scrollable Content Area */}
      <div 
        className="flex-1 overflow-y-auto px-6 py-8"
        style={{ 
          paddingTop: '100px',
          paddingBottom: '120px' // Space for fixed buttons + nav bar
        }}
      >
        <div className="max-w-sm mx-auto w-full space-y-8">
          <MalaCountSelector
            selectedCycle={selectedCycle}
            setSelectedCycle={setSelectedCycle}
            customCycle={customCycle}
            setCustomCycle={setCustomCycle}
            getCurrentCycle={getCurrentCycle}
            theme={selectedTheme}
          />
          
          <PracticeNameInput
            practiceName={practiceName}
            setPracticeName={setPracticeName}
            theme={selectedTheme}
          />
          
          <DailyGoalStepper
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
            theme={selectedTheme}
          />

          {/*
          <ReminderSettings
            reminderEnabled={reminderEnabled}
            reminderTime={reminderTime}
            onToggle={(value: boolean) => setReminderEnabled(value)}
            onOpenPicker={() => {
              if (!reminderEnabled) return;
              openTimePicker();
            }}
            formattedTime={formatReminderTime(reminderTime)}
            theme={selectedTheme}
          />

          <input
            ref={timeInputRef}
            type="time"
            value={reminderTime}
            onChange={(event) => setReminderTime(event.target.value || "09:00")}
            className="hidden"
          />
          */}

        </div>
      </div>

      {/* Fixed Footer for Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="fixed bottom-0 left-0 right-0 flex gap-4 p-6 border-t border-black/5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
        style={{ 
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
          paddingLeft: 'calc(env(safe-area-inset-left) + 1.5rem)',
          paddingRight: 'calc(env(safe-area-inset-right) + 1.5rem)'
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-white/30"
          style={{ color: selectedTheme.accentColor }}
        >
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>
        
        <button
          onClick={handleSave}
          disabled={!isValid}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
          style={{
            background: `linear-gradient(135deg, ${selectedTheme.accentColor}, ${selectedTheme.accentColor}dd)`,
            color: 'white'
          }}
        >
          <Check size={18} />
          <span>Create Practice</span>
        </button>
      </motion.div>
    </div>
  );
}

// --- Sub-components for better structure ---

const MalaCountSelector = ({ selectedCycle, setSelectedCycle, customCycle, setCustomCycle, getCurrentCycle, theme }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
  >
    <h3 className="text-lg mb-4" style={{ color: theme.accentColor }}>
      Cycle Count
    </h3>
    <div className="grid grid-cols-2 gap-3 mb-4">
      {cycleCounts.map((count) => (
        <button
          key={count}
          onClick={() => {
            setSelectedCycle(count);
            setCustomCycle("");
          }}
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            selectedCycle === count && !customCycle
              ? 'border-opacity-100 shadow-lg scale-105'
              : 'border-opacity-30 hover:border-opacity-60'
          }`}
          style={{
            borderColor: theme.accentColor,
            backgroundColor: selectedCycle === count && !customCycle ? `${theme.accentColor}15` : 'transparent'
          }}
        >
          <div className="text-xl" style={{ color: theme.accentColor }}>{count}</div>
          {count === 108 && <div className="text-xs text-gray-500 mt-1">Traditional</div>}
        </button>
      ))}
    </div>
    <input
      type="number"
      placeholder="Custom count..."
      value={customCycle}
      onChange={(e) => setCustomCycle(e.target.value)}
      className="w-full p-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-center outline-none transition-all duration-300 focus:shadow-lg"
      style={{
        borderColor: customCycle ? theme.accentColor : undefined,
        color: theme.accentColor
      }}
      min="1"
      max="10000"
    />
    <div className="flex justify-center mt-6">
      <div className="relative">
        <svg width="120" height="120" className="transform -rotate-90">
          <circle cx="60" cy="60" r="45" fill="none" stroke={`${theme.accentColor}40`} strokeWidth="3" />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={theme.accentColor}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 45 * 0.25} ${2 * Math.PI * 45}`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ color: theme.accentColor }} className="text-sm">{getCurrentCycle()}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const PracticeNameInput = ({ practiceName, setPracticeName, theme }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
  >
    <h3 className="text-lg mb-4" style={{ color: theme.accentColor }}>
      Practice Name
    </h3>
    <input
      type="text"
      placeholder="e.g., Morning Practice, Peace Meditation"
      value={practiceName}
      onChange={(e) => setPracticeName(e.target.value)}
      className="w-full p-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl outline-none transition-all duration-300 focus:shadow-lg"
      style={{
        borderColor: practiceName ? theme.accentColor : undefined,
        color: theme.accentColor
      }}
    />
  </motion.div>
);

const DailyGoalStepper = ({ dailyGoal, setDailyGoal, theme }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.5 }}
  >
    <h3 className="text-lg mb-4" style={{ color: theme.accentColor }}>
      Daily Goal
    </h3>
    <div className="flex items-center gap-4">
      <button
        onClick={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
        className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ borderColor: theme.accentColor, color: theme.accentColor }}
      >
        -
      </button>
      <div className="flex-1 text-center">
        <div className="text-2xl" style={{ color: theme.accentColor }}>
          {dailyGoal}
        </div>
        <div className="text-xs text-gray-500">
          cycles per day
        </div>
      </div>
      <button
        onClick={() => setDailyGoal(dailyGoal + 1)}
        className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ borderColor: theme.accentColor, color: theme.accentColor }}
      >
        +
      </button>
    </div>
  </motion.div>
);

/*
const ReminderSettings = ({
  reminderEnabled,
  reminderTime,
  onToggle,
  onOpenPicker,
  formattedTime,
  theme
}: {
  reminderEnabled: boolean;
  reminderTime: string;
  onToggle: (value: boolean) => void;
  onOpenPicker: () => void;
  formattedTime: string;
  theme: Theme;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.6 }}
    className="space-y-3"
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg" style={{ color: theme.accentColor }}>
          Daily Reminder
        </h3>
        <p className="text-xs text-gray-500">Stay on track with a gentle nudge.</p>
      </div>
      <Switch checked={reminderEnabled} onCheckedChange={onToggle} aria-label="Toggle daily reminder" />
    </div>

    <button
      type="button"
      onClick={onOpenPicker}
      disabled={!reminderEnabled}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
        reminderEnabled
          ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm'
          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
      }`}
    >
      <span className="text-sm font-medium">Remind me at</span>
      <span className="text-sm font-semibold">{formattedTime}</span>
    </button>
  </motion.div>
);
*/
