const fs = require('fs');
const path = require('path');

// Android launcher icon sizes
const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const sourceLogo = 'src/assets/divineCounterLogo-1024.png';
const androidResPath = 'android/app/src/main/res';

console.log('🎨 Setting up Android launcher icons from your custom logo...\n');

// Check if source logo exists
if (!fs.existsSync(sourceLogo)) {
  console.error(`❌ Source logo not found: ${sourceLogo}`);
  process.exit(1);
}

// Create mipmap directories if they don't exist
Object.keys(iconSizes).forEach(dir => {
  const fullPath = path.join(androidResPath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${fullPath}`);
  }
});

// Create mipmap-anydpi-v26 directory for adaptive icons
const adaptiveDir = path.join(androidResPath, 'mipmap-anydpi-v26');
if (!fs.existsSync(adaptiveDir)) {
  fs.mkdirSync(adaptiveDir, { recursive: true });
  console.log(`📁 Created directory: ${adaptiveDir}`);
}

console.log('🔄 Copying source logo to all required sizes...\n');

// Copy the source logo to all mipmap directories
Object.entries(iconSizes).forEach(([dir, size]) => {
  const outputPath = path.join(androidResPath, dir, 'ic_launcher.png');
  const roundOutputPath = path.join(androidResPath, dir, 'ic_launcher_round.png');
  const foregroundPath = path.join(androidResPath, dir, 'ic_launcher_foreground.png');
  
  try {
    // Copy the source logo as ic_launcher.png
    fs.copyFileSync(sourceLogo, outputPath);
    console.log(`✅ Copied to ${dir}/ic_launcher.png`);
    
    // Copy the source logo as ic_launcher_round.png
    fs.copyFileSync(sourceLogo, roundOutputPath);
    console.log(`✅ Copied to ${dir}/ic_launcher_round.png`);
    
    // Copy the source logo as ic_launcher_foreground.png for adaptive icons
    fs.copyFileSync(sourceLogo, foregroundPath);
    console.log(`✅ Copied to ${dir}/ic_launcher_foreground.png`);
    
  } catch (error) {
    console.error(`❌ Error copying icons for ${dir}:`, error.message);
  }
});

console.log('\n🔄 Creating adaptive icon XML files...\n');

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

console.log('\n🔄 Creating background color resources...\n');

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

console.log('\n🎉 Android launcher icons setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Update AndroidManifest.xml to reference the new icons');
console.log('2. Run: npx cap sync');
console.log('3. Build your APK: npx cap build android');
console.log('\n✨ Your custom logo is now ready to be used as the app icon!');
console.log('\n⚠️  Note: The icons are currently using the full 1024x1024 resolution.');
console.log('   For production, you may want to resize them to the exact required dimensions.');








