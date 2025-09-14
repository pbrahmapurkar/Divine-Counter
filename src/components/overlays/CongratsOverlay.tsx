import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function CongratsOverlay({ open, onClose, cycleSize }: { open: boolean; onClose: () => void; cycleSize: number; }){
  const reduce = useReducedMotion();
  useEffect(() => { if (!open) return; const t = setTimeout(onClose, 1200); return () => clearTimeout(t); }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.12 : 0.2, ease: 'easeOut' }}
        className="px-4 py-3 rounded-2xl bg-background/95 backdrop-blur border shadow-lg text-center"
        role="status" aria-live="polite"
      >
        <div className="text-base font-semibold">Congratulations 🎉</div>
        <div className="text-sm opacity-80">You completed one maala ({cycleSize} counts)</div>
      </motion.div>
      {!reduce && (
        <motion.div
          className="absolute w-[60vmin] h-[60vmin] rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(255,149,0,0.18), transparent 70%)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0, 1, 0], scale: [0.9, 1.1, 1] }}
          transition={{ duration: 0.9 }}
        />
      )}
    </div>
  );
}

