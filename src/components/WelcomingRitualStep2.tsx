import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, ChevronLeft } from "lucide-react";
// import { Switch } from "./ui/switch";

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

interface PracticeData {
  cycleCount: number;
  name: string;
  theme: Theme;
  dailyGoal: number;
  reminderEnabled: boolean;
  reminderTime: string;
}

interface WelcomingRitualStep2Props {
  userName: string;
  onNext: (data: PracticeData) => void;
  onBack: () => void;
}

// Fixed Golden Sunrise theme
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

export function WelcomingRitualStep2({ userName, onNext, onBack }: WelcomingRitualStep2Props) {
  const [selectedCycle, setSelectedCycle] = useState(108);
  const [customCycle, setCustomCycle] = useState("");
  const [practiceName, setPracticeName] = useState("");
  const [dailyGoal, setDailyGoal] = useState(3);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  
  // Always use Golden Sunrise theme
  const selectedTheme = goldenSunriseTheme;

  const handleContinue = () => {
    const finalCycleCount = customCycle ? parseInt(customCycle) || selectedCycle : selectedCycle;
    
    onNext({
      cycleCount: finalCycleCount,
      name: practiceName || "My Practice",
      theme: goldenSunriseTheme,
      dailyGoal,
      reminderEnabled,
      reminderTime
    });
  };

  const getCurrentCycle = () => {
    return customCycle ? parseInt(customCycle) || selectedCycle : selectedCycle;
  };

  const isValid = (practiceName.trim().length > 0) && dailyGoal > 0;


  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedTheme.preview.bg} flex flex-col px-6 py-8 transition-all duration-1000`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl mb-2" style={{ color: selectedTheme.accentColor }}>
          Set Your Intention
        </h1>
        <p className="text-gray-600">
          {userName}, let's craft your practice together
        </p>
      </motion.div>

      <div className="flex-1 max-w-sm mx-auto w-full space-y-8">
        {/* Cycle Count Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-lg mb-4" style={{ color: selectedTheme.accentColor }}>
            Cycle Count
          </h3>
          
          {/* Cycle Buttons */}
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
                  borderColor: selectedTheme.accentColor,
                  backgroundColor: selectedCycle === count && !customCycle 
                    ? `${selectedTheme.accentColor}15` 
                    : 'transparent'
                }}
              >
                <div className="text-xl" style={{ color: selectedTheme.accentColor }}>
                  {count}
                </div>
                {count === 108 && (
                  <div className="text-xs text-gray-500 mt-1">Traditional</div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <input
            type="number"
            placeholder="Custom count..."
            value={customCycle}
            onChange={(e) => setCustomCycle(e.target.value)}
            className="w-full p-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-center outline-none transition-all duration-300 focus:shadow-lg"
            style={{
              borderColor: customCycle ? selectedTheme.accentColor : undefined,
              color: selectedTheme.accentColor
            }}
            min="1"
            max="10000"
          />

          {/* Live Preview Ring */}
          <div className="flex justify-center mt-6">
            <div className="relative">
              <svg width="120" height="120" className="transform -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke={`${selectedTheme.accentColor}40`}
                  strokeWidth="3"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke={selectedTheme.accentColor}
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 45 * 0.25} ${2 * Math.PI * 45}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ color: selectedTheme.accentColor }} className="text-sm">
                  {getCurrentCycle()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Practice Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-lg mb-4" style={{ color: selectedTheme.accentColor }}>
            Practice Name
          </h3>
          <input
            type="text"
            placeholder="e.g., Morning Practice, Peace Meditation"
            value={practiceName}
            onChange={(e) => setPracticeName(e.target.value)}
            className="w-full p-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl outline-none transition-all duration-300 focus:shadow-lg"
            style={{
              borderColor: practiceName ? selectedTheme.accentColor : undefined,
              color: selectedTheme.accentColor
            }}
          />
        </motion.div>

        {/* Daily Goal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-lg mb-4" style={{ color: selectedTheme.accentColor }}>
            Daily Goal
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ borderColor: selectedTheme.accentColor, color: selectedTheme.accentColor }}
            >
              -
            </button>
            <div className="flex-1 text-center">
              <div className="text-2xl" style={{ color: selectedTheme.accentColor }}>
                {dailyGoal}
              </div>
              <div className="text-xs text-gray-500">
                cycles per day
              </div>
            </div>
            <button
              onClick={() => setDailyGoal(dailyGoal + 1)}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ borderColor: selectedTheme.accentColor, color: selectedTheme.accentColor }}
            >
              +
            </button>
          </div>
        </motion.div>

        {/* Reminder */}
        {/*
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg mb-1" style={{ color: selectedTheme.accentColor }}>
                Daily Reminder
              </h3>
              <p className="text-xs text-gray-500">Invite consistency with a gentle nudge.</p>
            </div>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
              aria-label="Toggle daily reminder"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (!reminderEnabled) return;
              openTimePicker();
            }}
            disabled={!reminderEnabled}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
              reminderEnabled
                ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm'
                : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-sm font-medium">Remind me at</span>
            <span className="text-sm font-semibold">{formatReminderTime(reminderTime)}</span>
          </button>
          <input
            ref={timeInputRef}
            type="time"
            value={reminderTime}
            onChange={(event) => setReminderTime(event.target.value || "09:00")}
            className="hidden"
          />
        </motion.div>
        */}


      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex gap-4 mt-8"
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
          onClick={handleContinue}
          disabled={!isValid}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
          style={{
            background: `linear-gradient(135deg, ${selectedTheme.accentColor}, ${selectedTheme.accentColor}dd)`,
            color: 'white'
          }}
        >
          <span>Continue</span>
          <ChevronRight size={18} />
        </button>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="text-center mt-4"
      >
        <div className="flex justify-center gap-2">
          <div className="w-2 h-1 bg-gray-400 rounded-full" />
          <div className="w-8 h-1 rounded-full" style={{ backgroundColor: selectedTheme.accentColor }} />
          <div className="w-2 h-1 bg-gray-400 rounded-full" />
        </div>
        <p className="text-xs text-gray-500 mt-2">Step 2 of 3</p>
      </motion.div>
    </div>
  );
}
