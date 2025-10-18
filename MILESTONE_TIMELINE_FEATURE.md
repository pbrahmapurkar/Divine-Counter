# Milestone Timeline Feature

## Overview

The Milestone Timeline is a complete reimagining of the Journey screen's milestone display, transforming it from a flat list into a beautiful, narrative timeline that feels ritual-inspired and is easy to scan.

## Key Features

### 🎯 **Visual Timeline Design**
- **Central Spine Line**: A vertical line that visually connects all milestones in chronological order
- **Alternating Layout**: Milestone cards alternate left and right of the spine on larger screens
- **Single Column**: Gracefully collapses to a single-column layout on mobile devices
- **Ritual-Inspired**: Clean, ceremonial design that feels sacred and meaningful

### 🏷️ **Consistent Milestone Badges**
- **Status Labels**: Clear "Unlocked", "In Progress", or "Locked" status indicators
- **Icon Integration**: Each milestone displays its unique icon/emoji
- **Color Coding**: Visual differentiation using the milestone's accent color
- **Progress Indicators**: Shows remaining days for in-progress milestones

### 🎨 **Layered Card Design**
- **Rounded Surfaces**: Soft, modern card design with subtle shadows
- **Warm Accent Borders**: Uses the Divine Counter color palette (#D4AF37)
- **Gradient Backgrounds**: Subtle gradients for unlocked milestones
- **Glow Effects**: Gentle glow effects for active and unlocked milestones

### ✨ **Micro-Interactions**
- **Sequential Animation**: Timeline nodes animate in sequence on first render
- **Hover Effects**: Cards scale and lift on hover
- **Smooth Transitions**: All interactions use smooth, gentle animations
- **Reduced Motion Support**: Respects user motion preferences

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for mobile devices with single-column layout
- **Tablet/Desktop**: Alternating layout with central spine line
- **Touch-Friendly**: Large touch targets and appropriate spacing
- **Accessibility**: Full keyboard navigation and screen reader support

## Component Architecture

### Timeline Component
```typescript
interface TimelineProps {
  milestones: StreakMilestone[];
  currentStreak: number;
  onMilestoneClick?: (milestone: StreakMilestone) => void;
  className?: string;
}
```

**Features:**
- Renders the central spine line (hidden on mobile)
- Manages alternating layout logic
- Handles empty state display
- Provides accessibility features

### TimelineItem Component
```typescript
interface TimelineItemProps {
  milestone: StreakMilestone;
  index: number;
  isUnlocked: boolean;
  isActive: boolean;
  isLeft: boolean;
  currentStreak: number;
  onMilestoneClick?: (milestone: StreakMilestone) => void;
}
```

**Features:**
- Individual milestone card rendering
- Status calculation and display
- Progress indicators for active milestones
- Interactive elements with proper ARIA labels

### MilestoneTimeline Component
```typescript
interface MilestoneTimelineProps {
  currentStreak: number;
  longestStreak: number;
  milestones?: StreakMilestone[];
  onMilestoneClick?: (milestone: StreakMilestone) => void;
}
```

**Features:**
- Overview cards for current and longest streak
- Timeline section with progress messaging
- Empty state handling
- Integration with existing data structures

## Visual Design System

### Color Palette
- **Primary Accent**: #D4AF37 (Divine Counter gold)
- **Unlocked Milestones**: Emerald green with success styling
- **Active Milestones**: Gold accent with progress indicators
- **Locked Milestones**: Muted colors with reduced opacity

### Typography
- **Headlines**: Bold, clear milestone names
- **Descriptions**: Readable, supportive text
- **Status Labels**: Small, uppercase labels with tracking
- **Progress Text**: Clear numerical indicators

### Spacing & Layout
- **Card Padding**: 24px (6 in Tailwind)
- **Timeline Spacing**: 32px on mobile, 48px on desktop
- **Node Size**: 24px diameter with 2px border
- **Spine Width**: 2px with gradient coloring

## Accessibility Features

### Keyboard Navigation
- **Tab Support**: All interactive elements are focusable
- **Enter/Space**: Activate milestone cards
- **Focus Indicators**: Clear focus rings with brand colors
- **Skip Links**: Logical tab order through timeline

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Role Attributes**: Proper button roles for clickable cards
- **Status Announcements**: Clear status information
- **Semantic HTML**: Proper heading hierarchy and landmarks

### Motion Preferences
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **CSS Classes**: Uses `motion-reduce:transition-none`
- **Fallback States**: Static versions when animations are disabled
- **Performance**: Optimized animations that don't impact performance

## Responsive Behavior

### Mobile (320px - 640px)
- Single column layout
- No central spine line
- Full-width cards
- Larger touch targets
- Simplified spacing

### Tablet (640px - 1024px)
- Alternating layout begins
- Central spine line visible
- Medium card widths
- Balanced spacing
- Touch-optimized interactions

### Desktop (1024px+)
- Full alternating layout
- Central spine line with gradient
- Maximum card widths
- Hover effects enabled
- Optimal spacing and typography

## Data Integration

### Existing Data Structures
- **StreakMilestone**: Uses existing milestone data structure
- **Current Streak**: Calculated from practice history
- **Milestone Status**: Determined by existing logic
- **Progress Calculation**: Real-time progress indicators

### State Management
- **No Internal State**: Pure presentational components
- **Props-Based**: All data passed through props
- **Event Handling**: Callback-based interaction handling
- **Performance**: Optimized re-rendering

## Implementation Details

### Files Created
- `src/components/Timeline.tsx` - Core timeline component
- `src/components/MilestoneTimeline.tsx` - Main timeline wrapper
- `src/components/__tests__/Timeline.test.tsx` - Unit tests

### Files Modified
- `src/components/PracticeJournalScreen.tsx` - Integration point
- Replaced `StreaksComponent` with `MilestoneTimeline`

### Dependencies
- `motion/react` - For animations and transitions
- `lucide-react` - For icons (Flame, Trophy, Sparkles, Target)
- `../data/rewards` - For StreakMilestone type definitions

## Performance Considerations

### Animation Performance
- **GPU Acceleration**: Uses transform properties for smooth animations
- **Reduced Motion**: Respects user preferences
- **Staggered Timing**: Prevents overwhelming animation sequences
- **Optimized Re-renders**: Minimal re-rendering with proper key props

### Bundle Size
- **Tree Shaking**: Only imports used components
- **Code Splitting**: Components are lazy-loaded when possible
- **Minimal Dependencies**: Uses existing project dependencies
- **Efficient Styling**: Leverages Tailwind utility classes

## Future Enhancements

### Planned Features
- **Journal Integration**: Direct journal entry creation from milestone cards
- **Achievement Sharing**: Social sharing capabilities for milestones
- **Custom Milestones**: User-defined milestone creation
- **Timeline Filtering**: Filter by status or date range

### Potential Improvements
- **Virtual Scrolling**: For very long milestone lists
- **Timeline Zoom**: Different time scales (daily, weekly, monthly)
- **Milestone Categories**: Group milestones by type or theme
- **Progress Analytics**: Detailed progress tracking and insights

## Testing

### Unit Tests
- Component rendering and props handling
- User interaction testing
- Accessibility compliance
- Responsive behavior verification

### Integration Tests
- Data flow from parent components
- Event handling and callbacks
- State management integration
- Performance benchmarking

## Browser Support

### Modern Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Browsers
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 13+
- Firefox Mobile 88+

### Accessibility
- Screen readers (NVDA, JAWS, VoiceOver)
- Keyboard navigation
- High contrast mode
- Reduced motion preferences
