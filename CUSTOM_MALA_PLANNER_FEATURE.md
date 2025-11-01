# Custom Mala Planner Feature Documentation

## Overview

The Custom Mala Planner is a dual-mode system that allows practitioners to manage recurring mantras in either a single daily set or weekday-specific sets, while tracking bead progress and persisting choices locally.

## Architecture

### Data Model

```typescript
export type PracticeMode = "daily" | "weekly";

export interface PracticeItem {
  id: string;
  title: string;
  beads: number;
  notes?: string;
  progress?: number; // Current bead count for today
}

export interface DailyMala {
  practices: PracticeItem[];
}

export type WeeklyMala = {
  [K in Weekday]: PracticeItem[];
};

export interface PlannerData {
  practiceMode: PracticeMode;
  dailyMala: DailyMala;
  weeklyMala: WeeklyMala;
  lastUpdated: string;
}
```

### Storage

- **Key**: `divine-counter-custom-mala-planner`
- **Format**: JSON stored in localStorage
- **Structure**: Complete `PlannerData` object

## Components

### 1. CustomMalaPlanner (`src/components/CustomMalaPlanner.tsx`)

Main screen component that manages the entire planner experience.

**Features:**
- Mode selection (Daily/Weekly)
- Renders appropriate view based on mode
- Handles all CRUD operations
- Persists changes immediately

### 2. PracticeModeSelector (`src/components/PracticeModeSelector.tsx`)

Segmented control for switching between Daily and Weekly modes.

**Features:**
- Visual toggle between modes
- Accessible labels
- Persists selection to localStorage

### 3. DailyModeView (`src/components/DailyModeView.tsx`)

Displays daily practices in a vertical list.

**Features:**
- Lists all daily practices
- Empty state with CTA
- Add/Edit/Delete operations
- Progress tracking per practice

### 4. WeeklyModeView (`src/components/WeeklyModeView.tsx`)

Shows weekly planner with collapsible day cards.

**Features:**
- 7 collapsible day cards (Sun → Sat)
- "Today" badge on current weekday
- Practice count per day
- Expand/collapse animations
- Empty states per day

### 5. MantraCard (`src/components/MantraCard.tsx`)

Reusable card component for displaying practices.

**Features:**
- Practice title and optional notes
- Progress ring visualization
- Increment button (+1 Bead)
- Edit/Delete menu
- Optional drag handle for reordering

### 6. AddEditPracticeModal (`src/components/AddEditPracticeModal.tsx`)

Modal for adding or editing practices.

**Features:**
- Title input (required)
- Bead count presets (27, 54, 108) or custom
- Optional notes field
- Save/Cancel actions
- Form validation

### 7. TodaysPracticesBanner (`src/components/TodaysPracticesBanner.tsx`)

Banner component for Home screen showing today's practice summary.

**Features:**
- Shows practice count and total beads
- Empty state with CTA to planner
- Auto-refreshes on window focus
- Resets progress at start of new day

### 8. TodaysPracticesSheet (`src/components/TodaysPracticesSheet.tsx`)

Bottom sheet modal showing full list of today's practices.

**Features:**
- Lists all practices for today
- Progress tracking per practice
- "Start Practice" button per practice
- Smooth slide-up animation

## Utilities

### `src/utils/customMala.ts`

**Core Functions:**
- `loadPlannerData()`: Loads complete planner data
- `savePlannerData(data)`: Saves planner data
- `getPracticeMode()`: Gets current mode
- `setPracticeMode(mode)`: Changes mode

**Daily Mode Operations:**
- `addDailyPractice(practice)`
- `updateDailyPractice(id, updates)`
- `deleteDailyPractice(id)`
- `reorderDailyPractices(startIndex, endIndex)`

**Weekly Mode Operations:**
- `addWeeklyPractice(weekday, practice)`
- `updateWeeklyPractice(weekday, id, updates)`
- `deleteWeeklyPractice(weekday, id)`
- `reorderWeeklyPractices(weekday, startIndex, endIndex)`

**Progress Management:**
- `getTodayPractices()`: Returns today's practices based on mode
- `updatePracticeProgress(mode, weekday, id, progress)`
- `resetDailyProgress()`: Resets all progress at start of new day

## Home Screen Integration

### Banner Display

The `TodaysPracticesBanner` should be displayed beneath the greeting:

```tsx
<TodaysPracticesBanner onOpenSheet={handleOpenSheet} />
```

### Bottom Sheet

The `TodaysPracticesSheet` opens when banner is tapped:

```tsx
<TodaysPracticesSheet
  isOpen={isSheetOpen}
  onClose={() => setIsSheetOpen(false)}
  onStartPractice={handleStartPractice}
/>
```

### Empty State

When no practices exist, the banner shows:
- "Add a practice to begin your journey."
- "Go to Planner" button

## User Flows

### Daily Mode Flow

1. User selects "Daily" mode
2. Sees empty state or existing practices
3. Taps "+ Add Mantra"
4. Enters title, selects beads, optional notes
5. Saves → Practice added to daily list
6. Practices repeat every day
7. Progress tracked per practice

### Weekly Mode Flow

1. User selects "Weekly" mode
2. Sees 7 day cards (collapsed by default, today expanded)
3. Taps a day card to expand
4. Sees practices for that day (or empty state)
5. Taps "+ Add Practice" in expanded card
6. Enters practice details
7. Saves → Practice added to that weekday
8. Different practices per day
9. Progress tracked per practice per day

### Home Screen Flow

1. App loads → Reads `practiceMode`
2. If daily: loads `dailyMala.practices`
3. If weekly: loads `weeklyMala[currentWeekday]`
4. Displays banner with count
5. User taps banner → Bottom sheet opens
6. Shows all today's practices with progress
7. User can increment progress or start practice
8. At midnight, all progress resets

### Edit Flow

1. User taps menu (⋮) on MantraCard
2. Selects "Edit"
3. Modal opens with current values
4. User modifies fields
5. Saves → Updates persisted immediately
6. Toast: "Practice updated."

### Delete Flow

1. User taps menu on MantraCard
2. Selects "Delete"
3. Practice removed from list
4. Data persisted immediately
5. Toast: "Practice deleted."

## Persistence & Sync

### Storage Structure

```json
{
  "practiceMode": "weekly",
  "dailyMala": {
    "practices": [
      {
        "id": "practice_123",
        "title": "Om Peace Namah",
        "beads": 108,
        "notes": "Morning practice",
        "progress": 0
      }
    ]
  },
  "weeklyMala": {
    "sun": [],
    "mon": [
      {
        "id": "practice_456",
        "title": "Om Serenity Flow Namah",
        "beads": 108,
        "progress": 0
      }
    ],
    "tue": [],
    "wed": [],
    "thu": [],
    "fri": [],
    "sat": []
  },
  "lastUpdated": "2025-01-01T12:00:00Z"
}
```

### Auto-Save

Changes are saved immediately on:
- Add practice
- Edit practice
- Delete practice
- Reorder practices
- Mode change
- Progress update

### Progress Reset

Progress resets automatically:
- At midnight (new day)
- Checks `divine-counter-last-progress-reset` date
- If date differs, resets all practice progress to 0
- Updates reset date

## UI/UX Guidelines

### Visual Design

- **Background**: Warm beige (#FDF6E3, #FAF0E6)
- **Accents**: Saffron (#D4AF37)
- **Cards**: Rounded 12dp, soft 2dp shadows
- **Spacing**: 8-12dp internal, 16dp outer margins

### Typography

- **Section Headers**: 20sp semi-bold
- **Body Text**: 16sp regular
- **Labels**: 14sp medium
- **Font**: Inter/Nunito family

### Motion

- **List Changes**: 200ms fade + slide (ease-out)
- **Progress Updates**: Animated ring fill (300ms)
- **Modal Open/Close**: Spring animation (300ms stiffness, 30 damping)
- **Collapse/Expand**: 200ms height + opacity

### Haptic Feedback

- **Add Practice**: Light impact
- **Save Practice**: Success notification
- **Delete Practice**: Medium impact (warning)

## Accessibility

### VoiceOver Labels

- "Daily mode button, Use the same practice set every day"
- "[Day] practice card, [count] practices, expand button"
- "[Practice] progress, [X] of [Y] beads, increment button"
- "Add practice button"
- "Edit [practice], menu button"
- "Delete [practice], menu button"

### Focus Order

1. Mode selector
2. List content (practices/day cards)
3. Add buttons
4. Action menus

### Tap Targets

- Minimum 44x44dp for all interactive elements
- Cards are fully tappable
- Menu buttons adequately sized

## Copy & Microcopy

### Empty States

- **Daily**: "No practices yet. Add a practice to begin your daily journey. These practices will repeat every day."
- **Weekly (per day)**: "No practices yet for this day."
- **Home**: "Add a practice to begin your journey."

### Toast Messages

- "Practice added."
- "Practice updated."
- "Practice deleted."
- "[Weekday] practice saved."
- "Daily practice saved."

### Banner Text

- "Today's Practices • {count} items added"
- "{total} beads counted today"

### Descriptive Copy

- "Your Friday includes 2 practices of 108 beads each."
- "Daily practice saved."
- "No practices yet—tap Add Mantra to begin."

## Testing Checklist

- [ ] Mode selection persists after app restart
- [ ] Daily practices repeat every day
- [ ] Weekly practices show correct day
- [ ] Add practice saves correctly
- [ ] Edit practice updates correctly
- [ ] Delete practice removes correctly
- [ ] Progress increments correctly
- [ ] Progress resets at midnight
- [ ] Home banner shows correct count
- [ ] Bottom sheet lists all practices
- [ ] Empty states show correctly
- [ ] Accessibility: Screen reader announces
- [ ] Accessibility: Focus order logical
- [ ] Mobile: All controls tappable (44x44dp)
- [ ] Dark mode: All text readable

## Future Enhancements

- Drag-to-reorder (react-beautiful-dnd)
- Practice templates/presets
- Progress analytics/history
- Practice reminders
- Share practice sets
- Custom bead counts beyond 1000
- Practice notes with rich text
- Daily/weekly progress summaries

