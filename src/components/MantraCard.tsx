import React from 'react';
import { motion } from 'motion/react';
import { MoreVertical, Edit2, Trash2, GripVertical } from 'lucide-react';
import { PracticeItem } from '../data/customMala';

interface MantraCardProps {
  practice: PracticeItem;
  onIncrement?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showDragHandle?: boolean;
  isDragging?: boolean;
  className?: string;
}

export function MantraCard({
  practice,
  onIncrement,
  onEdit,
  onDelete,
  showDragHandle = false,
  isDragging = false,
  className = '',
}: MantraCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const progressPercentage = practice.beads > 0 ? (practice.progress || 0) / practice.beads * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`
        relative rounded-xl border border-gray-200/50 dark:border-gray-700/50 
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm
        hover:shadow-md transition-all duration-200
        ${isDragging ? 'opacity-50' : ''}
        ${className}
      `}
    >
      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Drag Handle */}
            {showDragHandle && (
              <div className="flex-shrink-0 pt-1 cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <GripVertical className="w-5 h-5" />
              </div>
            )}

            {/* Title and Notes */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
                {practice.title}
              </h3>
              {practice.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {practice.notes}
                </p>
              )}
            </div>
          </div>

          {/* Menu Button */}
          {(onEdit || onDelete) && (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-20">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(practice.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 rounded-t-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(practice.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-b-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-semibold text-[#D4AF37]">
              {practice.progress || 0} / {practice.beads}
            </span>
          </div>

          {/* Progress Ring */}
          <div className="relative w-full h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, progressPercentage)}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Increment Button */}
          {onIncrement && (
            <button
              onClick={() => onIncrement(practice.id)}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] font-medium text-sm transition-colors"
              aria-label={`Increment ${practice.title} progress`}
            >
              +1 Bead
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

