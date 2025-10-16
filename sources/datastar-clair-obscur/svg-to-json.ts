import { readFileSync, writeFileSync } from 'fs';
import { createCanvas, loadImage } from 'canvas';

interface PixelData {
  x: number;
  y: number;
  color: string;
}

async function svgToPixelArray(svgPath: string, size: number = 59): Promise<PixelData[]> {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const svgBuffer = readFileSync(svgPath);
  const img = await loadImage(svgBuffer);
  
  ctx.drawImage(img, 0, 0, size, size);
  
  const imageData = ctx.getImageData(0, 0, size, size);
  const pixels: PixelData[] = [];
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pixelIndex = (y * size + x) * 4;
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
      
      pixels.push({ x, y, color });
    }
  }
  
  return pixels;
}

async function main() {
  try {
    const pixelData = await svgToPixelArray('./toto.svg', 59);
    const jsonOutput = JSON.stringify(pixelData, null, 2);
    writeFileSync('./output.json', jsonOutput, 'utf8');
    console.log('Fichier JSON créé: output.json');
    console.log(`Nombre de pixels: ${pixelData.length}`);
  } catch (error) {
    console.error('Error processing SVG:', error);
  }
}

main();