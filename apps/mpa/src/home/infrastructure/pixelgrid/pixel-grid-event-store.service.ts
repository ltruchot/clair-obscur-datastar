import type { PixelChange, PixelData, PixelGridData } from '@/home/adapters/in/models/pixels';
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

  private previousState: PixelGridStoreState = {
    pixelGrid: {},
  };

  private basePixelData: PixelData = {};

  private subscribers = new Map<string, PixelGridStoreSubscriber>();

  private lastChangeSubscribers = new Map<string, PixelLastChangeSubscriber>();

  initialize(basePixelData: PixelData): void {
    this.basePixelData = basePixelData;
    const pixelGrid: PixelGridData = {};

    for (const [key, value] of Object.entries(basePixelData)) {
      pixelGrid[key as `${number}-${number}`] = {
        ...value,
        guess: -1,
      };
    }

    this.state.pixelGrid = pixelGrid;
    this.previousState.pixelGrid = { ...pixelGrid };
  }

  reset(): void {
    const pixelGrid: PixelGridData = {};
    for (const [key, value] of Object.entries(this.basePixelData)) {
      pixelGrid[key as `${number}-${number}`] = {
        ...value,
        guess: -1,
      };
    }

    this.previousState = {
      pixelGrid: { ...this.state.pixelGrid },
    };

    this.state.pixelGrid = pixelGrid;

    this.notifySubscribers();
  }

  updatePixel(update: PixelUpdate): void {
    const key: `${number}-${number}` = `${update.x}-${update.y}`;
    const currentPixel = this.state.pixelGrid[key];

    if (!currentPixel) {
      return;
    }

    this.previousState = {
      pixelGrid: { ...this.state.pixelGrid },
    };

    this.state.pixelGrid[key] = {
      ...currentPixel,
      guess: update.guess,
    };

    this.notifyLastChangeSubscribers({
      x: update.x,
      y: update.y,
      guess: update.guess,
    });
  }

  read(): Readonly<PixelGridStoreState> {
    return {
      pixelGrid: { ...this.state.pixelGrid },
    };
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
    if (!this.hasRelevantLastChangeChanges(lastChange)) {
      return;
    }

    this.lastChangeSubscribers.forEach((subscriber) =>
      subscriber({ ...lastChange, timestamp: new Date().getTime() }),
    );
  }

  private hasRelevantLastChangeChanges(lastChange: Omit<PixelChange, 'timestamp'>): boolean {
    const { x, y, guess } = lastChange;
    const previousState = this.previousState.pixelGrid[`${x}-${y}`];

    if (guess !== previousState.guess) {
      return true;
    }
    return false;
  }

  private hasRelevantChanges(): boolean {
    const currentGrid = this.state.pixelGrid;
    const previousGrid = this.previousState.pixelGrid;

    const currentKeys = Object.keys(currentGrid);
    const previousKeys = Object.keys(previousGrid);

    if (currentKeys.length !== previousKeys.length) {
      return true;
    }

    for (const key of currentKeys) {
      const typedKey = key as `${number}-${number}`;
      const currentPixel = currentGrid[typedKey];
      const previousPixel = previousGrid[typedKey];

      if (!previousPixel) {
        return true;
      }

      if (currentPixel.guess !== previousPixel.guess) {
        return true;
      }
    }

    return false;
  }

  private notifySubscribers(): void {
    if (!this.hasRelevantChanges()) {
      return;
    }

    const currentState = this.read();
    this.subscribers.forEach((subscriber) => subscriber(currentState));
  }
}
