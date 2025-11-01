#!/usr/bin/env python3
import os
import sys
from PIL import Image

# Android launcher icon sizes
icon_sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

# Adaptive icon sizes (foreground should be 108dp, but we'll use the same sizes)
adaptive_icon_sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

source_logo = 'src/assets/divineCounterLogo-1024.png'
android_res_path = 'android/app/src/main/res'

print('🎨 Generating Android launcher icons from your custom logo...\n')

# Check if source logo exists
if not os.path.exists(source_logo):
    print(f'❌ Source logo not found: {source_logo}')
    sys.exit(1)

# Load the source image
try:
    source_image = Image.open(source_logo)
    print(f'✅ Loaded source logo: {source_image.size[0]}x{source_image.size[1]}')
except Exception as e:
    print(f'❌ Error loading source logo: {e}')
    sys.exit(1)

# Create mipmap directories if they don't exist
for dir_name in icon_sizes.keys():
    full_path = os.path.join(android_res_path, dir_name)
    os.makedirs(full_path, exist_ok=True)
    print(f'📁 Created directory: {full_path}')

# Create mipmap-anydpi-v26 directory for adaptive icons
adaptive_dir = os.path.join(android_res_path, 'mipmap-anydpi-v26')
os.makedirs(adaptive_dir, exist_ok=True)
print(f'📁 Created directory: {adaptive_dir}')

print('\n🔄 Generating standard launcher icons...\n')

# Generate standard launcher icons
for dir_name, size in icon_sizes.items():
    output_path = os.path.join(android_res_path, dir_name, 'ic_launcher.png')
    round_output_path = os.path.join(android_res_path, dir_name, 'ic_launcher_round.png')
    
    try:
        # Resize image to the required size
        resized = source_image.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save ic_launcher.png
        resized.save(output_path, 'PNG')
        print(f'✅ Generated {dir_name}/ic_launcher.png ({size}x{size})')
        
        # Save ic_launcher_round.png (same as ic_launcher for now)
        resized.save(round_output_path, 'PNG')
        print(f'✅ Generated {dir_name}/ic_launcher_round.png ({size}x{size})')
        
    except Exception as e:
        print(f'❌ Error generating icons for {dir_name}: {e}')

print('\n🔄 Generating adaptive icon foregrounds...\n')

# Generate adaptive icon foregrounds
for dir_name, size in adaptive_icon_sizes.items():
    output_path = os.path.join(android_res_path, dir_name, 'ic_launcher_foreground.png')
    
    try:
        # For adaptive icons, we'll use 75% of the icon size for safe zone
        foreground_size = int(size * 0.75)
        resized = source_image.resize((foreground_size, foreground_size), Image.Resampling.LANCZOS)
        
        # Create a transparent background of the full size
        foreground = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # Paste the resized image in the center
        x = (size - foreground_size) // 2
        y = (size - foreground_size) // 2
        foreground.paste(resized, (x, y), resized)
        
        foreground.save(output_path, 'PNG')
        print(f'✅ Generated {dir_name}/ic_launcher_foreground.png ({size}x{size})')
        
    except Exception as e:
        print(f'❌ Error generating foreground for {dir_name}: {e}')

print('\n🔄 Creating adaptive icon XML files...\n')

# Create ic_launcher.xml for adaptive icons
ic_launcher_xml = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>'''

with open(os.path.join(adaptive_dir, 'ic_launcher.xml'), 'w') as f:
    f.write(ic_launcher_xml)
print('✅ Created mipmap-anydpi-v26/ic_launcher.xml')

# Create ic_launcher_round.xml for adaptive icons
ic_launcher_round_xml = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>'''

with open(os.path.join(adaptive_dir, 'ic_launcher_round.xml'), 'w') as f:
    f.write(ic_launcher_round_xml)
print('✅ Created mipmap-anydpi-v26/ic_launcher_round.xml')

print('\n🔄 Creating background color resources...\n')

# Create colors.xml with background color
colors_dir = os.path.join(android_res_path, 'values')
os.makedirs(colors_dir, exist_ok=True)

colors_xml = '''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>'''

with open(os.path.join(colors_dir, 'colors.xml'), 'w') as f:
    f.write(colors_xml)
print('✅ Created values/colors.xml with background color')

print('\n🎉 Android launcher icons generated successfully!')
print('\n📋 Next steps:')
print('1. Update AndroidManifest.xml to reference the new icons')
print('2. Run: npx cap sync')
print('3. Build your APK: npx cap build android')
print('\n✨ Your custom logo is now ready to be used as the app icon!')















