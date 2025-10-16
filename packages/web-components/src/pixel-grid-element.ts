export interface PixelData {
  x: number;
  y: number;
  color: string;
}

export interface PixelGridChangeEvent {
  x: number;
  y: number;
}

export class PixelGridElement extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _pixels: PixelData[] = [];

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
        border: 1px solid #ddd;
        box-sizing: border-box;
        cursor: pointer;
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

        const color = pixelMap.get(`${x},${y}`) ?? 'transparent';

        if (color === 'transparent') {
          cell.style.backgroundColor = 'lightgray';
        } else if (color === 'black') {
          cell.style.backgroundColor = 'gray';
        } else if (color === 'white') {
          cell.style.backgroundColor = 'white';
        } else {
          cell.style.backgroundColor = color;
        }

        cell.addEventListener('click', () => {
          this.dispatchEvent(
            new CustomEvent<PixelGridChangeEvent>('change', {
              detail: { x, y },
              composed: true,
              bubbles: true,
            }),
          );
        });

        container.appendChild(cell);
      }
    }

    this._shadowRoot.replaceChildren(style, container);
  }
}

export function registerPixelGridElement(): void {
  if (!customElements.get('pixel-grid')) {
    customElements.define('pixel-grid', PixelGridElement);
  }
}

registerPixelGridElement();
