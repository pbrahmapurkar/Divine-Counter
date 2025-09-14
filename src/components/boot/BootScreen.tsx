import { motion, useReducedMotion } from 'motion/react';

export default function BootScreen() {
  const reduce = useReducedMotion();

  const container = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: reduce ? 0.15 : 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  } as const;

  const halo = reduce
    ? ({} as any)
    : ({
        initial: { opacity: 0, scale: 0.92 },
        animate: {
          opacity: [0.0, 0.6, 0.0],
          scale: [0.92, 1.06, 1.0],
          transition: {
            duration: 1.2,
            ease: 'easeOut',
            repeat: Infinity as any,
            repeatDelay: 0.2,
          },
        },
      } as any);

  const mark = reduce
    ? ({} as any)
    : ({
        initial: { scale: 0.98 },
        animate: { scale: [0.98, 1.0], transition: { duration: 0.6, ease: 'easeOut' } },
      } as any);

  return (
    <motion.div
      className="min-h-dvh bg-[var(--dc-cream)] dark:bg-black text-[var(--dc-brown)] dark:text-white relative flex items-center justify-center"
      initial={container.initial}
      animate={container.animate}
      exit={container.exit}
    >
      {!reduce && (
        <motion.div
          className="absolute w-[60vmin] h-[60vmin] rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,149,0,0.16), transparent 70%)',
          }}
          initial={halo.initial}
          animate={halo.animate}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <motion.img
          src="/assets/logo-mark.svg"
          alt="Divine Counter lotus mark"
          className="w-20 h-20"
          initial={mark.initial}
          animate={mark.animate}
        />
        <div className="text-2xl font-semibold tracking-wide">Divine Counter</div>
        <div className="text-sm opacity-70">A calm, focused way to count your japa</div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[env(safe-area-inset-bottom,20px)]" />
    </motion.div>
  );
}

