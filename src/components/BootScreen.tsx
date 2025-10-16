import React, { useEffect } from "react";
import { motion } from "motion/react";
import logo from '../assets/divine_counter_logo.png';

interface BootScreenProps {
  onComplete: () => void;
}

const BOOT_DURATION = 2500;
const LOGO_ENTRY_DURATION = 1000;
const TITLE_DELAY = 500;

export function BootScreen({ onComplete }: BootScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, BOOT_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Aura Effect */}
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.15, 1.2, 1.15],
            opacity: [0, 0.6, 0.8, 0.6]
          }}
          transition={{
            duration: LOGO_ENTRY_DURATION / 1000,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0.9
          }}
        />

        {/* Logo */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1, 1.03, 1],
            opacity: 1
          }}
          transition={{
            duration: LOGO_ENTRY_DURATION / 1000,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0.9
          }}
        >
          <img
            src={logo}
            alt="Divine Counter"
            className="w-20 h-20"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: TITLE_DELAY / 1000,
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Divine Counter
          </h1>
          <motion.p
            className="text-slate-300 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: (TITLE_DELAY + 200) / 1000,
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            Mindful Practice Companion
          </motion.p>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: (TITLE_DELAY + 400) / 1000,
            duration: 0.5
          }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-yellow-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
