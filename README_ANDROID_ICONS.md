# Android App Icon Setup

## Quick Start

### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
setup-android-icons.bat
```

**For Mac/Linux:**
```bash
./setup-android-icons.sh
```

**Or using npm:**
```bash
npm run setup-android
```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install sharp
   ```

2. **Generate icons:**
   ```bash
   npm run generate-icons
   ```

3. **Sync with Android:**
   ```bash
   npx cap sync
   ```

## What This Does

The automated setup will:

1. ✅ **Check prerequisites** - Node.js and source logo
2. ✅ **Install sharp** - Image processing library
3. ✅ **Generate Android icons** - All required sizes (48x48 to 192x192)
4. ✅ **Place icons correctly** - In proper Android resource folders
5. ✅ **Sync with Capacitor** - Update Android project

## Required Files

- **Source Logo**: `build/assets/divineCounterLogo-1024.png` (1024x1024 pixels)
- **Output**: Android icons in `android/app/src/main/res/mipmap-*/` folders

## Generated Icon Sizes

| Density | Size | Folder | Usage |
|---------|------|--------|-------|
| MDPI | 48x48 | mipmap-mdpi | Low density screens |
| HDPI | 72x72 | mipmap-hdpi | Medium density screens |
| XHDPI | 96x96 | mipmap-xhdpi | High density screens |
| XXHDPI | 144x144 | mipmap-xxhdpi | Very high density screens |
| XXXHDPI | 192x192 | mipmap-xxxhdpi | Ultra high density screens |

## Testing Your Icons

### 1. Build and Run
```bash
npm run build
npx cap open android
```

### 2. Install on Device
- Connect Android device or start emulator
- Build and install the app
- Check the app icon in the launcher

### 3. Verify Icon Quality
- Icon should be clear at all sizes
- No pixelation or blurriness
- Properly centered and scaled
- Looks good on different launcher themes

## Troubleshooting

### Common Issues

**❌ "Source logo not found"**
- Ensure `build/assets/divineCounterLogo-1024.png` exists
- Check the file path is correct
- Verify the file is a valid PNG image

**❌ "Sharp package not found"**
- Run `npm install sharp` first
- Check your internet connection
- Try `npm install --save-dev sharp`

**❌ "Icons not updating"**
- Clear app data: Settings > Apps > Divine Counter > Storage > Clear Data
- Uninstall and reinstall the app
- Check if icons are in correct folders

**❌ "Icon looks blurry"**
- Ensure source logo is high quality (1024x1024)
- Check that all density folders have icons
- Verify icon files are not corrupted

### Manual Icon Creation

If the automated script doesn't work, you can create icons manually:

1. **Use online tools:**
   - [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
   - [App Icon Generator](https://appicon.co/)

2. **Use image editing software:**
   - Photoshop, GIMP, or similar
   - Create 48x48, 72x72, 96x96, 144x144, 192x192 versions
   - Save as PNG with transparent background

3. **Place in correct folders:**
   ```
   android/app/src/main/res/
   ├── mipmap-mdpi/ic_launcher.png
   ├── mipmap-hdpi/ic_launcher.png
   ├── mipmap-xhdpi/ic_launcher.png
   ├── mipmap-xxhdpi/ic_launcher.png
   └── mipmap-xxxhdpi/ic_launcher.png
   ```

## Icon Design Tips

### Best Practices
- **Keep it simple** - Icons should be recognizable at small sizes
- **Use consistent colors** - Match your app's theme
- **Avoid text** - Text doesn't scale well in small icons
- **Test on different backgrounds** - Icons appear on various launcher themes
- **Consider adaptive icons** - They work better with different launcher styles

### Your Divine Counter App
- **Spiritual theme** - Use mala beads, lotus, or other spiritual symbols
- **Color scheme** - Match your app's golden/orange theme
- **Readability** - Ensure it's clear even at 48x48 pixels
- **Branding** - Make it recognizable as your app

## Next Steps

After setting up your Android icons:

1. **Test thoroughly** - Check on different devices and Android versions
2. **Update app store** - Use the same icon for Google Play Store
3. **Consider iOS icons** - You may want to create iOS app icons too
4. **Monitor feedback** - See how users respond to the new icon

## Support

If you encounter issues:

1. **Check the logs** - Look for error messages in the console
2. **Verify file paths** - Ensure all files are in correct locations
3. **Test on device** - Icons may look different on actual devices
4. **Ask for help** - Share error messages for assistance

Your Divine Counter app will now have a professional, branded icon that users will see in their Android launcher! 🙏













