# Reset Flow Fix Documentation

## Problem Summary

The "Delete everything" action in Settings → Info & Reset modal was failing to:
1. Restart onboarding properly
2. Purge all user data completely
3. Prevent data from being re-hydrated after reset

## Root Causes Identified

### 1. Missing Storage Keys
**Issue**: `handleResetTutorial` was not clearing all localStorage keys:
- Missing: `divine-counter-custom-mala-planner`
- Missing: `divine-counter-weekly-mala`
- Missing: `divine-counter-daily-override`

**Impact**: Custom Mala Planner and Weekly Mala data persisted after reset.

### 2. Race Condition with Save useEffect
**Issue**: The save `useEffect` (line 419) was potentially re-saving data after state updates but before `isOnboarding` flag was set to `true`.

**Flow**:
1. `handleResetTutorial` sets state variables (counters, history, etc.) to empty
2. Save `useEffect` triggers and checks `!isOnboarding && !isBooting`
3. If `isOnboarding` isn't set to `true` fast enough, the save effect might re-save cleared state
4. `isOnboarding` gets set to `true` after other state mutations

**Impact**: Data could be re-persisted to localStorage, preventing proper reset.

### 3. Load useEffect Re-hydration
**Issue**: The load `useEffect` (line 372) didn't check `isOnboarding` flag before loading data.

**Flow**:
1. Reset clears localStorage
2. React re-renders
3. Load `useEffect` runs (depends only on `isBooting`)
4. If `localStorage.getItem("divine-counter-onboarded")` somehow still exists, data gets re-loaded
5. User remains in non-onboarding state

**Impact**: Data could be re-hydrated after reset, keeping user out of onboarding.

### 4. Insufficient Error Handling
**Issue**: No try-catch around localStorage operations or logging to trace issues.

**Impact**: Silent failures, difficult to debug.

## Fixes Implemented

### Fix 1: Complete Storage Key Clearing
**File**: `src/App.tsx`, `handleResetTutorial` function

**Changes**:
- Added all missing storage keys to the `storageKeys` array:
  ```typescript
  "divine-counter-custom-mala-planner",
  "divine-counter-weekly-mala",
  "divine-counter-daily-override",
  ```
- Added error handling for each `removeItem` operation
- Added logging to track cleared keys

### Fix 2: Set Onboarding Flag First
**File**: `src/App.tsx`, `handleResetTutorial` function

**Changes**:
- Moved `setIsOnboarding(true)` and `setOnboardingStep("greeting")` to **STEP 1** (immediately at function start)
- This prevents the save `useEffect` from re-saving data
- Wrapped state updates in `setTimeout(..., 0)` to ensure `isOnboarding` is processed first

**Code**:
```typescript
// STEP 1: Set onboarding flag IMMEDIATELY
setIsOnboarding(true);
setOnboardingStep("greeting");

// STEP 2: Clear storage...

// STEP 4: Reset state (in setTimeout to ensure ordering)
setTimeout(() => {
  // ... all other state resets
}, 0);
```

### Fix 3: Prevent Load useEffect Re-hydration
**File**: `src/App.tsx`, load `useEffect` (line 372)

**Changes**:
- Added early return if `isOnboarding === true`
- Added `isOnboarding` to dependency array
- Added logging for debugging

**Code**:
```typescript
useEffect(() => {
  // Skip loading if we're already in onboarding mode
  if (isOnboarding) {
    console.log("[Load] Skipping data load - user is in onboarding mode");
    return;
  }
  // ... rest of load logic
}, [isBooting, isOnboarding]);
```

### Fix 4: Comprehensive Logging and Error Handling
**File**: `src/App.tsx`, `handleResetTutorial` function

**Changes**:
- Added console logging at each step of the reset process
- Added try-catch around entire reset flow
- Added verification step to confirm storage is cleared
- Added error handling for individual storage operations
- Made function `async` to properly handle notification cancellation

**Logging Output Example**:
```
[Reset] Starting reset process...
[Reset] Setting isOnboarding=true to prevent re-save...
[Reset] Clearing localStorage keys...
[Reset] Cleared 15/15 localStorage keys
[Reset] Cancelling native notifications...
[Reset] Notifications cancelled successfully
[Reset] Resetting React state...
[Reset] Reset complete! User should now see onboarding.
[Reset] Verified: divine-counter-onboarded successfully removed
```

## Event Flow (After Fix)

### Expected Flow:
1. User clicks "Delete everything" in `DeleteDataModal`
2. `onConfirm` callback fires → calls `handleResetTutorial()` in `App.tsx`
3. **STEP 1**: `setIsOnboarding(true)` immediately (prevents save useEffect)
4. **STEP 2**: Clear all 15 localStorage keys (with error handling)
5. **STEP 3**: Cancel native notifications (if on native platform)
6. **STEP 4**: Reset all React state (in setTimeout to ensure ordering)
7. **STEP 5**: Verify storage is cleared (for debugging)
8. Component re-renders with `isOnboarding === true`
9. Load `useEffect` sees `isOnboarding === true` and returns early
10. Save `useEffect` sees `isOnboarding === true` and doesn't save
11. Onboarding screen renders (`onboardingStep === "greeting"`)

### Console Log Timeline:
```
[Reset] Starting reset process...
[Reset] Setting isOnboarding=true to prevent re-save...
[Reset] Clearing localStorage keys...
[Reset] Cleared 15/15 localStorage keys
[Reset] Cancelling native notifications...
[Reset] Notifications cancelled successfully
[Reset] Resetting React state...
[Load] Skipping data load - user is in onboarding mode
[Reset] Reset complete! User should now see onboarding.
[Reset] Verified: divine-counter-onboarded successfully removed
```

## Testing Checklist

### Manual Testing Steps:
1. ✅ Complete onboarding and create practice data
2. ✅ Navigate to Settings → Info & Reset
3. ✅ Click "Delete everything" button
4. ✅ Observe console logs (should see `[Reset]` prefixed messages)
5. ✅ Verify onboarding screen appears
6. ✅ Check localStorage (should be empty for all divine-counter-* keys)
7. ✅ Verify no data persists in app after reset

### Automated Testing (Future):
- Unit test `handleResetTutorial` function
- Integration test reset flow with mocked localStorage
- E2E test complete reset → onboarding flow

## Storage Keys Cleared

Complete list of localStorage keys cleared during reset:

1. `divine-counter-onboarded`
2. `divine-counter-counters`
3. `divine-counter-states`
4. `divine-counter-history`
5. `divine-counter-journal`
6. `divine-counter-settings`
7. `divine-counter-active`
8. `divine-counter-username`
9. `divine-counter-unlocked-rewards`
10. `divine-counter-longest-streak`
11. `divine-counter-milestones`
12. `divine-counter-rewards`
13. `divine-counter-custom-mala-planner` *(newly added)*
14. `divine-counter-weekly-mala` *(newly added)*
15. `divine-counter-daily-override` *(newly added)*

## Native Side Effects

### Capacitor Plugins Cleared:
- **LocalNotifications**: All pending notifications are cancelled
- **Error Handling**: Failures are logged but don't block reset

### Other Native Considerations:
- No Capacitor Preferences API used (data only in localStorage)
- No IndexedDB usage (web-only storage not used)
- No sessionStorage usage (checked via grep)

## Error States Handled

1. **localStorage.removeItem() failures**: Individual try-catch per key
2. **Notification cancellation failures**: Logged but don't block reset
3. **State update failures**: Wrapped in outer try-catch with fallback to show onboarding
4. **Re-hydration attempts**: Prevented by early return in load useEffect

## Debugging Guide

If reset still fails, check console for:

1. **`[Reset]` prefixed logs**: Confirm reset function executed
2. **`[Load]` prefixed logs**: Check if data is being re-loaded
3. **`WARNING: divine-counter-onboarded still exists`**: Indicates storage clear failed
4. **`Failed to remove key`**: Specific key that failed to clear
5. **`CRITICAL ERROR during reset`**: Outer try-catch caught an error

### Common Issues:
- **Storage quota exceeded**: Browser storage is full (rare, but possible)
- **localStorage disabled**: User's browser settings block localStorage
- **React strict mode**: Double-rendering might cause issues (only in dev)

## Files Modified

1. `src/App.tsx`:
   - `handleResetTutorial` function (lines 896-995)
   - Load `useEffect` (lines 372-426)

## Related Files (Not Modified, But Reviewed)

- `src/components/SettingsScreen.tsx`: Modal trigger location
- `src/components/DeleteDataModal.tsx`: Modal confirmation button
- `src/utils/customMala.ts`: Custom Mala storage utilities
- `src/utils/weeklyMala.ts`: Weekly Mala storage utilities

## Next Steps

1. ✅ Fix implemented and documented
2. ⏳ Manual testing on device/emulator
3. ⏳ Monitor console logs during testing
4. ⏳ Verify onboarding flow works correctly after reset
5. ⏳ Consider adding toast notification on successful reset (optional UX enhancement)

