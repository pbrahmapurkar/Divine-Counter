import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from './ui/utils';

interface ThemeOption {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  className?: string;
}

const themes: ThemeOption[] = [
  {
    id: 'spiritual',
    name: 'Spiritual Gold',
    colors: {
      primary: '#FF9500',
      secondary: '#FFD60A',
      background: '#FFF9E6'
    }
  },
  {
    id: 'calm',
    name: 'Calm Blue',
    colors: {
      primary: '#007AFF',
      secondary: '#5AC8FA',
      background: '#F2F8FF'
    }
  },
  {
    id: 'nature',
    name: 'Nature Green',
    colors: {
      primary: '#34C759',
      secondary: '#8FDB8F',
      background: '#F0FFF0'
    }
  }
];

export function ThemeSelector({ currentTheme, onThemeChange, className }: ThemeSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-semibold text-foreground">Choose Theme</h3>
      <div className="grid grid-cols-1 gap-3">
        {themes.map((theme) => (
          <motion.button
            key={theme.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
              currentTheme === theme.id 
                ? "border-primary bg-primary/5" 
                : "border-border bg-card hover:border-primary/50"
            )}
            onClick={() => onThemeChange(theme.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Color preview */}
            <div className="flex gap-1">
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: theme.colors.background }}
              />
            </div>

            {/* Theme name */}
            <span className="flex-1 text-left font-medium text-foreground">
              {theme.name}
            </span>

            {/* Check mark */}
            {currentTheme === theme.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-primary"
              >
                <Check size={20} />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}