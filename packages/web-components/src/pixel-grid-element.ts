export type PixelData = Record<
  `${number}-${number}`,
  { n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; guess: -1 | 0 | 1 }
>;

export interface PixelChange {
  x: number;
  y: number;
  guess: -1 | 0 | 1;
  timestamp: number;
}

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
  private _container: HTMLDivElement | null = null;
  private _cellMap = new Map<string, HTMLDivElement>();
  private _lastDimensions: { columns: number; rows: number } | null = null;

  static get observedAttributes(): readonly string[] {
    return ['pixels', 'last-change'] as const;
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    console.log('attributeChangedCallback', name, newValue);
    if (name === 'pixels') {
      this.pixels = newValue ? (JSON.parse(newValue) as PixelData) : {};
    } else if (name === 'last-change' && newValue) {
      console.log('last-change', newValue);
      const change = JSON.parse(newValue) as PixelChange;
      this._applyPixelChange(change);
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
    if (!this._container) {
      this.render();
    }
  }

  private render(): void {
    const pixelKeys = Object.keys(this._pixels);
    if (pixelKeys.length === 0) {
      this._shadowRoot.replaceChildren();
      this._container = null;
      this._cellMap.clear();
      this._lastDimensions = null;
      return;
    }

    const { maxX, maxY } = this._getGridDimensions();
    const columns = maxX + 1 + 3;
    const rows = maxY + 1 + 1;

    const dimensionsChanged =
      !this._lastDimensions ||
      this._lastDimensions.columns !== columns ||
      this._lastDimensions.rows !== rows;

    if (dimensionsChanged) {
      this._lastDimensions = { columns, rows };
      this._initializeGrid(columns, rows);
    }

    this._updateCells();
  }

  private _getGridDimensions(): { maxX: number; maxY: number } {
    let maxX = 0;
    let maxY = 0;

    for (const key of Object.keys(this._pixels)) {
      const parts = key.split('-');
      const x = Number(parts[0]);
      const y = Number(parts[1]);
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    return { maxX, maxY };
  }

  private _initializeGrid(columns: number, rows: number): void {
    const style = this._createStyle(columns, rows);

    this._container = document.createElement('div');
    this._container.className = 'pixel-grid';
    this._cellMap.clear();

    const fragment = document.createDocumentFragment();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const cell = this._createCell(x, y);
        this._cellMap.set(`${x}-${y}`, cell);
        fragment.appendChild(cell);
      }
    }

    this._container.appendChild(fragment);
    this._attachEventListeners();
    this._shadowRoot.replaceChildren(style, this._container);
  }

  private _createStyle(columns: number, rows: number): HTMLStyleElement {
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
    return style;
  }

  private _createCell(x: number, y: number): HTMLDivElement {
    const cell = document.createElement('div');
    cell.className = 'pixel-cell';
    cell.dataset['x'] = x.toString();
    cell.dataset['y'] = y.toString();
    return cell;
  }

  private _updateCells(): void {
    this._cellMap.forEach((cell, key) => {
      const pixel = this._pixels[key as `${number}-${number}`];

      cell.className = 'pixel-cell';

      if (!pixel) {
        cell.classList.add('cell-transparent');
        cell.textContent = '';
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
    });
  }

  private _applyPixelChange(change: PixelChange): void {
    const key = `${change.x}-${change.y}` as unknown as `${number}-${number}`;
    const pixel = this._pixels[key];

    if (!pixel) return;

    pixel.guess = change.guess;

    const cell = this._cellMap.get(`${change.x}-${change.y}`);
    if (!cell) return;

    cell.className = 'pixel-cell';
    cell.textContent = pixel.n.toString();

    if (change.guess === -1) {
      cell.classList.add('cell-unguessed');
    } else if (change.guess === 0) {
      cell.classList.add('cell-obscur');
    } else if (change.guess === 1) {
      cell.classList.add('cell-clair');
    }
  }

  private _attachEventListeners(): void {
    if (!this._container) return;

    this._container.addEventListener('mousedown', (event) => {
      event.preventDefault();
      const mouseEvent = event;
      const target = event.target as HTMLElement;
      if (
        target.classList.contains('pixel-cell') &&
        !target.classList.contains('cell-transparent')
      ) {
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

    this._container.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }
}

export function registerPixelGridElement(): void {
  if (!customElements.get('pixel-grid')) {
    customElements.define('pixel-grid', PixelGridElement);
  }
}

registerPixelGridElement();
