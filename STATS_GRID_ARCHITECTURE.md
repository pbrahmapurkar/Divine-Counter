# Stats Grid Architecture

## Component Structure

```
JourneyHeader
├── Header Text (greeting + progress message)
└── Metrics Grid (responsive 2x2 layout)
    ├── Current Streak Card
    │   ├── Icon Container (Flame)
    │   ├── Value Display
    │   └── Label
    ├── Total Milestones Card
    │   ├── Icon Container (Sparkles)
    │   ├── Value Display
    │   └── Label
    ├── Early Momentum Card
    │   ├── Icon Container (TrendingUp)
    │   ├── Value Display
    │   └── Label
    └── Next Milestone Card
        ├── Icon Container (Target)
        ├── Value Display
        └── Label
```

## Grid Layout System

### Responsive Classes
```css
grid grid-cols-1 min-[320px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 
gap-3 sm:gap-4 lg:gap-6 
max-w-4xl mx-auto
```

### Breakpoint Behavior
```
<320px:  grid-cols-1  (single column)
320px+:  grid-cols-2  (2x2 grid)
640px+:  grid-cols-2  (maintains 2x2)
1024px+: grid-cols-4  (single row)
```

## Card Design System

### Base Card Structure
```css
.bg-white/40 dark:bg-white/5
.rounded-2xl
.p-4 sm:p-5
.border border-white/20 dark:border-white/10
.backdrop-blur-sm
```

### Icon Container
```css
.w-10 h-10 sm:w-12 sm:h-12
.rounded-xl
.bg-gradient-to-br from-[color]/20 to-[color]/20
.border border-[color]/30
```

### Typography Scale
```css
/* Values */
.text-xl sm:text-2xl font-bold text-foreground

/* Labels */
.text-xs text-muted-foreground font-medium
```

## Visual Layout Examples

### Mobile (320px - 640px)
```
┌─────────────────────────────────────────────────────────┐
│                Journey Header                          │
├─────────────────────────────────────────────────────────┤
│  Good morning, Test User                               │
│  Building beautiful momentum                            │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐                     │
│  │ 🔥    5     │  │ ✨    2     │                     │
│  │ Day Streak  │  │ Milestones  │                     │
│  └─────────────┘  └─────────────┘                     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐                     │
│  │ 📈    2     │  │ 🎯    2     │                     │
│  │Early Momentum│  │Weekly      │                     │
│  │             │  │Warrior     │                     │
│  └─────────────┘  └─────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

### Desktop (1024px+)
```
┌─────────────────────────────────────────────────────────┐
│                Journey Header                          │
├─────────────────────────────────────────────────────────┤
│  Good morning, Test User                               │
│  Building beautiful momentum                            │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │🔥   5   │ │✨   2   │ │📈   2   │ │🎯   2   │      │
│  │Day Streak│ │Milestones│ │Early   │ │Weekly   │      │
│  │         │ │         │ │Momentum│ │Warrior  │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
└─────────────────────────────────────────────────────────┘
```

## Animation Timeline

```
0.0s - Header fades in
0.2s - Greeting text appears
0.3s - Progress message appears
0.4s - Current Streak card animates in
0.5s - Total Milestones card animates in
0.6s - Early Momentum card animates in
0.7s - Next Milestone card animates in
0.8s - Progress bar animates in (if applicable)
0.9s - Progress bar fills to current percentage
```

## Data Flow

```
App State
├── currentStreak: number
├── totalMilestonesUnlocked: number
├── nextMilestone: StreakMilestone | null
└── userName: string

↓ (passed as props)

JourneyHeader
├── Calculates earlyMomentum
├── Calculates nextMilestoneInfo
└── Renders grid layout

↓ (renders)

Metrics Grid
├── 4 metric cards with calculated values
├── Responsive layout based on screen size
└── Consistent styling and animations
```

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Left-to-right, top-to-bottom
- **Focus Indicators**: Clear focus rings
- **Skip Links**: Efficient navigation

### Screen Reader Support
- **Semantic HTML**: Proper structure
- **ARIA Labels**: Descriptive labels
- **Status Announcements**: Progress information

### Visual Accessibility
- **Color Contrast**: WCAG AA compliant
- **Text Scaling**: Responsive typography
- **High Contrast**: Mode compatibility

## Performance Optimizations

### CSS Grid
- **Efficient Layout**: Native CSS Grid for optimal performance
- **Minimal Reflows**: Stable layout calculations
- **Responsive Design**: Single layout system for all breakpoints

### Animations
- **GPU Acceleration**: Transform-based animations
- **Reduced Motion**: Respects user preferences
- **Staggered Timing**: Prevents overwhelming sequences

### Bundle Size
- **Tailwind Utilities**: Optimized class generation
- **Tree Shaking**: Only used components included
- **Minimal Dependencies**: Leverages existing project dependencies

## Testing Strategy

### Unit Tests
- Grid layout rendering
- Responsive behavior
- Metric calculations
- Accessibility compliance

### Visual Tests
- Cross-browser compatibility
- Mobile device testing
- Light/dark theme support
- High contrast mode

### Integration Tests
- Data flow verification
- Animation performance
- Layout stability
- User interaction handling
