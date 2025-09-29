import React from 'react';
import { ChevronLeft } from 'lucide-react';
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  className?: string;
}

export function Header({ 
  title, 
  subtitle, 
  showBackButton = false, 
  onBack, 
  rightElement,
  className = ""
}: HeaderProps) {
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {/* App Logo */}
          <div className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Divine Counter" 
              className="w-8 h-8 rounded-lg shadow-sm"
            />
            {showBackButton && (
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{subtitle}</p>
            )}
          </div>
        </div>
        {rightElement && (
          <div className="flex items-center gap-2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}