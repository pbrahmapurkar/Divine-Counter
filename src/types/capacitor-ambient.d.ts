// Ambient module declarations to avoid TS errors when the plugins
// are not installed locally in this environment. At runtime on device,
// Capacitor will provide these modules.
declare module '@capacitor/local-notifications' {
  export type PermissionStatus = { display: 'granted'|'denied'|'prompt' };
  export type ScheduleOptions = {
    notifications: Array<{
      id: number;
      title: string;
      body: string;
      smallIcon?: string;
      channelId?: string;
      schedule?: any;
    }>;
  };
  export const LocalNotifications: {
    checkPermissions(): Promise<PermissionStatus>;
    requestPermissions(): Promise<PermissionStatus>;
    createChannel?(opts: any): Promise<void>;
    schedule(opts: ScheduleOptions): Promise<void>;
    cancel(opts: { notifications: { id: number }[] }): Promise<void>;
  };
}

declare module '@capacitor/preferences' {
  export const Preferences: {
    get(opts: { key: string }): Promise<{ value: string | null }>;
    set(opts: { key: string; value: string }): Promise<void>;
    remove(opts: { key: string }): Promise<void>;
  };
}

declare module '@capacitor/app' {
  export const App: { openSettings(): Promise<void> };
}

