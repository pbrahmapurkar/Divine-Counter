# Daily Mala Feature Documentation

## Overview

The Daily Mala feature automatically selects a mantra practice based on the day of the week, while allowing users to fully customize their weekly schedule or override the daily selection temporarily.

## Architecture

### Data Model

```typescript
type Weekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

interface MalaPlan {
  themeId: string;
  mantraId: string;
  beads: number;
}

interface WeeklyMala {
  [key in Weekday]: MalaPlan;
}

interface DailyOverride {
  themeId: string;
  mantraId: string;
  beads: number;
  expiresAt: string; // ISO timestamp at midnight
}
```

### Default Schedule

The app ships with a balanced, non-religious default mapping:

| Day | Theme | Sample Mantra |
|-----|-------|---------------|
| Sunday | Vitality | "Om Radiant Source Namah" |
| Monday | Calm Mind | "Om Serenity Flow Namah" |
| Tuesday | Strength | "Om Steady Heart Namah" |
| Wednesday | Clarity | "Om Clear Vision Namah" |
| Thursday | Wisdom | "Om Guiding Light Namah" |
| Friday | Compassion | "Om Gentle Grace Namah" |
| Saturday | Discipline | "Om Steadfast Path Namah" |

### Storage Keys

- `divine-counter-weekly-mala`: Stores the weekly schedule (JSON)
- `divine-counter-daily-override`: Stores temporary daily override (JSON)

## Components

### 1. TodaysPracticeBanner (`src/components/TodaysPracticeBanner.tsx`)

Displays the current day's practice banner on the Home screen.

**Features:**
- Shows today's mantra, energy, and bead count
- Indicates if an override is active
- "Change" button to select another mantra for today
- "Refresh" button (if override active) to revert to scheduled practice
- Auto-refreshes when window regains focus

**Props:**
```typescript
interface TodaysPracticeBannerProps {
  onOverride?: (counter: ReturnType<typeof malaPlanToCounter>) => void;
  onSelectOther?: () => void;
}
```

### 2. WeeklyMalaPlanner (`src/components/WeeklyMalaPlanner.tsx`)

Full weekly schedule planner accessible from Settings.

**Features:**
- Lists all 7 days with current practice
- "Today" badge on current weekday
- Tap any day to edit
- Edit modal with:
  - Theme selection (vitality, calm, strength, clarity, wisdom, compassion, discipline)
  - Mantra search/filter
  - Bead count selection (21, 27, 54, 108)
  - Restore default option
- "Restore All Defaults" button

### 3. EditDayModal

Modal component for editing a single day's practice.

**Features:**
- Theme buttons (visual icons)
- Searchable mantra list
- Bead count dropdown
- Save and Restore Default buttons

## Utilities

### `src/utils/weeklyMala.ts`

**Functions:**
- `loadWeeklyMala()`: Loads weekly schedule from localStorage
- `saveWeeklyMala(schedule)`: Saves weekly schedule
- `loadDailyOverride()`: Loads active override (null if expired)
- `saveDailyOverride(plan)`: Saves temporary override with midnight expiration
- `clearDailyOverride()`: Removes override
- `getTodayPractice()`: Returns today's practice (override if active, else scheduled)
- `malaPlanToCounter(plan, id)`: Converts MalaPlan to Counter-like object

### `src/data/weeklyMala.ts`

**Exports:**
- Mantra library (MANTRAS array)
- Theme information (THEMES object)
- Default weekly schedule (DEFAULT_WEEKLY_MALA)
- Type definitions
- Utility functions

## Integration Points

### HomeScreen Integration

The HomeScreen accepts two optional props:
- `showTodaysPractice?: boolean` - Shows/hides the banner
- `onTodaysPracticeOverride?: () => void` - Callback when user wants to change practice

### SettingsScreen Integration

The WeeklyMalaPlanner is integrated as the first settings card. It's rendered specially (not as a standard settings item).

### App.tsx Integration (Required)

To enable auto-selection on Home screen:

1. **On Launch:**
```typescript
useEffect(() => {
  if (!isOnboarding && !isBooting && currentScreen === 'home') {
    const todayPractice = getTodayPractice();
    const counter = malaPlanToCounter(todayPractice, 'daily-mala');
    // Set as active counter or create if needed
  }
}, [isOnboarding, isBooting, currentScreen]);
```

2. **On Screen Focus:**
```typescript
// When Home screen regains focus, refresh the practice
useEffect(() => {
  if (currentScreen === 'home') {
    const todayPractice = getTodayPractice();
    // Update counter if needed
  }
}, [currentScreen]);
```

3. **Midnight Check:**
```typescript
// Check for expired override at midnight
useEffect(() => {
  const checkMidnight = setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      const expired = isOverrideExpired(loadDailyOverride());
      if (expired) {
        clearDailyOverride();
        // Refresh practice
      }
    }
  }, 60000); // Check every minute
  
  return () => clearInterval(checkMidnight);
}, []);
```

## User Flows

### Default Load Flow

1. User opens app
2. System reads `divine-counter-weekly-mala` from localStorage
3. If not found, uses `DEFAULT_WEEKLY_MALA`
4. Detects current weekday
5. Selects practice for that day
6. Displays banner on Home screen
7. Sets as active counter

### Edit Weekly Schedule Flow

1. User goes to Settings → Weekly Mala Planner
2. User taps a day card
3. Edit modal opens
4. User selects theme, mantra, and bead count
5. User taps "Save"
6. Schedule saved to localStorage
7. Toast notification: "[Day] Practice updated."

### Temporary Override Flow

1. User sees "Today's Practice" banner
2. User taps "Change"
3. Modal opens (can reuse WeeklyMalaPlanner edit modal)
4. User selects new mantra
5. Override saved with midnight expiration
6. Banner updates to show override
7. At midnight, override expires automatically
8. System reverts to scheduled practice

### Restore Default Flow

1. User taps "Restore Default" in edit modal
2. That day's practice restored to default
3. Schedule saved
4. Toast: "[Day] restored to default."

## Accessibility

### Minimum Requirements

- **Typography**: All text uses minimum 16sp (text-sm or larger)
- **Focus Order**: Logical tab order through interactive elements
- **VoiceOver Labels**: 
  - "Today's Practice banner"
  - "[Day] practice, edit button"
  - "Search mantras"
  - "Save button"
- **Descriptive Copy**: 
  - "Your practice for [Day] is [Mantra]"
  - "Today's practice: [Mantra], [Energy], [Beads] beads"

### Motion

- Mantra transitions: 200ms fade + slide-up (ease-out)
- Modal open/close: Spring animation (300ms stiffness, 30 damping)
- Banner updates: 400ms fade

## Visual Design

- **Colors**: Warm beige background (#FDF6E3, #FAF0E6), saffron highlights (#D4AF37)
- **Shadows**: Soft shadows, rounded 12dp cards
- **Icons**: Abstract energy theme icons (☀️ 🌊 🔥 ✨ 🌟 💚 🎯)
- **Spacing**: Consistent padding, balanced negative space

## Testing Checklist

- [ ] Default schedule loads on first run
- [ ] Weekly schedule persists after app restart
- [ ] Today's practice banner shows correct practice
- [ ] Override expires at midnight
- [ ] Edit weekly schedule saves correctly
- [ ] Restore default works for individual days
- [ ] Restore all defaults works
- [ ] Search filters mantras correctly
- [ ] Accessibility: Screen reader announces correctly
- [ ] Accessibility: Focus order is logical
- [ ] Mobile: All controls are tappable (minimum 44x44px)
- [ ] Dark mode: All text is readable

## Future Enhancements

- Custom mantra creation
- Multiple weekly schedules
- Practice history/analytics
- Reminder notifications for daily practice
- Sharing weekly schedules with others

