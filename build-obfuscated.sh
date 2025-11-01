#!/bin/bash

# Build script for creating obfuscated AAB and APK files
# Usage: ./build-obfuscated.sh

set -e  # Exit on error

echo "🔨 Building obfuscated Android release..."

# Navigate to android directory
cd android

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build obfuscated AAB (Android App Bundle)
echo "📦 Building obfuscated AAB..."
./gradlew bundleRelease

# Build obfuscated APK
echo "📦 Building obfuscated APK..."
./gradlew assembleRelease

# Find and display output files
echo ""
echo "✅ Build complete! Output files:"
echo ""

AAB_PATH=$(find app/build/outputs/bundle/release -name "*.aab" 2>/dev/null | head -n 1)
APK_PATH=$(find app/build/outputs/apk/release -name "*.apk" 2>/dev/null | head -n 1)
MAPPING_PATH=$(find app/build/outputs/mapping/release -name "mapping.txt" 2>/dev/null | head -n 1)

if [ -n "$AAB_PATH" ]; then
    echo "📦 AAB: $AAB_PATH"
    ls -lh "$AAB_PATH"
fi

if [ -n "$APK_PATH" ]; then
    echo "📦 APK: $APK_PATH"
    ls -lh "$APK_PATH"
fi

if [ -n "$MAPPING_PATH" ]; then
    echo ""
    echo "📋 ProGuard mapping file (save for crash reports):"
    echo "   $MAPPING_PATH"
fi

echo ""
echo "✨ Done! Both obfuscated AAB and APK files are ready."
echo ""
echo "⚠️  IMPORTANT: Save the mapping.txt file if you need to deobfuscate crash reports!"

cd ..

