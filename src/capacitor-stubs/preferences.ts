export const Preferences = {
  async get({ key }: { key: string }): Promise<{ value: string | null }>{
    try { return { value: localStorage.getItem(key) }; } catch { return { value: null }; }
  },
  async set({ key, value }: { key: string; value: string }): Promise<void>{
    try { localStorage.setItem(key, value); } catch {}
  },
  async remove({ key }: { key: string }): Promise<void>{
    try { localStorage.removeItem(key); } catch {}
  }
};

