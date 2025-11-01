# Onboarding Boot Flow Fix

## Problem Summary

The app **always booted into onboarding** even after a successful first-run completion. Users had to complete onboarding every time they opened the app.

## Root Cause Identified

### Critical Bug: Load useEffect Early Return

**File**: `src/App.tsx`, load `useEffect` (line 372)

**The Problem**:
```typescript
useEffect(() => {
  // ❌ WRONG: Returns early if isOnboarding is true
  if (isOnboarding) {
    console.log("[Load] Skipping data load - user is in onboarding mode");
    return;  // <-- This prevents checking localStorage!
  }
  
  // This code never runs because isOnboarding starts as true
  const savedOnboarding = localStorage.getItem("divine-counter-onboarded");
  // ...
}, [isBooting, isOnboarding]);
```

**The Flow**:
1. App component mounts with `isOnboarding = useState(true)` (line 204)
2. Boot screen completes, `isBooting` becomes `false`
3. Load `useEffect` runs
4. **Checks `if (isOnboarding)` - it's `true`, so returns early**
5. **Never checks localStorage for `divine-counter-onboarded` flag**
6. User always sees onboarding screen

**Why This Happens**:
- `isOnboarding` state defaults to `true` on every mount
- The load effect assumed `isOnboarding` was already correct before checking storage
- This created a chicken-and-egg problem: we need to check storage to know if onboarding should be shown, but we returned early before checking storage

## Fixes Implemented

### Fix 1: Check localStorage FIRST, Then Set State

**File**: `src/App.tsx`, load `useEffect` (line 372)

**Changes**:
- Removed early return based on `isOnboarding` state
- Check localStorage **first** to determine if user completed onboarding
- Only then set `isOnboarding` state based on what's in storage

**New Logic**:
```typescript
useEffect(() => {
  if (!isBooting) {
    // ✅ CORRECT: Check localStorage FIRST
    const savedOnboarding = localStorage.getItem("divine-counter-onboarded");
    
    if (savedOnboarding === "true") {
      // User completed onboarding - load data
      if (isOnboarding) {
        setIsOnboarding(false);  // Switch out of onboarding
      }
      // Load all data...
    } else {
      // No flag - show onboarding
      if (!isOnboarding) {
        setIsOnboarding(true);  // Ensure we show onboarding
      }
    }
  }
}, [isBooting]);  // ✅ Removed isOnboarding from deps - only runs on boot
```

**Key Changes**:
1. Removed `isOnboarding` from dependency array (only depends on `isBooting`)
2. Check localStorage first, regardless of current `isOnboarding` state
3. Set `isOnboarding` based on what's in localStorage, not current state

### Fix 2: Explicit Flag Save on Onboarding Complete

**File**: `src/App.tsx`, `handleOnboardingComplete` function (line 701)

**Changes**:
- Added explicit `localStorage.setItem()` call immediately after `setIsOnboarding(false)`
- Don't rely solely on the save `useEffect` (which might have timing issues)

**New Code**:
```typescript
setIsOnboarding(false);

// Force immediate write of onboarding flag (don't wait for useEffect)
try {
  localStorage.setItem("divine-counter-onboarded", "true");
  console.log("[Onboarding] Explicitly saved divine-counter-onboarded flag to localStorage");
} catch (error) {
  console.error("[Onboarding] ERROR: Failed to save onboarding flag", error);
}
```

### Fix 3: Comprehensive Logging

Added detailed console logging throughout the flow:

**On Boot**:
```
[Load] Boot complete, checking localStorage for saved data...
[Load] Current isOnboarding state: true
[Load] divine-counter-onboarded in localStorage: "true"
[Load] Found onboarding flag - user has completed onboarding, loading data...
[Load] Currently in onboarding mode but flag exists - switching to app mode
[Load] Loaded 1 counters
[Load] Data loaded successfully - user should see app, not onboarding
```

**On Onboarding Complete**:
```
[Onboarding] Completing onboarding...
[Onboarding] Setting up initial counter...
[Onboarding] Setting isOnboarding=false - save useEffect should write divine-counter-onboarded flag
[Onboarding] Explicitly saved divine-counter-onboarded flag to localStorage
[Onboarding] Onboarding complete - user should now see app
```

**On First Launch**:
```
[Load] Boot complete, checking localStorage for saved data...
[Load] Current isOnboarding state: true
[Load] divine-counter-onboarded in localStorage: null
[Load] No onboarding flag found - user needs to complete onboarding
```

## Event Flow (After Fix)

### Expected Flow on Normal Boot (After Onboarding):

1. App component mounts: `isOnboarding = true` (default)
2. Boot screen shows, then completes: `isBooting = false`
3. Load `useEffect` runs (depends only on `isBooting`)
4. Checks localStorage: `localStorage.getItem("divine-counter-onboarded")`
5. Finds flag exists: `"true"`
6. Logs: `"[Load] Found onboarding flag - user has completed onboarding"`
7. Checks current state: `isOnboarding === true` (still default)
8. Sets: `setIsOnboarding(false)`
9. Loads all saved data (counters, history, settings, etc.)
10. Component re-renders with `isOnboarding === false`
11. App screen shows (not onboarding)

### Expected Flow on First Launch:

1. App component mounts: `isOnboarding = true` (default)
2. Boot screen shows, then completes: `isBooting = false`
3. Load `useEffect` runs
4. Checks localStorage: `localStorage.getItem("divine-counter-onboarded")`
5. No flag found: `null`
6. Logs: `"[Load] No onboarding flag found - user needs to complete onboarding"`
7. Keeps: `isOnboarding = true` (already correct)
8. Component renders onboarding screen

### Expected Flow on Reset:

1. User clicks "Delete everything" in Settings
2. `handleResetTutorial` clears localStorage (including `divine-counter-onboarded`)
3. Sets `isOnboarding = true`
4. Next boot: Load `useEffect` finds no flag → shows onboarding ✅

## Testing Checklist

### Test 1: First Launch
1. Clear all app data / fresh install
2. Open app
3. **Expected**: Onboarding screen appears
4. Complete onboarding
5. **Expected**: App screen shows (not onboarding)
6. **Console**: Should see `[Onboarding] Explicitly saved divine-counter-onboarded flag`

### Test 2: Normal Boot (After Onboarding)
1. Close app completely
2. Reopen app
3. **Expected**: App screen shows immediately (NOT onboarding)
4. **Console**: Should see `[Load] Found onboarding flag - user has completed onboarding`
5. **Check localStorage**: `divine-counter-onboarded` should be `"true"`

### Test 3: Reset Flow
1. Complete onboarding, use app
2. Go to Settings → Info & Reset
3. Click "Delete everything"
4. **Expected**: Onboarding screen appears
5. **Console**: Should see `[Reset] Verified: divine-counter-onboarded successfully removed`
6. **Check localStorage**: `divine-counter-onboarded` should not exist

### Test 4: Multiple Boots
1. Complete onboarding
2. Close and reopen app 5 times
3. **Expected**: App screen shows every time (no onboarding)
4. **Console**: Should see load logs confirming flag exists each time

## Debugging Guide

If onboarding still shows incorrectly, check console for:

### Issue: Flag Not Saved
**Symptoms**: Onboarding completes but shows again on next boot

**Check Console**:
- Look for `[Onboarding] Explicitly saved divine-counter-onboarded flag` ✅
- If missing, flag save failed

**Possible Causes**:
- localStorage quota exceeded
- localStorage disabled in browser
- Storage API unavailable

**Fix**: Check localStorage API availability:
```javascript
try {
  localStorage.setItem("test", "test");
  localStorage.removeItem("test");
  console.log("localStorage available");
} catch (e) {
  console.error("localStorage not available:", e);
}
```

### Issue: Flag Not Loaded
**Symptoms**: Flag exists in localStorage but onboarding still shows

**Check Console**:
- Look for `[Load] Boot complete, checking localStorage for saved data...`
- Check `[Load] divine-counter-onboarded in localStorage:` value
- If shows `null` but you see it in DevTools → timing issue

**Possible Causes**:
- Race condition with other useEffect
- Storage cleared between saves
- localStorage read failure

**Fix**: Add explicit check in load useEffect:
```typescript
const savedOnboarding = localStorage.getItem("divine-counter-onboarded");
console.log("[Load] DEBUG: Flag value:", savedOnboarding, typeof savedOnboarding);
```

### Issue: Flag Cleared Unexpectedly
**Symptoms**: App works, then suddenly shows onboarding again

**Check Console**:
- Look for `[Reset]` logs (user triggered reset?)
- Check for localStorage errors
- Check if another tab/window cleared storage

**Possible Causes**:
- Reset handler called accidentally
- Storage quota exceeded, oldest items cleared
- Browser privacy mode clearing storage

## Platform-Specific Considerations

### Web Browser
- localStorage persists across sessions ✅
- No special considerations

### Android WebView
- localStorage persists unless app data cleared ✅
- May be cleared if user clears app data in Android Settings

### iOS WebView
- localStorage persists ✅
- May be cleared if user clears Safari data (if using WKWebView)

### Capacitor
- Uses native WebView storage
- Persists correctly ✅

## Files Modified

1. **`src/App.tsx`**:
   - Load `useEffect` (lines 371-444): Fixed logic to check localStorage first
   - `handleOnboardingComplete` (lines 701-761): Added explicit flag save
   - Removed `isOnboarding` from load useEffect dependency array

## Related Issues

This fix also resolves:
- Issue where reset didn't properly clear onboarding flag (now fixed in both directions)
- Race condition where save useEffect might not write flag fast enough
- Inconsistent onboarding state on app restart

## Success Metrics

After this fix:
- ✅ First launch: Shows onboarding
- ✅ Normal boot: Skips onboarding if completed
- ✅ After reset: Shows onboarding again
- ✅ Console logs: Clear trace of onboarding state
- ✅ localStorage: Flag persists correctly

