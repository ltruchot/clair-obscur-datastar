import type { PixelChange, PixelData, PixelGridData } from '@/home/domain/pixel-grid';
import type {
  PixelGridStoreState,
  PixelGridStoreSubscriber,
  PixelLastChangeSubscriber,
  PixelUpdate,
} from './pixel-grid-event-store.types';

export type OnLevelCompleteCallback = () => void;

export class PixelGridEventStore {
  private state: PixelGridStoreState = {
    pixelGrid: {},
  };

  private basePixelGrid: PixelGridData = {};

  private subscribers = new Map<string, PixelGridStoreSubscriber>();

  private lastChangeSubscribers = new Map<string, PixelLastChangeSubscriber>();

  private resetTimeoutId: NodeJS.Timeout | null = null;

  private onLevelCompleteCallback: OnLevelCompleteCallback | null = null;

  initialize(basePixelData: PixelData, notify = false): void {
    if (this.resetTimeoutId !== null) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    const pixelGrid: PixelGridData = {};

    for (const [key, value] of Object.entries(basePixelData)) {
      pixelGrid[key as `${number}-${number}`] = {
        ...value,
        guess: -1,
      };
    }
    this.basePixelGrid = structuredClone(pixelGrid);
    this.state = {
      pixelGrid: pixelGrid,
    };

    if (notify) {
      this.notifySubscribers();
    }
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

  almostWinLevel(): void {
    const almostWonPixelGrid: PixelGridData = structuredClone(this.state.pixelGrid);

    for (const [key, currentPixel] of Object.entries(this.state.pixelGrid)) {
      almostWonPixelGrid[key as `${number}-${number}`] = {
        ...currentPixel,
        guess: currentPixel.v,
      };
    }

    const firstIncorrectPixel = this.findFirstIncorrectPixel();
    if (firstIncorrectPixel) {
      almostWonPixelGrid[firstIncorrectPixel].guess = -1;
    }

    this.state.pixelGrid = almostWonPixelGrid;
    this.notifySubscribers();
  }

  nextLevel(): void {
    if (this.onLevelCompleteCallback) {
      this.onLevelCompleteCallback();
    }
  }

  private findFirstIncorrectPixel(): `${number}-${number}` | null {
    const sortedKeys = Object.keys(this.state.pixelGrid).sort((a, b) => {
      const [x1, y1] = a.split('-').map(Number);
      const [x2, y2] = b.split('-').map(Number);

      if (y1 !== y2) {
        return y1 - y2;
      }
      return x1 - x2;
    });

    for (const key of sortedKeys) {
      const pixel = this.state.pixelGrid[key as `${number}-${number}`];
      if (pixel.v !== pixel.guess) {
        return key as `${number}-${number}`;
      }
    }

    return null;
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

  setOnLevelCompleteCallback(callback: OnLevelCompleteCallback): void {
    this.onLevelCompleteCallback = callback;
  }

  private notifyLastChangeSubscribers(lastChange: Omit<PixelChange, 'timestamp'>): void {
    this.lastChangeSubscribers.forEach((subscriber) => subscriber({ ...lastChange, timestamp: new Date().getTime() }));

    const victory = this._checkVictory();
    if (victory && this.resetTimeoutId === null) {
      this.resetTimeoutId = setTimeout(() => {
        if (this.onLevelCompleteCallback) {
          this.onLevelCompleteCallback();
        } else {
          this.reset();
        }
      }, 20_000);
    }
  }

  private notifySubscribers(): void {
    const currentState = this.read();
    const victory = this._checkVictory();
    this.subscribers.forEach((subscriber) => subscriber({ ...currentState, victory }));
    if (victory && this.resetTimeoutId === null) {
      this.resetTimeoutId = setTimeout(() => {
        if (this.onLevelCompleteCallback) {
          this.onLevelCompleteCallback();
        } else {
          this.reset();
        }
      }, 20_000);
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
