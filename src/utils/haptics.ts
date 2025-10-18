import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

/**
 * Divine Design System - Sacred Haptic Feedback
 * 
 * A unified haptic feedback system that provides gentle, spiritually resonant
 * tactile responses throughout the Divine Counter app.
 */

export type HapticType = 'gentle' | 'celebration' | 'warning';

const HAPTIC_MAP: Record<HapticType, {
  impactStyle?: ImpactStyle;
  notificationType?: NotificationType;
  webVibrationPattern?: number[];
}> = {
  gentle: {
    impactStyle: ImpactStyle.Light,
    webVibrationPattern: [50]
  },
  celebration: {
    notificationType: NotificationType.Success,
    webVibrationPattern: [100, 50, 100, 50, 200]
  },
  warning: {
    impactStyle: ImpactStyle.Medium,
    webVibrationPattern: [200, 100, 200]
  }
};

/**
 * Triggers haptic feedback with the specified type
 * 
 * @param type - The type of haptic feedback to trigger
 * @param options - Optional configuration
 */
export async function triggerHaptic(
  type: HapticType = 'gentle',
  options: { enableVibrateFallback?: boolean } = {}
): Promise<void> {
  const { enableVibrateFallback = true } = options;
  const config = HAPTIC_MAP[type];

  try {
    if (Capacitor.isNativePlatform()) {
      // Use native haptics on mobile platforms
      if (config.impactStyle) {
        await Haptics.impact({ style: config.impactStyle });
      }
      if (config.notificationType) {
        await Haptics.notification({ type: config.notificationType });
      }
    } else if (enableVibrateFallback && 'vibrate' in navigator) {
      // Fallback to web vibration API
      if (config.webVibrationPattern) {
        navigator.vibrate(config.webVibrationPattern);
      }
    }
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
    
    // Final fallback to web vibration if native haptics fail
    if (enableVibrateFallback && 'vibrate' in navigator && config.webVibrationPattern) {
      try {
        navigator.vibrate(config.webVibrationPattern);
      } catch (vibrationError) {
        console.warn('Web vibration fallback also failed:', vibrationError);
      }
    }
  }
}

/**
 * Convenience function for gentle haptic feedback (taps, selections)
 */
export const gentleHaptic = () => triggerHaptic('gentle');

/**
 * Convenience function for celebratory haptic feedback (achievements, completions)
 */
export const celebrationHaptic = () => triggerHaptic('celebration');

/**
 * Convenience function for warning haptic feedback (errors, important actions)
 */
export const warningHaptic = () => triggerHaptic('warning');

/**
 * Legacy compatibility function for existing code
 * @deprecated Use triggerHaptic('gentle') instead
 */
export const HapticsService = {
  tap: () => triggerHaptic('gentle'),
  completion: () => triggerHaptic('celebration'),
  action: () => triggerHaptic('warning')
};



