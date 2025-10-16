# Custom Volume Control Plugin

## Overview
This is a custom Capacitor plugin that provides native Android volume button control for the Mantra Counting App. Unlike third-party plugins, this implementation directly intercepts volume key events at the native Android level, ensuring reliable functionality on both physical devices and emulators.

## Architecture

### Native Android Layer
**Files:**
- `/android/app/src/main/java/com/divinecounter/app/VolumeControlPlugin.java` - Main plugin class
- `/android/app/src/main/java/com/divinecounter/app/MainActivity.java` - Activity that handles key events

**How it works:**
1. `MainActivity.dispatchKeyEvent()` intercepts all key events
2. When volume keys (UP/DOWN) are pressed, it delegates to `VolumeControlPlugin`
3. The plugin checks if volume control is enabled
4. If enabled, it consumes the event (prevents volume change) and sends notification to React
5. React receives the event and triggers counter increment/decrement

### TypeScript/React Layer
**Files:**
- `/src/plugins/VolumeControl.ts` - TypeScript interface for the plugin
- `/src/App.tsx` - React component that uses the plugin

**API:**
```typescript
VolumeControl.enable()  // Enable volume button interception
VolumeControl.disable() // Disable volume button interception
VolumeControl.isEnabled() // Check current status
VolumeControl.addListener('volumeButtonPressed', callback) // Listen for events
```

## Advantages Over Third-Party Plugins

1. **Works on Emulators**: Direct key event interception works with emulator hardware buttons
2. **More Reliable**: No dependency on external plugin maintenance
3. **Better Control**: Full control over event handling and volume suppression
4. **Simpler**: No complex configuration or external dependencies

## Testing

### On Android Emulator:
1. Build and sync: `yarn build && npx cap sync android`
2. Open Android Studio: `npx cap open android`
3. Run on emulator
4. Enable "Volume Key Control" in Settings
5. Press hardware volume buttons (side buttons on emulator)
6. Counter should increment/decrement with toast notifications

### On Physical Device:
Same process as emulator, but using physical volume buttons.

## Implementation Details

**Key Prevention:**
When volume control is enabled, the plugin returns `true` from `dispatchKeyEvent()`, which prevents the default Android volume behavior (volume UI and actual volume change).

**Event Flow:**
```
User presses volume button
    ↓
MainActivity.dispatchKeyEvent() receives KeyEvent
    ↓
Checks if it's VOLUME_UP or VOLUME_DOWN
    ↓
Calls VolumeControlPlugin.handleVolumeKey()
    ↓
Plugin checks if enabled
    ↓
If enabled: sends event to React & returns true (consume event)
    ↓
React listener receives event
    ↓
Triggers handleIncrement() or handleDecrement()
    ↓
Counter updates with haptic feedback & toast
```

## Migration from Old Plugin

**Removed:**
- `@capacitor-community/volume-buttons` npm package
- `VolumeButtonTester.tsx` component (no longer needed)
- Old plugin configuration from `capacitor.config.json`

**Added:**
- Custom native plugin files
- TypeScript interface
- Direct event handling in App.tsx

## Troubleshooting

**Volume buttons not working:**
1. Check if Volume Key Control is enabled in Settings
2. Verify an active counter is selected
3. Check Android logcat for plugin logs
4. Ensure app has been rebuilt and synced

**Still hearing volume beep:**
- The plugin should suppress volume UI, but some Android versions may still show brief indicators. This is expected behavior and doesn't affect functionality.
