// --- Reward System Data ---

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'color_theme' | 'sacred_symbol' | 'background_pattern';
  category: 'streak' | 'milestone' | 'special';
  unlockCondition: {
    type: 'streak_days' | 'total_practices' | 'consecutive_weeks';
    value: number;
  };
  icon: string;
  color?: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface StreakMilestone {
  days: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  isAchieved: boolean;
  achievedAt?: string;
}

// --- Streak Milestones ---
export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 1,
    name: "First Spark",
    description: "Your journey begins with a single day.",
    icon: "✨",
    color: "#FACC15",
    isAchieved: false
  },
  {
    days: 3,
    name: "Early Momentum",
    description: "Three days of focused practice.",
    icon: "🌱",
    color: "#10B981",
    isAchieved: false
  },
  {
    days: 7,
    name: "Weekly Warrior",
    description: "A full week of dedication!",
    icon: "🔥",
    color: "#F97316",
    isAchieved: false
  },
  {
    days: 21,
    name: "Steady Bloom",
    description: "Three weeks of steady growth.",
    icon: "🌿",
    color: "#8B5CF6",
    isAchieved: false
  },
  {
    days: 30,
    name: "Monthly Master",
    description: "One month of unwavering focus.",
    icon: "🏆",
    color: "#F59E0B",
    isAchieved: false
  },
  {
    days: 60,
    name: "Seasoned Seeker",
    description: "Two months of radiant practice.",
    icon: "🧘‍♀️",
    color: "#06B6D4",
    isAchieved: false
  },
  {
    days: 108,
    name: "The Great Cycle",
    description: "108 days — a complete circle of dedication.",
    icon: "🌟",
    color: "#F472B6",
    isAchieved: false
  }
];

// --- Unlockable Rewards ---
export const REWARDS: Reward[] = [
  // Color Themes
  {
    id: "sunset_theme",
    name: "Sunset Meditation",
    description: "Warm orange and purple gradients",
    type: "color_theme",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 3 },
    icon: "🌅",
    color: "#FF6B6B",
    isUnlocked: false
  },
  {
    id: "ocean_theme",
    name: "Ocean Depths",
    description: "Deep blue and teal serenity",
    type: "color_theme",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 7 },
    icon: "🌊",
    color: "#4ECDC4",
    isUnlocked: false
  },
  {
    id: "forest_theme",
    name: "Forest Sanctuary",
    description: "Natural green and earth tones",
    type: "color_theme",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 14 },
    icon: "🌲",
    color: "#45B7D1",
    isUnlocked: false
  },
  {
    id: "cosmic_theme",
    name: "Cosmic Journey",
    description: "Deep purple and starry night",
    type: "color_theme",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 30 },
    icon: "🌌",
    color: "#9F7AEA",
    isUnlocked: false
  },
  {
    id: "golden_theme",
    name: "Golden Enlightenment",
    description: "Luxurious gold and amber",
    type: "color_theme",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 60 },
    icon: "✨",
    color: "#F6AD55",
    isUnlocked: false
  },
  {
    id: "diamond_theme",
    name: "Diamond Clarity",
    description: "Pure white and crystal clear",
    type: "color_theme",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 100 },
    icon: "💎",
    color: "#E2E8F0",
    isUnlocked: false
  },

  // Sacred Symbols
  {
    id: "om_symbol",
    name: "Sacred Om",
    description: "The primordial sound of the universe",
    type: "sacred_symbol",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 7 },
    icon: "🕉️",
    isUnlocked: false
  },
  {
    id: "lotus_symbol",
    name: "Lotus Flower",
    description: "Symbol of spiritual awakening",
    type: "sacred_symbol",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 14 },
    icon: "🪷",
    isUnlocked: false
  },
  {
    id: "yin_yang",
    name: "Yin Yang",
    description: "Balance and harmony",
    type: "sacred_symbol",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 30 },
    icon: "☯️",
    isUnlocked: false
  },
  {
    id: "mandala",
    name: "Sacred Mandala",
    description: "Cosmic order and unity",
    type: "sacred_symbol",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 60 },
    icon: "🌀",
    isUnlocked: false
  },
  {
    id: "chakra",
    name: "Chakra Wheel",
    description: "Energy centers of the body",
    type: "sacred_symbol",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 100 },
    icon: "🔮",
    isUnlocked: false
  },

  // Background Patterns
  {
    id: "zen_pattern",
    name: "Zen Circles",
    description: "Minimalist circular patterns",
    type: "background_pattern",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 14 },
    icon: "⭕",
    isUnlocked: false
  },
  {
    id: "sacred_geometry",
    name: "Sacred Geometry",
    description: "Ancient geometric patterns",
    type: "background_pattern",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 30 },
    icon: "🔷",
    isUnlocked: false
  },
  {
    id: "cosmic_pattern",
    name: "Cosmic Patterns",
    description: "Starry constellation designs",
    type: "background_pattern",
    category: "streak",
    unlockCondition: { type: "streak_days", value: 60 },
    icon: "⭐",
    isUnlocked: false
  }
];

// --- Helper Functions ---
export const getUnlockedRewards = (rewards: Reward[]): Reward[] => {
  return rewards.filter(reward => reward.isUnlocked);
};

export const getRewardsByType = (rewards: Reward[], type: Reward['type']): Reward[] => {
  return rewards.filter(reward => reward.type === type);
};

export const getRewardsByCategory = (rewards: Reward[], category: Reward['category']): Reward[] => {
  return rewards.filter(reward => reward.category === category);
};

export const getRewardsByStreak = (streakDays: number, rewards: Reward[] = REWARDS): Reward[] => {
  return rewards.filter(reward =>
    reward.unlockCondition.type === 'streak_days' &&
    reward.unlockCondition.value === streakDays
  );
};

export const checkStreakMilestone = (currentStreak: number, milestones: StreakMilestone[]): StreakMilestone | null => {
  return milestones.find(milestone => 
    milestone.days === currentStreak && !milestone.isAchieved
  ) || null;
};

export const checkRewardUnlock = (currentStreak: number, rewards: Reward[]): Reward[] => {
  return rewards.filter(reward => 
    !reward.isUnlocked && 
    reward.unlockCondition.type === 'streak_days' && 
    reward.unlockCondition.value === currentStreak
  );
};
