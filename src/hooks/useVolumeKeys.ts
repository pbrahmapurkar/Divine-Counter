import { useEffect } from 'react';

interface VolumeKeyOptions {
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
}

/**
 * Custom hook to listen for hardware volume button events from Android WebView bridge
 * 
 * @param options - Object containing callback functions for volume up/down events
 * @returns void
 * 
 * @example
 * ```tsx
 * useVolumeKeys({
 *   onVolumeUp: () => console.log('Volume Up pressed'),
 *   onVolumeDown: () => console.log('Volume Down pressed')
 * });
 * ```
 */
export function useVolumeKeys({ onVolumeUp, onVolumeDown }: VolumeKeyOptions) {
  useEffect(() => {
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
  }, [onVolumeUp, onVolumeDown]);
}
