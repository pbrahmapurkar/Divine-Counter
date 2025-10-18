# Journey Header Architecture

## Component Hierarchy

```
App.tsx
├── PracticeJournalScreen (Journey Screen)
│   ├── Header (existing)
│   ├── JourneyHeader (NEW) ⭐
│   │   ├── Greeting Section
│   │   ├── Metrics Grid
│   │   │   ├── Current Streak (Flame icon)
│   │   │   ├── Total Milestones (Sparkles icon)
│   │   │   └── Next Milestone (Target icon)
│   │   └── Progress Bar (conditional)
│   └── StreaksComponent (existing)
```

## Data Flow

```
App State
├── userName: string
├── streak: number
├── milestones: StreakMilestone[]
└── history: HistoryEntry[]

↓ (passed as props)

PracticeJournalScreen
├── Calculates currentStreakValue
├── Calculates totalMilestonesUnlocked
├── Finds nextMilestone
└── Passes to JourneyHeader

↓ (renders)

JourneyHeader
├── Displays greeting with userName
├── Shows current streak with flame icon
├── Shows unlocked milestones count
├── Shows next milestone target
└── Renders progress bar (if applicable)
```

## Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│                    Journey Header                       │
├─────────────────────────────────────────────────────────┤
│  Good morning, [UserName]                              │
│  [Progress message based on streak]                    │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                │
│  │   🔥    │  │   ✨    │  │   🎯    │                │
│  │    5    │  │    2    │  │    2    │                │
│  │  Days   │  │Milestones│  │Weekly   │                │
│  │ Streak  │  │         │  │Warrior  │                │
│  └─────────┘  └─────────┘  └─────────┘                │
│                                                         │
│  Progress to Weekly Warrior: 5 / 7 days                │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────────────────┘
```

## Responsive Behavior

### Mobile (Portrait)
- Single column layout
- Stacked metrics cards
- Full-width progress bar
- Larger touch targets

### Tablet/Desktop
- Three-column metrics grid
- Horizontal layout
- Compact progress bar
- Hover effects on cards

## Animation Timeline

```
0.0s - Header fades in (opacity: 0 → 1, y: 20 → 0)
0.2s - Greeting text appears
0.3s - Progress message appears
0.4s - Streak metric animates in
0.5s - Milestones metric animates in
0.6s - Next milestone metric animates in
0.7s - Progress bar animates in (if applicable)
0.8s - Progress bar fills to current percentage
```

## State Management

### Props Interface
```typescript
interface JourneyHeaderProps {
  currentStreak: number;           // Current practice streak
  totalMilestonesUnlocked: number; // Count of achieved milestones
  nextMilestone: StreakMilestone | null; // Next target milestone
  userName: string;                // User's name for greeting
  className?: string;              // Optional additional styling
}
```

### Internal State
- No internal state (pure presentational component)
- All data derived from props
- Time-based greeting calculated on each render
