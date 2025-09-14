/**
 * Domain helpers for Divine Counter business logic
 * These functions handle the core calculations for maala counting
 */

export const dayKey = (d = new Date()) => 
  new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .slice(0, 10);

export const derivedMaalas = (raw: number, delta: number, cycle: number) =>
  Math.max(0, Math.floor(raw / Math.max(1, cycle)) + delta);

export const isBoundaryCross = (prevRaw: number, nextRaw: number, cycle: number) => {
  if (cycle <= 0) return false; // Handle division by zero
  return Math.floor(prevRaw / cycle) < Math.floor(nextRaw / cycle);
};

export const crossedBelow = (prevRaw: number, nextRaw: number, cycle: number) => {
  if (cycle <= 0) return false; // Handle division by zero
  return Math.floor(prevRaw / cycle) > Math.floor(nextRaw / cycle);
};

export const getProgressPercent = (current: number, total: number) =>
  Math.min(100, Math.round((current % total) / total * 100));

export const getTapsToNextBoundary = (current: number, cycle: number) =>
  ((cycle - (current % cycle)) % cycle) || cycle;
