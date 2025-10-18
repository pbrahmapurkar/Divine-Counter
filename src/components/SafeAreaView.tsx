import React, { ReactNode } from 'react';

interface SafeAreaViewProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SafeAreaView component for Capacitor apps
 * Provides consistent safe area handling across all screens
 */
export function SafeAreaView({ children, className = "", style = {} }: SafeAreaViewProps) {
  return (
    <div
      className={`min-h-screen ${className}`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        ...style
      }}
    >
      {children}
    </div>
  );
}

/**
 * SafeAreaView for fixed headers that need to account for status bar
 */
export function SafeAreaHeader({ children, className = "", style = {} }: SafeAreaViewProps) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        ...style
      }}
    >
      {children}
    </div>
  );
}




