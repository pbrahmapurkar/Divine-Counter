import { useEffect } from 'react';

interface VolumeKeyOptions {
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  enabled?: boolean;
}

/**
 * Custom hook to listen for hardware volume button events from Android WebView bridge
 * 
 * @param options - Object containing callback functions for volume up/down events and enabled flag
 * @returns void
 * 
 * @example
 * ```tsx
 * useVolumeKeys({
 *   onVolumeUp: () => console.log('Volume Up pressed'),
 *   onVolumeDown: () => console.log('Volume Down pressed'),
 *   enabled: true
 * });
 * ```
 */
export function useVolumeKeys({ onVolumeUp, onVolumeDown, enabled = true }: VolumeKeyOptions) {
  useEffect(() => {
    // If volume keys are disabled, don't register event listeners
    if (!enabled) {
      console.log('🔇 Volume Button Control: DISABLED - No event listeners registered');
      return;
    }

    console.log('🔊 Volume Button Control: ENABLED - Event listeners registered');

    const handleVolumeUp = () => {
      onVolumeUp?.();
    };

    const handleVolumeDown = () => {
      onVolumeDown?.();
    };

    // Listen for custom events dispatched from Android MainActivity
    window.addEventListener('volume-up', handleVolumeUp);
    window.addEventListener('volume-down', handleVolumeDown);

    return () => {
      window.removeEventListener('volume-up', handleVolumeUp);
      window.removeEventListener('volume-down', handleVolumeDown);
    };
  }, [enabled, onVolumeUp, onVolumeDown]);
}
