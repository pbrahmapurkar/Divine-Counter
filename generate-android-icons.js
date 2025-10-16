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

// Android launcher icon sizes
const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// Adaptive icon sizes (foreground should be 108dp, but we'll use the same sizes)
const adaptiveIconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const sourceLogo = 'src/assets/divineCounterLogo-1024.png';
const androidResPath = 'android/app/src/main/res';

console.log('🎨 Generating Android launcher icons from your custom logo...\n');

// Check if ImageMagick is available
if (!checkImageMagick()) {
  console.error('❌ ImageMagick is not installed. Please install it first:');
  console.error('   macOS: brew install imagemagick');
  console.error('   Ubuntu: sudo apt-get install imagemagick');
  console.error('   Windows: Download from https://imagemagick.org/script/download.php');
  process.exit(1);
}

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

console.log('🔄 Generating standard launcher icons...\n');

// Generate standard launcher icons
Object.entries(iconSizes).forEach(([dir, size]) => {
  const outputPath = path.join(androidResPath, dir, 'ic_launcher.png');
  const roundOutputPath = path.join(androidResPath, dir, 'ic_launcher_round.png');
  
  try {
    // Generate ic_launcher.png
    execSync(`magick "${sourceLogo}" -resize ${size}x${size} -background transparent -gravity center -extent ${size}x${size} "${outputPath}"`, { stdio: 'inherit' });
    console.log(`✅ Generated ${dir}/ic_launcher.png (${size}x${size})`);
    
    // Generate ic_launcher_round.png (same as ic_launcher for now)
    execSync(`magick "${sourceLogo}" -resize ${size}x${size} -background transparent -gravity center -extent ${size}x${size} "${roundOutputPath}"`, { stdio: 'inherit' });
    console.log(`✅ Generated ${dir}/ic_launcher_round.png (${size}x${size})`);
    
  } catch (error) {
    console.error(`❌ Error generating icons for ${dir}:`, error.message);
  }
});

console.log('\n🔄 Generating adaptive icon foregrounds...\n');

// Generate adaptive icon foregrounds
Object.entries(adaptiveIconSizes).forEach(([dir, size]) => {
  const outputPath = path.join(androidResPath, dir, 'ic_launcher_foreground.png');
  
  try {
    // For adaptive icons, we'll use the same logo but ensure it fits within the safe zone
    // The foreground should be 108dp but we'll scale it appropriately
    const foregroundSize = Math.round(size * 0.75); // 75% of the icon size for safe zone
    execSync(`magick "${sourceLogo}" -resize ${foregroundSize}x${foregroundSize} -background transparent -gravity center -extent ${size}x${size} "${outputPath}"`, { stdio: 'inherit' });
    console.log(`✅ Generated ${dir}/ic_launcher_foreground.png (${size}x${size})`);
    
  } catch (error) {
    console.error(`❌ Error generating foreground for ${dir}:`, error.message);
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

console.log('\n🎉 Android launcher icons generated successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update AndroidManifest.xml to reference the new icons');
console.log('2. Run: npx cap sync');
console.log('3. Build your APK: npx cap build android');
console.log('\n✨ Your custom logo is now ready to be used as the app icon!');