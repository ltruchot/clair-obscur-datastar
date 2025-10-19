import type { PixelGridData } from '@/home/adapters/in/models/pixels';
import type { EventStorePixelGridAdapter } from './event-store-pixel-grid-adapter';

export class PixelGridQueryService {
  constructor(private readonly adapter: EventStorePixelGridAdapter) {}

  getPixelGrid(): PixelGridData {
    return this.adapter.getPixelGrid();
  }

  getPixelGuess(x: number, y: number): -1 | 0 | 1 | undefined {
    return this.adapter.getPixelGuess(x, y);
  }

  checkVictory(): boolean {
    const pixelGrid = this.adapter.getPixelGrid();
    for (const [, pixel] of Object.entries(pixelGrid)) {
      const isCorrect = (pixel.v && pixel.guess === 1) || (!pixel.v && pixel.guess === 0);
      if (!isCorrect) {
        return false;
      }
    }
    return true;
  }
}
