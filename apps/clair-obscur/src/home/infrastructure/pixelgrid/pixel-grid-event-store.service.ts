import type { PixelChange, PixelData, PixelGridData } from '@/home/domain/pixel-grid';
import type {
  PixelGridStoreState,
  PixelGridStoreSubscriber,
  PixelLastChangeSubscriber,
  PixelUpdate,
} from './pixel-grid-event-store.types';

export class PixelGridEventStore {
  private state: PixelGridStoreState = {
    pixelGrid: {},
  };

  private basePixelGrid: PixelGridData = {};

  private subscribers = new Map<string, PixelGridStoreSubscriber>();

  private lastChangeSubscribers = new Map<string, PixelLastChangeSubscriber>();

  private resetTimeoutId: NodeJS.Timeout | null = null;

  initialize(basePixelData: PixelData): void {
    const pixelGrid: PixelGridData = {};

    for (const [key, value] of Object.entries(basePixelData)) {
      pixelGrid[key as `${number}-${number}`] = {
        ...value,
        guess: -1,
      };
    }
    this.basePixelGrid = structuredClone(pixelGrid);
    this.state.pixelGrid = pixelGrid;
  }

  reset(): void {
    if (this.resetTimeoutId !== null) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
    this.state.pixelGrid = structuredClone(this.basePixelGrid);
    this.notifySubscribers();
  }

  cheat(): void {
    const cheatedPixelGrid: PixelGridData = structuredClone(this.state.pixelGrid);
    for (const [key, currentPixel] of Object.entries(this.state.pixelGrid)) {
      cheatedPixelGrid[key as `${number}-${number}`] = {
        ...currentPixel,
        guess: currentPixel.guess === currentPixel.v ? currentPixel.guess : -1,
      };
    }
    this.state.pixelGrid = cheatedPixelGrid;
    this.notifySubscribers();
  }

  win(): void {
    const wonPixelGrid: PixelGridData = structuredClone(this.state.pixelGrid);
    for (const [key, currentPixel] of Object.entries(this.state.pixelGrid)) {
      wonPixelGrid[key as `${number}-${number}`] = {
        ...currentPixel,
        guess: currentPixel.v,
      };
    }
    wonPixelGrid['30-1'].guess = 1;
    this.state.pixelGrid = wonPixelGrid;
    this.notifySubscribers();
  }

  updatePixel(update: PixelUpdate): void {
    const key: `${number}-${number}` = `${update.x}-${update.y}`;
    const currentPixel = this.state.pixelGrid[key];

    if (!currentPixel) {
      return;
    }

    currentPixel.guess = update.guess;

    this.notifyLastChangeSubscribers({
      x: update.x,
      y: update.y,
      guess: update.guess,
    });
  }

  read(): PixelGridStoreState {
    return this.state;
  }

  subscribe(sessionId: string, subscriber: PixelGridStoreSubscriber): () => void {
    this.subscribers.set(sessionId, subscriber);

    return () => {
      this.subscribers.delete(sessionId);
    };
  }

  subscribeLastChange(sessionId: string, subscriber: PixelLastChangeSubscriber): () => void {
    this.lastChangeSubscribers.set(sessionId, subscriber);

    return () => {
      this.lastChangeSubscribers.delete(sessionId);
    };
  }

  private notifyLastChangeSubscribers(lastChange: Omit<PixelChange, 'timestamp'>): void {
    const victory = this._checkVictory();
    if (!victory) {
      this.lastChangeSubscribers.forEach((subscriber) =>
        subscriber({ ...lastChange, timestamp: new Date().getTime() }),
      );
      return;
    }
    const currentState = this.read();
    this.subscribers.forEach((subscriber) => subscriber({ ...currentState, victory }));
    if (victory && this.resetTimeoutId === null) {
      this.resetTimeoutId = setTimeout(() => this.reset(), 20_000);
    }
  }

  private notifySubscribers(): void {
    const currentState = this.read();
    const victory = this._checkVictory();
    this.subscribers.forEach((subscriber) => subscriber({ ...currentState, victory }));
    if (victory && this.resetTimeoutId === null) {
      this.resetTimeoutId = setTimeout(() => this.reset(), 20_000);
    }
  }

  private _checkVictory(): boolean {
    for (const pixel of Object.values(this.state.pixelGrid)) {
      if (pixel.v !== pixel.guess) {
        return false;
      }
    }
    return true;
  }
}
