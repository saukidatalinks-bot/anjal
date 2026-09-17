#!/usr/bin/env python3
"""
Comprehensive Brand Asset Generator for Anjal Solutions LTD
Generates all logos, favicons, PWA icons, and social graph cards
from the master architectural logo files.
"""

import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

from PIL import Image, ImageDraw, ImageFont, ImageFilter

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), '..', 'public')
MASTER_LOGO_1 = os.path.join(PUBLIC_DIR, 'new-logo-1.png')
MASTER_LOGO_2 = os.path.join(PUBLIC_DIR, 'new-logo-2.png')

# Primary brand colors
NAVY_PRIMARY = (24, 62, 99)       # #183E63 architectural blue
BG_DARK = (10, 22, 40)            # #0A1628 deep dark navy
BG_DARK_SECONDARY = (17, 34, 64)  # #112240 mid navy
WHITE = (255, 255, 255)
ACCENT_GREEN = (22, 163, 74)      # #16A34A emerald
ACCENT_GOLD = (201, 168, 76)      # #C9A84C gold
SLATE_400 = (148, 163, 184)

def extract_transparent_mark():
    """Extracts the architectural mark with transparent alpha."""
    im2 = Image.open(MASTER_LOGO_2).convert('RGB')
    # Bounding box of the mark in master 2: (510, 85, 897, 483)
    crop_box = (510, 85, 897, 483)
    mark = im2.crop(crop_box)
    
    bg_r, bg_g, bg_b = 252.0, 251.0, 246.0
    fg_r, fg_g, fg_b = float(NAVY_PRIMARY[0]), float(NAVY_PRIMARY[1]), float(NAVY_PRIMARY[2])
    
    out = Image.new('RGBA', mark.size, (0, 0, 0, 0))
    mpix = mark.load()
    opix = out.load()
    
    max_dist = ((fg_r - bg_r)**2 + (fg_g - bg_g)**2 + (fg_b - bg_b)**2)**0.5
    
    for y in range(mark.size[1]):
        for x in range(mark.size[0]):
            r, g, b = mpix[x, y]
            dist = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
            alpha = min(255, max(0, int((dist / max_dist) * 255 * 1.1)))
            if alpha < 14:
                opix[x, y] = (0, 0, 0, 0)
            else:
                opix[x, y] = (int(fg_r), int(fg_g), int(fg_b), alpha)
                
    # Trim empty borders
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
        
    return out

def extract_transparent_full_lockup():
    """Extracts the full lockup (mark + company name + subtitle)."""
    im2 = Image.open(MASTER_LOGO_2).convert('RGB')
    crop_box = (360, 85, 1048, 685)
    cropped = im2.crop(crop_box)
    
    bg_r, bg_g, bg_b = 252.0, 251.0, 246.0
    fg_r, fg_g, fg_b = float(NAVY_PRIMARY[0]), float(NAVY_PRIMARY[1]), float(NAVY_PRIMARY[2])
    
    out = Image.new('RGBA', cropped.size, (0, 0, 0, 0))
    cpix = cropped.load()
    opix = out.load()
    
    max_dist = ((fg_r - bg_r)**2 + (fg_g - bg_g)**2 + (fg_b - bg_b)**2)**0.5
    
    for y in range(cropped.size[1]):
        for x in range(cropped.size[0]):
            r, g, b = cpix[x, y]
            dist = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
            alpha = min(255, max(0, int((dist / max_dist) * 255 * 1.1)))
            if alpha < 14:
                opix[x, y] = (0, 0, 0, 0)
            else:
                opix[x, y] = (int(fg_r), int(fg_g), int(fg_b), alpha)
                
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
        
    return out

def invert_to_white(rgba_img):
    """Turns any colored transparent image into pure white with same alpha."""
    r, g, b, a = rgba_img.split()
    white_plane = Image.new('L', rgba_img.size, 255)
    return Image.merge('RGBA', (white_plane, white_plane, white_plane, a))

def fit_in_square(rgba_img, canvas_size=512, padding_pct=0.10):
    """Places an image inside a square transparent canvas with padding."""
    canvas = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    max_dim = int(canvas_size * (1.0 - 2 * padding_pct))
    
    w, h = rgba_img.size
    scale = min(max_dim / w, max_dim / h)
    new_w, new_h = int(w * scale), int(h * scale)
    
    resized = rgba_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    pos_x = (canvas_size - new_w) // 2
    pos_y = (canvas_size - new_h) // 2
    
    canvas.paste(resized, (pos_x, pos_y), resized)
    return canvas

def generate_social_card(width, height, title_sub, mark_img_white, full_img_white):
    """Generates a high-end social preview image (OpenGraph / Twitter / LinkedIn)."""
    card = Image.new('RGB', (width, height), BG_DARK)
    draw = ImageDraw.Draw(card)
    
    # Modern gradient background simulation
    for y in range(height):
        ratio = y / height
        r = int(BG_DARK[0] * (1 - ratio * 0.4) + BG_DARK_SECONDARY[0] * (ratio * 0.4))
        g = int(BG_DARK[1] * (1 - ratio * 0.4) + BG_DARK_SECONDARY[1] * (ratio * 0.4))
        b = int(BG_DARK[2] * (1 - ratio * 0.4) + BG_DARK_SECONDARY[2] * (ratio * 0.4))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    # Top accent line (dual gradient emerald and blue)
    half_w = width // 2
    draw.rectangle([(0, 0), (half_w, 6)], fill=ACCENT_GREEN)
    draw.rectangle([(half_w, 0), (width, 6)], fill=(0, 113, 227)) # apple-blue
    
    # Subtle geometric tech grid / watermarks
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    # Draw faint grid dots
    grid_gap = 48
    for gx in range(40, width - 40, grid_gap):
        for gy in range(40, height - 40, grid_gap):
            ov_draw.ellipse([(gx, gy), (gx + 2, gy + 2)], fill=(255, 255, 255, 18))
            
    # Right-side large watermark of the architectural logo
    watermark_size = int(height * 0.85)
    watermark = mark_img_white.resize((watermark_size, watermark_size), Image.Resampling.LANCZOS)
    wm_r, wm_g, wm_b, wm_a = watermark.split()
    # Dim the watermark alpha
    wm_a = wm_a.point(lambda p: int(p * 0.08))
    watermark_faint = Image.merge('RGBA', (wm_r, wm_g, wm_b, wm_a))
    wm_x = width - watermark_size + int(width * 0.04)
    wm_y = (height - watermark_size) // 2
    overlay.paste(watermark_faint, (wm_x, wm_y), watermark_faint)
    
    # Composite overlay
    card = Image.alpha_composite(card.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(card)
    
    # Left Content layout
    margin_left = int(width * 0.08)
    
    # Brand Full Lockup on the left
    lockup_h = int(height * 0.38)
    aspect = full_img_white.size[0] / full_img_white.size[1]
    lockup_w = int(lockup_h * aspect)
    lockup_resized = full_img_white.resize((lockup_w, lockup_h), Image.Resampling.LANCZOS)
    
    lockup_y = int(height * 0.16)
    card.paste(lockup_resized, (margin_left, lockup_y), lockup_resized)
    
    # Headline / Tagline below lockup
    # Load fonts or use clean drawn layout
    try:
        font_title = ImageFont.truetype("arial.ttf", 34)
        font_sub = ImageFont.truetype("arial.ttf", 22)
        font_meta = ImageFont.truetype("arialbd.ttf", 18)
        font_tag = ImageFont.truetype("arial.ttf", 16)
    except:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_meta = ImageFont.load_default()
        font_tag = ImageFont.load_default()
        
    draw = ImageDraw.Draw(card)
    
    text_y = lockup_y + lockup_h + 36
    draw.text((margin_left, text_y), "Enterprise Software • Digital Infrastructure", fill=WHITE, font=font_title)
    
    text_y += 46
    draw.text((margin_left, text_y), "Web Platforms • Mobile Applications • Cloud SaaS", fill=SLATE_400, font=font_sub)
    
    # Bottom badges: CAC status & domain
    bottom_y = height - 70
    
    # CAC badge pill
    badge_text = "CAC Registered · CAMA 2020 (RC 9854225)"
    badge_bg = (17, 34, 64)
    draw.rounded_rectangle([(margin_left, bottom_y), (margin_left + 360, bottom_y + 36)], radius=8, fill=badge_bg, outline=ACCENT_GREEN, width=1)
    # Green status dot
    draw.ellipse([(margin_left + 14, bottom_y + 13), (margin_left + 24, bottom_y + 23)], fill=ACCENT_GREEN)
    draw.text((margin_left + 34, bottom_y + 9), badge_text, fill=WHITE, font=font_tag)
    
    # Domain on right
    domain_text = "anjalsolutionsltd.com"
    draw.text((width - margin_left - 200, bottom_y + 9), domain_text, fill=SLATE_400, font=font_tag)
    
    return card

def generate_hero_bg(width, height, mark_img_white):
    """Generates an executive-grade 1920x1080 hero background with ambient mesh and architectural watermark."""
    bg = Image.new('RGB', (width, height), BG_DARK)
    draw = ImageDraw.Draw(bg)
    
    # Subtle dark gradient
    for y in range(height):
        ratio = y / height
        r = int(BG_DARK[0] * (1 - ratio * 0.3) + BG_DARK_SECONDARY[0] * (ratio * 0.3))
        g = int(BG_DARK[1] * (1 - ratio * 0.3) + BG_DARK_SECONDARY[1] * (ratio * 0.3))
        b = int(BG_DARK[2] * (1 - ratio * 0.3) + BG_DARK_SECONDARY[2] * (ratio * 0.3))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    # Elegant grid dots
    grid_gap = 64
    for gx in range(40, width, grid_gap):
        for gy in range(40, height, grid_gap):
            ov_draw.ellipse([(gx, gy), (gx + 2, gy + 2)], fill=(255, 255, 255, 12))
            
    # Ambient glows
    # Cyan/blue ambient circle top-left
    ov_draw.ellipse([(int(width * 0.05), int(height * 0.1)), (int(width * 0.35), int(height * 0.6))], fill=(24, 62, 99, 45))
    # Emerald ambient circle bottom-right
    ov_draw.ellipse([(int(width * 0.6), int(height * 0.5)), (int(width * 0.95), int(height * 1.05))], fill=(22, 163, 74, 25))
    
    # Large architectural watermark on right side
    wm_size = int(height * 0.9)
    wm = mark_img_white.resize((wm_size, wm_size), Image.Resampling.LANCZOS)
    wm_r, wm_g, wm_b, wm_a = wm.split()
    wm_a = wm_a.point(lambda p: int(p * 0.06)) # ultra subtle watermark
    wm_faint = Image.merge('RGBA', (wm_r, wm_g, wm_b, wm_a))
    
    wm_x = width - wm_size - 40
    wm_y = (height - wm_size) // 2
    overlay.paste(wm_faint, (wm_x, wm_y), wm_faint)
    
    composite = Image.alpha_composite(bg.convert('RGBA'), overlay).convert('RGB')
    return composite

def main():
    print("🚀 Starting Anjal Solutions LTD Asset Build...")
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    
    # Step 1: Extract master mark and master lockup
    print("✓ Extracting transparent architectural mark...")
    mark_raw = extract_transparent_mark()
    mark_white = invert_to_white(mark_raw)
    
    print("✓ Extracting transparent full lockup...")
    lockup_raw = extract_transparent_full_lockup()
    lockup_white = invert_to_white(lockup_raw)
    
    # Step 2: Primary Logo files (logo.png, logo.webp)
    print("✓ Building logo.png & logo.webp (512x512)...")
    logo_square = fit_in_square(mark_raw, 512, padding_pct=0.08)
    logo_square.save(os.path.join(PUBLIC_DIR, 'logo.png'), 'PNG', optimize=True)
    logo_square.save(os.path.join(PUBLIC_DIR, 'logo.webp'), 'WEBP', quality=95)
    
    # Step 3: Dark Background Variants (logo-dark.png & logo-dark.webp)
    print("✓ Building logo-dark.png & logo-dark.webp (512x512)...")
    logo_dark_square = fit_in_square(mark_white, 512, padding_pct=0.08)
    logo_dark_square.save(os.path.join(PUBLIC_DIR, 'logo-dark.png'), 'PNG', optimize=True)
    logo_dark_square.save(os.path.join(PUBLIC_DIR, 'logo-dark.webp'), 'WEBP', quality=95)
    
    # Step 4: Full Lockup Files (logo-full.png, logo-full.webp, logo-full-dark.webp)
    print("✓ Building logo-full.png & logo-full.webp...")
    lockup_raw.save(os.path.join(PUBLIC_DIR, 'logo-full.png'), 'PNG', optimize=True)
    lockup_raw.save(os.path.join(PUBLIC_DIR, 'logo-full.webp'), 'WEBP', quality=95)
    lockup_white.save(os.path.join(PUBLIC_DIR, 'logo-full-dark.png'), 'PNG', optimize=True)
    lockup_white.save(os.path.join(PUBLIC_DIR, 'logo-full-dark.webp'), 'WEBP', quality=95)
    
    # Step 5: Responsive sizes for <picture> tags (logo-sm, logo-md)
    print("✓ Building logo-sm.webp (120x120) & logo-md.webp (160x160)...")
    logo_sm = fit_in_square(mark_raw, 120, padding_pct=0.08)
    logo_sm.save(os.path.join(PUBLIC_DIR, 'logo-sm.webp'), 'WEBP', quality=90)
    
    logo_md = fit_in_square(mark_raw, 160, padding_pct=0.08)
    logo_md.save(os.path.join(PUBLIC_DIR, 'logo-md.webp'), 'WEBP', quality=90)
    
    # Dark responsive variants
    logo_sm_dark = fit_in_square(mark_white, 120, padding_pct=0.08)
    logo_sm_dark.save(os.path.join(PUBLIC_DIR, 'logo-sm-dark.webp'), 'WEBP', quality=90)
    
    logo_md_dark = fit_in_square(mark_white, 160, padding_pct=0.08)
    logo_md_dark.save(os.path.join(PUBLIC_DIR, 'logo-md-dark.webp'), 'WEBP', quality=90)
    
    # Step 6: Favicons & Apple Touch Icon
    print("✓ Building favicon.ico (16, 32, 48)...")
    fav_16 = fit_in_square(mark_raw, 16, padding_pct=0.02)
    fav_32 = fit_in_square(mark_raw, 32, padding_pct=0.04)
    fav_48 = fit_in_square(mark_raw, 48, padding_pct=0.04)
    
    fav_32.save(os.path.join(PUBLIC_DIR, 'favicon.png'), 'PNG', optimize=True)
    # Save multi-resolution .ico
    fav_48.save(
        os.path.join(PUBLIC_DIR, 'favicon.ico'),
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    
    print("✓ Building apple-touch-icon.png (180x180)...")
    # Apple Touch Icon with executive deep-navy background and crisp white mark
    apple_icon = Image.new('RGB', (180, 180), BG_DARK)
    apple_mark = fit_in_square(mark_white, 180, padding_pct=0.14)
    apple_icon.paste(apple_mark, (0, 0), apple_mark)
    apple_icon.save(os.path.join(PUBLIC_DIR, 'apple-touch-icon.png'), 'PNG', optimize=True)
    
    # Step 7: PWA Icons (192x192, 512x512)
    print("✓ Building icon-192.png & icon-512.png...")
    # PWA standard: crisp deep-navy badge
    pwa_192 = Image.new('RGB', (192, 192), BG_DARK)
    mark_192 = fit_in_square(mark_white, 192, padding_pct=0.14)
    pwa_192.paste(mark_192, (0, 0), mark_192)
    pwa_192.save(os.path.join(PUBLIC_DIR, 'icon-192.png'), 'PNG', optimize=True)
    
    pwa_512 = Image.new('RGB', (512, 512), BG_DARK)
    mark_512 = fit_in_square(mark_white, 512, padding_pct=0.14)
    pwa_512.paste(mark_512, (0, 0), mark_512)
    pwa_512.save(os.path.join(PUBLIC_DIR, 'icon-512.png'), 'PNG', optimize=True)
    
    # Step 8: Social Graph Cards
    print("✓ Building OpenGraph Card og-image.png (1200x630)...")
    og_card = generate_social_card(1200, 630, "OpenGraph", mark_white, lockup_white)
    og_card.save(os.path.join(PUBLIC_DIR, 'og-image.png'), 'PNG', quality=95, optimize=True)
    og_card.save(os.path.join(PUBLIC_DIR, 'og-image.webp'), 'WEBP', quality=90)
    
    print("✓ Building Twitter Card twitter-image.png (1200x675)...")
    tw_card = generate_social_card(1200, 675, "Twitter", mark_white, lockup_white)
    tw_card.save(os.path.join(PUBLIC_DIR, 'twitter-image.png'), 'PNG', quality=95, optimize=True)
    
    print("✓ Building LinkedIn Banner linkedin-image.png (1200x627)...")
    li_card = generate_social_card(1200, 627, "LinkedIn", mark_white, lockup_white)
    li_card.save(os.path.join(PUBLIC_DIR, 'linkedin-image.png'), 'PNG', quality=95, optimize=True)
    
    # Step 9: Hero Background (hero-bg.png 1920x1080)
    print("✓ Building modern hero-bg.png (1920x1080)...")
    hero_bg = generate_hero_bg(1920, 1080, mark_white)
    hero_bg.save(os.path.join(PUBLIC_DIR, 'hero-bg.png'), 'PNG', quality=90, optimize=True)
    
    print("\n🎉 ALL BRAND ASSETS SUCCESSFULLY GENERATED!")

if __name__ == '__main__':
    main()
