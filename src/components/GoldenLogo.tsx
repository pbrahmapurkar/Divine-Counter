import React from 'react';
import { motion } from 'motion/react';
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

interface GoldenLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'bright';
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  bright: 'w-16 h-16'
};

export function GoldenLogo({ 
  size = 'md', 
  className = '', 
  animated = true 
}: GoldenLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <img 
        src={logo} 
        alt="Divine Counter" 
        className={`${sizeClasses[size]} rounded-lg shadow-sm`}
        style={{
          filter: 'brightness(1.2) saturate(1.3) hue-rotate(15deg) contrast(1.1)',
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Bright Golden gradient overlay */}
      <motion.div 
        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${
          size === 'bright' 
            ? 'from-yellow-200/80 via-amber-200/90 to-yellow-400/80' 
            : 'from-yellow-300/60 via-amber-300/70 to-yellow-500/60'
        } pointer-events-none`}
        animate={animated ? {
          opacity: [0.8, 1, 0.8],
        } : {}}
        transition={animated ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      />
      
      {/* Bright Golden glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-lg shadow-2xl shadow-yellow-400/60 pointer-events-none"
        animate={animated ? {
          boxShadow: [
            '0 0 20px rgba(251, 191, 36, 0.8)',
            '0 0 30px rgba(251, 191, 36, 1)',
            '0 0 20px rgba(251, 191, 36, 0.8)'
          ]
        } : {}}
        transition={animated ? {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      />
      
      {/* Bright Golden border highlight */}
      <div className="absolute inset-0 rounded-lg border-2 border-yellow-300/80 pointer-events-none" />
      
      {/* Additional bright golden shine */}
      <motion.div 
        className="absolute inset-0 rounded-lg bg-gradient-to-tr from-transparent via-yellow-200/40 to-transparent pointer-events-none"
        animate={animated ? {
          opacity: [0.3, 0.7, 0.3],
        } : {}}
        transition={animated ? {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      />
    </div>
  );
}
