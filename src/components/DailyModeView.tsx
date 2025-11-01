import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { PracticeItem } from '../data/customMala';
import { MantraCard } from './MantraCard';
import { AddEditPracticeModal } from './AddEditPracticeModal';

interface DailyModeViewProps {
  practices: PracticeItem[];
  onAdd: (practice: PracticeItem) => void;
  onEdit: (id: string, practice: PracticeItem) => void;
  onDelete: (id: string) => void;
  onIncrement: (id: string) => void;
}

export function DailyModeView({
  practices,
  onAdd,
  onEdit,
  onDelete,
  onIncrement,
}: DailyModeViewProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingPractice = editingId ? practices.find(p => p.id === editingId) : undefined;

  const handleSave = (practice: PracticeItem) => {
    if (editingId) {
      onEdit(editingId, practice);
      setEditingId(null);
    } else {
      onAdd(practice);
    }
  };

  if (practices.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-orange-500/20 border border-[#D4AF37]/30 flex items-center justify-center">
            <Plus className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No practices yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Add a practice to begin your daily journey. These practices will repeat every day.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] text-white font-semibold hover:bg-[#caa634] shadow-sm transition-colors"
            aria-label="Add your first practice"
          >
            <Plus className="w-5 h-5" />
            Add Mantra
          </button>
        </div>

        <AddEditPracticeModal
          isOpen={isAddModalOpen}
          onSave={handleSave}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {practices.map((practice) => (
          <MantraCard
            key={practice.id}
            practice={practice}
            onIncrement={() => onIncrement(practice.id)}
            onEdit={(id) => setEditingId(id)}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>

      {/* Add Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] font-medium"
        aria-label="Add new practice"
      >
        <Plus className="w-5 h-5" />
        Add Mantra
      </button>

      {/* Modals */}
      <AddEditPracticeModal
        isOpen={isAddModalOpen}
        onSave={handleSave}
        onClose={() => setIsAddModalOpen(false)}
      />

      <AddEditPracticeModal
        isOpen={!!editingId}
        practice={editingPractice}
        onSave={handleSave}
        onClose={() => setEditingId(null)}
      />
    </div>
  );
}

