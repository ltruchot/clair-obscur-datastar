import { createCanvas, loadImage } from 'canvas';
import { readFileSync, writeFileSync } from 'fs';

interface PixelData {
  x: number;
  y: number;
  color: string;
}

function trimPixels(pixels: PixelData[]): PixelData[] {
  const nonTransparent = pixels.filter((p) => p.color !== 'transparent');

  if (nonTransparent.length === 0) {
    return [];
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of nonTransparent) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  return pixels
    .filter((p) => p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY)
    .map((p) => ({
      x: p.x - minX,
      y: p.y - minY,
      color: p.color,
    }));
}

function detectBlockSize(imageData: ImageData, canvasSize: number): number {
  const getPixelColor = (x: number, y: number): string => {
    const idx = (y * canvasSize + x) * 4;
    return `${imageData.data[idx]},${imageData.data[idx + 1]},${imageData.data[idx + 2]},${imageData.data[idx + 3]}`;
  };

  const scanLine = Math.floor(canvasSize / 2);
  const blockSizes: number[] = [];
  let lastColor = getPixelColor(0, scanLine);
  let currentBlockSize = 1;

  for (let x = 1; x < canvasSize; x++) {
    const color = getPixelColor(x, scanLine);

    if (color === lastColor) {
      currentBlockSize++;
    } else {
      if (currentBlockSize > 5) {
        blockSizes.push(currentBlockSize);
      }
      currentBlockSize = 1;
      lastColor = color;
    }
  }

  if (currentBlockSize > 5) {
    blockSizes.push(currentBlockSize);
  }

  if (blockSizes.length === 0) {
    return 1;
  }

  blockSizes.sort((a, b) => a - b);
  const median = blockSizes[Math.floor(blockSizes.length / 2)];

  return median;
}

async function svgToPixelArray(svgContent: string, forcedGridSize?: number): Promise<PixelData[]> {
  const img = await loadImage(Buffer.from(svgContent));

  const originalSize = Math.max(img.width, img.height);
  const canvas = createCanvas(originalSize, originalSize);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, originalSize, originalSize);

  const imageData = ctx.getImageData(0, 0, originalSize, originalSize);

  let gridSize: number;
  let blockSize: number;

  if (forcedGridSize) {
    gridSize = forcedGridSize;
    blockSize = Math.floor(originalSize / gridSize);
  } else {
    blockSize = detectBlockSize(imageData, originalSize);
    gridSize = blockSize > 1 ? Math.floor(originalSize / blockSize) : originalSize;
  }

  const pixels: PixelData[] = [];

  for (let gridY = 0; gridY < gridSize; gridY++) {
    for (let gridX = 0; gridX < gridSize; gridX++) {
      const centerX = Math.floor(gridX * blockSize + blockSize / 2);
      const centerY = Math.floor(gridY * blockSize + blockSize / 2);

      const pixelIndex = (centerY * originalSize + centerX) * 4;
      const r = imageData.data[pixelIndex];
      const g = imageData.data[pixelIndex + 1];
      const b = imageData.data[pixelIndex + 2];
      const a = imageData.data[pixelIndex + 3];

      let color: string;
      if (a === 0) {
        color = 'transparent';
      } else if (r === 255 && g === 255 && b === 255) {
        color = 'white';
      } else {
        color = 'black';
      }

      pixels.push({ x: gridX, y: gridY, color });
    }
  }

  return pixels;
}

async function main() {
  const args = process.argv.slice(2);
  const sizeArg = args.find((arg) => arg.startsWith('--size='));
  const shouldTrim = args.includes('--trim');
  const forcedSize = sizeArg ? parseInt(sizeArg.split('=')[1], 10) : 13;
  const filteredArgs = args.filter((arg) => !arg.startsWith('--'));
  const [inputPath, outputPath] = filteredArgs;

  if (!inputPath) {
    console.error('Usage: tsx scripts/svg-to-json.ts <input.svg> [output.json] [--size=N] [--trim]');
    console.error('Default size: 13');
    process.exit(1);
  }

  const finalOutputPath = outputPath ?? inputPath.replace(/\.svg$/, '.json');

  try {
    const svgBuffer = readFileSync(inputPath);
    const svgContent = svgBuffer.toString('utf-8');

    let svgToLoad = svgContent;
    const svgTagMatch = svgContent.match(/<svg[^>]*>/);
    if (svgTagMatch && (!svgTagMatch[0].includes('width=') || !svgTagMatch[0].includes('height='))) {
      const viewBoxMatch = svgContent.match(/viewBox="[^"]*\s+[^"]*\s+(\d+)\s+(\d+)"/);
      if (viewBoxMatch) {
        const [, width, height] = viewBoxMatch;
        svgToLoad = svgContent.replace('<svg', `<svg width="${width}" height="${height}"`);
      }
    }

    const img = await loadImage(Buffer.from(svgToLoad));
    const originalSize = Math.max(img.width, img.height);

    let pixelData = await svgToPixelArray(svgToLoad, forcedSize);

    if (shouldTrim) {
      pixelData = trimPixels(pixelData);
    }

    const jsonOutput = JSON.stringify(pixelData, null, 2);
    writeFileSync(finalOutputPath, jsonOutput, 'utf8');

    const nonTransparentCount = pixelData.filter((p) => p.color !== 'transparent').length;

    let gridWidth = 0;
    let gridHeight = 0;
    for (const p of pixelData) {
      if (p.x + 1 > gridWidth) gridWidth = p.x + 1;
      if (p.y + 1 > gridHeight) gridHeight = p.y + 1;
    }

    const canvas = createCanvas(originalSize, originalSize);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, originalSize, originalSize);
    const imageData = ctx.getImageData(0, 0, originalSize, originalSize);
    const detectedBlockSize = detectBlockSize(imageData, originalSize);

    console.log(`✓ SVG original size: ${originalSize}x${originalSize}px`);
    console.log(`✓ Grid size: ${forcedSize}x${forcedSize}`);
    console.log(`✓ Final grid: ${gridWidth}x${gridHeight}`);
    console.log(`✓ Total pixels: ${pixelData.length}`);
    console.log(`✓ Non-transparent pixels: ${nonTransparentCount}`);
    console.log(`✓ Trim: ${shouldTrim ? 'yes' : 'no'}`);
    console.log(`✓ Output written to ${finalOutputPath}`);
  } catch (error) {
    console.error('Error processing SVG:', error);
    process.exit(1);
  }
}

void main();
