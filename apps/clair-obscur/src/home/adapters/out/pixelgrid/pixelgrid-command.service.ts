import type { EventStorePixelGridAdapter } from './event-store-pixel-grid-adapter';

export class PixelGridCommandService {
  constructor(private readonly adapter: EventStorePixelGridAdapter) {}

  updatePixelGuess(x: number, y: number, guess: -1 | 0 | 1): void {
    this.adapter.updatePixel(x, y, guess);
  }

  resetPixelGrid(): void {
    this.adapter.reset();
  }

  cheatPixelGrid(): void {
    this.adapter.cheat();
  }

  winPixelGrid(): void {
    this.adapter.win();
  }
}
