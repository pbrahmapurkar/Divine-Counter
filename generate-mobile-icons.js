#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if ImageMagick is installed
function checkImageMagick() {
  try {
    execSync('magick -version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    try {
      execSync('convert -version', { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Icon sizes for different platforms
const iconSizes = {
  // Android launcher icons
  android: {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
  },
  // iOS app icons
  ios: {
    'AppIcon-20': 20,
    'AppIcon-29': 29,
    'AppIcon-40': 40,
    'AppIcon-58': 58,
    'AppIcon-60': 60,
    'AppIcon-76': 76,
    'AppIcon-80': 80,
    'AppIcon-87': 87,
    'AppIcon-114': 114,
    'AppIcon-120': 120,
    'AppIcon-152': 152,
    'AppIcon-167': 167,
    'AppIcon-180': 180,
    'AppIcon-1024': 1024
  },
  // Web app icons
  web: {
    'icon-48': 48,
    'icon-72': 72,
    'icon-96': 96,
    'icon-144': 144,
    'icon-192': 192,
    'icon-512': 512
  },
  // High-res master icons
  master: {
    'icon-1024': 1024
  }
};

const sourceIcon = 'assets/icon.png';
const androidResPath = 'android/app/src/main/res';
const iosResPath = 'ios/App/App/Assets.xcassets/AppIcon.appiconset';
const webIconsPath = 'icons';
const masterIconsPath = 'assets';

console.log('🎨 Generating high-quality mobile app icons...\n');

// Check if ImageMagick is available
if (!checkImageMagick()) {
  console.error('❌ ImageMagick is not installed. Please install it first:');
  console.error('   macOS: brew install imagemagick');
  console.error('   Ubuntu: sudo apt-get install imagemagick');
  console.error('   Windows: Download from https://imagemagick.org/script/download.php');
  process.exit(1);
}

// Check if source icon exists
if (!fs.existsSync(sourceIcon)) {
  console.error(`❌ Source icon not found: ${sourceIcon}`);
  process.exit(1);
}

// Create directories if they don't exist
function createDirectories() {
  // Android directories
  Object.keys(iconSizes.android).forEach(dir => {
    const fullPath = path.join(androidResPath, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${fullPath}`);
    }
  });

  // iOS directories
  if (!fs.existsSync(iosResPath)) {
    fs.mkdirSync(iosResPath, { recursive: true });
    console.log(`📁 Created directory: ${iosResPath}`);
  }

  // Web icons directory
  if (!fs.existsSync(webIconsPath)) {
    fs.mkdirSync(webIconsPath, { recursive: true });
    console.log(`📁 Created directory: ${webIconsPath}`);
  }

  // Master icons directory
  if (!fs.existsSync(masterIconsPath)) {
    fs.mkdirSync(masterIconsPath, { recursive: true });
    console.log(`📁 Created directory: ${masterIconsPath}`);
  }

  // Android adaptive icon directory
  const adaptiveDir = path.join(androidResPath, 'mipmap-anydpi-v26');
  if (!fs.existsSync(adaptiveDir)) {
    fs.mkdirSync(adaptiveDir, { recursive: true });
    console.log(`📁 Created directory: ${adaptiveDir}`);
  }
}

// Generate Android icons
function generateAndroidIcons() {
  console.log('🔄 Generating Android launcher icons...\n');

  // Generate standard launcher icons
  Object.entries(iconSizes.android).forEach(([dir, size]) => {
    const outputPath = path.join(androidResPath, dir, 'ic_launcher.png');
    const roundOutputPath = path.join(androidResPath, dir, 'ic_launcher_round.png');
    
    try {
      // Generate ic_launcher.png with enhanced styling
      execSync(`magick "${sourceIcon}" -resize ${size}x${size} -background transparent -gravity center -extent ${size}x${size} -unsharp 0x0.75+0.75+0.008 -quality 100 "${outputPath}"`, { stdio: 'inherit' });
      console.log(`✅ Generated ${dir}/ic_launcher.png (${size}x${size})`);
      
      // Generate ic_launcher_round.png (same as ic_launcher for now)
      execSync(`magick "${sourceIcon}" -resize ${size}x${size} -background transparent -gravity center -extent ${size}x${size} -unsharp 0x0.75+0.75+0.008 -quality 100 "${roundOutputPath}"`, { stdio: 'inherit' });
      console.log(`✅ Generated ${dir}/ic_launcher_round.png (${size}x${size})`);
      
    } catch (error) {
      console.error(`❌ Error generating icons for ${dir}:`, error.message);
    }
  });

  // Generate adaptive icon foregrounds
  console.log('\n🔄 Generating adaptive icon foregrounds...\n');
  Object.entries(iconSizes.android).forEach(([dir, size]) => {
    const outputPath = path.join(androidResPath, dir, 'ic_launcher_foreground.png');
    
    try {
      // For adaptive icons, use 75% of the icon size for safe zone
      const foregroundSize = Math.round(size * 0.75);
      execSync(`magick "${sourceIcon}" -resize ${foregroundSize}x${foregroundSize} -background transparent -gravity center -extent ${size}x${size} -unsharp 0x0.75+0.75+0.008 -quality 100 "${outputPath}"`, { stdio: 'inherit' });
      console.log(`✅ Generated ${dir}/ic_launcher_foreground.png (${size}x${size})`);
      
    } catch (error) {
      console.error(`❌ Error generating foreground for ${dir}:`, error.message);
    }
  });
}

// Generate iOS icons
function generateIOSIcons() {
  console.log('\n🔄 Generating iOS app icons...\n');

  Object.entries(iconSizes.ios).forEach(([name, size]) => {
    const outputPath = path.join(iosResPath, `${name}.png`);
    
    try {
      // Generate iOS icon with enhanced styling
      execSync(`magick "${sourceIcon}" -resize ${size}x${size} -background transparent -gravity center -extent ${size}x${size} -unsharp 0x0.75+0.75+0.008 -quality 100 "${outputPath}"`, { stdio: 'inherit' });
      console.log(`✅ Generated ${name}.png (${size}x${size})`);
      
    } catch (error) {
      console.error(`❌ Error generating iOS icon ${name}:`, error.message);
    }
  });

  // Generate iOS Contents.json
  const contentsJson = {
    "images": [
      { "size": "20x20", "idiom": "iphone", "filename": "AppIcon-20.png", "scale": "2x" },
      { "size": "20x20", "idiom": "iphone", "filename": "AppIcon-40.png", "scale": "3x" },
      { "size": "29x29", "idiom": "iphone", "filename": "AppIcon-29.png", "scale": "2x" },
      { "size": "29x29", "idiom": "iphone", "filename": "AppIcon-58.png", "scale": "3x" },
      { "size": "40x40", "idiom": "iphone", "filename": "AppIcon-40.png", "scale": "2x" },
      { "size": "40x40", "idiom": "iphone", "filename": "AppIcon-60.png", "scale": "3x" },
      { "size": "60x60", "idiom": "iphone", "filename": "AppIcon-60.png", "scale": "2x" },
      { "size": "60x60", "idiom": "iphone", "filename": "AppIcon-120.png", "scale": "3x" },
      { "size": "20x20", "idiom": "ipad", "filename": "AppIcon-20.png", "scale": "1x" },
      { "size": "20x20", "idiom": "ipad", "filename": "AppIcon-40.png", "scale": "2x" },
      { "size": "29x29", "idiom": "ipad", "filename": "AppIcon-29.png", "scale": "1x" },
      { "size": "29x29", "idiom": "ipad", "filename": "AppIcon-58.png", "scale": "2x" },
      { "size": "40x40", "idiom": "ipad", "filename": "AppIcon-40.png", "scale": "1x" },
      { "size": "40x40", "idiom": "ipad", "filename": "AppIcon-80.png", "scale": "2x" },
      { "size": "76x76", "idiom": "ipad", "filename": "AppIcon-76.png", "scale": "1x" },
      { "size": "76x76", "idiom": "ipad", "filename": "AppIcon-152.png", "scale": "2x" },
      { "size": "83.5x83.5", "idiom": "ipad", "filename": "AppIcon-167.png", "scale": "2x" },
      { "size": "1024x1024", "idiom": "ios-marketing", "filename": "AppIcon-1024.png", "scale": "1x" }
    ],
    "info": {
      "author": "xcode",
      "version": 1
    }
  };

  fs.writeFileSync(path.join(iosResPath, 'Contents.json'), JSON.stringify(contentsJson, null, 2));
  console.log('✅ Created iOS Contents.json');
}

// Generate web icons
function generateWebIcons() {
  console.log('\n🔄 Generating web app icons...\n');

  Object.entries(iconSizes.web).forEach(([name, size]) => {
    const outputPath = path.join(webIconsPath, `${name}.png`);
    
    try {
      // Generate web icon with enhanced styling
      execSync(`magick "${sourceIcon}" -resize ${size}x${size} -background transparent -gravity center -extent ${size}x${size} -unsharp 0x0.75+0.75+0.008 -quality 100 "${outputPath}"`, { stdio: 'inherit' });
      console.log(`✅ Generated ${name}.png (${size}x${size})`);
      
    } catch (error) {
      console.error(`❌ Error generating web icon ${name}:`, error.message);
    }
  });
}

// Generate master icons
function generateMasterIcons() {
  console.log('\n🔄 Generating master icons...\n');

  Object.entries(iconSizes.master).forEach(([name, size]) => {
    const outputPath = path.join(masterIconsPath, `${name}.png`);
    
    try {
      // Generate master icon with enhanced styling
      execSync(`magick "${sourceIcon}" -resize ${size}x${size} -background transparent -gravity center -extent ${size}x${size} -unsharp 0x0.75+0.75+0.008 -quality 100 "${outputPath}"`, { stdio: 'inherit' });
      console.log(`✅ Generated ${name}.png (${size}x${size})`);
      
    } catch (error) {
      console.error(`❌ Error generating master icon ${name}:`, error.message);
    }
  });
}

// Create Android adaptive icon XML files
function createAndroidXMLFiles() {
  console.log('\n🔄 Creating Android adaptive icon XML files...\n');

  const adaptiveDir = path.join(androidResPath, 'mipmap-anydpi-v26');

  // Create ic_launcher.xml for adaptive icons
  const icLauncherXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;

  fs.writeFileSync(path.join(adaptiveDir, 'ic_launcher.xml'), icLauncherXml);
  console.log('✅ Created mipmap-anydpi-v26/ic_launcher.xml');

  // Create ic_launcher_round.xml for adaptive icons
  const icLauncherRoundXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;

  fs.writeFileSync(path.join(adaptiveDir, 'ic_launcher_round.xml'), icLauncherRoundXml);
  console.log('✅ Created mipmap-anydpi-v26/ic_launcher_round.xml');

  // Create colors.xml with background color
  const colorsDir = path.join(androidResPath, 'values');
  if (!fs.existsSync(colorsDir)) {
    fs.mkdirSync(colorsDir, { recursive: true });
  }

  const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>`;

  fs.writeFileSync(path.join(colorsDir, 'colors.xml'), colorsXml);
  console.log('✅ Created values/colors.xml with background color');
}

// Main execution
function main() {
  createDirectories();
  generateAndroidIcons();
  generateIOSIcons();
  generateWebIcons();
  generateMasterIcons();
  createAndroidXMLFiles();

  console.log('\n🎉 High-quality mobile app icons generated successfully!');
  console.log('\n📋 Generated files:');
  console.log('📱 Android: Launcher icons, adaptive icons, and XML files');
  console.log('🍎 iOS: App icons and Contents.json');
  console.log('🌐 Web: PWA icons for different sizes');
  console.log('🎨 Master: High-resolution source icons');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npx cap sync');
  console.log('2. Build your apps: npx cap build android && npx cap build ios');
  console.log('3. Test the icons on different devices');
  console.log('\n✨ Your app icons are now ready for production!');
}

main();


