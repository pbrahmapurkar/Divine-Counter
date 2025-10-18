# Stats Grid Feature

## Overview

The Journey header stats have been refactored from a single vertical column into a responsive 2×2 matrix while maintaining Divine Counter's calm aesthetic. This provides better visual balance and more efficient use of screen space.

## Key Features

### 📊 **2×2 Grid Layout**
- **Four Key Metrics**: Day Streak, Milestones, Early Momentum, and Progress/Next Milestone
- **Side-by-Side Cards**: Two cards per row on standard phone widths
- **Consistent Spacing**: Uniform gaps and alignment across all cards
- **Equal Heights**: All cards maintain consistent height for a tidy appearance

### 📱 **Responsive Behavior**
- **Very Narrow Screens (<320px)**: Single column layout for maximum readability
- **Standard Mobile (320px+)**: 2×2 grid layout with two cards per row
- **Tablet/Desktop (1024px+)**: Optional 4-column layout for wider screens
- **Smooth Transitions**: Graceful layout changes across breakpoints

### 🎨 **Visual Design**
- **Rounded Badges**: Consistent rounded corners and soft shadows
- **Gold Accent Highlights**: Maintains #D4AF37 color scheme
- **Backdrop Blur**: Subtle glassmorphism effect for depth
- **Hover Effects**: Gentle scale animations on interaction

### ♿ **Accessibility**
- **Color Contrast**: Sufficient contrast ratios for readability
- **Logical Tab Order**: Left-to-right, top-to-bottom navigation
- **Readable Text**: Scaled typography that remains legible in grid layout
- **Focus States**: Clear focus indicators for keyboard navigation

## Technical Implementation

### Grid System
```typescript
// Responsive grid classes
className="grid grid-cols-1 min-[320px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto"
```

**Breakpoint Behavior:**
- `<320px`: `grid-cols-1` (single column)
- `320px+`: `grid-cols-2` (2×2 grid)
- `640px+`: `grid-cols-2` (maintains 2×2 on tablets)
- `1024px+`: `grid-cols-4` (single row on desktop)

### Four Key Metrics

#### 1. Day Streak
- **Icon**: Flame (🔥)
- **Color**: Orange gradient
- **Value**: Current practice streak
- **Label**: "Day Streak"

#### 2. Milestones
- **Icon**: Sparkles (✨)
- **Color**: Gold gradient (#D4AF37)
- **Value**: Total milestones unlocked
- **Label**: "Milestones"

#### 3. Early Momentum
- **Icon**: TrendingUp (📈)
- **Color**: Green gradient
- **Value**: Calculated momentum score (0-4)
- **Label**: "Early Momentum"

#### 4. Progress/Next Milestone
- **Icon**: Target (🎯)
- **Color**: Purple gradient
- **Value**: Days remaining to next milestone
- **Label**: Next milestone name

### Early Momentum Calculation
```typescript
const getEarlyMomentum = () => {
  if (currentStreak === 0) return 0;      // No momentum
  if (currentStreak < 3) return 1;        // Just started
  if (currentStreak < 7) return 2;        // Building momentum
  if (currentStreak < 14) return 3;       // Strong momentum
  return 4;                               // Excellent momentum
};
```

## Visual Layout

### Mobile Layout (320px - 640px)
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

### Desktop Layout (1024px+)
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

## Card Design System

### Base Card Styling
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
- **Values**: `text-xl sm:text-2xl font-bold`
- **Labels**: `text-xs text-muted-foreground font-medium`
- **Responsive**: Scales appropriately for grid layout

## Responsive Breakpoints

### Very Narrow (<320px)
- Single column layout
- Full-width cards
- Larger touch targets
- Simplified spacing

### Mobile (320px - 640px)
- 2×2 grid layout
- Two cards per row
- Balanced spacing
- Touch-optimized interactions

### Tablet (640px - 1024px)
- Maintains 2×2 grid
- Medium card sizes
- Enhanced spacing
- Hover effects enabled

### Desktop (1024px+)
- 4-column single row
- Compact card layout
- Maximum spacing
- Full interaction effects

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical left-to-right, top-to-bottom flow
- **Focus Indicators**: Clear focus rings with brand colors
- **Skip Links**: Efficient navigation for screen readers

### Visual Accessibility
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Text Scaling**: Responsive typography that scales with user preferences
- **High Contrast**: Works well in high contrast mode

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Status Announcements**: Clear progress and milestone information

## Performance Considerations

### Animation Performance
- **GPU Acceleration**: Uses transform properties for smooth animations
- **Reduced Motion**: Respects user motion preferences
- **Staggered Timing**: Prevents overwhelming animation sequences

### Layout Performance
- **CSS Grid**: Efficient layout calculations
- **Tailwind Utilities**: Optimized class generation
- **Minimal Re-renders**: Efficient component updates

## Integration

### Existing Components
- **JourneyHeader**: Main component with grid layout
- **PracticeJournalScreen**: Integration point
- **App.tsx**: Data flow and prop passing

### Data Flow
```
App State → PracticeJournalScreen → JourneyHeader → Grid Layout
```

### Props Interface
```typescript
interface JourneyHeaderProps {
  currentStreak: number;
  totalMilestonesUnlocked: number;
  nextMilestone: StreakMilestone | null;
  userName: string;
  className?: string;
}
```

## Testing

### Unit Tests
- Grid layout rendering
- Responsive behavior
- Metric calculations
- Accessibility compliance

### Visual Tests
- Light/dark theme compatibility
- Cross-browser rendering
- Mobile device testing
- High contrast mode

## Future Enhancements

### Planned Features
- **Custom Metrics**: User-selectable metric types
- **Animation Customization**: Configurable animation preferences
- **Metric Details**: Expandable cards with additional information
- **Progress Visualization**: Enhanced progress indicators

### Potential Improvements
- **Dynamic Grid**: Adjustable grid sizes based on content
- **Metric Ordering**: User-customizable metric arrangement
- **Real-time Updates**: Live metric updates without page refresh
- **Analytics Integration**: Detailed progress tracking and insights
