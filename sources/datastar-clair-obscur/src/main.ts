import './style.css';

interface PixelData {
  x: number;
  y: number;
  color: string;
}

async function loadPixelData(): Promise<PixelData[]> {
  const response = await fetch('./output.json');
  return await response.json();
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

function createPixelGrid(pixelData: PixelData[]): void {
  const app = document.querySelector<HTMLDivElement>('#app')!;

  const container = document.createElement('div');
  container.className = 'pixel-grid';
  container.style.cssText = `
    display: grid;
    grid-template-columns: repeat(59, 12px);
    grid-template-rows: repeat(59, 12px);
    gap: 0;
  `;

  pixelData.forEach((pixel) => {
    const div = document.createElement('div');

    let backgroundColor = '';
    let textContent = '';
    let textColor = 'black';
    let actualColor = pixel.color;

    if (pixel.color === 'transparent') {
      backgroundColor = 'lightgray';
    } else if (pixel.color === 'black') {
      backgroundColor = 'gray';
      textContent = getNeighborCount(pixelData, pixel.x, pixel.y).toString();
    } else {
      backgroundColor = 'gray';
      textContent = getNeighborCount(pixelData, pixel.x, pixel.y).toString();
    }

    div.style.cssText = `
      width: 12px;
      height: 12px;
      background-color: ${backgroundColor};
      color: ${textColor};
      border: 1px solid lightgray;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      font-weight: bold;
      grid-column: ${pixel.x + 1};
      grid-row: ${pixel.y + 1};
      cursor: ${pixel.color !== 'transparent' ? 'pointer' : 'default'};
    `;

    if (textContent) {
      div.textContent = textContent;
    }

    // Store actual color for click reveal
    if (actualColor !== 'transparent') {
      div.dataset.actualColor = actualColor;
      div.addEventListener('click', () => {
        if (actualColor === 'black') {
          div.style.backgroundColor = 'black';
          div.style.color = 'white';
        } else {
          div.style.backgroundColor = 'white';
          div.style.color = 'black';
        }
      });
    }

    container.appendChild(div);
  });

  app.appendChild(container);
}

async function init() {
  try {
    const pixelData = await loadPixelData();
    createPixelGrid(pixelData);
  } catch (error) {
    console.error('Error loading pixel data:', error);
  }
}

init();
