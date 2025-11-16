import type { PixelData } from './pixel-grid';

export interface Highscore {
  durationMs: number;
  playerName: string;
  playerColor: string;
  playerFont: string;
  victoryTimestamp: number;
}

export interface Level {
  index: number;
  clue: string;
  pixelData: PixelData;
}
