import { registerPlugin } from '@capacitor/core';

export interface VolumeControlPlugin {
  enable(): Promise<{ success: boolean }>;
  disable(): Promise<{ success: boolean }>;
  isEnabled(): Promise<{ enabled: boolean }>;
  addListener(
    eventName: 'volumeButtonPressed',
    listenerFunc: (event: { direction: 'up' | 'down' }) => void
  ): Promise<{ remove: () => void }>;
  removeAllListeners(): Promise<void>;
}

const VolumeControl = registerPlugin<VolumeControlPlugin>('VolumeControl');

export default VolumeControl;
