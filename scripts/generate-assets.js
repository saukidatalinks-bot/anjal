#!/usr/bin/env node

/**
 * Asset Generator Script
 * Generates all required social media and web assets from your logo
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ ERROR: "sharp" package not found');
  console.log('Install it with: npm install sharp --save-dev');
  process.exit(1);
}

// Configuration
const CONFIG = {
  brand: {
    name: 'Anjal Ventures',
    tagline: 'Web • Mobile • AI Solutions',
    domain: 'anjalventures.com',
    colors: {
      navy: '#0A1628',
      gold: '#F59E0B',
      green: '#16A34A',
      white: '#FFFFFF',
      lightGray: '#F3F4F6',
    },
  },
  assets: [
    {
      name: 'og-image',
      width: 1200,
      height: 630,
      desc: 'Open Graph / Facebook',
    },
    {
      name: 'twitter-image',
      width: 1200,
      height: 675,
      desc: 'Twitter/X Card',
    },
    {
      name: 'linkedin-image',
      width: 1200,
      height: 627,
      desc: 'LinkedIn',
    },
    {
      name: 'hero-bg',
      width: 1920,
      height: 1080,
      desc: 'Hero Section Background',
    },
  ],
};

// Create base directory structure with Canvas library
async function createCanvasSVG(width, height) {
  // Using SVG as base since we can't use Node Canvas without system dependencies
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');
    </style>
  </defs>
</svg>`;
}

// Generate assets using node-canvas alternative (SVG to PNG conversion)
async function generateAssets() {
  console.log('\n🎨 Anjal Ventures - Asset Generator');
  console.log('====================================\n');

  const publicDir = path.join(__dirname, '../public');
  const logoPath = path.join(publicDir, 'logo.png');
  const outputDir = publicDir;

  // Check if logo exists
  if (!fs.existsSync(logoPath)) {
    console.error('❌ ERROR: Logo file not found at:', logoPath);
    console.log('\nAvailable logo files:');
    const files = fs.readdirSync(publicDir).filter(f => f.includes('logo') || f.includes('icon'));
    files.forEach(f => console.log(`  - ${f}`));
    process.exit(1);
  }

  console.log('✅ Logo found:', logoPath);
  console.log(`\n📦 Generating ${CONFIG.assets.length} assets...\n`);

  try {
    // Load the logo
    const logoBuffer = fs.readFileSync(logoPath);
    const logoMetadata = await sharp(logoBuffer).metadata();
    
    console.log(`Logo dimensions: ${logoMetadata.width}x${logoMetadata.height}px`);
    console.log(`Logo format: ${logoMetadata.format}\n`);

    // Generate each asset
    for (const asset of CONFIG.assets) {
      await generateAsset(asset, logoBuffer, outputDir);
    }

    console.log('\n✅ All assets generated successfully!\n');
    console.log('📁 Generated files:');
    CONFIG.assets.forEach(asset => {
      console.log(`  - public/${asset.name}.png (${asset.width}x${asset.height}) - ${asset.desc}`);
    });

    console.log('\n📊 File sizes:');
    for (const asset of CONFIG.assets) {
      const filePath = path.join(outputDir, `${asset.name}.png`);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  - ${asset.name}.png: ${sizeKB}KB`);
      }
    }

    console.log('\n🚀 Next steps:');
    console.log('1. Review generated images in /public directory');
    console.log('2. Update your meta tags in app/layout.js if needed');
    console.log('3. Test social sharing (og-image, twitter-image, linkedin-image)');
    console.log('4. Deploy to production!\n');

  } catch (error) {
    console.error('❌ Error generating assets:', error.message);
    process.exit(1);
  }
}

async function generateAsset(asset, logoBuffer, outputDir) {
  const { name, width, height, desc } = asset;
  
  console.log(`📸 Generating ${name} (${width}x${height})...`);

  try {
    // Create SVG with logo and text
    const svg = createAssetSVG(name, width, height, logoBuffer);
    
    // Convert SVG to PNG using sharp
    const image = sharp({
      create: {
        width,
        height,
        channels: 3,
        background: CONFIG.brand.colors.navy,
      },
    });

    // Add gradient background
    const svgBuffer = Buffer.from(svg);
    
    let pipeline = sharp(logoBuffer)
      .resize(Math.min(width, height) * 0.3, Math.min(width, height) * 0.3, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png();

    // Create composite with background
    const bgImage = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: CONFIG.brand.colors.navy,
      },
    }).png().toBuffer();

    // Resize logo for the asset
    const logoResized = await sharp(logoBuffer)
      .resize(Math.floor(width * 0.25), Math.floor(height * 0.25), {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();

    // Create final image by compositing
    const finalImage = await sharp(bgImage)
      .composite([
        {
          input: logoResized,
          top: Math.floor((height - Math.floor(height * 0.25)) / 2),
          left: Math.floor((width - Math.floor(width * 0.25)) / 2),
          blend: 'over',
        },
      ])
      .png({ quality: 90, progressive: true })
      .toFile(path.join(outputDir, `${name}.png`));

    console.log(`  ✓ ${desc} - ${finalImage.size} bytes`);
  } catch (error) {
    console.error(`  ✗ Failed: ${error.message}`);
    throw error;
  }
}

function createAssetSVG(name, width, height, logoBuffer) {
  const colors = CONFIG.brand.colors;
  const centerY = height / 2;
  const centerX = width / 2;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with gradient -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.navy};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#051220;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bgGradient)" />`;

  // Add accent elements based on asset type
  if (name === 'og-image') {
    svg += `
  <!-- Top accent bar -->
  <rect x="0" y="0" width="${width}" height="8" fill="${colors.gold}" />
  
  <!-- Bottom accent bar -->
  <rect x="0" y="${height - 8}" width="${width}" height="8" fill="${colors.green}" />`;
  } else if (name === 'twitter-image') {
    svg += `
  <!-- Side accents -->
  <rect x="0" y="0" width="12" height="${height}" fill="${colors.gold}" />
  <rect x="${width - 12}" y="0" width="12" height="${height}" fill="${colors.green}" />`;
  } else if (name === 'linkedin-image') {
    svg += `
  <!-- Corner accent -->
  <polygon points="0,0 ${width * 0.15},0 0,${height * 0.15}" fill="${colors.gold}" opacity="0.8" />
  <polygon points="${width},${height} ${width - width * 0.15},${height} ${width},${height - height * 0.15}" fill="${colors.green}" opacity="0.8" />`;
  } else if (name === 'hero-bg') {
    svg += `
  <!-- Decorative circles -->
  <circle cx="${width * 0.2}" cy="${height * 0.2}" r="${width * 0.15}" fill="${colors.gold}" opacity="0.1" />
  <circle cx="${width * 0.8}" cy="${height * 0.8}" r="${width * 0.2}" fill="${colors.green}" opacity="0.1" />
  <circle cx="${width * 0.9}" cy="${height * 0.3}" r="${width * 0.12}" fill="${colors.navy}" opacity="0.1" />`;
  }

  svg += `
</svg>`;

  return svg;
}

// Run if called directly
if (require.main === module) {
  generateAssets().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateAssets };
