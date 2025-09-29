import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Save, Sun, Moon, Star, Flower, Triangle, Circle, Heart, Zap } from "lucide-react";
import { Header } from './Header';
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

interface Counter {
  id: string;
  name: string;
  color: string;
  cycleCount: number;
  dailyGoal: number;
  icon?: string;
}


interface EditPracticeScreenProps {
  counter: Counter;
  onSave: (updatedCounter: Counter) => void;
  onBack: () => void;
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

const availableIcons = Object.keys(iconMap);


const cycleCounts = [21, 27, 54, 108];

export function EditPracticeScreen({ counter, onSave, onBack }: EditPracticeScreenProps) {
  const [practiceName, setPracticeName] = useState(counter.name);
  const [selectedCycle, setSelectedCycle] = useState(counter.cycleCount);
  const [customCycle, setCustomCycle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(counter.icon || "lotus");
  const [dailyGoal, setDailyGoal] = useState(counter.dailyGoal);

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Flower;
    return IconComponent;
  };

  const handleSave = () => {
    if (!practiceName.trim()) return;

    const finalCycleCount = customCycle.trim() ? parseInt(customCycle) : selectedCycle;
    
    if (finalCycleCount < 1 || finalCycleCount > 1000) return;
    if (dailyGoal < 1 || dailyGoal > 50) return;

    const updatedCounter: Counter = {
      ...counter,
      name: practiceName.trim(),
      cycleCount: finalCycleCount,
      dailyGoal,
      icon: selectedIcon
    };

    onSave(updatedCounter);
  };

  const isCustomCycle = !cycleCounts.includes(selectedCycle) && !customCycle;
  const canSave = practiceName.trim() && 
                  (customCycle.trim() ? parseInt(customCycle) >= 1 && parseInt(customCycle) <= 1000 : true) &&
                  dailyGoal > 0 && dailyGoal <= 50;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/20 overflow-hidden">
      <Header
        title="Edit Practice"
        subtitle="Modify your spiritual practice"
        showBackButton={true}
        onBack={onBack}
      />
      
      {/* Scrollable Content Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ 
          paddingTop: '100px',
          paddingBottom: '120px' // Space for fixed buttons + nav bar
        }}
      >
        <div className="space-y-8">
        {/* Practice Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <label className="block text-sm font-medium text-foreground/80">
            Practice Name
          </label>
          <input
            type="text"
            value={practiceName}
            onChange={(e) => setPracticeName(e.target.value)}
            placeholder="Enter your practice name..."
            className="w-full p-4 rounded-xl bg-card border border-border focus:border-saffron focus:outline-none transition-colors text-base"
            maxLength={50}
          />
          <div className="text-xs text-muted-foreground text-right">
            {practiceName.length}/50
          </div>
        </motion.div>

        {/* Icon Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-foreground/80">
            Sacred Symbol
          </label>
          <div className="grid grid-cols-4 gap-3">
            {availableIcons.map((iconName) => {
              const IconComponent = getIcon(iconName);
              const isSelected = selectedIcon === iconName;
              
              return (
                <motion.button
                  key={iconName}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedIcon(iconName)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                    ${isSelected 
                      ? 'border-saffron bg-saffron/10' 
                      : 'border-border hover:border-saffron/50 bg-card'
                    }
                  `}
                >
                  <IconComponent 
                    size={24} 
                    className={isSelected ? 'text-saffron' : 'text-muted-foreground'} 
                  />
                  <span className={`text-xs capitalize ${isSelected ? 'text-saffron' : 'text-muted-foreground'}`}>
                    {iconName}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>


        {/* Cycle Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-foreground/80">
            Mala Count (beads per cycle)
          </label>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {cycleCounts.map((count) => (
              <motion.button
                key={count}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCycle(count);
                  setCustomCycle("");
                }}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-center
                  ${selectedCycle === count && !customCycle
                    ? 'border-saffron bg-saffron/10 text-saffron' 
                    : 'border-border hover:border-saffron/50 bg-card'
                  }
                `}
              >
                <div className="text-lg font-semibold">{count}</div>
                <div className="text-xs text-muted-foreground">beads</div>
              </motion.button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-muted-foreground">
              Or enter custom count (1-1000)
            </label>
            <input
              type="number"
              value={customCycle}
              onChange={(e) => setCustomCycle(e.target.value)}
              placeholder="Custom count..."
              min="1"
              max="1000"
              className="w-full p-3 rounded-xl bg-card border border-border focus:border-saffron focus:outline-none transition-colors"
            />
          </div>
        </motion.div>

        {/* Daily Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-foreground/80">
            Daily Goal (1-50 cycles)
          </label>
          <input
            type="number"
            value={dailyGoal || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setDailyGoal(0); // Allow empty state
              } else {
                const numValue = parseInt(value);
                if (!isNaN(numValue) && numValue >= 1 && numValue <= 50) {
                  setDailyGoal(numValue);
                }
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '' || parseInt(e.target.value) < 1) {
                setDailyGoal(1); // Set to 1 when focus is lost and field is empty or invalid
              }
            }}
            placeholder="Enter daily goal..."
            min="1"
            max="50"
            className="w-full p-3 rounded-xl bg-card border border-border focus:border-saffron focus:outline-none transition-colors"
          />
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-4 border border-border/50"
        >
          <div className="text-sm font-medium text-foreground/80 mb-3">Preview</div>
          <div className="bg-gradient-to-br from-background to-accent/10 rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${counter.color}15` }}
              >
                {(() => {
                  const IconComponent = getIcon(selectedIcon);
                  return <IconComponent size={18} style={{ color: counter.color }} />;
                })()}
              </div>
              <div>
                <div className="font-medium">{practiceName || "Practice Name"}</div>
                <div className="text-sm text-muted-foreground">
                  Goal: {dailyGoal} cycles/day
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-white/30 text-gray-600 dark:text-gray-400"
        >
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>
        
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:hover:scale-100 bg-saffron text-white"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </motion.div>
    </div>
  );
}