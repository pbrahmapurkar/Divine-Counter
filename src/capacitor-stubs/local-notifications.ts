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

function checkDisplay(): 'granted'|'denied'|'prompt' {
  if (typeof Notification === 'undefined') return 'prompt';
  try { return Notification.permission as any; } catch { return 'prompt'; }
}

export const LocalNotifications = {
  async checkPermissions(): Promise<PermissionStatus>{
    return { display: checkDisplay() };
  },
  async requestPermissions(): Promise<PermissionStatus>{
    if (typeof Notification === 'undefined') return { display: 'prompt' };
    try { const p = await Notification.requestPermission(); return { display: p as any }; } catch { return { display: 'prompt' }; }
  },
  async createChannel(_: any): Promise<void>{ /* no-op on web */ },
  async schedule(opts: ScheduleOptions): Promise<void>{
    const p = checkDisplay();
    if (p !== 'granted') return;
    opts.notifications.forEach(n => {
      const delay = typeof n.schedule?.at === 'object' ? Math.max(0, new Date(n.schedule.at).getTime() - Date.now()) : 1000;
      setTimeout(() => { try { new Notification(n.title, { body: n.body }); } catch {} }, delay);
    });
  },
  async cancel(_: { notifications: { id: number }[] }): Promise<void>{},
};

