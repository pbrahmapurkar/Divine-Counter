import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import logoAsset from "../assets/divine_counter_logo.png";

export interface BootScreenProps {
  onComplete: () => void;
}

export const BOOT_DURATION = 2500;

type EasingTuple = [number, number, number, number];

export const bootAnimationEasings: Record<
  "easeInOutSine" | "easeOutQuart" | "easeOutCubic",
  EasingTuple
> = {
  easeInOutSine: [0.445, 0.05, 0.55, 0.95],
  easeOutQuart: [0.165, 0.84, 0.44, 1],
  easeOutCubic: [0.215, 0.61, 0.355, 1],
};

export const bootAnimationParams = {
  auraPulse: {
    scale: [0.85, 1.25, 0.85] as const,
    opacity: [0.2, 0.75, 0.2] as const,
    duration: 2400,
    delay: 300,
  },
  logoIntro: {
    scale: [1.5, 1],
    opacity: [0, 1],
    duration: 1200,
  },
  logoBreath: {
    scale: [1, 1.05, 1] as const,
    duration: 3000,
  },
  titleReveal: {
    delay: 700,
    translateY: [20, 0] as const,
    opacity: [0, 1] as const,
    duration: 700,
  },
  subtitleReveal: {
    delay: 900,
    translateY: [15, 0] as const,
    opacity: [0, 1] as const,
    duration: 800,
  },
  loaderReveal: {
    delay: 1200,
    duration: 500,
  },
  loaderDots: {
    count: 3,
    spacing: 4,
    translateY: [0, -3, 0] as const,
    opacity: [0.3, 1, 0.3] as const,
    duration: 1100,
    stagger: 150,
  },
  particles: {
    count: 14,
    driftDuration: [6000, 9000] as const,
    opacity: 0.05,
    scale: [0.6, 0.8] as const,
  },
  transitionOut: {
    duration: 400,
  },
} as const;

interface Particle {
  id: number;
  left: number;
  initialY: number;
  driftDistance: number;
  duration: number;
  delay: number;
  scale: number;
}

const toSeconds = (ms: number) => ms / 1000;

const safeAreaStyle: CSSProperties = {
  paddingTop: "env(safe-area-inset-top, 0px)",
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
  paddingLeft: "env(safe-area-inset-left, 0px)",
  paddingRight: "env(safe-area-inset-right, 0px)",
};

export function BootScreen({ onComplete }: BootScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeOutLead = Math.max(
      BOOT_DURATION - bootAnimationParams.transitionOut.duration,
      0,
    );

    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, fadeOutLead);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, BOOT_DURATION);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const particles = useMemo<Particle[]>(() => {
    if (prefersReducedMotion) {
      return [];
    }

    return Array.from({ length: bootAnimationParams.particles.count }, (_, index) => {
      const [minDuration, maxDuration] = bootAnimationParams.particles.driftDuration;
      const duration =
        Math.random() * (maxDuration - minDuration) + minDuration;
      const delay = Math.random() * duration;
      const scale =
        Math.random() *
          (bootAnimationParams.particles.scale[1] -
            bootAnimationParams.particles.scale[0]) +
        bootAnimationParams.particles.scale[0];

      return {
        id: index,
        left: Math.random() * 100,
        initialY: 70 + Math.random() * 20,
        driftDistance: 25 + Math.random() * 15,
        duration,
        delay,
        scale,
      };
    });
  }, [prefersReducedMotion]);

  return (
    <motion.div
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, rgba(15,23,42,1) 0%, rgba(30,41,59,0.95) 45%, rgba(15,23,42,1) 100%)",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{
        duration: toSeconds(bootAnimationParams.transitionOut.duration),
        ease: bootAnimationEasings.easeInOutSine,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(15,23,42,0.75) 100%)",
        }}
      />

      {!prefersReducedMotion ? (
        <motion.div
          className="pointer-events-none absolute h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,215,150,0.18) 0%, rgba(255,180,180,0.08) 55%, rgba(255,160,120,0) 75%)",
            mixBlendMode: "screen",
          }}
          initial={{
            opacity: bootAnimationParams.auraPulse.opacity[0],
            scale: bootAnimationParams.auraPulse.scale[0],
          }}
          animate={{
            scale: bootAnimationParams.auraPulse.scale,
            opacity: bootAnimationParams.auraPulse.opacity,
          }}
          transition={{
            duration: toSeconds(bootAnimationParams.auraPulse.duration),
            ease: bootAnimationEasings.easeInOutSine,
            repeat: Infinity,
            repeatType: "loop",
            delay: toSeconds(bootAnimationParams.auraPulse.delay),
          }}
        />
      ) : (
        <div
          className="pointer-events-none absolute h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,215,150,0.15) 0%, rgba(255,180,180,0.03) 70%, rgba(255,160,120,0) 100%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="pointer-events-none absolute origin-center rounded-full bg-white"
          style={{
            left: `${particle.left}%`,
            top: `${particle.initialY}%`,
            opacity: bootAnimationParams.particles.opacity,
            width: `${particle.scale}rem`,
            height: `${particle.scale}rem`,
          }}
          initial={{ y: 0, scale: particle.scale }}
          animate={{
            y: prefersReducedMotion ? 0 : -particle.driftDistance,
            opacity: prefersReducedMotion
              ? bootAnimationParams.particles.opacity
              : [
                  bootAnimationParams.particles.opacity,
                  bootAnimationParams.particles.opacity * 0.6,
                  bootAnimationParams.particles.opacity,
                ],
          }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: toSeconds(particle.duration),
                  ease: bootAnimationEasings.easeInOutSine,
                  repeat: Infinity,
                  delay: toSeconds(particle.delay),
                }
          }
        />
      ))}

      <div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center"
        style={safeAreaStyle}
      >
        <div
          className="pointer-events-none absolute inset-[-6rem] -z-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(253,234,204,0.16) 0%, rgba(253,234,204,0.06) 40%, rgba(253,234,204,0) 75%)",
            mixBlendMode: "screen",
          }}
        />

        <motion.div
          className="relative flex items-center justify-center"
          initial={{
            scale: bootAnimationParams.logoIntro.scale[0],
            opacity: bootAnimationParams.logoIntro.opacity[0],
          }}
          animate={{
            scale: bootAnimationParams.logoIntro.scale[1],
            opacity: bootAnimationParams.logoIntro.opacity[1],
          }}
          transition={{
            duration: toSeconds(bootAnimationParams.logoIntro.duration),
            ease: bootAnimationEasings.easeOutQuart,
          }}
        >
          <motion.img
            src={logoAsset}
            alt="Divine Counter"
            className="h-24 w-24 select-none object-contain"
            style={{
              filter: "drop-shadow(0 0 25px rgba(255,230,200,0.25))",
            }}
            animate={
              prefersReducedMotion
                ? { scale: 1 }
                : { scale: bootAnimationParams.logoBreath.scale }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: toSeconds(bootAnimationParams.logoBreath.duration),
                    ease: bootAnimationEasings.easeInOutSine,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }
            }
            draggable={false}
          />
        </motion.div>

        <motion.h1
          className="mt-6 text-2xl font-medium tracking-wide text-white"
          initial={{
            opacity: bootAnimationParams.titleReveal.opacity[0],
            y: bootAnimationParams.titleReveal.translateY[0],
          }}
          animate={{
            opacity: bootAnimationParams.titleReveal.opacity[1],
            y: bootAnimationParams.titleReveal.translateY[1],
          }}
          transition={{
            delay: toSeconds(bootAnimationParams.titleReveal.delay),
            duration: toSeconds(bootAnimationParams.titleReveal.duration),
            ease: bootAnimationEasings.easeOutCubic,
          }}
          style={{ fontFamily: '"Outfit", "Inter", sans-serif' }}
        >
          Divine Counter
        </motion.h1>

        <motion.p
          className="mt-2 text-sm font-normal text-white"
          initial={{
            opacity: bootAnimationParams.subtitleReveal.opacity[0],
            y: bootAnimationParams.subtitleReveal.translateY[0],
          }}
          animate={{
            opacity: bootAnimationParams.subtitleReveal.opacity[1],
            y: bootAnimationParams.subtitleReveal.translateY[1],
          }}
          transition={{
            delay: toSeconds(bootAnimationParams.subtitleReveal.delay),
            duration: toSeconds(bootAnimationParams.subtitleReveal.duration),
            ease: bootAnimationEasings.easeOutCubic,
          }}
          style={{ fontFamily: '"Inter", "Outfit", sans-serif' }}
        >
          Mindful Practice Companion
        </motion.p>

        <motion.div
          className="mt-8 flex items-center justify-center"
          style={{ columnGap: `${bootAnimationParams.loaderDots.spacing}px` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: toSeconds(bootAnimationParams.loaderReveal.delay),
            duration: toSeconds(bootAnimationParams.loaderReveal.duration),
            ease: bootAnimationEasings.easeInOutSine,
          }}
        >
          {Array.from({ length: bootAnimationParams.loaderDots.count }).map((_, index) => (
            <motion.span
              key={index}
              className="h-2 w-2 rounded-full bg-slate-400"
              animate={
                prefersReducedMotion
                  ? { opacity: 0.7 }
                  : {
                      opacity: bootAnimationParams.loaderDots.opacity,
                      y: bootAnimationParams.loaderDots.translateY,
                    }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: toSeconds(bootAnimationParams.loaderDots.duration),
                      ease: bootAnimationEasings.easeInOutSine,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay:
                        index *
                        toSeconds(bootAnimationParams.loaderDots.stagger),
                    }
              }
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
