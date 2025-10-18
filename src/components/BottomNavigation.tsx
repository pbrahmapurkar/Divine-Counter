import { Home, BookOpen, Layers, Settings } from "lucide-react";
import { useCallback, useRef } from "react";
import { gentleHaptic } from "../utils/haptics";

interface BottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  hapticsEnabled?: boolean;
}

export function BottomNavigation({ activeScreen, onNavigate, hapticsEnabled = true }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'history', icon: BookOpen, label: 'Journey' },
    { id: 'counters', icon: Layers, label: 'Counters' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  // Debounce timer for haptic feedback
  const hapticTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handles navigation with haptic feedback
   * Respects user preferences and accessibility settings
   */
  const handleNavigation = useCallback(async (screenId: string) => {
    // Clear any existing timeout to debounce rapid taps
    if (hapticTimeoutRef.current) {
      clearTimeout(hapticTimeoutRef.current);
    }

    // Check if haptics should be triggered
    const shouldTriggerHaptic = hapticsEnabled && 
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shouldTriggerHaptic) {
      // Debounce haptic feedback to prevent rapid-fire vibrations
      hapticTimeoutRef.current = setTimeout(async () => {
        try {
          await gentleHaptic();
        } catch (error) {
          // Silently fail if haptics are not available
          console.debug('Haptic feedback not available:', error);
        }
      }, 50); // 50ms debounce
    }

    // Navigate immediately regardless of haptic feedback
    onNavigate(screenId);
  }, [onNavigate, hapticsEnabled]);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleNavigation(id)}
            className={`flex flex-col items-center p-2 min-w-[44px] min-h-[44px] justify-center ${
              activeScreen === id
                ? 'text-[#FF8C42]'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            aria-label={`Navigate to ${label}`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
