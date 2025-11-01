import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface ResetLoadingOverlayProps {
  isVisible: boolean;
}

/**
 * Loading overlay shown during the reset process
 * Displays a calm "Clearing your journey..." message with a spinner
 */
export function ResetLoadingOverlay({ isVisible }: ResetLoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Loader2 className="w-12 h-12 text-[#D4AF37]" strokeWidth={2.5} />
            </motion.div>
            
            {/* Message */}
            <p className="text-white text-lg font-medium text-center">
              Clearing your journey...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

