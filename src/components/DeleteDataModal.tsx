import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface DeleteDataModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Design Tokens for Delete Data Modal
 * 
 * Background:
 * - Backdrop: rgba(0, 0, 0, 0.7) with blur(12px)
 * - Modal: gray-900 (dark gray) with subtle gradient
 * 
 * Spacing:
 * - Internal padding: 20px (mobile), 24px (tablet+)
 * - Button spacing: 12px gap
 * - Icon to title: 20px
 * - Title to description: 8px
 * - Description to buttons: 24px
 * 
 * Typography:
 * - Title: 20sp semi-bold (text-xl font-semibold)
 * - Description: 16sp regular (text-base)
 * - Buttons: 16sp medium (text-base font-medium)
 * 
 * Colors:
 * - Background: gray-900/98 (dark gray with slight transparency)
 * - Title: white
 * - Description: gray-300
 * - Cancel button: ghost (gray-800 hover)
 * - Delete button: #D4AF37 (golden) with hover state
 * 
 * Elevation:
 * - Modal shadow: 0 20px 60px rgba(0, 0, 0, 0.5)
 * - Inner shadow: inset 0 1px 2px rgba(255, 255, 255, 0.05)
 * - Golden icon glow: 0 0 24px rgba(212, 175, 55, 0.4)
 * 
 * Border Radius:
 * - Modal: 20px (rounded-2xl)
 * - Buttons: 12px (rounded-xl)
 * 
 * Responsive:
 * - Mobile (411×823 dp): max-width 90%, padding 20px
 * - Tablet+: max-width 400px, padding 24px
 */
export function DeleteDataModal({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteDataModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Dimmed and blurred */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-[12px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            aria-hidden="true"
          />

          {/* Modal Dialog */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="relative w-full max-w-[90%] sm:max-w-[400px] bg-gray-900/98 backdrop-blur-xl rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
              }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-data-title"
              aria-describedby="delete-data-description"
            >
              {/* Content */}
              <div className="px-5 py-6 sm:px-6 sm:py-6">
                {/* Glowing Golden Icon */}
                <div className="flex justify-center mb-5">
                  <motion.div
                    className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/10 border border-[#D4AF37]/30"
                    style={{
                      boxShadow: '0 0 24px rgba(212, 175, 55, 0.4), inset 0 0 16px rgba(212, 175, 55, 0.1)',
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Pulsing glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#D4AF37]/20"
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.6, 0.8, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <AlertTriangle
                      className="relative w-8 h-8 text-[#D4AF37]"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </motion.div>
                </div>

                {/* Title */}
                <h2
                  id="delete-data-title"
                  className="text-xl font-semibold text-white text-center mb-2"
                  style={{ fontSize: '20px', lineHeight: '28px' }}
                >
                  Delete all data?
                </h2>

                {/* Description */}
                <p
                  id="delete-data-description"
                  className="text-base text-gray-300 text-center leading-relaxed mb-6 px-2"
                  style={{ fontSize: '16px', lineHeight: '24px' }}
                >
                  This erases your name, practices, history, and settings, and returns you to the welcome screen.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {/* Cancel Button - Ghost */}
                  <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 rounded-xl bg-transparent border border-gray-700 text-gray-300 font-medium text-base hover:bg-gray-800/50 active:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900"
                    style={{ minHeight: '44px' }}
                    aria-label="Cancel deletion"
                  >
                    Cancel
                  </button>

                  {/* Delete Button - Golden */}
                  <button
                    onClick={onConfirm}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#D4AF37] text-white font-semibold text-base hover:bg-[#caa634] active:bg-[#c09d2f] transition-all duration-200 shadow-lg shadow-[#D4AF37]/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900"
                    style={{
                      minHeight: '44px',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }}
                    aria-label="Delete everything"
                  >
                    Delete everything
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

