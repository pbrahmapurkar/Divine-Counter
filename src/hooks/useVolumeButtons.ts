import { useEffect, useRef, useState } from 'react';

export type VolumeStatus = 'unavailable' | 'limited' | 'active';

export function useVolumeButtons(enabled: boolean, handlers: { onUp: () => void; onDown: () => void; }){
  const [status, setStatus] = useState<VolumeStatus>('unavailable');
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    if (!enabled) { setStatus('unavailable'); return; }

    const handler = (e: KeyboardEvent) => {
      const k = (e.key || e.code) as string;
      if (k === 'AudioVolumeUp' || k === 'VolumeUp') { e.preventDefault(); handlers.onUp(); setStatus('active'); }
      else if (k === 'AudioVolumeDown' || k === 'VolumeDown') { e.preventDefault(); handlers.onDown(); setStatus('active'); }
    };

    window.addEventListener('keydown', handler, { passive: false });

    const visHandler = () => {
      if (document.visibilityState === 'visible' && status !== 'active') setStatus('limited');
    };
    document.addEventListener('visibilitychange', visHandler);

    return () => {
      window.removeEventListener('keydown', handler as any);
      document.removeEventListener('visibilitychange', visHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return status;
}

