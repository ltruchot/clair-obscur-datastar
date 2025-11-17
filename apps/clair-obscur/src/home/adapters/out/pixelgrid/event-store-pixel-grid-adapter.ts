import type { PixelGridData, PixelGuess, PixelKey } from '@/home/domain/pixel-grid';
import { PixelGridEventStore } from '@/home/infrastructure/pixelgrid/pixel-grid-event-store.service';
import type { PixelUpdate } from '@/home/infrastructure/pixelgrid/pixel-grid-event-store.types';

export class EventStorePixelGridAdapter {
  constructor(private readonly eventStore: PixelGridEventStore) {}

  getPixelGrid(): PixelGridData {
    const state = this.eventStore.read();
    return state.pixelGrid;
  }

  updatePixel(x: number, y: number, guess: PixelGuess): void {
    const update: PixelUpdate = { x, y, guess };
    this.eventStore.updatePixel(update);
  }

  getPixelGuess(x: number, y: number): PixelGuess | undefined {
    const state = this.eventStore.read();
    const key: PixelKey = `${x}-${y}`;
    return state.pixelGrid[key]?.guess;
  }

  reset(): void {
    this.eventStore.reset();
  }

  cheat(): void {
    this.eventStore.cheat();
  }

  almostWinLevel(): void {
    this.eventStore.almostWinLevel();
  }

  nextLevel(): void {
    this.eventStore.nextLevel();
  }
}
