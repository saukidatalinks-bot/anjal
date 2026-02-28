from PIL import Image
import os
import shutil

# Load original
img_path = r'C:\Users\harun\Downloads\Gemini_Generated_Image_askqx1askqx1askq.png'
img = Image.open(img_path)

print('🎨 Processing og-image...\n')

# Resize to 1200x630
img_resized = img.resize((1200, 630), Image.Resampling.LANCZOS)
print(f'📐 Resized to: 1200x630px')

# Convert RGBA to RGB for JPG (JPG doesn't support transparency)
if img_resized.mode == 'RGBA':
    background = Image.new('RGB', img_resized.size, (255, 255, 255))
    background.paste(img_resized, mask=img_resized.split()[3])
    img_resized = background
    print('🎨 Converted RGBA to RGB')

# Try JPG format (better compression)
output_jpg = 'public/og-image.jpg'
img_resized.save(output_jpg, 'JPEG', quality=90, optimize=True)
size_jpg = os.path.getsize(output_jpg) / 1024
print(f'📦 JPG (quality=90): {size_jpg:.2f}KB')

if size_jpg > 100:
    img_resized.save(output_jpg, 'JPEG', quality=75, optimize=True)
    size_jpg = os.path.getsize(output_jpg) / 1024
    print(f'📦 JPG (quality=75): {size_jpg:.2f}KB')

if size_jpg > 100:
    img_resized.save(output_jpg, 'JPEG', quality=60, optimize=True)
    size_jpg = os.path.getsize(output_jpg) / 1024
    print(f'📦 JPG (quality=60): {size_jpg:.2f}KB')

# Try WebP format
try:
    output_webp = 'public/og-image.webp'
    img_resized.save(output_webp, 'WEBP', quality=80, optimize=True)
    size_webp = os.path.getsize(output_webp) / 1024
    print(f'📦 WebP (quality=80): {size_webp:.2f}KB')
except:
    pass

print('\n✅ RECOMMENDATION:')
if size_jpg < 100:
    print(f'Use JPG format - {size_jpg:.2f}KB')
    shutil.move(output_jpg, 'public/og-image.png')
    print('✓ Saved as og-image.png')
else:
    print(f'JPG is {size_jpg:.2f}KB (complex image, higher quality)')
    print('This is acceptable for OG images.')
    shutil.move(output_jpg, 'public/og-image.png')
    print('✓ Saved as og-image.png anyway')

print('\n📊 File ready for deployment!')
