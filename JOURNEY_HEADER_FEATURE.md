# Journey Header Feature

## Overview

The Journey Header is a new hero component that provides users with an immediate overview of their spiritual practice progress. It's positioned at the top of the Journey screen (PracticeJournalScreen) above the milestone timeline.

## Features

### Key Metrics Display
- **Current Streak**: Shows the user's current daily practice streak with a flame icon
- **Total Milestones Unlocked**: Displays the number of achieved milestones with a sparkles icon  
- **Next Milestone Target**: Shows the next milestone name and remaining days with a target icon

### Dynamic Content
- **Time-based Greeting**: "Good morning/afternoon/evening, [UserName]"
- **Progress Messages**: Contextual messages based on streak length:
  - 0 days: "Ready to begin your mindful journey"
  - 1 day: "Your journey has begun"
  - 2-6 days: "Building beautiful momentum"
  - 7-29 days: "Your dedication is inspiring"
  - 30+ days: "Your practice radiates wisdom"

### Visual Design
- **Glassmorphism Card**: Soft gradient background with backdrop blur
- **Warm Gold Accents**: Uses the app's signature #D4AF37 color
- **Subtle Animations**: Gentle hover effects and fade-in animations
- **Responsive Layout**: Stacks vertically on mobile, horizontal on larger screens

### Progress Visualization
- **Progress Bar**: Shows progress toward the next milestone (when applicable)
- **Celebration State**: Special message when all milestones are achieved
- **Icon Integration**: Meaningful icons for each metric (Flame, Sparkles, Target)

## Technical Implementation

### Component Structure
```typescript
<JourneyHeader
  currentStreak={number}
  totalMilestonesUnlocked={number}
  nextMilestone={StreakMilestone | null}
  userName={string}
/>
```

### Data Flow
1. **Current Streak**: Calculated from practice history in PracticeJournalScreen
2. **Total Milestones**: Count of achieved milestones from the milestones array
3. **Next Milestone**: First unachieved milestone with days > current streak
4. **User Name**: Passed from App.tsx through PracticeJournalScreen

### Styling
- Uses existing Tailwind classes and design system tokens
- Follows the Divine Design System color palette
- Implements glassmorphism with backdrop-blur and gradient backgrounds
- Responsive design with mobile-first approach

## Integration Points

### Files Modified
- `src/components/JourneyHeader.tsx` - New component
- `src/components/PracticeJournalScreen.tsx` - Integration and data calculation
- `src/App.tsx` - Added userName prop passing
- `src/components/__tests__/JourneyHeader.test.tsx` - Unit tests

### Dependencies
- `motion/react` - For animations
- `lucide-react` - For icons (Flame, Sparkles, Target)
- `../data/rewards` - For StreakMilestone type

## Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmark roles
- **Color Contrast**: Meets WCAG AA standards
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **Screen Reader Support**: Descriptive text and proper labeling

## Future Enhancements

- **Haptic Feedback**: Gentle vibration on milestone achievements
- **Sound Effects**: Optional audio cues for progress updates
- **Customization**: User-selectable greeting styles or progress messages
- **Analytics**: Track user engagement with the header metrics
