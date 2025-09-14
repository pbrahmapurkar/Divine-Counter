export type HapticKind = 'soft' | 'success';

const supportsVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;
const pattern: Record<HapticKind, number | number[]> = {
  soft: 15,
  success: [10, 30, 10],
};

export function haptic(kind: HapticKind) {
  try {
    if (!supportsVibrate) return;
    navigator.vibrate(pattern[kind]);
  } catch {
    // no-op
  }
}

