# Android App Icon Setup Guide

## Overview
This guide will help you create proper Android app icons from your existing `divineCounterLogo-1024.png` file.

## Required Icon Sizes
Android requires multiple icon sizes for different screen densities:

| Density | Size | Folder | Purpose |
|---------|------|--------|---------|
| MDPI | 48x48 | mipmap-mdpi | Medium density |
| HDPI | 72x72 | mipmap-hdpi | High density |
| XHDPI | 96x96 | mipmap-xhdpi | Extra high density |
| XXHDPI | 144x144 | mipmap-xxhdpi | Extra extra high density |
| XXXHDPI | 192x192 | mipmap-xxxhdpi | Extra extra extra high density |

## Step 1: Resize Your Logo

### Using Online Tools (Recommended)
1. Go to [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
2. Upload your `divineCounterLogo-1024.png`
3. Download the generated icon pack
4. Extract the icons to the appropriate folders

### Using Image Editing Software
If you prefer to create them manually:

1. **Open your 1024x1024 logo** in Photoshop, GIMP, or similar
2. **Create new images** with these exact dimensions:
   - 48x48 pixels (MDPI)
   - 72x72 pixels (HDPI) 
   - 96x96 pixels (XHDPI)
   - 144x144 pixels (XXHDPI)
   - 192x192 pixels (XXXHDPI)
3. **Resize and crop** your logo to fit each size
4. **Save as PNG** with transparent background if needed

## Step 2: Replace Icon Files

Replace the existing icon files in these locations:

```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-hdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
└── mipmap-xxxhdpi/
    ├── ic_launcher.png
    └── ic_launcher_round.png
```

## Step 3: Update Adaptive Icons (Optional)

If you want to use adaptive icons (Android 8.0+), you'll also need:

### Foreground Icons
Create these sizes for the foreground layer:
- 108x108 (MDPI)
- 162x162 (HDPI)
- 216x216 (XHDPI)
- 324x324 (XXHDPI)
- 432x432 (XXXHDPI)

### Background Layer
The background can be a solid color or simple pattern.

## Step 4: Test Your Icons

### Build and Test
```bash
# Build the app
npm run build

# Sync with Android
npx cap sync

# Open in Android Studio
npx cap open android
```

### Verify Icon Display
1. Install the app on a device/emulator
2. Check the app icon in the launcher
3. Verify it looks good at different sizes
4. Test on different Android versions

## Step 5: Icon Design Guidelines

### Best Practices
- **Keep it simple**: Icons should be recognizable at small sizes
- **Use consistent colors**: Match your app's theme
- **Avoid text**: Text doesn't scale well in small icons
- **Test on different backgrounds**: Icons appear on various launcher themes
- **Consider adaptive icons**: They work better with different launcher styles

### Your Logo Considerations
- **Divine Counter theme**: Ensure the icon reflects the spiritual/mala counting purpose
- **Color scheme**: Use colors that match your app's design
- **Symbolism**: Consider using mala beads, lotus, or other spiritual symbols
- **Readability**: Make sure it's clear even at 48x48 pixels

## Troubleshooting

### Common Issues
1. **Icon not updating**: Clear app data and reinstall
2. **Blurry icons**: Ensure you're using the correct size for each density
3. **Wrong aspect ratio**: Icons should be square (1:1 ratio)
4. **Background issues**: Use transparent PNG for better integration

### Quick Fixes
```bash
# Clean and rebuild
npx cap clean
npm run build
npx cap sync

# Force reinstall
adb uninstall com.divinecounter.app
npx cap run android
```

## Alternative: Automated Icon Generation

### Using Capacitor Icon Plugin
You can also use the Capacitor icon plugin to automatically generate icons:

```bash
npm install @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#000000' --splashBackgroundColor '#ffffff' --splashBackgroundColorDark '#000000'
```

This will automatically generate all required icon sizes from your source image.

## Next Steps

1. **Create the resized icons** using one of the methods above
2. **Replace the existing icon files** in the Android project
3. **Build and test** the app
4. **Verify the icon** appears correctly in the launcher
5. **Test on different devices** and Android versions

Your Divine Counter app will now have a professional, branded icon that users will see in their app launcher!











