export type PixelData = Record<
  `${number}-${number}`,
  { n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; guess: -1 | 0 | 1 }
>;

export interface PixelGridChangeEvent {
  x: number;
  y: number;
  guess: -1 | 0 | 1;
}

export interface PixelGridHoverEvent {
  x: number;
  y: number;
}

export class PixelGridElement extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _pixels: PixelData = {};
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
      this.pixels = newValue ? (JSON.parse(newValue) as PixelData) : {};
    }
  }

  connectedCallback(): void {
    this.render();
  }

  override get shadowRoot(): ShadowRoot {
    return this._shadowRoot;
  }

  get pixels(): PixelData {
    return this._pixels;
  }

  set pixels(value: PixelData) {
    this._pixels = value;
    this.render();
  }

  private render(): void {
    const pixelKeys = Object.keys(this._pixels);
    if (pixelKeys.length === 0) {
      this._shadowRoot.replaceChildren();
      return;
    }

    const coordinates = pixelKeys.map((key): { x: number; y: number } => {
      const [x, y]: [number, number] = key.split('-').map(Number) as [number, number];
      return { x, y };
    });

    const maxX = Math.max(...coordinates.map((c) => c.x));
    const maxY = Math.max(...coordinates.map((c) => c.y));
    const columns = maxX + 1 + 3;
    const rows = maxY + 1 + 1;

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
      .pixel-cell.cell-transparent {
        cursor: default;
        background-color: #2facc2;
      }
      .pixel-cell.cell-unguessed {
        background-color: lightgray;
      }
      .pixel-cell.cell-obscur {
        background-color: black;
        color: white;
      }
      .pixel-cell.cell-clair {
        background-color: white;
        color: black;
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

        const pixelKey = `${x}-${y}`;
        const pixel = this._pixels[pixelKey as `${number}-${number}`];

        if (!pixel) {
          cell.classList.add('cell-transparent');
        } else {
          cell.textContent = pixel.n.toString();
          if (pixel.guess === -1) {
            cell.classList.add('cell-unguessed');
          } else if (pixel.guess === 0) {
            cell.classList.add('cell-obscur');
          } else if (pixel.guess === 1) {
            cell.classList.add('cell-clair');
          }
        }

        container.appendChild(cell);
      }
    }

    container.addEventListener('mousedown', (event) => {
      event.preventDefault();
      const mouseEvent = event;
      const target = event.target as HTMLElement;
      if (target.classList.contains('pixel-cell') && !target.classList.contains('cell-transparent')) {
        const x = Number.parseInt(target.dataset['x'] ?? '0', 10);
        const y = Number.parseInt(target.dataset['y'] ?? '0', 10);

        let guess: -1 | 0 | 1 = -1;
        if (mouseEvent.button === 0) {
          guess = 0;
        } else if (mouseEvent.button === 2) {
          guess = 1;
        }

        this.dispatchEvent(
          new CustomEvent<PixelGridChangeEvent>('pixelclick', {
            detail: { x, y, guess },
            composed: true,
            bubbles: true,
          }),
        );
      }
    });

    container.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    /*
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
            new CustomEvent<PixelGridHoverEvent>('pixelhover', {
              detail: { x, y },
              composed: true,
              bubbles: true,
            }),
          );
          this._hoverDebounceTimer = null;
        }, 50);
      }
    });
    */

    this._shadowRoot.replaceChildren(style, container);
  }
}

export function registerPixelGridElement(): void {
  if (!customElements.get('pixel-grid')) {
    customElements.define('pixel-grid', PixelGridElement);
  }
}

registerPixelGridElement();
