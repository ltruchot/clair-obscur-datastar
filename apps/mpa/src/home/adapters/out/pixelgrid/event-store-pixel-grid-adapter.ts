import type { PixelGridData } from '@/home/adapters/in/models/pixels';
import { PixelGridEventStore } from '@/home/infrastructure/pixelgrid/pixel-grid-event-store.service';
import type { PixelUpdate } from '@/home/infrastructure/pixelgrid/pixel-grid-event-store.types';

export class EventStorePixelGridAdapter {
  constructor(private readonly eventStore: PixelGridEventStore) {}

  getPixelGrid(): PixelGridData {
    const state = this.eventStore.read();
    return state.pixelGrid;
  }

  updatePixel(x: number, y: number, guess: -1 | 0 | 1): void {
    const update: PixelUpdate = { x, y, guess };
    this.eventStore.updatePixel(update);
  }

  getPixelGuess(x: number, y: number): -1 | 0 | 1 | undefined {
    const state = this.eventStore.read();
    const key: `${number}-${number}` = `${x}-${y}`;
    return state.pixelGrid[key]?.guess;
  }
}
