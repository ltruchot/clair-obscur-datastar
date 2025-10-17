export interface PixelData {
  x: number;
  y: number;
  color: string;
  clairNeighbors?: number;
}

export interface PixelGridChangeEvent {
  x: number;
  y: number;
}

export class PixelGridElement extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _pixels: PixelData[] = [];
  private _hoverDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  static get observedAttributes(): readonly string[] {
    return ['pixels'] as const;
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'pixels') {
      this.pixels = newValue ? (JSON.parse(newValue) as PixelData[]) : ([] as PixelData[]);
    }
  }

  connectedCallback(): void {
    this.render();
  }

  override get shadowRoot(): ShadowRoot {
    return this._shadowRoot;
  }

  get pixels(): PixelData[] {
    return this._pixels;
  }

  set pixels(value: PixelData[]) {
    this._pixels = value;
    this.render();
  }

  private getNeighborCount(x: number, y: number): number {
    const pixelMap = new Map<string, string>();
    this._pixels.forEach((p) => pixelMap.set(`${p.x},${p.y}`, p.color));

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

  private render(): void {
    if (this._pixels.length === 0) {
      this._shadowRoot.replaceChildren();
      return;
    }

    const maxX = Math.max(...this._pixels.map((p) => p.x));
    const maxY = Math.max(...this._pixels.map((p) => p.y));
    const columns = maxX + 1;
    const rows = maxY + 1;

    const pixelMap = new Map<string, string>();
    this._pixels.forEach((p) => pixelMap.set(`${p.x},${p.y}`, p.color));

    const style = document.createElement('style');
    style.textContent = `
      .pixel-grid {
        display: grid;
        grid-template-columns: repeat(${columns}, 20px);
        grid-template-rows: repeat(${rows}, 20px);
        gap: 0;
      }
      .pixel-cell {
        width: 20px;
        height: 20px;
        border: 1px solid lightgray;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
      }
      .pixel-cell:hover {
        opacity: 0.8;
      }
    `;

    const container = document.createElement('div');
    container.className = 'pixel-grid';

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const cell = document.createElement('div');
        cell.className = 'pixel-cell';
        cell.dataset['x'] = x.toString();
        cell.dataset['y'] = y.toString();

        const pixel = this._pixels.find((p) => p.x === x && p.y === y);
        const color = pixel?.color ?? 'transparent';
        const neighborCount = pixel?.clairNeighbors ?? this.getNeighborCount(x, y);

        if (color === 'transparent') {
          cell.style.backgroundColor = '#2facc2';
        } else if (color === 'black') {
          cell.style.backgroundColor = 'lightgray';
          cell.style.color = 'black';
          cell.textContent = neighborCount.toString();
        } else if (color === 'white') {
          cell.style.backgroundColor = 'lightgray';
          cell.style.color = 'black';
          cell.textContent = neighborCount.toString();
        } else {
          cell.style.backgroundColor = color;
        }

        container.appendChild(cell);
      }
    }

    container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('pixel-cell')) {
        const x = Number.parseInt(target.dataset['x'] ?? '0', 10);
        const y = Number.parseInt(target.dataset['y'] ?? '0', 10);
        this.dispatchEvent(
          new CustomEvent<PixelGridChangeEvent>('change', {
            detail: { x, y },
            composed: true,
            bubbles: true,
          }),
        );
      }
    });

    container.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('pixel-cell')) {
        const x = Number.parseInt(target.dataset['x'] ?? '0', 10);
        const y = Number.parseInt(target.dataset['y'] ?? '0', 10);

        if (this._hoverDebounceTimer) {
          clearTimeout(this._hoverDebounceTimer);
        }

        this._hoverDebounceTimer = setTimeout(() => {
          this.dispatchEvent(
            new CustomEvent<PixelGridChangeEvent>('pixelhover', {
              detail: { x, y },
              composed: true,
              bubbles: true,
            }),
          );
          this._hoverDebounceTimer = null;
        }, 50);
      }
    });

    this._shadowRoot.replaceChildren(style, container);
  }
}

export function registerPixelGridElement(): void {
  if (!customElements.get('pixel-grid')) {
    customElements.define('pixel-grid', PixelGridElement);
  }
}

registerPixelGridElement();
