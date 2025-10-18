/**
 * Platform detection utility for Divine Counter
 * 
 * Provides lightweight platform detection for conditional features
 * like volume button control (Android-only).
 */

export const Platform = {
  /**
   * Detects if the app is running on Android
   * @returns true if running on Android device
   */
  isAndroid: (): boolean => {
    return /Android/i.test(navigator.userAgent);
  },

  /**
   * Detects if the app is running on iOS
   * @returns true if running on iOS device (iPhone, iPad, iPod)
   */
  isIOS: (): boolean => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },

  /**
   * Detects if the app is running on a mobile device
   * @returns true if running on any mobile device
   */
  isMobile: (): boolean => {
    return Platform.isAndroid() || Platform.isIOS();
  },

  /**
   * Detects if the app is running on a desktop/web browser
   * @returns true if running on desktop/web
   */
  isWeb: (): boolean => {
    return !Platform.isMobile();
  }
};
