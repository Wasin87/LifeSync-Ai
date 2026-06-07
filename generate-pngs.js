import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.join(process.cwd(), 'public', 'logo.svg');
const outputDir = path.join(process.cwd(), 'public');

const targets = [
  { name: 'logo-192.png', size: 192 },
  { name: 'logo-512.png', size: 512 },
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon.ico', size: 48 }, // ICO format can be a high-quality 48x48 PNG
];

async function generate() {
  console.log('Generating high-fidelity PWA & browser tab icon assets from logo.svg...');
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    for (const target of targets) {
      const outputPath = path.join(outputDir, target.name);
      await sharp(svgBuffer)
        .resize(target.size, target.size)
        .png()
        .toFile(outputPath);
      console.log(`Successfully generated ${target.name} (${target.size}x${target.size})`);
    }
    console.log('All branding assets generated and synchronized successfully!');
  } catch (error) {
    console.error('Error rasterizing SVG logo:', error);
    process.exit(1);
  }
}

generate();
