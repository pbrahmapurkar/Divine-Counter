// --- Data Model ---
export type Weekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface MalaPlan {
  themeId: string;
  mantraId: string;
  beads: number;
}

export type WeeklyMala = {
  [K in Weekday]: MalaPlan;
};

export interface DailyOverride {
  themeId: string;
  mantraId: string;
  beads: number;
  expiresAt: string; // ISO timestamp at midnight local time
}

// --- Mantra Library ---
export interface Mantra {
  id: string;
  title: string;
  mantra: string;
  energy: string; // Brief energy description
  themeId: string;
}

export const MANTRAS: Mantra[] = [
  // Sunday - Vitality
  { id: "om_radiant_source_namah", title: "Radiant Source", mantra: "Om Radiant Source Namah", energy: "Focus Vitality", themeId: "vitality" },
  { id: "om_sunrise_energy_namah", title: "Sunrise Energy", mantra: "Om Sunrise Energy Namah", energy: "Focus Vitality", themeId: "vitality" },
  { id: "om_living_light_namah", title: "Living Light", mantra: "Om Living Light Namah", energy: "Focus Vitality", themeId: "vitality" },
  
  // Monday - Calm Mind
  { id: "om_serenity_flow_namah", title: "Serenity Flow", mantra: "Om Serenity Flow Namah", energy: "Focus Calm", themeId: "calm" },
  { id: "om_peace_within_namah", title: "Peace Within", mantra: "Om Peace Within Namah", energy: "Focus Energy", themeId: "calm" },
  { id: "om_still_waters_namah", title: "Still Waters", mantra: "Om Still Waters Namah", energy: "Focus Calm", themeId: "calm" },
  
  // Tuesday - Strength
  { id: "om_steady_heart_namah", title: "Steady Heart", mantra: "Om Steady Heart Namah", energy: "Focus Strength", themeId: "strength" },
  { id: "om_inner_fortitude_namah", title: "Inner Fortitude", mantra: "Om Inner Fortitude Namah", energy: "Focus Strength", themeId: "strength" },
  { id: "om_resilient_spirit_namah", title: "Resilient Spirit", mantra: "Om Resilient Spirit Namah", energy: "Focus Strength", themeId: "strength" },
  
  // Wednesday - Clarity
  { id: "om_clear_vision_namah", title: "Clear Vision", mantra: "Om Clear Vision Namah", energy: "Focus Clarity", themeId: "clarity" },
  { id: "om_awakened_mind_namah", title: "Awakened Mind", mantra: "Om Awakened Mind Namah", energy: "Focus Clarity", themeId: "clarity" },
  { id: "om_insight_flow_namah", title: "Insight Flow", mantra: "Om Insight Flow Namah", energy: "Focus Clarity", themeId: "clarity" },
  
  // Thursday - Wisdom
  { id: "om_guiding_light_namah", title: "Guiding Light", mantra: "Om Guiding Light Namah", energy: "Focus Wisdom", themeId: "wisdom" },
  { id: "om_deep_knowing_namah", title: "Deep Knowing", mantra: "Om Deep Knowing Namah", energy: "Focus Wisdom", themeId: "wisdom" },
  { id: "om_ancient_wisdom_namah", title: "Ancient Wisdom", mantra: "Om Ancient Wisdom Namah", energy: "Focus Wisdom", themeId: "wisdom" },
  
  // Friday - Compassion
  { id: "om_gentle_grace_namah", title: "Gentle Grace", mantra: "Om Gentle Grace Namah", energy: "Focus Compassion", themeId: "compassion" },
  { id: "om_loving_kindness_namah", title: "Loving Kindness", mantra: "Om Loving Kindness Namah", energy: "Focus Compassion", themeId: "compassion" },
  { id: "om_open_heart_namah", title: "Open Heart", mantra: "Om Open Heart Namah", energy: "Focus Compassion", themeId: "compassion" },
  
  // Saturday - Discipline
  { id: "om_steadfast_path_namah", title: "Steadfast Path", mantra: "Om Steadfast Path Namah", energy: "Focus Discipline", themeId: "discipline" },
  { id: "om_dedicated_practice_namah", title: "Dedicated Practice", mantra: "Om Dedicated Practice Namah", energy: "Focus Discipline", themeId: "discipline" },
  { id: "om_commitment_namah", title: "Commitment", mantra: "Om Commitment Namah", energy: "Focus Discipline", themeId: "discipline" },
];

// --- Theme Information ---
export interface ThemeInfo {
  id: string;
  name: string;
  icon: string; // Emoji or icon identifier
  description: string;
}

export const THEMES: Record<string, ThemeInfo> = {
  vitality: { id: "vitality", name: "Vitality", icon: "☀️", description: "Sunday focuses on vitality and renewal." },
  calm: { id: "calm", name: "Calm Mind", icon: "🌊", description: "Monday focuses on mental calm and peace." },
  strength: { id: "strength", name: "Strength", icon: "🔥", description: "Tuesday focuses on inner strength and resilience." },
  clarity: { id: "clarity", name: "Clarity", icon: "✨", description: "Wednesday focuses on mental clarity and insight." },
  wisdom: { id: "wisdom", name: "Wisdom", icon: "🌟", description: "Thursday focuses on wisdom and understanding." },
  compassion: { id: "compassion", name: "Compassion", icon: "💚", description: "Friday focuses on compassion and kindness." },
  discipline: { id: "discipline", name: "Discipline", icon: "🎯", description: "Saturday focuses on discipline and dedication." },
};

// --- Default Weekly Schedule ---
export const DEFAULT_WEEKLY_MALA: WeeklyMala = {
  sun: { themeId: "vitality", mantraId: "om_radiant_source_namah", beads: 108 },
  mon: { themeId: "calm", mantraId: "om_serenity_flow_namah", beads: 108 },
  tue: { themeId: "strength", mantraId: "om_steady_heart_namah", beads: 108 },
  wed: { themeId: "clarity", mantraId: "om_clear_vision_namah", beads: 108 },
  thu: { themeId: "wisdom", mantraId: "om_guiding_light_namah", beads: 108 },
  fri: { themeId: "compassion", mantraId: "om_gentle_grace_namah", beads: 108 },
  sat: { themeId: "discipline", mantraId: "om_steadfast_path_namah", beads: 108 },
};

// --- Utilities ---
export function getWeekday(): Weekday {
  const day = new Date().getDay();
  const weekdays: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return weekdays[day];
}

export function getMantraById(mantraId: string): Mantra | undefined {
  return MANTRAS.find(m => m.id === mantraId);
}

export function getMantrasByTheme(themeId: string): Mantra[] {
  return MANTRAS.filter(m => m.themeId === themeId);
}

export function getMidnightTimestamp(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.toISOString();
}

export function isOverrideExpired(override: DailyOverride | null): boolean {
  if (!override) return true;
  return new Date(override.expiresAt) < new Date();
}

