# Volume Button Control Implementation

## Overview
This document describes the implementation of hardware volume button control for Divine Counter, allowing users to increment/decrement counters using the physical Volume Up/Down buttons on Android devices.

## Architecture

### 1. Android Native Bridge (`MainActivity.java`)
The Android MainActivity intercepts hardware volume key events and forwards them to the WebView as custom JavaScript events.

**Key Features:**
- Intercepts `KEYCODE_VOLUME_UP` and `KEYCODE_VOLUME_DOWN` events
- Dispatches custom events to the WebView using `evaluateJavascript()`
- Returns `true` to consume the events and prevent system volume changes

### 2. React Hook (`useVolumeKeys.ts`)
A custom React hook that listens for the custom events from the native bridge and maps them to callback functions.

**Key Features:**
- Listens for `volume-up` and `volume-down` custom events
- Provides clean callback interface for increment/decrement actions
- Automatically cleans up event listeners on unmount

### 3. Integration (`HomeScreen.tsx`)
The main counter screen integrates the volume key controls with comprehensive safety checks.

**Safety Features:**
- Validates active counter exists before actions
- Prevents negative counter values
- Checks goal completion status
- Provides user feedback via toast notifications
- Triggers appropriate haptic feedback

### 4. Enhanced Haptics (`haptics.ts`)
Extended the haptic feedback system with volume button specific feedback types.

**New Haptic Types:**
- `light`: Subtle feedback for volume button taps
- `success`: Celebration feedback for goal completion
- `error`: Warning feedback for boundary violations

## Usage

### Basic Integration
```tsx
import { useVolumeKeys } from '../hooks/useVolumeKeys';
import { lightHaptic, successHaptic, errorHaptic } from '../utils/haptics';

function CounterScreen() {
  const handleVolumeUp = () => {
    // Safety checks
    if (!activeCounter) {
      toast.error('No active counter selected.');
      errorHaptic();
      return;
    }
    
    // Business logic
    onIncrement();
    lightHaptic();
  };

  useVolumeKeys({
    onVolumeUp: handleVolumeUp,
    onVolumeDown: handleVolumeDown,
  });
}
```

### Safety Checks
The implementation includes comprehensive safety checks:

1. **Active Counter Validation**: Ensures a counter is selected before allowing actions
2. **Boundary Protection**: Prevents negative values and handles goal completion
3. **User Feedback**: Provides clear toast messages for all states
4. **Haptic Feedback**: Appropriate tactile responses for different actions

## Platform Support

### Android
- Full support with hardware volume button integration
- Native haptic feedback via Capacitor
- Custom event bridge from MainActivity to WebView

### iOS/Web
- Graceful fallback - volume keys simply don't trigger
- Users continue to use touch interface normally
- Settings screen indicates Android-only availability

## Privacy & Security

- **No System Interception**: Only intercepts volume keys within the app context
- **Offline Operation**: Works completely offline with no external dependencies
- **No Data Collection**: No volume key usage is tracked or stored
- **Play Store Safe**: Uses standard Android key event handling

## Testing

### Manual Testing Checklist
- [ ] Volume Up increments counter on Android device
- [ ] Volume Down decrements counter on Android device
- [ ] Toast notifications appear for boundary conditions
- [ ] Haptic feedback triggers appropriately
- [ ] No crashes on web/iOS builds
- [ ] Settings screen shows volume control info
- [ ] Offline functionality works correctly

### Build Verification
```bash
# Android build
./gradlew assembleRelease

# Web build
npm run build
```

## Future Enhancements

1. **Settings Toggle**: Allow users to enable/disable volume button control
2. **Custom Key Mapping**: Support for other hardware keys
3. **Accessibility**: Enhanced support for accessibility features
4. **Analytics**: Optional usage tracking for feature optimization

## Troubleshooting

### Volume Keys Not Working
1. Verify running on Android device (not emulator)
2. Check that app is in foreground
3. Ensure no other apps are intercepting volume keys
4. Test with different Android versions

### Haptic Feedback Issues
1. Check device haptic settings
2. Verify `hapticsEnabled` setting in app
3. Test with different haptic types

### Build Issues
1. Ensure Android SDK is properly configured
2. Check Capacitor configuration
3. Verify all dependencies are installed
