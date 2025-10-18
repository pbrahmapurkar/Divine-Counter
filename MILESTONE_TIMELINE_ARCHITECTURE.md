# Milestone Timeline Architecture

## Component Hierarchy

```
PracticeJournalScreen (Journey Screen)
├── JourneyHeader (existing)
└── MilestoneTimeline (NEW) ⭐
    ├── Overview Cards
    │   ├── Current Streak Card
    │   └── Longest Streak Card
    └── Timeline Section
        ├── Section Header
        └── Timeline
            ├── Central Spine Line (desktop only)
            └── TimelineItem[] (alternating layout)
                ├── Content Card
                │   ├── Header (icon + status)
                │   ├── Description
                │   ├── Progress Bar (active only)
                │   └── Call to Action (unlocked only)
                └── Timeline Node
```

## Visual Layout

### Desktop Layout (1024px+)
```
┌─────────────────────────────────────────────────────────┐
│                Journey Header                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                     │
│  │ Current     │  │ Longest     │                     │
│  │ Streak: 5   │  │ Streak: 10  │                     │
│  └─────────────┘  └─────────────┘                     │
├─────────────────────────────────────────────────────────┤
│              Your Journey Timeline                     │
│                                                         │
│  ┌─────────────┐    │    ┌─────────────┐              │
│  │ ✨ First    │    │    │             │              │
│  │    Spark    │    │    │             │              │
│  │   Locked    │    │    │             │              │
│  └─────────────┘    │    └─────────────┘              │
│                     │                                  │
│  ┌─────────────┐    │    ┌─────────────┐              │
│  │             │    │    │ 🔥 Weekly   │              │
│  │             │    │    │   Warrior   │              │
│  │             │    │    │  Unlocked   │              │
│  └─────────────┘    │    └─────────────┘              │
│                     │                                  │
│  ┌─────────────┐    │    ┌─────────────┐              │
│  │ 🏆 Monthly  │    │    │             │              │
│  │   Master    │    │    │             │              │
│  │ In Progress │    │    │             │              │
│  └─────────────┘    │    └─────────────┘              │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout (320px - 640px)
```
┌─────────────────────────────────────────────────────────┐
│                Journey Header                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐                                       │
│  │ Current     │                                       │
│  │ Streak: 5   │                                       │
│  └─────────────┘                                       │
│  ┌─────────────┐                                       │
│  │ Longest     │                                       │
│  │ Streak: 10  │                                       │
│  └─────────────┘                                       │
├─────────────────────────────────────────────────────────┤
│              Your Journey Timeline                     │
│                                                         │
│  ┌─────────────┐                                       │
│  │ ✨ First    │                                       │
│  │    Spark    │                                       │
│  │   Locked    │                                       │
│  └─────────────┘                                       │
│                                                         │
│  ┌─────────────┐                                       │
│  │ 🔥 Weekly   │                                       │
│  │   Warrior   │                                       │
│  │  Unlocked   │                                       │
│  └─────────────┘                                       │
│                                                         │
│  ┌─────────────┐                                       │
│  │ 🏆 Monthly  │                                       │
│  │   Master    │                                       │
│  │ In Progress │                                       │
│  └─────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
App State
├── currentStreak: number
├── longestStreak: number
├── milestones: StreakMilestone[]
└── onMilestoneClick: function

↓ (passed as props)

PracticeJournalScreen
├── Calculates currentStreakValue
├── Calculates longestStreakValue
└── Passes to MilestoneTimeline

↓ (renders)

MilestoneTimeline
├── Overview Cards (current + longest streak)
├── Timeline Section Header
└── Timeline Component

↓ (renders)

Timeline
├── Central Spine Line (desktop only)
└── TimelineItem[] (for each milestone)
    ├── Status Calculation (unlocked/active/locked)
    ├── Content Card Rendering
    ├── Progress Indicators
    └── Interactive Elements
```

## Responsive Breakpoints

### Mobile (320px - 640px)
- Single column layout
- No central spine line
- Full-width cards
- Simplified spacing (24px)
- Touch-optimized interactions

### Tablet (640px - 1024px)
- Alternating layout begins
- Central spine line visible
- Medium card widths (max-w-sm)
- Balanced spacing (32px)
- Touch and hover interactions

### Desktop (1024px+)
- Full alternating layout
- Central spine line with gradient
- Maximum card widths (max-w-md)
- Optimal spacing (48px)
- Full hover effects and animations

## Animation Timeline

```
0.0s - Overview cards fade in
0.2s - Timeline section header appears
0.3s - Timeline container fades in
0.4s - First timeline item animates in
0.5s - Second timeline item animates in
0.6s - Third timeline item animates in
... (staggered by 0.1s per item)

Timeline Node Animation:
- Initial: scale(0)
- Animate: scale(1) with delay
- Duration: 0.4s ease-out

Content Card Animation:
- Initial: opacity(0), y(30)
- Animate: opacity(1), y(0)
- Duration: 0.6s ease-out
- Staggered delay: index * 0.1s
```

## State Management

### Props Interface
```typescript
interface MilestoneTimelineProps {
  currentStreak: number;           // Current practice streak
  longestStreak: number;          // Longest achieved streak
  milestones?: StreakMilestone[]; // Array of milestone data
  onMilestoneClick?: (milestone: StreakMilestone) => void;
}

interface TimelineProps {
  milestones: StreakMilestone[];  // Sorted milestone array
  currentStreak: number;          // Current streak for calculations
  onMilestoneClick?: (milestone: StreakMilestone) => void;
  className?: string;             // Optional styling
}

interface TimelineItemProps {
  milestone: StreakMilestone;     // Individual milestone data
  index: number;                  // Position in timeline
  isUnlocked: boolean;           // Achievement status
  isActive: boolean;             // In-progress status
  isLeft: boolean;               // Layout position
  currentStreak: number;         // For progress calculations
  onMilestoneClick?: (milestone: StreakMilestone) => void;
}
```

### Internal Calculations
- **Status Determination**: Based on milestone.isAchieved and currentStreak
- **Layout Position**: Alternating based on index % 2
- **Progress Calculation**: For active milestones only
- **Responsive Behavior**: Based on screen size breakpoints

## Accessibility Features

### Keyboard Navigation
- Tab order follows visual layout
- Enter/Space activates milestone cards
- Focus indicators with brand colors
- Skip links for screen readers

### Screen Reader Support
- ARIA labels for all interactive elements
- Role attributes for clickable cards
- Status announcements for milestone states
- Semantic HTML structure

### Motion Preferences
- Respects `prefers-reduced-motion`
- CSS classes for reduced motion
- Fallback static states
- Performance optimizations
