#!/bin/bash

echo "🎨 Setting up Android app icons for Divine Counter..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if source logo exists
if [ ! -f "build/assets/divineCounterLogo-1024.png" ]; then
    echo "❌ Source logo not found: build/assets/divineCounterLogo-1024.png"
    echo "Please ensure your logo is in the correct location."
    exit 1
fi

echo "📦 Installing required packages..."
npm install sharp

echo
echo "🎨 Generating Android icons..."
node generate-android-icons.js

echo
echo "🔄 Syncing with Capacitor..."
npx cap sync

echo
echo "✅ Android icon setup complete!"
echo
echo "📋 Next steps:"
echo "1. Open Android Studio: npx cap open android"
echo "2. Build and test your app"
echo "3. Check the app icon in the launcher"
echo



















