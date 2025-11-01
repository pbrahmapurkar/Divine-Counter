import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { PracticeItem, generateId } from '../data/customMala';
import { toast } from 'sonner';

interface AddEditPracticeModalProps {
  isOpen: boolean;
  practice?: PracticeItem;
  onSave: (practice: PracticeItem) => void;
  onClose: () => void;
}

const BEAD_PRESETS = [27, 54, 108];

export function AddEditPracticeModal({
  isOpen,
  practice,
  onSave,
  onClose,
}: AddEditPracticeModalProps) {
  const [title, setTitle] = useState('');
  const [beads, setBeads] = useState(108);
  const [customBeads, setCustomBeads] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (practice) {
      setTitle(practice.title);
      setBeads(practice.beads);
      setCustomBeads('');
      setNotes(practice.notes || '');
    } else {
      setTitle('');
      setBeads(108);
      setCustomBeads('');
      setNotes('');
    }
  }, [practice, isOpen]);

  const finalBeads = customBeads ? parseInt(customBeads) || beads : beads;
  const isValid = title.trim().length > 0 && finalBeads > 0 && finalBeads <= 1000;

  const handleSave = () => {
    if (!isValid) return;

    const savedPractice: PracticeItem = {
      id: practice?.id || generateId(),
      title: title.trim(),
      beads: finalBeads,
      notes: notes.trim() || undefined,
      progress: practice?.progress || 0,
    };

    onSave(savedPractice);
    onClose();
    toast.success(practice ? 'Practice updated.' : 'Practice added.');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-br from-white via-[#FDF6E3]/30 to-[#FAF0E6]/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 shadow-xl backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {practice ? 'Edit Practice' : 'Add Practice'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter practice title"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                autoFocus
                aria-label="Practice title"
              />
            </div>

            {/* Bead Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bead Count
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {BEAD_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setBeads(preset);
                      setCustomBeads('');
                    }}
                    className={`
                      px-4 py-2.5 rounded-xl border font-medium text-sm transition-all
                      ${beads === preset && !customBeads
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#D4AF37]/30'
                      }
                    `}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={customBeads}
                onChange={(e) => {
                  setCustomBeads(e.target.value);
                  if (e.target.value) {
                    const num = parseInt(e.target.value);
                    if (!isNaN(num) && num > 0) {
                      setBeads(num);
                    }
                  }
                }}
                placeholder="Custom count (1-1000)"
                min="1"
                max="1000"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                aria-label="Custom bead count"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note or tag for this practice..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none"
                aria-label="Practice notes"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-200/50 dark:border-gray-700/50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`
                flex-1 px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-colors
                ${isValid
                  ? 'bg-[#D4AF37] text-white hover:bg-[#caa634]'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

