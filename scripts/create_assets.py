from PIL import Image, ImageDraw
import os
import sys

BRAND = {
    'name': 'Anjal Ventures',
    'colors': {
        'navy': (10, 22, 40),
        'gold': (245, 158, 15),
        'green': (22, 163, 74),
        'white': (255, 255, 255),
    }
}

ASSETS = [
    {'name': 'twitter-image', 'width': 1200, 'height': 675, 'desc': 'Twitter/X Card'},
    {'name': 'linkedin-image', 'width': 1200, 'height': 627, 'desc': 'LinkedIn Social Share'},
    {'name': 'hero-bg', 'width': 1920, 'height': 1080, 'desc': 'Hero Section Background'},
]

def main():
    public_dir = 'public'
    logo_path = os.path.join(public_dir, 'logo.png')
    
    if not os.path.exists(logo_path):
        print(f"Error: Logo not found at {logo_path}")
        sys.exit(1)
    
    print('\n🎨 Anjal Ventures - Asset Generator')
    print('=' * 40)
    print('\n📦 Creating assets from logo.png...\n')
    
    logo = Image.open(logo_path).convert('RGBA')
    
    for asset in ASSETS:
        name = asset['name']
        width = asset['width']
        height = asset['height']
        desc = asset['desc']
        
        print(f'📸 Creating {name} ({width}x{height})...')
        
        # Create base image with navy background
        img = Image.new('RGB', (width, height), BRAND['colors']['navy'])
        draw = ImageDraw.Draw(img)
        
        # Scale and paste logo centered
        logo_size = int(min(width, height) * 0.25)
        logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        logo_x = (width - logo_size) // 2
        logo_y = (height - logo_size) // 2
        img.paste(logo_resized, (logo_x, logo_y), logo_resized)
        
        # Add decorative accents based on asset type
        if name == 'twitter-image':
            # Side accent bars for Twitter
            draw.rectangle([(0, 0), (12, height)], fill=BRAND['colors']['gold'])
            draw.rectangle([(width - 12, 0), (width, height)], fill=BRAND['colors']['green'])
        
        elif name == 'linkedin-image':
            # Corner triangles for LinkedIn
            corner_size = 150
            draw.polygon([(0, 0), (corner_size, 0), (0, corner_size)], fill=BRAND['colors']['gold'])
            draw.polygon([(width, height), (width-corner_size, height), (width, height-corner_size)], 
                        fill=BRAND['colors']['green'])
        
        elif name == 'hero-bg':
            # Decorative circles for hero background
            overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            overlay_draw = ImageDraw.Draw(overlay)
            
            # Gold circle top-left
            overlay_draw.ellipse(
                [(int(width*0.1), int(height*0.1)), (int(width*0.4), int(height*0.4))],
                fill=BRAND['colors']['gold'] + (40,)
            )
            
            # Green circle bottom-right
            overlay_draw.ellipse(
                [(int(width*0.7), int(height*0.6)), (int(width*1.1), int(height*1.0))],
                fill=BRAND['colors']['green'] + (40,)
            )
            
            # Composite overlay onto image
            img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
        
        # Save with optimization
        output_path = os.path.join(public_dir, f'{name}.png')
        img.save(output_path, 'PNG', quality=95, optimize=True)
        
        # Get file size
        size_kb = os.path.getsize(output_path) / 1024
        print(f'  ✓ {desc}')
        print(f'    Size: {size_kb:.2f}KB\n')
    
    print('✅ All assets created successfully!\n')
    print('📁 Generated files:')
    for asset in ASSETS:
        print(f"  ✓ {asset['name']}.png ({asset['width']}x{asset['height']})")
    
    print('\n🚀 Ready to push to production!')

if __name__ == '__main__':
    main()
