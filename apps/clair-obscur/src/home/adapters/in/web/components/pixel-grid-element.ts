import type { PixelChange, PixelGridData, PixelGuess, PixelKey } from '@/home/domain/pixel-grid';
import { isTouchOnlyDevice } from '@clair-obscur-workspace/utils';

export interface PixelGridChangeEvent {
  x: number;
  y: number;
  guess: PixelGuess;
}

export interface PixelGridHoverEvent {
  x: number;
  y: number;
}

interface PixelGridElementState {
  pixelGrid: PixelGridData;
  timestamp?: number;
}

export class PixelGridElement extends HTMLElement {
  private _pixels: PixelGridElementState = {
    pixelGrid: {},
  };
  private _container: HTMLDivElement | null = null;
  private _cellMap = new Map<string, HTMLDivElement>();
  private _lastDimensions: { columns: number; rows: number } | null = null;
  private _victory = false;
  private _isTouchDevice = false;
  private _pointerStartX = 0;
  private _pointerStartY = 0;
  private _hasMoved = false;

  private getNextGuess(currentGuess: PixelGuess): PixelGuess {
    const cycle: PixelGuess[] = [-1, 1, 0];
    const currentIndex = cycle.indexOf(currentGuess);
    const nextIndex = (currentIndex + 1) % 3;
    return cycle[nextIndex];
  }

  static get observedAttributes(): readonly string[] {
    return ['pixels', 'last-change', 'victory'] as const;
  }

  constructor() {
    super();
    this._isTouchDevice = isTouchOnlyDevice();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'pixels') {
      this.pixels = JSON.parse(newValue ?? '{"pixelGrid":{}}') as PixelGridElementState;
    } else if (name === 'last-change' && newValue) {
      const change = JSON.parse(newValue) as PixelChange;
      this._applyPixelChange(change);
    } else if (name === 'victory') {
      this._victory = newValue === 'true';
      this._updateVictoryState();
    }
  }

  connectedCallback(): void {
    this.render();
  }

  get pixels(): PixelGridElementState {
    return this._pixels;
  }

  set pixels(value: PixelGridElementState) {
    this._pixels = value;

    this.render();
  }

  private render(): void {
    const pixelKeys = Object.keys(this._pixels.pixelGrid);
    if (pixelKeys.length === 0) {
      this.replaceChildren();
      this._container = null;
      this._cellMap.clear();
      this._lastDimensions = null;
      return;
    }

    const { maxX, maxY } = this._getGridDimensions();
    const columns = maxX + 1;
    const rows = maxY + 1;

    const dimensionsChanged =
      !this._lastDimensions || this._lastDimensions.columns !== columns || this._lastDimensions.rows !== rows;

    if (dimensionsChanged) {
      this._lastDimensions = { columns, rows };
      this._initializeGrid(columns, rows);
    }

    this._updateCells();
  }

  private _getGridDimensions(): { maxX: number; maxY: number } {
    let maxX = 0;
    let maxY = 0;

    for (const key of Object.keys(this._pixels.pixelGrid)) {
      const parts = key.split('-');
      const x = Number(parts[0]);
      const y = Number(parts[1]);
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    return { maxX, maxY };
  }

  private _initializeGrid(columns: number, rows: number): void {
    const gridColumns = columns + 2;
    const gridRows = rows + 2;

    this._container = document.createElement('div');
    this._container.className = 'pixel-grid';
    this._container.style.display = 'grid';
    this._container.style.gridTemplateColumns = `repeat(${gridColumns}, 25px)`;
    this._container.style.gridTemplateRows = `repeat(${gridRows}, 25px)`;
    this._container.style.gap = '0';
    this._container.style.touchAction = 'manipulation';

    this._cellMap.clear();

    const fragment = document.createDocumentFragment();

    for (let y = -1; y <= rows; y++) {
      for (let x = -1; x <= columns; x++) {
        const isBorder = x === -1 || x === columns || y === -1 || y === rows;
        const cell = this._createCell(x, y, isBorder);
        if (!isBorder) {
          this._cellMap.set(`${x}-${y}`, cell);
        }
        fragment.appendChild(cell);
      }
    }

    this._container.appendChild(fragment);
    this._attachEventListeners();
    this._updateVictoryState();
    this.replaceChildren(this._container);
  }

  private _createCell(x: number, y: number, isBorder = false): HTMLDivElement {
    const cell = document.createElement('div');
    if (isBorder) {
      cell.className = 'pixel-cell cell-transparent';
    } else {
      cell.className = 'pixel-cell';
      cell.dataset.x = x.toString();
      cell.dataset.y = y.toString();
    }
    return cell;
  }

  private _updateCells(): void {
    this._cellMap.forEach((cell, key) => {
      this._updateSingleCell(cell, key as PixelKey);
    });
  }

  private _updateSingleCell(cell: HTMLDivElement, key: PixelKey): void {
    const pixel = this._pixels.pixelGrid[key];

    if (!pixel) {
      cell.className = 'pixel-cell cell-transparent';
      cell.textContent = '';
      return;
    }

    cell.textContent = pixel.n.toString();

    if (pixel.guess === -1) {
      cell.className = 'pixel-cell cell-unguessed';
    } else if (pixel.guess === 0) {
      cell.className = 'pixel-cell cell-obscur';
    } else {
      cell.className = 'pixel-cell cell-clair';
    }
  }

  private _applyPixelChange(change: PixelChange): void {
    const key: PixelKey = `${change.x}-${change.y}`;
    const pixel = this._pixels.pixelGrid[key];

    if (!pixel) return;

    pixel.guess = change.guess;

    const cell = this._cellMap.get(key);
    if (!cell) return;

    this._updateSingleCell(cell, key);
  }

  private _updateVictoryState(): void {
    if (!this._container) return;

    if (this._victory) {
      this._container.classList.add('victory');
    } else {
      this._container.classList.remove('victory');
    }
  }

  private _attachEventListeners(): void {
    if (!this._container) return;

    if (this._isTouchDevice) {
      this._attachTouchListeners();
    } else {
      this._attachDesktopListeners();
    }
  }

  private _attachDesktopListeners(): void {
    if (!this._container) return;

    this._container.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      if (target.classList.contains('pixel-cell') && !target.classList.contains('cell-transparent')) {
        const x = Number.parseInt(target.dataset.x ?? '0', 10);
        const y = Number.parseInt(target.dataset.y ?? '0', 10);
        const pixelKey: PixelKey = `${x}-${y}`;
        const currentPixel = this._pixels.pixelGrid[pixelKey];

        if (!currentPixel) return;

        const newGuess = this.getNextGuess(currentPixel.guess);

        if (currentPixel.guess === newGuess) return;

        target.classList.add('flash');
        setTimeout(() => target.classList.remove('flash'), 150);

        this.dispatchEvent(
          new CustomEvent<PixelGridChangeEvent>('pixelclick', {
            detail: { x, y, guess: newGuess },
            composed: true,
            bubbles: true,
          }),
        );
      }
    });
  }

  private _attachTouchListeners(): void {
    if (!this._container) return;

    this._container.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    this._container.addEventListener('pointerdown', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('pixel-cell') && !target.classList.contains('cell-transparent')) {
        event.preventDefault();
        this._pointerStartX = event.clientX;
        this._pointerStartY = event.clientY;
        this._hasMoved = false;
      }
    });

    this._container.addEventListener('pointermove', (event) => {
      const moveThreshold = 10;
      const deltaX = Math.abs(event.clientX - this._pointerStartX);
      const deltaY = Math.abs(event.clientY - this._pointerStartY);

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        this._hasMoved = true;
      }
    });

    this._container.addEventListener('pointerup', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('pixel-cell') && !target.classList.contains('cell-transparent')) {
        event.preventDefault();
      }

      if (this._hasMoved) {
        this._hasMoved = false;
        return;
      }

      if (target.classList.contains('pixel-cell') && !target.classList.contains('cell-transparent')) {
        const x = Number.parseInt(target.dataset.x ?? '0', 10);
        const y = Number.parseInt(target.dataset.y ?? '0', 10);
        const pixelKey: PixelKey = `${x}-${y}`;
        const currentPixel = this._pixels.pixelGrid[pixelKey];

        if (currentPixel) {
          const newGuess = this.getNextGuess(currentPixel.guess);

          if (currentPixel.guess !== newGuess) {
            target.classList.add('flash');
            setTimeout(() => target.classList.remove('flash'), 150);

            this.dispatchEvent(
              new CustomEvent<PixelGridChangeEvent>('pixelclick', {
                detail: { x, y, guess: newGuess },
                composed: true,
                bubbles: true,
              }),
            );
          }
        }
      }

      this._hasMoved = false;
    });

    this._container.addEventListener('pointercancel', () => {
      this._hasMoved = false;
    });
  }
}

export function registerPixelGridElement(): void {
  if (!customElements.get('pixel-grid')) {
    customElements.define('pixel-grid', PixelGridElement);
  }
}

registerPixelGridElement();
