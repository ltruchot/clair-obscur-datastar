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
  }

  reset(): void {
    const pixelGrid: PixelGridData = {};
    for (const key of Object.keys(this.basePixelData)) {
      pixelGrid[key as `${number}-${number}`].guess = -1;
    }

    this.state.pixelGrid = pixelGrid;
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
    this.lastChangeSubscribers.forEach((subscriber) =>
      subscriber({ ...lastChange, timestamp: new Date().getTime() }),
    );
  }

  private notifySubscribers(): void {
    const currentState = this.read();
    this.subscribers.forEach((subscriber) => subscriber(currentState));
  }
}
