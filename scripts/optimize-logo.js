const fs = require('fs');
const path = require('path');

/**
 * Image Optimization Script for Logo Assets
 * Creates optimized logo variants for web performance
 * 
 * Generated assets:
 * - logo.webp, logo.png (compressed + optimized)
 * - logo-dark.png/webp (dark background version)
 * - favicon.ico, favicon.png
 * - apple-touch-icon.png (180x180)
 * - icon-192.png, icon-512.png (PWA icons)
 */

async function optimizeLogo() {
  try {
    // Dynamically import sharp (avoid require in ES module context)
    let sharp;
    try {
      sharp = require('sharp');
    } catch {
      console.error('❌ Sharp not installed. Install with: npm install sharp');
      console.log('Attempting minimal compression with Node.js built-in zlib...');
      return minimalOptimization();
    }

    const logoPath = path.join(__dirname, '../public/logo.png');
    const outputDir = path.join(__dirname, '../public');

    if (!fs.existsSync(logoPath)) {
      console.error('❌ Logo file not found at:', logoPath);
      process.exit(1);
    }

    console.log('🖼️  Starting logo optimization...\n');

    // Read original file
    const originalSize = fs.statSync(logoPath).size;
    console.log(`📊 Original logo size: ${(originalSize / 1024).toFixed(2)} KB`);

    // Get image metadata to understand dimensions
    const metadata = await sharp(logoPath).metadata();
    console.log(`📐 Original dimensions: ${metadata.width}x${metadata.height}`);

    // 1. Optimize PNG (compressed) - save to temp first
    console.log('✓ Creating optimized PNG...');
    const tempLogoPath = path.join(outputDir, 'logo-temp.png');
    await sharp(logoPath)
      .png({ 
        quality: 90,
        compressionLevel: 9
      })
      .toFile(tempLogoPath);
    
    // Replace original with optimized version
    fs.unlinkSync(logoPath);
    fs.renameSync(tempLogoPath, logoPath);
    const logoPngSize = fs.statSync(logoPath).size;
    console.log(`  → logo.png: ${(logoPngSize / 1024).toFixed(2)} KB (${((1 - logoPngSize/originalSize) * 100).toFixed(1)}% reduction)`);

    // 2. Create WebP (best compression for web)
    console.log('✓ Creating WebP format (best compression)...');
    await sharp(logoPath)  // Use the now-optimized logo.png
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, 'logo.webp'));
    const logoWebpSize = fs.statSync(path.join(outputDir, 'logo.webp')).size;
    console.log(`  → logo.webp: ${(logoWebpSize / 1024).toFixed(2)} KB (${((1 - logoWebpSize/originalSize) * 100).toFixed(1)}% reduction)`);

    // 3. Favicon (32x32)
    console.log('✓ Creating favicon assets...');
    await sharp(logoPath)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon.png'));
    console.log(`  → favicon.png: 32x32`);

    // 4. Apple touch icon (180x180)
    console.log('✓ Creating Apple touch icon...');
    await sharp(logoPath)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log(`  → apple-touch-icon.png: 180x180`);

    // 5. PWA Icons (192x192, 512x512)
    console.log('✓ Creating PWA icons...');
    await sharp(logoPath)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'icon-192.png'));
    console.log(`  → icon-192.png: 192x192`);

    await sharp(logoPath)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'icon-512.png'));
    console.log(`  → icon-512.png: 512x512`);

    // 6. Logo variants for different contexts
    console.log('✓ Creating logo variants...');
    
    // Logo for admin/quotations (dark background friendly)
    await sharp(logoPath)
      .resize(200, 200, { fit: 'contain', background: { r: 10, g: 22, b: 40, alpha: 1 } })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, 'logo-dark.webp'));
    console.log(`  → logo-dark.webp: 200x200`);

    // Logo for navbar (small)
    await sharp(logoPath)
      .resize(120, 120, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, 'logo-sm.webp'));
    console.log(`  → logo-sm.webp: 120x120`);

    // Logo for footer (medium)
    await sharp(logoPath)
      .resize(160, 160, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, 'logo-md.webp'));
    console.log(`  → logo-md.webp: 160x160`);

    console.log('\n✅ Logo optimization complete!');
    console.log('\n📋 Summary:');
    console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Optimized PNG: ${(logoPngSize / 1024).toFixed(2)} KB`);
    console.log(`   WebP format: ${(logoWebpSize / 1024).toFixed(2)} KB`);
    console.log(`   Total savings: ${((1 - logoPngSize/originalSize) * 100).toFixed(1)}% from PNG, ${((1 - logoWebpSize/originalSize) * 100).toFixed(1)}% from WebP\n`);

    console.log('🚀 Next steps: Update your code to use these assets:\n');
    console.log('   For navbar: <Image src="/logo-sm.webp" alt="Logo" width={120} height={120} />\n');
    console.log('   For favicon: Add to <head> in layout.js');
    console.log('   For PWA: Add icon-192.png and icon-512.png to manifest\n');

  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
}

async function minimalOptimization() {
  console.log('⚠️  Running minimal optimization without Sharp...');
  console.log('   Install Sharp for full optimization: npm install sharp');
}

// Run the script
optimizeLogo().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
