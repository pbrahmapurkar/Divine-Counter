import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export class HapticsService {
  static async vibrate(style: ImpactStyle = ImpactStyle.Medium) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.warn('Haptics not available:', error);
      // Fallback to web vibration API if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }

  static async light() {
    await this.vibrate(ImpactStyle.Light);
  }

  static async medium() {
    await this.vibrate(ImpactStyle.Medium);
  }

  static async heavy() {
    await this.vibrate(ImpactStyle.Heavy);
  }

  /**
   * Light, sharp tap for each count/tap
   * Uses Haptics.selectionStart() as specified
   */
  static async tap() {
    try {
      await Haptics.selectionStart();
    } catch (error) {
      console.warn('Haptics selection not available:', error);
      // Fallback to light impact
      await this.light();
    }
  }

  /**
   * Celebratory vibration for mala completion
   * Uses Haptics.notification with SUCCESS type as specified
   */
  static async completion() {
    try {
      await Haptics.notification({ type: NotificationType.SUCCESS });
    } catch (error) {
      console.warn('Haptics notification not available:', error);
      // Fallback to web vibration API with celebratory pattern
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]); // Success pattern
      }
    }
  }

  /**
   * Medium-intensity tap for key actions (reset, delete, etc.)
   * Uses Haptics.impact with MEDIUM style as specified
   */
  static async action() {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.warn('Haptics impact not available:', error);
      // Fallback to web vibration API
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
  }

  // Legacy methods for backward compatibility
  static async selection() {
    await this.tap();
  }

  static async notification(type: 'success' | 'warning' | 'error' = 'success') {
    if (type === 'success') {
      await this.completion();
    } else {
      try {
        const notificationType = type === 'warning' ? NotificationType.WARNING : NotificationType.ERROR;
        await Haptics.notification({ type: notificationType });
      } catch (error) {
        console.warn('Haptics notification not available:', error);
        // Fallback to web vibration API
        if (navigator.vibrate) {
          const pattern = type === 'warning' ? [100, 50, 100] : [200, 100, 200];
          navigator.vibrate(pattern);
        }
      }
    }
  }
}
