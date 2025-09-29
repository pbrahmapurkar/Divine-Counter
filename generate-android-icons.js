#!/usr/bin/env node

/**
 * Android Icon Generator Script
 * 
 * This script helps generate Android app icons from your source logo.
 * It creates the proper sizes and places them in the correct Android folders.
 * 
 * Requirements:
 * - Node.js
 * - sharp package for image processing
 * 
 * Usage:
 * 1. npm install sharp
 * 2. node generate-android-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Sharp package not found. Please install it first:');
  console.error('npm install sharp');
  process.exit(1);
}

// Icon sizes for different densities
const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// Source logo path
const sourceLogo = path.join(__dirname, 'build', 'assets', 'divineCounterLogo-1024.png');
const androidResPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

async function generateIcons() {
  console.log('🎨 Generating Android app icons...');
  
  // Check if source logo exists
  if (!fs.existsSync(sourceLogo)) {
    console.error(`❌ Source logo not found: ${sourceLogo}`);
    console.error('Please ensure your logo is at: build/assets/divineCounterLogo-1024.png');
    process.exit(1);
  }

  try {
    // Load the source image
    const sourceImage = sharp(sourceLogo);
    const metadata = await sourceImage.metadata();
    
    console.log(`📸 Source image: ${metadata.width}x${metadata.height} pixels`);
    
    // Generate icons for each density
    for (const [folder, size] of Object.entries(iconSizes)) {
      const folderPath = path.join(androidResPath, folder);
      
      // Ensure folder exists
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      
      console.log(`📱 Generating ${size}x${size} icons for ${folder}...`);
      
      // Generate regular icon
      await sourceImage
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(path.join(folderPath, 'ic_launcher.png'));
      
      // Generate round icon (same as regular for now)
      await sourceImage
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(folderPath, 'ic_launcher_round.png'));
      
      console.log(`✅ Generated icons for ${folder}`);
    }
    
    console.log('\n🎉 Android icons generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Build your app: npm run build');
    console.log('2. Sync with Android: npx cap sync');
    console.log('3. Open in Android Studio: npx cap open android');
    console.log('4. Test the app icon on a device/emulator');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

// Run the script
generateIcons();



