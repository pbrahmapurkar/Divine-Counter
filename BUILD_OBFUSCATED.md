# Building Obfuscated Android Release Files

This guide explains how to create obfuscated AAB (Android App Bundle) and APK files for the Divine Counter app.

## Prerequisites

1. **Java Development Kit (JDK)**: Version 17 or higher
2. **Android SDK**: Installed via Android Studio
3. **Gradle**: Included in the project (gradlew)
4. **Keystore**: Located at `android/app/divine-counter-original.keystore`

## Obfuscation Configuration

The app uses **R8/ProGuard** for code obfuscation with the following settings:

- **minifyEnabled**: `true` - Enables code shrinking and obfuscation
- **shrinkResources**: `true` - Removes unused resources
- **ProGuard Rules**: Custom rules in `android/app/proguard-rules.pro`

### What Gets Obfuscated

- **Class names**: Renamed to short, meaningless names (a, b, c, etc.)
- **Method names**: Obfuscated while preserving public API
- **Field names**: Obfuscated while preserving reflection-accessible fields
- **Unused code**: Removed completely

### What's Preserved

- **Capacitor classes**: Required for JavaScript bridge
- **JavaScript interfaces**: Required for WebView communication
- **Native methods**: Required for platform functionality
- **Serializable classes**: Required for data persistence
- **Application/Activity classes**: Required for Android lifecycle

## Build Instructions

### Option 1: Using the Build Script (Recommended)

#### macOS/Linux:
```bash
./build-obfuscated.sh
```

#### Windows:
```cmd
build-obfuscated.bat
```

### Option 2: Manual Gradle Commands

#### Build Obfuscated AAB:
```bash
cd android
./gradlew clean bundleRelease
```

#### Build Obfuscated APK:
```bash
cd android
./gradlew clean assembleRelease
```

#### Build Both:
```bash
cd android
./gradlew clean bundleRelease assembleRelease
```

## Output Files

After building, find your files here:

### AAB (Android App Bundle)
```
android/app/build/outputs/bundle/release/app-release.aab
```

### APK (Android Package)
```
android/app/build/outputs/apk/release/app-release.apk
```

### ProGuard Mapping File (Important!)
```
android/app/build/outputs/mapping/release/mapping.txt
```

**⚠️ CRITICAL**: Save the `mapping.txt` file! You'll need it to:
- Deobfuscate crash reports from production
- Debug issues in release builds
- Understand stack traces from users

## Signing

The release builds are automatically signed using:
- **Keystore**: `android/app/divine-counter-original.keystore`
- **Key Alias**: `divine-counter-key`
- **Store Password**: Set in build.gradle
- **Key Password**: Set in build.gradle

⚠️ **Security Note**: In production, use environment variables or a secrets management system instead of hardcoding passwords.

## Verifying Obfuscation

To verify that your code is obfuscated:

1. Extract the APK: `unzip app-release.apk`
2. Decompile classes.dex using a tool like `jadx` or `apktool`
3. Check that class and method names are obfuscated (a, b, c, etc.)

### Using jadx (quick check):
```bash
# Install jadx
brew install jadx  # macOS
# or download from: https://github.com/skylot/jadx

# Decompile APK
jadx app-release.apk -d output/

# Check if classes are obfuscated
grep -r "class [a-z]" output/
```

## Troubleshooting

### Build Fails with "Missing class" Errors

This usually means ProGuard is too aggressive. Add keep rules:
```
-keep class com.your.package.** { *; }
```

### App Crashes After Obfuscation

1. Check crash logs
2. Use mapping.txt to deobfuscate stack traces
3. Add keep rules for classes referenced in crashes
4. Rebuild and test

### AAB is Too Large

- Check that `shrinkResources` is enabled
- Review ProGuard rules to remove unused code
- Check for large assets that can be optimized

## ProGuard Rules Explained

### Key Rules in `proguard-rules.pro`:

```proguard
# Enable obfuscation
-obfuscate
-printmapping mapping.txt

# Keep Capacitor classes (required for JS bridge)
-keep class com.getcapacitor.** { *; }

# Keep JavaScript interfaces (required for WebView)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep reflection-accessible classes
-keepattributes RuntimeVisibleAnnotations
```

## Building for Google Play

### AAB (Recommended)
- Use `bundleRelease` - Google Play optimizes the bundle per device
- Smaller download size for users
- Required for new apps on Play Store

### APK
- Use `assembleRelease` - Single universal APK
- Can be distributed directly or through Play Store
- Larger file size

## Best Practices

1. **Always save mapping.txt** before uploading to Play Store
2. **Test obfuscated builds** before release
3. **Keep ProGuard rules updated** when adding new dependencies
4. **Monitor crash reports** after release
5. **Version your mapping files** alongside releases

## Version Information

- **Current Version**: 1.7.7
- **Version Code**: 17
- **Build Type**: Release (Obfuscated)

## Additional Resources

- [Android Code Shrinking](https://developer.android.com/studio/build/shrink-code)
- [ProGuard Manual](https://www.guardsquare.com/manual/home)
- [R8 Configuration](https://developer.android.com/studio/build/shrink-code#keep-code)

