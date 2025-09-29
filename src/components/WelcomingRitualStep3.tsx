import { motion } from "motion/react";
import { User, Circle, Palette, Target, Sparkles } from "lucide-react";
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

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
}

interface WelcomingRitualStep3Props {
  userName: string;
  practiceData: PracticeData;
  onComplete: () => void;
  onBack: () => void;
}

export function WelcomingRitualStep3({ userName, practiceData, onComplete, onBack }: WelcomingRitualStep3Props) {
  const { cycleCount, name, theme, dailyGoal } = practiceData;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.preview.bg} flex flex-col px-6 py-6 relative overflow-hidden`}>
      {/* Animated background sparkles */}
      <motion.div
        className="absolute inset-0 opacity-15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              backgroundColor: theme.accentColor,
              left: `${15 + (i * 12)}%`,
              top: `${10 + (i * 12)}%`
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3,
              repeatType: "loop",
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col justify-between min-h-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          {/* Logo with glow effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-4"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    `0 0 15px ${theme.accentColor}30`,
                    `0 0 25px ${theme.accentColor}50`,
                    `0 0 15px ${theme.accentColor}30`
                  ]
                }}
                transition={{
                  duration: 2,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
              />
              <img 
                src={logo} 
                alt="Divine Counter" 
                className="w-16 h-16 mx-auto relative z-10" 
              />
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${theme.accentColor}25` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Sparkles size={12} style={{ color: theme.accentColor }} />
              </motion.div>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-2xl mb-2" style={{ color: theme.accentColor }}>
              Your Sanctuary is Ready
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Everything is prepared, {userName}
            </p>
          </motion.div>
        </div>

        {/* Compact summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex-1 space-y-3 mb-6"
        >
          {/* User */}
          <div className="flex items-center gap-3 p-3 bg-white/25 backdrop-blur-sm rounded-xl">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${theme.accentColor}20` }}
            >
              <User size={14} style={{ color: theme.accentColor }} />
            </div>
            <div className="text-left flex-1">
              <div className="text-xs text-gray-600">Practitioner</div>
              <div className="text-sm" style={{ color: theme.accentColor }}>{userName}</div>
            </div>
          </div>

          {/* Practice Name */}
          <div className="flex items-center gap-3 p-3 bg-white/25 backdrop-blur-sm rounded-xl">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${theme.accentColor}20` }}
            >
              <Sparkles size={14} style={{ color: theme.accentColor }} />
            </div>
            <div className="text-left flex-1">
              <div className="text-xs text-gray-600">Practice</div>
              <div className="text-sm" style={{ color: theme.accentColor }}>{name}</div>
            </div>
          </div>

          {/* Cycle Count & Daily Goal Combined */}
          <div className="flex gap-2">
            <div className="flex items-center gap-3 p-3 bg-white/25 backdrop-blur-sm rounded-xl flex-1">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${theme.accentColor}20` }}
              >
                <Circle size={14} style={{ color: theme.accentColor }} />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-600">Mala</div>
                <div className="text-sm" style={{ color: theme.accentColor }}>{cycleCount}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/25 backdrop-blur-sm rounded-xl flex-1">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${theme.accentColor}20` }}
              >
                <Target size={14} style={{ color: theme.accentColor }} />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-600">Daily</div>
                <div className="text-sm" style={{ color: theme.accentColor }}>{dailyGoal}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Back and Begin Button Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-3 items-center"
          >
            {/* Small Back Button */}
            <motion.button
              onClick={onBack}
              className="w-12 h-12 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ color: theme.accentColor }}
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </motion.button>

            {/* Begin Journey Button */}
            <motion.button
              onClick={onComplete}
              className="group flex-1 py-4 px-6 rounded-2xl shadow-lg text-white overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.accentColor}dd)`
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: '-100%', opacity: 0 }}
                whileHover={{ x: '100%', opacity: 0.1 }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Begin Your Journey</span>
            </motion.button>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <div className="flex justify-center gap-2 mb-2">
              <div className="w-2 h-1 bg-gray-400 rounded-full" />
              <div className="w-2 h-1 bg-gray-400 rounded-full" />
              <div className="w-8 h-1 rounded-full" style={{ backgroundColor: theme.accentColor }} />
            </div>
            <p className="text-xs text-gray-500">Step 3 of 3</p>
          </motion.div>

          {/* Subtle completion indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500">
              A gentle chime will welcome you to your practice
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}