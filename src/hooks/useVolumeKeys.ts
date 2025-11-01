import { useEffect, useRef } from 'react';

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
  const volumeUpRef = useRef(onVolumeUp);
  const volumeDownRef = useRef(onVolumeDown);

  useEffect(() => {
    volumeUpRef.current = onVolumeUp;
  }, [onVolumeUp]);

  useEffect(() => {
    volumeDownRef.current = onVolumeDown;
  }, [onVolumeDown]);

  useEffect(() => {
    if (!enabled) {
      console.log('🔇 Volume Button Control: DISABLED - No event listeners registered');
      return undefined;
    }

    console.log('🔊 Volume Button Control: ENABLED - Event listeners registered');

    const handleVolumeUpEvent = () => {
      volumeUpRef.current?.();
    };

    const handleVolumeDownEvent = () => {
      volumeDownRef.current?.();
    };

    window.addEventListener('volume-up', handleVolumeUpEvent);
    window.addEventListener('volume-down', handleVolumeDownEvent);

    return () => {
      window.removeEventListener('volume-up', handleVolumeUpEvent);
      window.removeEventListener('volume-down', handleVolumeDownEvent);
    };
  }, [enabled]);
}
