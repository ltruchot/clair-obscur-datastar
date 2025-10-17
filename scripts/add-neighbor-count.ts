import { readFileSync, writeFileSync } from 'node:fs';

interface PixelData {
  x: number;
  y: number;
  color: string;
  clairNeighbors?: number;
}

function getNeighborCount(pixelData: PixelData[], x: number, y: number): number {
  const pixelMap = new Map<string, string>();
  pixelData.forEach((p) => pixelMap.set(`${p.x},${p.y}`, p.color));

  let whiteCount = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      const neighborColor = pixelMap.get(`${nx},${ny}`);

      if (neighborColor === 'white') {
        whiteCount++;
      }
    }
  }

  return whiteCount;
}

function addNeighborCounts(inputPath: string, outputPath: string): void {
  const rawData = readFileSync(inputPath, 'utf-8');
  const pixelData = JSON.parse(rawData) as PixelData[];

  const enrichedData = pixelData
    .filter((pixel) => pixel.color !== 'transparent')
    .map((pixel) => ({
      ...pixel,
      clairNeighbors: getNeighborCount(pixelData, pixel.x, pixel.y),
    }));

  writeFileSync(outputPath, JSON.stringify(enrichedData, null, 2), 'utf-8');
  console.log(`✓ Enriched ${enrichedData.length} pixels with neighbor counts`);
  console.log(`✓ Stripped ${pixelData.length - enrichedData.length} transparent pixels`);
  console.log(`✓ Output written to ${outputPath}`);
}

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath) {
  console.error('Usage: tsx scripts/add-neighbor-count.ts <input.json> [output.json]');
  process.exit(1);
}

const finalOutputPath = outputPath ?? inputPath.replace(/\.json$/, '-enriched.json');

addNeighborCounts(inputPath, finalOutputPath);
