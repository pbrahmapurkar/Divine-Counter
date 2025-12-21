@echo off
echo 🎨 Setting up Android app icons for Divine Counter...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if source logo exists
if not exist "build\assets\divineCounterLogo-1024.png" (
    echo ❌ Source logo not found: build\assets\divineCounterLogo-1024.png
    echo Please ensure your logo is in the correct location.
    pause
    exit /b 1
)

echo 📦 Installing required packages...
npm install sharp

echo.
echo 🎨 Generating Android icons...
node generate-android-icons.js

echo.
echo 🔄 Syncing with Capacitor...
npx cap sync

echo.
echo ✅ Android icon setup complete!
echo.
echo 📋 Next steps:
echo 1. Open Android Studio: npx cap open android
echo 2. Build and test your app
echo 3. Check the app icon in the launcher
echo.
pause



















