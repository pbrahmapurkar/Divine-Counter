# Daily Archiving System Documentation

## Overview
This document describes the robust daily progress archiving system implemented to fix critical bugs in date and history logic. The system ensures that when a new day starts, yesterday's completed tasks are properly saved and displayed correctly.

## Architecture

### 1. PracticeContext (`src/contexts/PracticeContext.tsx`)
The central hub for all archiving and data management logic.

#### Key Functions:

**`archivePreviousDayIfNeeded()`**
- **Purpose**: Archives the previous day's progress when a new day is detected
- **When Called**: At the very beginning of `handleIncrement()` before any count changes
- **Logic**:
  1. Compares `lastCountDate` with current date
  2. If dates differ (new day detected):
     - Creates `HistoryEntry` for yesterday's date
     - Saves to persistent history (prevents duplicates)
     - Resets `todayProgress` to 0
     - Updates `lastCountDate` to current date
  3. Only archives if there was progress on the previous day

**`getLast7DaysData()`**
- **Purpose**: Generates data for the Last 7 Days view using persistent history
- **Logic**:
  1. Generates array of last 7 calendar dates
  2. For past 6 days: queries persistent history for matching entries
  3. For today: uses live `todayProgress` from context
  4. Returns structured data for UI rendering

### 2. App.tsx Integration
The main app component now uses the archiving system:

```typescript
const handleIncrement = async () => {
  // CRITICAL: Archive previous day if needed BEFORE any count changes
  await archivePreviousDayIfNeeded(
    activeCounterId,
    counterStates,
    setCounterStates,
    setHistory,
    counter.dailyGoal
  );
  
  // ... rest of increment logic
};
```

### 3. UI Components
- **PracticeJournalScreen**: Uses `getLast7DaysData()` for weekly view
- **HistoryScreen**: Displays archived history entries
- **HomeScreen**: Shows live progress for today

## Data Flow

### Daily Progress Lifecycle:

1. **User Action**: User taps counter button
2. **Archiving Check**: `archivePreviousDayIfNeeded()` runs first
   - If new day: archives yesterday's progress
   - If same day: no archiving needed
3. **Count Update**: Normal increment logic proceeds
4. **State Update**: Counter state updated with new values
5. **UI Refresh**: Components re-render with updated data

### History Management:

```
Yesterday's Progress → HistoryEntry → Persistent Storage
Today's Progress → Live State → Real-time UI Updates
```

## Key Features

### ✅ Robust Date Handling
- Compares dates using `toDateString()` for reliable day detection
- Handles timezone changes and daylight saving time
- Works across different date formats

### ✅ Duplicate Prevention
- Checks for existing history entries before adding
- Updates existing entries instead of creating duplicates
- Maintains data integrity

### ✅ Performance Optimized
- Only archives when necessary (new day + progress)
- Uses React's `useMemo` for expensive calculations
- Minimal re-renders with proper dependency arrays

### ✅ Error Handling
- Graceful fallbacks for missing data
- Console logging for debugging
- Type-safe interfaces throughout

## Testing

### Manual Testing Steps:

1. **Same Day Testing**:
   - Count some malas
   - Verify no archiving occurs
   - Check that progress accumulates

2. **New Day Testing**:
   - Complete some malas
   - Change system date to next day
   - Count one more mala
   - Verify yesterday's progress was archived
   - Check that today's progress starts at 0

3. **Weekly View Testing**:
   - Complete malas over several days
   - Verify Last 7 Days shows correct data
   - Check that past days show archived data
   - Verify today shows live data

### Automated Testing:
Use the test utilities in `src/utils/testArchiving.ts`:

```typescript
import { testScenarios, logTestResult } from './testArchiving';

// Run test scenarios
testScenarios.forEach(scenario => {
  // Test your implementation
  // Log results
});
```

## Migration Notes

### Breaking Changes:
- `handleIncrement()` is now async
- `PracticeContext` has new required functions
- Weekly view data source changed from state to history

### Backward Compatibility:
- Existing history data is preserved
- UI components work with new data structure
- No data loss during migration

## Troubleshooting

### Common Issues:

**Q: Yesterday's progress not showing in history**
A: Check that `archivePreviousDayIfNeeded()` is called before count changes

**Q: Duplicate history entries**
A: The system prevents duplicates, but check for race conditions

**Q: Weekly view showing wrong data**
A: Verify `getLast7DaysData()` is using persistent history for past days

**Q: Today's progress not updating**
A: Ensure archiving doesn't interfere with live progress updates

### Debug Logging:
Enable console logging to see archiving in action:
```typescript
console.log(`New day detected! Archiving ${lastCountDate} with progress: ${currentState.todayProgress}`);
console.log(`Archived previous day: ${lastCountDate} with ${currentState.todayProgress} malas`);
```

## Future Enhancements

### Potential Improvements:
1. **Database Integration**: Replace localStorage with proper database
2. **Offline Sync**: Handle offline/online data synchronization
3. **Data Export**: Allow users to export their history
4. **Analytics**: Add progress analytics and insights
5. **Backup/Restore**: Implement data backup and restore functionality

### Performance Optimizations:
1. **Lazy Loading**: Load history data on demand
2. **Pagination**: Implement pagination for large history datasets
3. **Caching**: Add intelligent caching for frequently accessed data
4. **Compression**: Compress stored data to save space

## Conclusion

The new daily archiving system provides a robust, reliable solution for managing daily progress data. It ensures data integrity, prevents loss of user progress, and provides a solid foundation for future enhancements.

The system is designed to be:
- **Reliable**: Handles edge cases and prevents data loss
- **Performant**: Optimized for mobile devices
- **Maintainable**: Clean, well-documented code
- **Extensible**: Easy to add new features


















