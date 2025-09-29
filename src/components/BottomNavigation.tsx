import { Home, BookOpen, Layers, Settings } from "lucide-react";
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

interface BottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'history', icon: BookOpen, label: 'Journey' },
    { id: 'counters', icon: Layers, label: 'Counters' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      {/* Small logo indicator at top of nav */}
      <div className="flex justify-center py-1 border-b border-gray-100 dark:border-gray-800">
        <img 
          src={logo} 
          alt="Divine Counter" 
          className="w-4 h-4 opacity-30"
        />
      </div>
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center p-2 min-w-[44px] min-h-[44px] justify-center ${
              activeScreen === id
                ? 'text-[#FF8C42]'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}