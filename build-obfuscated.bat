@echo off
REM Build script for creating obfuscated AAB and APK files (Windows)
REM Usage: build-obfuscated.bat

echo Building obfuscated Android release...

REM Navigate to android directory
cd android

REM Clean previous builds
echo Cleaning previous builds...
call gradlew.bat clean

REM Build obfuscated AAB (Android App Bundle)
echo Building obfuscated AAB...
call gradlew.bat bundleRelease

REM Build obfuscated APK
echo Building obfuscated APK...
call gradlew.bat assembleRelease

echo.
echo Build complete! Output files:
echo.

REM Find and display output files
for /r "app\build\outputs\bundle\release" %%f in (*.aab) do (
    echo AAB: %%f
    dir "%%f"
    goto :found_aab
)
:found_aab

for /r "app\build\outputs\apk\release" %%f in (*.apk) do (
    echo APK: %%f
    dir "%%f"
    goto :found_apk
)
:found_apk

echo.
echo IMPORTANT: Save the mapping.txt file if you need to deobfuscate crash reports!
echo Location: app\build\outputs\mapping\release\mapping.txt

cd ..

